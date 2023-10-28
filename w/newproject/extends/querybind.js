
if (window.Element && typeof window.Element === 'function' && window.Element.prototype) {
  window.Element.prototype.query = function query (qss,callback=null) {
    let nod = this.querySelector(qss);
    if (!nod) return null;
    if (callback && typeof callback === 'function') callback(nod);
    return nod;
  }

  window.Element.prototype.queryAll =  function (qss, callback=null) {
    let nds = this.querySelectorAll(qss);
    if (callback && typeof callback === 'function') nds.forEach(callback);
    return nds;
  }
}

module.exports = {}
