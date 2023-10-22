'use strict'

process.chdir(__dirname)

const titbit = require('titbit')
const cluster = require('cluster')
const fs = require('fs')
const os = require('os')
const {proxy, resource} = require('titbit-toolkit')
const npargv = require('npargv')
const loadddoc = require('./lib/loaddoc')

let arg = npargv({
  '--http2': {
    name: 'http2',
    default: false,
  },

  '--https': {
    name: 'https',
    default: false,
  },

  '--port': {
    name: 'port',
    default: 0,
    type: 'number',
    min: 1,
    max: 65535
  },

  '--local': {
    name: 'local',
    default: false,
  },

  '--debug': {
    name: 'debug',
    default: false,
  },

  '--no-debug': {
    name: 'nodebug',
    default: false,
  },

  '--test': {
    name: 'test',
    default: false
  }

})

if (cluster.isMaster) {
  try {
    fs.accessSync('./config')
  } catch (err) {
    fs.mkdirSync('./config')
  }

  try {
    fs.accessSync('./config/config.js')
  } catch (err) {
    fs.copyFileSync('./config-example.js', './config/config.js')
    console.log('正在初始化配置文件···\n已经初始化配置文件\n')
    console.log('首次运行，请配置config/config.js后再次启动服务。\n或者您可以再次运行，这会使用默认配置。')
    process.exit(0)
  }
}

const initapp = require('./initapp')
const cfg = require('./config/config')

let args = arg.args

let app = new titbit({
  maxBody: 50,
  debug: true,
  showLoadInfo: false,
  timeout : 10000,
  http2: args.http2,
  https: args.https,
})

app.autoWorker(cfg.maxWorker)

if (cfg.port === undefined) {
  cfg.port = 1213
}

if (cfg.host === undefined) {
  cfg.host = '0.0.0.0'
}

if (cfg.worker === undefined) {
  cfg.worker = 1
}

if (args.port) cfg.port = args.port

app.service.TEST = args.test

if (app.config.https) {
  app.config.cert = './rsa/localhost.cert'
  app.config.key = './rsa/localhost.key'
}

//初始化相关目录和文件
if (cluster.isMaster) {
  try {
    fs.accessSync('./events', fs.constants.F_OK)
  } catch (err) {
    fs.mkdirSync('./events')
  }
  
  fs.watch('./events', (evt, name) => {
    if (name === 'stop-server') {
      process.kill(0, 'SIGTERM')
    }
  })

  try {
    fs.accessSync('./config/server')
  } catch (err) {
    fs.mkdirSync('./config/server')
  }
}

if (cluster.isWorker) {
  fs.watch('./events', (evt, name) => {
    if (name == 'restart') {
      process.exit(0)
    }

  })
}

let iapp

/**
 * 初始化App，如果目录以!或者 . 开头则不加载。
 */
if (cluster.isWorker) {

  app.get('/favicon.ico', async c => {
    await c.setHeader('content-type', 'image/x-icon')
            .helper.pipe('./wight-app/favicon.ico', c.reply)
  })
  
  let opts = {
    test : args.test,
    debug : args.debug,
    prefix : 'apps',
  }

  if (arg.list.length > 0) {
    let fmtList = arg.list.map(x => {
      x = x.trim()
      if (!x) return ''
      if (x[x.length - 1] === '/') x = x.substring(0, x.length - 1)
      if (x.indexOf('apps/') === 0) return x.substring(5)
      return x
    })

    opts.appList = fmtList.filter(x => x.length > 0)
  }

  iapp = new initapp(opts)

  iapp.init(app)

  app.get('/self/control/applist', async ctx => {
    ctx.send(iapp.appList)
  })

  app.get('/self/control/netinfo', async ctx => {
    try {
      let ips = os.networkInterfaces()
      if (!ips) return ctx.status(400).send('failed')
      ctx.send(ips)
    } catch (err) {
      ctx.status(500).send('failed')
    }
  })

  /* process.on('message', (msg) => {
    if (msg.type === 'reload-app') {
      console.log(`---- PID: [${process.pid}] ; RELOAD APP [${msg.appname}] ----`)
      iapp.reloadApp(app, msg.appname)
    } else if (msg.type === 'unload-app') {
      console.log(`---- PID: [${process.pid}] ; UNLOAD APP [${msg.appname}] ----`)
      iapp.unloadApp(app, msg.appname)
    }
  }) */

}

