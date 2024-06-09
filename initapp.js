'use strict'

//const cluster = require('cluster')
const fs = require('fs')
const zlib = require('zlib')
const wpg = require('./w/pw.js')
const wkthread = require('worker_threads')
const {resource, sse} = require('titbit-toolkit')
const path = require('path')

if (wkthread.isMainThread) {
  process.chdir(__dirname)
}

let sseNotice = new sse({
  timeout: 0,
  retry: 500,
  timeSlice: 1000,
  mode: 'generator'
})

let appState = {}
sseNotice.connectCount = 0

let presse = async (ctx, next) => {
  ctx.box.connid = ctx.helper.uuid()

  let name = ctx.param.name
  
  sseNotice.connectCount += 1

  if (appState[name] === undefined) {
    appState[name] = {
      state: 'none',
      idmap: {}
    }
  }

  appState[name].idmap[ctx.box.connid] = 'none'

  await next(ctx)
  //有可能无法在close事件触发handleClose
  if (appState[name].idmap[ctx.box.connid]) {
    delete appState[name].idmap[ctx.box.connid]
  }
}

sseNotice.handle = async function (ctx) {
  let name = ctx.param.name

  if (appState[name].idmap[ctx.box.connid] === 'update') {
    ctx.sendmsg({event: 'update', data: 'update'})
    appState[name].idmap[ctx.box.connid] = 'none'
  }

  ctx.sendmsg(':ok')
}

sseNotice.handleClose = async function (ctx) {
  let name = ctx.param.name
  
  sseNotice.connectCount -= 1

  if (appState[name] && ctx.box.connid) {
    delete appState[name].idmap[ctx.box.connid]
  }
}

sseNotice.handleError = sseNotice.handleClose

class initapp {

  constructor (options = {}) {
    
    if (typeof options !== 'object') {
      options = {}
    }

    this.notFound = `<!DOCTYPE html><html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
      </head>
      <body>
        <div style="margin:auto;width:90%;margin-top:1.5rem;color:#4a4a4f;">
          <h2>404 : 没有发现应用</h2>
        </div>
      </body>
    </html>`

    this.appPath = __dirname

    this.prefix = 'apps'

    this.test = false

    this.appList = null

    this.closePrompt = false

    this.debug = false

    this.reloadTimer = null;

    for (let k in options) {
      switch (k) {
        case 'prefix':
        case 'test':
        case 'notFound':
        case 'closePrompt':
        case 'debug':
        case 'appPath':
          this[k] = options[k]
          break
          
        case 'appList':
          if (Array.isArray(options[k]) && options[k].length > 0) {
            this.appList = options[k]
          }
          break
        
        default:
      }
    }

    this.maxAge = 7200

    if (this.test || this.debug) {
      this.maxAge = 35
    }

    if (this.appList === null) {
      this.appList = []
      try {
        let files = fs.readdirSync(`${__dirname}/${this.prefix}`, {withFileTypes:true})

        for (let i = 0 ; i < files.length; i++) {
          if (!files[i].isDirectory()) {
            continue
          }
          if (files[i].name[0] === '!' || files[i].name[0] === '.') {
            continue
          }
          this.appList.push(files[i].name)
        }

      } catch (err) {
        console.error(err)
      }
    }

  }

  removeCache (keypre, cacheobj) {
    if (!cacheobj || typeof cacheobj !== 'object') {
      return
    }

    for (let k in cacheobj) {
      if (k.indexOf(keypre) === 0) {
        delete cacheobj[k]
      }
    }
  }

  unloadApp (app, appname) {
    delete app.service.apps[appname]
    let keypre = `${appname}-`

    this.removeCache(keypre, app.service.iconCache)
    this.removeCache(keypre, app.service.jsCache)
    this.removeCache(keypre, app.service.cssCache)
    this.removeCache(keypre, app.service.imgCache)

  }

  has (app, appname) {
    return app.service.apps[appname] ? true : false
  }

  async reloadApp (app, appname) {
    this.unloadApp(app, appname);
    return this.makeApp(app, appname)
              .then(r => {
                  if (r) {
                    if (appState[appname] === undefined) {
                      appState[appname] = {
                        state: 'none', idmap: {}
                      }
                    }

                    appState[appname].state = 'update';
                    for (let k in appState[appname].idmap) {
                      appState[appname].idmap[k] = 'update';
                    }
                  }
              });
  }

  delayReload (app, appname) {
    if (this.reloadTimer) return;
    
    this.reloadTimer = setTimeout(() => {
      this.reloadApp(app, appname);
      this.reloadTimer = null;
    }, 1000);

  }

  watch (pd, app, appname) {
    fs.watch(pd, (evt,name) => {
      fs.access(pd, err => {
        !err && this.delayReload(app, appname);
      });
    });

    try {
      let flist = fs.readdirSync(pd, {withFileTypes: true});
      let tmpfile;
      for (let f of flist) {
        if (f.isDirectory()) {
          if (f.name === 'static' || f.name === '.git') continue;

          tmpfile = `${pd}/${f.name}`;

          fs.watch(tmpfile, (evt, name) => {
            fs.access(tmpfile, err => {
              !err && this.delayReload(app, appname);
            });
            
          });

          if (f.name === 'components' || f.name === 'pages') {
            let comps = fs.readdirSync(`${pd}/${f.name}`, {withFileTypes: true});

            for (let c of comps) {
              if (c.isDirectory()) {
                fs.watch(`${pd}/${f.name}/${c.name}`, (evt, name) => {
                  fs.access(`${pd}/${f.name}/${c.name}`, err => {
                    !err && this.delayReload(app, appname);
                  });
                });
              }
            }
          }

        }
      }
    } catch (err) {
      console.error(err);
    }

  }

