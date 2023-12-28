
process.chdir(__dirname);

const wpg = require('./w/pw.js');
const fs = require('fs');
const npargv = require('npargv');

let arg = npargv({
  '--compress': {
    alias: '-c',
    name: 'compress',
    default: false
  },

  '--name': {
    alias: '-n',
    name: 'name',
    default: ''
  },

  '--min': {
    alias: '--not-in-app',
    name: 'min',
    default: false
  }
})

if (process.argv.length < 3) {
  console.log('使用需要携带参数：[项目目录] ····');
  console.log('示例：node build.js first');
  process.exit(1);
}

let webapp = new wpg({
  buildInApp: !arg.args.min
});

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

if (arg.list.length == 0) {
  console.error('未指定要打包的应用')
  process.exit(1)
}

let real_list = arg.list.map(x => {
  if (x.indexOf('/') >= 0) {
    return x.split('/').filter(p => p.length > 0).pop()
  }

  return x.trim()
})

for (let a of real_list) {
  if (!a) continue;
  webapp.build(`${__dirname}/apps/${fmt_name(a)}`, arg.args.name || a);
}
