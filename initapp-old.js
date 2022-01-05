'use strict';

//const cluster = require('cluster');
const fs = require('fs');
const zlib = require('zlib');
const wpg = require('./w/pw');
const wkthread = require('worker_threads');

if (wkthread.isMainThread) {
  process.chdir(__dirname);
}

class initapp {

  constructor (options = {}) {
    
    if (typeof options !== 'object') {
      options = {};
    }

    this.notFound = `<!DOCTYPE html><html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
      </head>
      <body>
        <div style="margin:auto;width:90%;margin-top:1.5rem;color:#4a4a4f;">
          <h2>404 : 应用没有发现</h2>
        </div>
      </body>
    </html>`;

    this.appPath = __dirname;

    this.prefix = 'apps';

    this.test = false;

    this.appList = null;

    this.closePrompt = false;

    this.debug = false;

    for (let k in options) {
      switch (k) {
        case 'prefix':
        case 'test':
        case 'notFound':
        case 'closePrompt':
        case 'debug':
        case 'appPath':
          this[k] = options[k];
          break;
          
        case 'appList':
          if (options[k] instanceof Array) {
            this.appList = options[k];
          }
          break;
        
        default:;
      }
    }

    this.maxAge = 7200

    if (this.test || this.debug) {
      this.maxAge = 35
    }

    if (this.appList === null) {
      this.appList = [];
      try {
        let files = fs.readdirSync(`${__dirname}/${this.prefix}`, {withFileTypes:true});

        for (let i = 0 ; i < files.length; i++) {
          if (!files[i].isDirectory()) {
            continue;
          }
          if (files[i].name[0] === '!' || files[i].name[0] === '.') {
            continue;
          }
          this.appList.push(files[i].name);
        }

      } catch (err) {
        console.error(err);
      }
    }

  }

  removeCache (keypre, cacheobj) {
    
    if (!cacheobj || typeof cacheobj !== 'object') {
      return;
    }

    for (let k in cacheobj) {
      if (k.indexOf(keypre) === 0) {
        delete cacheobj[k];
      }
    }
  }

  unloadApp (app, appname) {
    delete app.service.apps[appname];
    let keypre = `${appname}-`;

    this.removeCache(keypre, app.service.iconCache);
    this.removeCache(keypre, app.service.jsCache);
    this.removeCache(keypre, app.service.cssCache);
    this.removeCache(keypre, app.service.imgCache);

  }

  has (app, appname) {
    return app.service.apps[appname] ? true : false
  }

  async reloadApp (app, appname) {
    this.unloadApp(app, appname);
    return this.makeApp(app, appname);
  }

  async makeApp (app, appname) {
    let appdata;

    try {
      let wp = new wpg({
        closePrompt: this.closePrompt,
        debug: this.debug,
        test : this.test,
        pagedir : `${this.appPath}/${this.prefix}/${appname}`
      });

      appdata = wp.makeApp();

    } catch (err) {
      console.error(err);
    }


    return new Promise((rv, rj) => {
      zlib.gzip(appdata, {encoding:'utf8'}, (err, data) => {
        if (err) {
          console.error(err);
          rj(err);
        } else {
          rv(data);
        }
      });

    }).then(data => {
      app.service.apps[appname] = data;
    });
    
  }

  appRouter (app) {

    app.service.appNotFound = this.notFound;

    app.get('/:name', async c => {

      let appdata = c.service.apps[ c.param.name ];

      if (appdata === undefined) {
        c.status(404);
        c.res.body = c.service.appNotFound;
        return;
      }
  
      c.setHeader('cache-control', `public, max-age=${this.maxAge}`);
      c.setHeader('content-encoding', 'gzip');
      c.setHeader('content-type', 'text/html; charset=utf-8');
      c.res.body = appdata;
    });
  }

  iconRouter (app) {
    app.service.iconCache = {};

    app.get('/:pagedir/static/icon/:name', async c => {
      try {
  
        let iname = c.param.name;

        let chkey = `${c.param.pagedir}-${iname}`;

        let ctype = 'image/png';

        if (iname.indexOf('.ico') > 0) {
          ctype = 'image/x-icon';
        }

        if (c.service.iconCache[chkey]) {
          c.setHeader('cache-control', 'public, max-age=86400');
          c.setHeader('content-type', ctype);
          c.res.body = c.service.iconCache[chkey];
          return ;
        }
  
        let iconfile = `${c.service.appPath}/${c.service.prefix}/${c.param.pagedir}/_static/icon/${iname}`;

        let data = await c.helper.readb(iconfile);

        c.service.iconCache[chkey] = data;
  
        c.setHeader('cache-control', 'max-age=86400');
        c.setHeader('content-type', ctype);
        c.res.body = data;

      } catch (err) {
        //console.error(err);
        c.status(404);
      }

    }, 'icon');

  }