  async makeApp (app, appname) {
    let appdata;
    let pagedir = `${this.appPath}/${this.prefix}/${appname}`;

    try {
      fs.accessSync(pagedir);
    } catch (err) {
      console.error(err);
      return false;
    }

    let error_count = 0

    try {
      let config_realpath = path.resolve(`${pagedir}/config.json`);
      delete require.cache[config_realpath];
      let wp = new wpg({
        closePrompt: this.closePrompt,
        debug: this.debug,
        test : this.test,
        pagedir : pagedir
      })

      appdata = await wp.makeApp()
      //console.log(wp.errorCount)
      error_count = wp.errorCount
    } catch (err) {
      console.error(err)
      error_count += 1
    }

    this.watch(pagedir, app, appname);

    return new Promise((rv, rj) => {
      zlib.gzip(appdata, {encoding:'utf8'}, (err, data) => {
        if (err) {
          console.error(err)
          rj(err)
        } else {
          rv(data)
        }
      })

    }).then(data => {
      app.service.apps[appname] = data
    }).then(() => {
      return error_count > 0 ? false : true
    })

  }

  appRouter (app) {

    app.service.appNotFound = this.notFound

    app.get('/:name', async c => {

      let appdata = c.service.apps[ c.param.name ]

      if (appdata === undefined) {
        //说明正在构建中···
        if (this.appList.indexOf(c.param.name) >= 0) {
          for (let i = 0; i < 1000; i++) {
            await new Promise((rv, rj) => {
              setTimeout(rv, 10)
            })
          }
          appdata = c.service.apps[ c.param.name ]
        }
        if (!appdata) {
          return c.status(404).send(c.service.appNotFound)
        }
      }
  
      c.setHeader('cache-control', `public, max-age=${this.maxAge}`)
      c.setHeader('content-encoding', 'gzip')
      c.setHeader('content-type', 'text/html; charset=utf-8')
      c.res.body = appdata
    })

    for (let a of this.appList) {
      ;(new resource({
        staticPath: `${this.appPath}/${this.prefix}/${a}/static`,
        routePath : `/${a}/static/*`,
        routeGroup: `${a}static`,
        decodePath: true
      }).init(app));

      /* ;(new resource({
        staticPath: `${this.appPath}/${this.prefix}/${a}/static`,
        routePath : `/${a}/static/*`,
        routeGroup: `${a}static_`,
        decodePath: true
      }).init(app)); */

      /* ;(new resource({
        staticPath: `${this.appPath}/${this.prefix}/${a}/static/components`,
        routePath : `/${a}/component/*`,
        routeGroup: `${a}static_component_`,
        decodePath: true
      }).init(app)); */

    }

    app.service.icoCache = {};

    app.get(`/:name/favicon.ico`, async c => {
      try {
        let icokey = `${c.param.name}-favicon.ico`;

        if (c.service.icoCache[icokey]) {
          c.setHeader('cache-control', 'public, max-age=86400');
          c.setHeader('content-type', 'image/x-icon');
          c.res.body = c.service.icoCache[icokey];
          return ;
        }

        let icofile = `${c.service.appPath}/${c.service.prefix}/${c.param.name}/favicon.ico`;
        let data = await c.helper.readb(icofile);

        c.service.icoCache[icokey] = data;

        c.setHeader('content-type', 'image/x-icon');

        c.res.body = data;

      } catch (err) {
        c.res.body = '';
      }
    });

    app.service.manifestCache = {}

    app.get(`/:name/manifest.json`, async c => {
      try {
        let mkey = `${c.param.name}-manifest.json`;

        if (c.service.manifestCache[mkey]) {
          c.setHeader('cache-control', 'public, max-age=86400');
          c.setHeader('content-type', 'applocation/json;charset=utf-8');
          c.res.body = c.service.manifestCache[mkey];
          return ;
        }

        let mfile = `${c.service.appPath}/${c.service.prefix}/${c.param.name}/manifest.json`;
        let data = await c.helper.readb(mfile);

        c.service.manifestCache[mkey] = data;

        c.setHeader('content-type', 'application/json;charset=utf-8');

        c.res.body = data;

      } catch (err) {
        c.res.body = '';
      }
    });

    app.get('/:name/components/:comp/:src', async c => {
      let srcname = `${c.service.appPath}/${c.service.prefix}/${c.param.name}/`
          + `components/${c.param.comp}/static/${c.param.src}`;
        
      //console.log(srcname);

      try {
        await c.helper.pipe(srcname, c.reply)
      } catch (err) {
        console.error(err)
        return c.status(404).send()
      }

    })

    //sse route

    app.get('/:name/sse', async c => {}, {group: '__sse__'})

    app.use(presse).use(sseNotice.mid(), {group: '__sse__'})

  }
  
  init (app) {

    app.service.apps = {}
    app.service.prefix = this.prefix
    app.service.appPath = this.appPath

    for (let i = 0; i < this.appList.length; i++) {
      this.makeApp(app, this.appList[i])
    }

    this.appRouter(app)

  }

}

module.exports = initapp