if (app.isWorker) {
  let mdoc = new loadddoc('doc')
  mdoc.routepath = '/self/wight-doc'
  mdoc.init()

  app.get('/self/wight-doc', async ctx => {
    if (ctx.query.group) {
      let clist = mdoc.search('.*', 0, 0, ctx.query.group)
      return ctx.send(clist)
    }

    ctx.send(mdoc.search('.*'))
  })

  app.get('/self/wight-doc/*', async ctx => {
    try {
      let fname = ctx.param.starPath
      let doc = mdoc.getById(fname)
      if (!doc) {
        try {
          ctx.setHeader('cache-control', 'public,max-age=600')
          return await ctx.helper.pipe('./doc/' + fname, ctx.reply)
        } catch (err) {
          return ctx.status(404).send('没有找到文档，该文档可能丢失。')
        }
      }

      return ctx.send(doc)
    } catch (err) {
      return ctx.status(404).send(err.message)
    }
  })

  let magic_str = 'wy-wxm-ww-ok'
  let rse = new resource({
    staticPath: './wight-app/static',
    routePath : `/${magic_str}/wight-app/static/*`,
    routeGroup: '_static_wight',
    decodePath: true,
    //最大缓存文件大小，超过此大小则不会缓存
    maxFileSize: 12_000_000,
    //设置消息头cache-control的值，默认为null表示不发送消息头cache-control
    cacheControl: 'max-age=35'
  })

  rse.init(app)

  app.get('/', async ctx => {
    try {
      ctx.setHeader('content-encoding', 'gzip').setHeader('content-type', 'text/html;charset=utf-8')
      await ctx.helper.pipe('./wight-app/index.html.gz', ctx.reply)
    } catch (err) {
      ctx.setHeader('content-encoding', 'identity')
      await ctx.helper.pipe('./wight-app/index.html', ctx.reply)
    }
    
  })

  /**
   * {
   *    action: "create",
   *    type: "component|extend"
   * }
   */
  app.put('/control/:name', async ctx => {

  })
}

