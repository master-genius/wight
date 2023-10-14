'use strict'

process.chdir(__dirname)

const titbit = require('titbit')
const cluster = require('cluster')
const fs = require('fs')
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
    cacheControl: 'max-age=30'
  })

  rse.init(app)

  app.get('/', async ctx => {
    await ctx.helper.pipe('./wight-app/index.html', ctx.reply)
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
