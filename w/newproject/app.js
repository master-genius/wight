/**
 * 在app.js中的代码会在页面加载之前运行。
 */
const pushStart = require('pushStart')

pushStart()

let allowPages = [
  'login'
]

if (!w.dev) {
  w.host = location.protocol + '//' + location.host
}

/*
w.addHook((c) => {
  let r = checkToken(true)
  if (!r && allowPages.indexOf(c.path) < 0) {
    cover('<user-login></user-login>')
  }

  return r
}, {name: 'check-token', exclude: []})
*/


//测试代码，在app.js文件中你可以直接在顶层使用await。
/*
notice('正在加载···')

await new Promise((rv) => {

  setTimeout(() => {
    rv()
  }, 500);

})

unnotify()
 */