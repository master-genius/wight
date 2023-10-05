
process.chdir(__dirname);

const wpg = require('./w/pw');
const fs = require('fs');
const npargv = require('npargv');

let arg = npargv({
  '--compress': {
    alias: '-c',
    name: 'compress',
    default: false
  }
})

if (process.argv.length < 3) {
  console.log('使用需要携带参数：[项目目录] ····');
  console.log('示例：node build.js first');
  process.exit(1);
}

let webapp = new wpg();

let pdir = process.argv[2];

function fmt_name (pdir) {
  if (pdir[pdir.length-1] == '/') {
    pdir = pdir.substring(0, pdir.length-1);
  }

  return pdir.replace(/\s+/g, '');
}

try {
  fs.accessSync('./apps')
} catch (err) {
  fs.mkdirSync('./apps')
}

webapp.forceCompress = arg.args.compress;

for (let a of arg.list) {
  webapp.build(`${__dirname}/apps/${fmt_name(a)}`, a);
}
