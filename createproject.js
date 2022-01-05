
process.chdir(__dirname);

const wpg = require('./w/pw');
const fs = require('fs');

if (process.argv.length < 3) {
  console.log('使用需要携带参数：[项目目录] ····');
  console.log('示例：node newproject.js first');
  process.exit(1);
}

var webapp = new wpg();

var pdir = process.argv[2];
if (pdir[pdir.length-1] == '/') {
  pdir = pdir.substring(0, pdir.length-1);
}

try {
  fs.accessSync('./apps')
} catch (err) {
  fs.mkdirSync('./apps')
}

webapp.newProject(`${__dirname}/apps/${pdir}`);
