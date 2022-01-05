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