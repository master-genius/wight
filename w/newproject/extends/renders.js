'use strict'

Array.prototype.renders = function (callback, firstText='', endText='') {
  if (!callback || typeof callback !== 'function') {
    w.debug && w.notifyTopError(`renderHTML: callback必须是一个函数`)
    return '';
  }
  
  let htmls = this.map(callback);

  return `${firstText}${htmls.join('')}${endText}`;
}

module.exports = {}