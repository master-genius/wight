'use strict';

class page {

  constructor() {

  }

  makeList() {
    let total = parseInt(Math.random() * 9) + 8;
    let datalist = [];
    for (let i = 0; i < total; i++) {
      datalist.push({
        id : `${(new Date()).toDateString()}${parseInt(Math.random()*10000) + 1}`,
        text: `${(new Date).toLocaleString()} ${i} ${Math.random()}`
      });
    }
    return datalist;
  }

  renderList(d) {
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
  }

  async onload(ctx) {
    this.view({
      list: this.makeList()
    });
  }

  async onshow(ctx) {

  }

  onhide() {

  }

  onunload() {

  }

  onbottom() {
    this.view({
      list: this.makeList()
    });
  }

  onscroll(scrollTop, clientHeight, scrollHeight) {

  }

  ontop() {

  }

  onresize() {

  }

}

definePage(page);
