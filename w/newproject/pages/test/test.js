'use strict';

class page {

  constructor() {

  }

  testConfirm(t) {
    confirm({
      text: '确认？',
      callback: () => {
        notify('OK')
      },

      cancel: () => {
        notify('CANCEL')
      }
    })
  }

  async onload(ctx) {
  
  }

  async onshow(ctx) {

  }

  onhide() {

  }

  onunload() {

  }

  onbottom() {

  }

  onscroll(scrollTop, clientHeight, scrollHeight) {

  }

  ontop() {

  }

  onresize() {

  }

}

definePage(page);
