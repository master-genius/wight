
process.chdir(__dirname);

const wpg = require('./w/pw');

if (process.argv.length < 4) {
  console.log('使用需要携带参数：[项目名称(项目的目录名)] [组件名称]····');
  console.log('示例：node newcomps.js first a-x x-image');
  process.exit(1);
}

var webapp = new wpg();

var pdir = process.argv[2];
if (pdir[pdir.length-1] == '/') {
  pdir = pdir.substring(0, pdir.length-1);
}

let cname = '';

for (let i = 3; i < process.argv.length; i++) {

  cname = process.argv[i];

  webapp.newComps(cname, `${__dirname}/apps/${pdir}`);
}