  cssRouter (app) {
    app.service.cssCache = {};

    app.get('/:pagedir/static/css/:name', async c => {
      try {

        let iname = c.param.name;

        let chkey = `${c.param.pagedir}-${iname}`;

        if (c.service.cssCache[chkey]) {
          c.setHeader('cache-control', 'public, max-age=3600');
          c.setHeader('content-encoding', 'gzip');
          c.setHeader('content-type', 'text/css; utf-8');
          c.res.body = c.service.cssCache[chkey];
          return ;
        }
  
        let cssfile = `${c.service.appPath}/${c.service.prefix}/${c.param.pagedir}/_static/css/${iname}`;

        let data = await c.helper.readb(cssfile);

        let zipdata = await new Promise((rv, rj) => {
          zlib.gzip(data, (err, data) => {
            if (err) {
              console.error(err);
              rj(err);
            } else {
              rv(data);
            }
          });
    
        });

        c.service.cssCache[chkey] = zipdata;

        c.setHeader('content-encoding', 'gzip');
        c.setHeader('cache-control', 'public, max-age=86400');
        c.setHeader('content-type', 'text/css; utf-8');

        c.res.body = zipdata;

      } catch (err) {
        c.status(404);
      }
    });
  }

  jsRouter (app) {
    app.service.jsCache = {};

    app.get('/:pagedir/static/js/:name', async c => {
      try {

        let iname = c.param.name;

        let chkey = `${c.param.pagedir}-${iname}`;

        if (c.service.jsCache[chkey]) {
          c.setHeader('cache-control', 'public, max-age=3600');
          c.setHeader('content-encoding', 'gzip');
          c.setHeader('content-type', 'text/javascript; utf-8');
          c.res.body = c.service.jsCache[chkey];
          return ;
        }
  
        let jsfile = `${c.service.appPath}/${c.service.prefix}/${c.param.pagedir}/_static/js/${iname}`;

        let data = await c.helper.readb(jsfile);
        let zipdata = await new Promise((rv, rj) => {
          zlib.gzip(data, (err, data) => {
            if (err) {
              console.error(err);
              rj(err);
            } else {
              rv(data);
            }
          });
    
        });

        c.service.jsCache[chkey] = zipdata;

        c.setHeader('content-encoding', 'gzip');
        c.setHeader('cache-control', 'public, max-age=86400');
        c.setHeader('content-type', 'text/javascript; utf-8');

        c.res.body = zipdata;

      } catch (err) {
        c.status(404);
      }
    });

  }

  imgRouter (app) {
    app.service.imgCache = {};

    app.get('/:pagedir/images/:name', async c => {
      try {
  
        let iname = c.param.name;

        let imgkey = `${c.param.pagedir}-${iname}`;

        if (c.service.imgCache[imgkey]) {

          c.setHeader('cache-control', 'public, max-age=86400');
          c.setHeader('content-type', c.service.imgCache[imgkey].type);
          c.setHeader('content-length', c.service.imgCache[imgkey].length);
          c.res.body = c.service.imgCache[imgkey].data;
          return ;
        }
  
        let imgtype = 'image/webp';
        if (iname.indexOf('.png') > 0) {
          imgtype = 'image/png';
        } else if (iname.indexOf('.jpg') > 0 || iname.indexOf('.jpeg') > 0) {
          imgtype = 'image/jpeg';
        } else if (iname.indexOf('.gif') > 0) {
          imgtype = 'image/gif';
        }
  
        let imgfile = `${c.service.appPath}/${c.service.prefix}/${c.param.pagedir}/_images/${iname}`;

        let data = await c.helper.readb(imgfile);

        c.service.imgCache[imgkey] = {
          data : data,
          type : imgtype,
          length : data.length
        };
  
        c.setHeader('cache-control', 'public, max-age=86400');
        c.setHeader('content-type', imgtype);
        c.setHeader('content-length', data.length);

        c.res.body = data;

      } catch (err) {
        c.status(404);
      }
    });

  }

  icoRouter (app) {
    app.service.icoCache = {};

    app.get('/:pagedir/favicon.ico', async c => {

      let icokey = `${c.param.pagedir}-favicon.ico`;

      if (c.service.icoCache[icokey]) {
        c.setHeader('cache-control', 'public, max-age=86400');
        c.setHeader('content-type', 'image/x-icon');
        c.res.body = c.service.icoCache[icokey];
        return ;
      }

      let icofile = `${c.service.appPath}/${c.service.prefix}/${c.param.pagedir}/favicon.ico`;
      let data = await c.helper.readb(icofile);

      c.service.icoCache[icokey] = data;

      c.setHeader('content-type', 'image/x-icon');
      c.res.body = data;
    });
  }

  init (app) {

    app.service.apps = {};
    app.service.prefix = this.prefix;
    app.service.appPath = this.appPath;

    for (let i = 0; i < this.appList.length; i++) {
      this.makeApp(app, this.appList[i]);
    }

    this.appRouter(app);

    this.cssRouter(app);

    this.jsRouter(app);

    this.icoRouter(app);

    this.iconRouter(app);

    this.imgRouter(app);
    
  }

}

module.exports = initapp;
