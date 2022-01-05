exports.user = new function () {
  this.data = {
    list : [
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
  };

  this.mapLevel = function (level) {
    if (level < 2) {
      return '*';
    } else if (level < 5) {
      return '**';
    } else if (level < 8) {
      return '***';
    } else if (level < 10) {
      return '****';
    }

    return '*****';
  };

  this.filterData = function (dl, nod) {
    let htext = '';
    this.data.list.forEach((d) => {
      htext += `<div class="user-cell" data-onclick="showUserInfo">
        <h4>${d.name}</h4>
        <div row>
          <div c-5>ID: ${d.id}</div>
          <div c-4>${this.mapLevel(d.level)}</div>
        </div>
      </div>`;
    });

    return htext;
  };

  this.showUserInfo = function (d) {
    prompt(d.target.innerHTML);
  };

  this.onload = function (c) {
    this.view({
      userData : this.data.list
    });
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