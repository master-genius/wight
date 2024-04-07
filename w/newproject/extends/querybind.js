function query(qss,callback=null) {
  let nod = this.querySelector(qss);
  if (!nod) return null;
  if (callback && typeof callback === 'function') callback(nod);
  return nod;
}

function queryAll(qss, callback=null) {
  let nds = this.querySelectorAll(qss);
  if (callback && typeof callback === 'function') nds.forEach(callback);
  return nds;
}

if (window.Element && typeof window.Element === 'function' && window.Element.prototype) {
  window.Element.prototype.query = query;
  window.Element.prototype.queryAll = queryAll;
}

if (window.DocumentFragment && typeof window.DocumentFragment === 'function' && window.DocumentFragment.prototype) {
  window.DocumentFragment.prototype.query = query;
  window.DocumentFragment.prototype.queryAll = queryAll;
}

