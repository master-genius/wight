/**
 * 检测到若页面不是首页开始逐步跳转过来的，则添加首页的历史记录。
 */

exports.pushStart = function () {

  let oldhash = location.hash;

  if (oldhash === '' || oldhash === '#' || history.length > 1) return;

  history.replaceState({id: 'home'}, '', '#');
  history.pushState({id: 'home'}, '', '#');
  history.pushState({}, '', oldhash);
  
};
