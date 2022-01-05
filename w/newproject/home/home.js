let dataList = [
  {
    id : 101,
    name : '50公斤大背包金刚粉'
  },
  {
    id : 102,
    name : '现代风格简约古朴实木布艺沙发'
  },
  {
    id : 103,
    name : '10000mAh电池超长屏幕便携手机'
  }
];

exports.home = new function () {

  this.renderList = (a) => {

    return `
        <h4>${a.data.id}</h4>
        <div>${a.data.name}</div>
      `;
  };

  this.clickTest = function (evt) {
    console.log(evt);
    notifyTop('OK');
  };

  this.getInput = function (t) {
    this.view({
      inputValue : t.value
    });
  }

  this.submitTest = function (a) {
    console.log(a);
    notifyTop(JSON.stringify(a.value));
  }

  this.curTime = function () {
    let tm = new Date();
    let tmstr = `${tm.getFullYear()}-${tm.getMonth()+1}-${tm.getDate()} `
            +`${tm.getHours()}:${tm.getMinutes()}:${tm.getSeconds()}`;
    
    return tmstr;
  }

  this.timer = null;

  this.onload = function (c) {

    this.view({
      list: dataList,
      timeText : this.curTime()
    });
    
  };

  this.onshow = function (c) {
    this.timer = setInterval(() => {
      this.view({
        timeText: this.curTime()
      });
    }, 1000);
  };

  this.clearTimer = function () {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  this.onhide = function () {
    this.clearTimer();
  };

  this.onunload = function () {
    this.clearTimer();
  };

  this.onbottom = function () {

  };

  this.onscroll = function () {

  };

};
