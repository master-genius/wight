'use strict'

process.chdir(__dirname)

const titbit = require('titbit')
const cluster = require('cluster')
const fs = require('fs')
const {proxy} = require('titbit-toolkit')

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
    console.log('首次运行，请配置config/config.js后再次启动服务。\n或者您可以再次运行，这会使用默认配置。')
    process.exit(0)
  }
}

const initapp = require('./initapp')
const cfg = require('./config/config')

let http2_on = false

let https_on = false

if (process.argv.indexOf('--http2') > 0) {
  http2_on = true
  https_on = true
}

if (process.argv.indexOf('--https') > 0) {
  https_on = true
}

var app = new titbit({
  maxBody: 50,
  debug: true,
  showLoadInfo: false,
  timeout : 10000,
  http2: http2_on,
  https: https_on,
})

app.autoWorker(cfg.maxWorker)

if (cfg.port === undefined) {
  cfg.port = 1213
}

if (cfg.host === undefined) {
  cfg.host = '0.0.0.0'
}

if (cfg.worker === undefined) {
  cfg.worker = 2
}

var _test_mode = false
var _debug_mode = false

if (process.argv.length > 2) {
  
  let pind = process.argv.indexOf('--port')
  if (pind > 0) {
    if (pind+1 < process.argv.length && !isNaN(process.argv[pind+1])) {
      cfg.port =  process.argv[pind+1]
    }
  }
  if (process.argv.indexOf('--local') > 0) {
    app.config.https = false
    cfg.host = 'localhost'
  }

  if (process.argv.indexOf('-d') > 0) {
    app.config.daemon = true
  }

  if (process.argv.indexOf('--no-debug') > 0) {
    app.config.debug = false
  }

  if (process.argv.indexOf('--debug') > 0) {
    app.config.debug = true
    _debug_mode = true
  }

  if (process.argv.indexOf('--test') > 0) {
    _test_mode = true
    app.config.debug = true
    app.config.globalLog = true
    //app.config.https = false
    app.config.daemon = false
    cfg.port = 1213
  }

}

app.service.TEST = _test_mode

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
    c.setHeader('content-type', 'image/x-icon')
    c.res.body = await c.helper.readb('./favicon.ico')
  })

  let opts = {
    test : _test_mode,
    debug : _debug_mode,
    prefix : 'apps',
  }

  if (process.argv.length > 2) {
    
    let applist = []
    for (let i = 2; i < process.argv.length; i++) {
      if ((/^[\_a-z]/i).test(process.argv[i])) {
        applist.push(process.argv[i])
      }
    }
    if (applist.length > 0) {
      opts.appList = applist
    }
  }

  iapp = new initapp(opts)

  iapp.init(app)

  process.on('message', (msg) => {
    if (msg.type === 'reload-app') {
      console.log(`---- PID: [${process.pid}] ; RELOAD APP [${msg.appname}] ----`)
      iapp.reloadApp(app, msg.appname)
    } else if (msg.type === 'unload-app') {
      console.log(`---- PID: [${process.pid}] ; UNLOAD APP [${msg.appname}] ----`)
      iapp.unloadApp(app, msg.appname)
    }
  })

} else {
  app.setMsgEvent('reload-app', (w, msg, sock) => {
    for (let k in cluster.workers) {
      cluster.workers[k].send(msg)
    }
  })

  app.setMsgEvent('unload-app', (w, msg, sock) => {
    for (let k in cluster.workers) {
      cluster.workers[k].send(msg)
    }
  })

}

app.get('/app/control/:appname/:handle', async c => {
  let {appname, handle} = c.param

  if (iapp.has(app, appname) === false) {
    c.send('app not found', 404)
    return
  }

  switch (handle) {
    case 'reload':
      process.send({
        type : 'reload-app',
        appname : appname
      })
      break
    
    case 'unload':
      if (appname === '_control') {
        c.send('deny', 403)
        return
      }
      process.send({
        type : 'unload-app',
        appname : appname
      })
      break
    
    default:
      c.send('unknow command', 400)
      return
  }
  
  c.send('done')

})

if (app.isWorker) {
  let pxy;
  let proxy_host;

  if (cfg.proxy && !_test_mode) proxy_host = cfg.proxy;

  if (cfg.proxyTest && _test_mode) proxy_host = cfg.proxyTest;

  if (proxy_host) {
    pxy = new proxy({
      methods: ['GET'],
      host: proxy_host
    });
    pxy.init(app);
  }

}

app.daemon(cfg.port, cfg.host, cfg.worker)
