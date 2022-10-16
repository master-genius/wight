exports.list = new function () {
  this.data = {

  };

  this.makeList = () => {
    let total = parseInt(Math.random() * 9) + 8;
    let datalist = [];
    for (let i = 0; i < total; i++) {
      datalist.push({
        id : `${(new Date()).toDateString()}${parseInt(Math.random()*10000) + 1}`,
        text: `${(new Date).toLocaleString()} ${i} ${Math.random()}`
      });
    }
    return datalist;
  };

  /**
   * d包含属性：data、target、type
   * type为map或list，表示是通过data-map还是通过data-list执行的函数。
   * data是具体的数值，target是目前执行的DOM节点。
   * @param {object} d 
   */
  this.renderList = (d) => {
    let htext = '';
    let randcolor = (n = 100, rn = 150) => {
      let r = parseInt(Math.random() * rn) + n;
      return r.toString(16);
    };

    d.data.forEach(a => {
      let colorVal = `${randcolor(96)}${randcolor(92)}${randcolor(105)}`;

      htext += `
        <div column>
          <div style="padding:0.35rem;box-shadow:0.25rem 0.25rem 0.25rem #efefef;border-radius:0.15rem;margin-bottom:0.65rem;background:#${colorVal};">
            <h4>${a.id}</h4>
            <p>${a.text}</p>
          </div>
        </div>
      `;
    });

    return htext;
  };

  this.onload = function (c) {
    this.view({
      list: this.makeList()
    });
  };

  this.onshow = function (c) {

  };

  this.onhide = function () {

  };

  this.onunload = function () {

  };

  this.onbottom = function () {
    this.view({
      list: this.makeList()
    });

  };

  this.onscroll = function (scrollTop, clientHeight, scrollHeight) {

  };

  this.ontop = function () {
  
  };

  this.onresize = function () {

  };

};