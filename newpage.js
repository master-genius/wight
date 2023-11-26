
process.chdir(__dirname);

const wpg = require('./w/pw.js');

if (process.argv.length < 4) {
  console.log('使用需要携带参数：[页面所在目录] [页面名称]····');
  console.log('示例：node newpage.js first home user goods');
  process.exit(1);
}

var webapp = new wpg();

var pdir = process.argv[2];
if (pdir[pdir.length-1] == '/') {
  pdir = pdir.substring(0, pdir.length-1);
}

let pagename = '';

for (let i=3; i<process.argv.length; i++) {

  pagename = process.argv[i];

  if (pagename.indexOf('.js') > 0) {
    pagename = pagename.substring(0, pagename.length - 3);
  }

  pagename = pagename.replace(/[\'\"\#\[\]\{\}\:\/\?\<\>\s]+/g, '');

  webapp.newPage(pagename, `${__dirname}/apps/${pdir}`);
}
