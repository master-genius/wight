w.share.userlist = [
  {
    id : 'u_001',
    level : 1,
    name : '两只小蜜蜂'
  },
  {
    id : 'u_002',
    level : 3,
    name : '白日依山近'
  },
  {
    id : 'u_003',
    level : 5,
    name : '千里共婵娟'
  },

  {
    id : 'u_004',
    level : 10,
    name : '百万雄师过大江'
  },
  {
    id : 'u_005',
    level : 12,
    name : '那些钱是我的'
  }
]

exports.user = new function () {

  this.onload = async function (c) {
    acover('<div style="text-align:center;">loading</div>', true);
    await _import('/static/module/u-card.js').then(m => { console.log(m); })
    setTimeout(() => {
      uncover();
    }, 500);
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