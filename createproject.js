
process.chdir(__dirname);

const wpg = require('./w/pw.js');
const fs = require('fs');
const npargv = require('npargv');

let arg = npargv({
  '@autoDefault': true,

  '--empty': {
    name: 'empty',
    default: false
  }
})

if (process.argv.length < 3) {
  console.log('使用需要携带参数：[项目目录] ····');
  console.log('示例：node newproject.js first');
  process.exit(1);
}

let webapp = new wpg();

let pdir = process.argv[2];
function fmt_name(pdir) {
  if (pdir[pdir.length-1] == '/') {
    pdir = pdir.substring(0, pdir.length-1);
  }

  return pdir.replace(/\s+/g, '');
}

let args = arg.args

try {
  fs.accessSync('./apps')
} catch (err) {
  fs.mkdirSync('./apps')
}

for (let a of arg.list) {
  webapp.newProject(`${__dirname}/apps/${fmt_name(a)}`, args.empty ? 'emptyproject' : '');
}
