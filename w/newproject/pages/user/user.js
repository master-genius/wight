'use strict';

//设置共享数据。
w.share.userList = [
  {
    id: 'a001',
    name: '两只小蜜蜂',
    role: 'admin'
  },

  {
    id: 'a002',
    name: '胡子弯弯长睫毛',
    role: 'user'
  },

  {
    id: 'a003',
    name: '(null !== false) is true',
    role: 'user'
  }

]

class page {

  constructor () {

  }

  async onload(c) {
    //显示加载信息，true表示背景透明。
    cover('<div style="text-align:center;">loading</div>', true);
    await _import('/static/module/u-card.js').then(m => { console.log(m); })
    setTimeout(() => {
      uncover();
    }, 500);
  }

  async onshow(c) {

  }

  onhide() {

  }

  onunload() {

  }

  onbottom() {

  }

  onscroll() {

  }

}

definePage(page);
