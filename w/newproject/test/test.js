/**
 * 这种定义页面的方式是早期的形式，但是依旧被支持。
 * 新创建的页面已经改为class的形式。
 */
exports.test = new function () {
  this.data = {

  };

  this.testConfirm = (t) => {
    confirm({
      text: '确认？',
      callback: () => {
        notify('OK')
      },

      cancel: () => {
        notify('CANCEL')
      }
    })
  };

  this.onload = function (c) {
  
  };

  this.onshow = function (c) {

  };

  this.onhide = function () {

  };

  this.onunload = function () {

  };

  this.onbottom = function () {

  };

  this.onscroll = function () {

  };

};