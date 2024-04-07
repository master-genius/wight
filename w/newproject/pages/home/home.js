let dataList = [
  {
    id : 101,
    name : '50公斤大背包钢丝网背带'
  },
  {
    id : 102,
    name : '现代风格简约古朴实木布艺真皮沙发'
  },
  {
    id : 103,
    name : '50000mAh电池50cm超长屏幕便携手机'
  }
];

class page {

  constructor () {
    this.timer = null;
    this.display = {
      list: (ctx) => {
        return ctx.data.renders((a) => {
          return `
            <h4>${a.id}</h4>
            <div>${a.name}</div>
          `;
        })
      }
    }
  }

  clickTest(evt) {
    console.log(evt);
    notifyTop('OK');
  }

  getInput(t) {
    this.view({
      inputValue : t.value
    });
  }

  submitTest(a) {
    notifyTop(JSON.stringify(a.value));
  }

  curTime() {
    let tm = new Date();
    let tmstr = `${tm.getFullYear()}-${tm.getMonth()+1}-${tm.getDate()} `
            +`${tm.getHours()}:${tm.getMinutes()}:${tm.getSeconds()}`;
    
    return tmstr;
  }

  async onload(c) {
    this.view({
      list: dataList,
      timeText : this.curTime()
    });
    
    setTimeout(() => {
      w.share.test = 123;
    }, 1000);

    setTimeout(() => {
      delete w.share.test;
    }, 2000);

  }

  async onshow(c) {
    this.timer = setInterval(() => {
      this.view({
        timeText: this.curTime()
      });
    }, 1000);
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  onhide() {
    this.clearTimer();
  }

  onunload() {
    this.clearTimer();
  }

  onbottom() {

  }

  onscroll(scrollTop, clientHeight, scrollHeight) {

  }

}

//定义页面，请务必保持此代码，否则页面不会生效。
definePage(page);