const fsp = fs.promises
//处理服务端请求部分
if (app.isWorker) {
  /**
   * authorization指定token 提交的消息头，默认是authorization
   * token_api_response 描述一个登录接口的返回值并描述如何存储相关的辅助字段
   * {
   *    //返回值的类型，string表示直接就是token
   *    type: 'json|string',
   *    //返回值的token字段
   *    token: 'access_token',
   *    refreshToken: '',
   *    //有效期类型，number表示固定数字，此时expires就是一个数字，field表示一个字段，expires指明了哪个字段。
   *    expiresType: 'number|field'
   *    expires: '',
   *    refreshExpiresType: 'number|field',
   *    refreshExpires: ''
   *    //验证失败的状态码，默认是401。
   *    failedCode: 401,
   *    
   * }
   */
  function checkServerData(data) {
    let mustkeys = ['name', 'host', 'is_token', 'authorization', 'token_api', 'token_api_response'];

    for (let k of mustkeys) {
      if (!data[k]) return {ok: false, errmsg: `${k} 必须存在`}
    }

    let token_api_response_keys = [
      'token', 'refreshToken', 'expiresType', 'expires', 'refreshExpiresType',
      'refreshExpires'
    ]

    if (!mustkeys.token_api_response.type || ['string', 'json'].indexOf(mustkeys.token_api_response.type) < 0)
    {
      return {ok: false, errmsg: 'token_api_response 不符合要求'}
    }

    if (mustkeys.token_api_response.type === 'json') {
      for (let k of token_api_response_keys) {
        if (!mustkeys.token_api_response[k]) {
          return {ok: false, errmsg: `缺少 token_api_response.${k}`}
        }
      }
    }

    return {ok: true}
  }

  let serverPath = './config/server'

  app.get('/self/control/server', async ctx => {
    let flist = await fsp.readdir(serverPath, {withFileTypes: true})
    let jlist = []
    for (let f of flist) {
      if (f.isFile() && f.name.substring(f.name.length - 5) === '.json') {
        jlist.push(f.name)
      }
    }

    let datalist = []
    let data
    for (let f of jlist) {
      try {
        data = JSON.parse(await fsp.readFile(serverPath + '/' + f, {encoding: 'utf8'}))
        datalist.push(data)
      } catch (err) {
        console.error(err)
      }
    }

    ctx.send(datalist)
  })

  //sha1(应用名字)作为文件名
  //必须提交的字段：name、host、is_token、authorization、token_api、token_api_response
  //可选字段：route: {GET: {}, POST: {}}
  app.post('/self/control/server', async ctx => {
    if (!ctx.body.name || !ctx.body.name.trim()) {
      return ctx.status(400).send('名称不符合要求')
    }

    let name = ctx.body.name.trim()

    let shaname = ctx.helper.sha1(name)

    let filename = shaname + '.json'

    try {
      await fsp.access(serverPath + '/' + filename)
      return ctx.status(400).send('应用已经存在，请更改名字')
    } catch (err) {

    }

    let chk = checkServerData(ctx.body)
    if (!chk.ok) {
      return ctx.status(400).send(chk.errmsg)
    }

    ctx.body.id = shaname
    ctx.body.name = name

    fsp.writeFile(serverPath + '/' + filename, JSON.stringify(ctx.body))

    return ctx.send(ctx.body)
  })

  app.put('/self/control/server/:id', async ctx => {
    try {
      await fsp.access(serverPath + '/' + ctx.param.id + '.json')
    } catch (err) {
      return ctx.status(400).send('应用不存在')
    }

    let chk = checkServerData(ctx.body)
    if (!chk.ok) {
      return ctx.status(400).send(chk.errmsg)
    }

    //改名字会涉及到重新修改id
    let data = JSON.parse(await fsp.readFile(serverPath + '/' + ctx.param.id + '.json', {encoding:'utf8'}))

    //改名字要在更改后，把原来的数据文件删除并创建新的文件。
    for (let k in ctx.body) {
      if (k !== 'id' && k !== 'name') data[k] = ctx.body[k]
    }

    if (ctx.body.name) {
      let rname = ctx.body.name.trim()
      if (rname !== data.name) {
        data.id = ctx.helper.sha1(rname)
        data.name = rname
        //检测是否存在同名的文件
        let checkfile = data.id + '.json'
        try {
          await fsp.access(serverPath + '/' + checkfile)
          return ctx.status(400).send('已经存在同名的应用')
        } catch (err) {}

        try {
          await fsp.unlink(serverPath + '/' + ctx.param.id + '.json')
        } catch (err) {
          return ctx.status(400).send('无法删除旧文件，并重建应用，请检查权限')
        }

        try {
          await fsp.writeFile(serverPath + '/' + checkfile, JSON.stringify(data))
        } catch (err) {
          return ctx.status(400).send('更新应用信息失败')
        }

        return ctx.send(data)
      }
    }

    try {
      await fsp.writeFile(serverPath + '/' + ctx.param.id + '.json', JSON.stringify(data))
    } catch (err) {
      return ctx.status(400).send('更新应用信息失败')
    }

    return ctx.send(data)
  })

  app.delete('/self/control/server/:id', async ctx => {
    let fname = serverPath + '/' + ctx.param.id + '.json'

    try {
      await fsp.access(fname)
    } catch (err) {
      return ctx.status(400).send('应用不存在')
    }

    try {
      await fsp.unlink(fname)
    } catch (err) {
      return ctx.status(400).send('无法删除应用，请检查权限')
    }

    return ctx.send('ok')
  })
}

if (app.isWorker) {
  let pxy;
  let proxy_host;

  if (cfg.proxy && !args.test) proxy_host = cfg.proxy;

  if (cfg.proxyTest && args.test) proxy_host = cfg.proxyTest;

  if (proxy_host) {
    pxy = new proxy({
      methods: [
        'GET'
      ],
      host: proxy_host
    });
    pxy.init(app);
  }

}

app.daemon(cfg.port, cfg.host, cfg.worker)
