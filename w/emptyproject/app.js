/**
 * 在app.js中的代码会在页面加载之前运行。
 */
const pushStart = require('pushStart')

pushStart()

if (!w.dev) {
  w.host = location.protocol + '//' + location.host
}
