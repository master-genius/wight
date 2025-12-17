'use strict'

Object.defineProperty(Array.prototype, 'renders', {
  value: function (callback, firstText='', endText='') {
    if (!callback || typeof callback !== 'function') {
      w.debug && w.notifyTopError(`renderHTML: callback必须是一个函数`)
      return '';
    }
    
    let htmls = this.map(callback);
  
    return `${firstText}${htmls.join('')}${endText}`;
  },
  enumerable: false,
  writable: false,
  configurable: false
});

Object.defineProperty(Object.prototype, 'renders', {
  value: function (callback, firstText='', endText='') {
    if (!callback || typeof callback !== 'function') {
      w.debug && w.notifyTopError(`renderHTML: callback必须是一个函数`)
      return '';
    }
    
    let htmls = [];
    let okeys = Object.keys(this);

    for (let k of okeys) {
      htmls.push(callback(this[k], k) || '');
    }
  
    return `${firstText}${htmls.join('')}${endText}`;
  },
  enumerable: false,
  writable: false,
  configurable: false
});
