'use strict';

class __htmlstate {

  constructor () {
    this.STATE = {
      CHAR: 'c',
      TAG_ATTR_PRE: '_',
      TAG_ATTR: 'a',
      TAG_START: '<',
      TAG_END: '>',
      TAG_CLOSE : '/',
      TAG_CLOSE_END: '/>',
      SPACE: ' ',
      TAG_ATTR_VALUE_START: '@',
      TAG_ATTR_VALUE_END: '/@',
      TAG_CLOSE_START: '</',
      TAG_ATTR_SET_VALUE: '=',
      TAG_ATTR_VALUE: 'v',
      TAG_NAME: 'n',
      TAG_CLOSE_NAME: 'cn',
      NONE: 0
    }

    //记录当前属性值的类型：单引号、双引号、无
    this.attrType = ''
    this.curState = this.STATE.NONE
    this.cursor = 0
    this.lastCursor = 0

    this.tagStack = []
    this.tagCloseStack = []

    this.singleTags = [
      'br', 'hr', 'img', 'input', 'param', 'meta', 'link'
    ]

    this.lastErrorMsg = ''

    this.curTagIndex = 0
    this.curTagEndIndex = 0

    this.data = ''

    this.is_script = false
  }

  diffCloseTag () {
    let tagname = ''
    let endIndex = this.curTagEndIndex

    while (this.data[endIndex] !== ' ' && endIndex < this.cursor) {
      endIndex += 1
    }

    tagname = this.data.substring(this.curTagEndIndex, endIndex)

    if (tagname.toLowerCase() !== this.tagStack.pop()) {
      return false
    }

    return true
  }

  pushTag () {
    
    let tagname = ''
    let endIndex = this.curTagIndex

    while (this.data[endIndex] !== ' ' && endIndex < this.cursor) {
      endIndex += 1
    }

    tagname = this.data.substring(this.curTagIndex, endIndex).toLowerCase()

    this.singleTags.indexOf(tagname) < 0 && this.tagStack.push(tagname)

    if (tagname === 'script')
      this.is_script = true

  }

  /**
   * 在不是设置属性值的状态下（TAG_ATTR_VALUE），如果出现了< >则为非法格式。
   * 在属性值中，如果出现了单引号或双引号的冲突则为非法格式。
   */

  checkSpace (next_char) {
    if (this.STATE.TAG_START === this.curState || this.STATE.TAG_CLOSE === this.curState) {
      return false
    }

    if (next_char === ' ') return true

    if (this.curState === this.STATE.TAG_ATTR_VALUE_END) {
      this.curState = this.STATE.TAG_ATTR_PRE
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE) {
      if (this.attrType === '') {
        this.curState = this.STATE.TAG_ATTR_PRE
      }

      return true
    }

    if (this.STATE.TAG_NAME === this.curState || this.curState === this.STATE.TAG_ATTR) {
      this.curState = this.STATE.TAG_ATTR_PRE
    }
    else if (this.STATE.NONE === this.curState) {
      this.curState = this.STATE.CHAR
    }
    else if (next_char === '>') {
      return false
    }

    return true
  }

  checkTagStart (next_char) {

    if (this.curState === this.STATE.TAG_ATTR_VALUE) {
      if (this.attrType !== '') {
        return false
      }
      return true
    }

    if (this.STATE.TAG_END === this.curState 
      || this.STATE.TAG_CLOSE_END === this.curState 
      || this.STATE.NONE === this.curState 
      || this.STATE.CHAR === this.curState)
    {
      if (next_char === '/') {
        this.curState = this.STATE.TAG_CLOSE
        this.cursor += 1
        this.curTagEndIndex = this.cursor + 1
      } else {
        this.curState = this.STATE.TAG_START
        this.curTagIndex = this.cursor + 1
      }
      
      return true
    }

    return false

  }

  checkTagEnd (cur_char, next_char) {
    
    if (this.curState === this.STATE.TAG_CLOSE_NAME) {
      this.curState = this.STATE.TAG_CLOSE_END
      if (!this.diffCloseTag()) {
        return false
      }
      return true
    }

    if (this.curState === this.STATE.TAG_NAME 
      || this.curState === this.STATE.TAG_ATTR
      || this.curState === this.STATE.TAG_ATTR_PRE
      || (this.curState === this.STATE.TAG_ATTR_VALUE && this.attrType === '')
      || this.curState === this.STATE.TAG_ATTR_VALUE_END)
    {
      this.curState = this.STATE.TAG_END
      this.pushTag()
      return true
    }

    return false
  }

  checkAttrQuote (cur_char, next_char) {
    if (this.curState === this.STATE.NONE 
      || this.curState === this.STATE.CHAR 
      || this.curState === this.STATE.TAG_CLOSE_END
      || this.curState === this.STATE.TAG_END)
    {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_SET_VALUE) {
      this.attrType = cur_char
      this.curState = this.STATE.TAG_ATTR_VALUE_START
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE_END) {
      return false
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE || this.curState === this.STATE.TAG_ATTR_VALUE_START)
    {
      if (cur_char !== this.attrType) {
        return false
      }
      this.curState = this.STATE.TAG_ATTR_VALUE_END
      return true
    }

    return false
  }

  checkAttrSetValue (next_char) {

    if (this.curState === this.STATE.NONE) {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.STATE.CHAR === this.curState 
      || this.curState === this.STATE.TAG_END 
      || this.curState === this.STATE.TAG_CLOSE_END)
    {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.STATE.TAG_ATTR === this.curState) {
      this.curState = this.STATE.TAG_ATTR_SET_VALUE
      return true
    }

    return false
  }

  checkChar(cur_char, next_char) {

    if (cur_char === '/' && next_char && next_char === '>') {
      if ( (this.attrType === '' && this.curState === this.STATE.TAG_ATTR_VALUE)
        || this.STATE.TAG_NAME === this.curState
        || this.STATE.TAG_ATTR === this.curState
        || this.STATE.TAG_ATTR_PRE === this.curState
      ) {
        this.cursor += 1;
        this.curState = this.STATE.TAG_CLOSE_END;
        return true;
      }
    }

    if (this.curState === this.STATE.TAG_ATTR_PRE) {
      this.curState = this.STATE.TAG_ATTR
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_SET_VALUE) {

      if (cur_char === '\\') {
        this.cursor += 2
        return true
      }

      this.attrType = ''
      this.curState = this.STATE.TAG_ATTR_VALUE
      return true
    }

    if (this.curState === this.STATE.NONE) {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE_START) {
      this.curState = this.STATE.TAG_ATTR_VALUE
      return true
    }

    if (this.curState === this.STATE.TAG_START) {
      this.curState = this.STATE.TAG_NAME
      return true
    }

    if (this.curState === this.STATE.TAG_CLOSE) {
      this.curState = this.STATE.TAG_CLOSE_NAME
      return true
    }
    
    return true;
  }

  checkState (cur_char, next_char) {

    if (cur_char !== this.attrType && this.attrType !== '') {
      if (this.curState === this.STATE.TAG_ATTR_VALUE)
      {
        return true
      }
    }

    if (this.is_script) {
      let script_ind = this.data.indexOf('<\/script>', this.cursor);
      if (script_ind < 0) {
        return false
      }

      this.cursor = script_ind - 1
      this.is_script = false
      return true
    }

    switch (cur_char) {
      case '<':
        return this.checkTagStart(next_char)

      case '>':
        return this.checkTagEnd(cur_char, next_char)

      case '"':
      case "'":
        return this.checkAttrQuote(cur_char, next_char)

      case ' ':
        return this.checkSpace(next_char)

      case '=':
        return this.checkAttrSetValue(next_char)

      default:
        return this.checkChar(cur_char, next_char)
    }

  }

  diffStack () {

    if (this.tagStack.length !== this.tagCloseStack.length) {
      return false
    }

    return true
  }

  init () {
    this.curState = this.STATE.NONE
    this.attrType = ''
    this.curTagIndex = this.curTagEndIndex = 0
    this.tagStack = []
    this.is_script = false
    this.data = ''
    this.cursor = 0
  }

  parse (data) {
    
    this.init();

    if (typeof data !== 'string') {
      console.error('data is not string.')
      return true;
    }

    if (data.indexOf('<!doctype html>') >= 0) {
      this.lastErrorMsg = '渲染数据不可出现&lt;!doctype html&gt;声明';
      return false;
    }

    this.data = data.replace(new RegExp('<SCRIPT>', 'ig'), '<script>')
                    .replace(new RegExp('<\/SCRIPT>', 'ig'), '<\/script>')
                    .replace(/<!--(.|[\r\n])*?-->/mg, '');

    if (this.data.length === 0) {
      return true
    }

    if (this.data.length === 1) {
      if (this.data[0] === '<' || this.data[0] === '>') {
        this.lastErrorMsg = '标签符号 < 或 > 需要转义'
        return false
      }

      return true
    }

    this.cursor = 0

    let end_index = this.data.length
    let last_index = this.data.length - 1
    let st

    while (this.cursor < end_index) {
      if (this.cursor < last_index)
        st = this.checkState(this.data[this.cursor], this.data[this.cursor+1])
      else
        st = this.checkState(this.data[this.cursor], '')

      if (this.curState === this.STATE.TAG_START)
        this.lastCursor = this.cursor

      if (!st) {
        let errt = this.data.substring(this.lastCursor, this.cursor + 10);
        
        this.lastErrorMsg = `index ${this.lastCursor} ~ ${this.cursor}, 错误的语法。<p style="color:#df6878;">...`
          +`${errt.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}...</p>`;

        console.error(this.data);
        return false;
      }

      this.cursor += 1
    }

    //console.log(this.cursor, data[this.cursor], this.curState)
    //最后的结束状态只能是字符或者标签结束
    if (this.curState !== this.STATE.CHAR 
      && this.curState !== this.STATE.TAG_END 
      && this.curState !== this.STATE.TAG_CLOSE_END)
    {
      this.lastErrorMsg = '标签结束状态错误，请检查模板字符串的语法格式。'
      return false
    }

    if (!this.diffStack()) {
      this.lastErrorMsg = '模板标签包含嵌套不一致。'
      return false
    }

    return true

  }

}

const w = new function () {
  this.alertlog = '';
  this.alertlogcount = 0;
  this.notifylog = '';
  this.notifylogcount = 0;

  Object.defineProperty(this, 'config', {
    value: {},
    writable: false,
    enumerable: true,
    configurable: false
  });

  this.config.notFound = '';

  this.host = '';
  this.prepath = '';
  this.homepage = null;

  this.__title__ = '';
  this.curTitle = '';

  this.checkhtml = true;

  this.errorList = [];
  
  Object.defineProperty(this, 'title', {
    set: (t) => {
      if (t === null || t === '' || t === undefined) {
        document.getElementById('app-title').innerHTML = this.__title__;
        this.curTitle = this.__title__;
      } else {
        document.getElementById('app-title').innerHTML = t;
        this.curTitle = t;
      }
    },
    get: () => {
      return this.curTitle;
    }
  });

  this.setTitle = (t) => {
    this.title = `${this.__title__}${t}`;
  };

  this.resetTitle = () => {
    this.title = this.__title__;
  };

  this.ua = navigator.userAgent;

  this.isFirefox = false;
  if (navigator.userAgent.indexOf('Firefox') > 0) {
    this.isFirefox = true;
  }

  this.alertLock = false;

  //replace=false, notClose=false, withCover = false
  this.alert = function (info, options = {}) {
    let domname = 'alertdom';
    let coverdomname = 'alertcoverdom';
    if (options.shadow) {
      domname = 'alertdom1';
      coverdomname = 'alertcoverdom1';
    }

    if (w.alertLock && !options.shadow) {
      return false;
    }

    info = w.fmtHTML(w.curpagename, info);

    let check_stat = true;
    w.checkhtml && (check_stat = w._htmlcheck(info));

    if (!check_stat) {
      return w[domname];
    }

    if (w[domname]) {
      if (!options.shadow) {
        w.alertlogcount += 1;

        if (w.alertlogcount > 3) {
          w.alertlog = '';
          w.alertlogcount = 1;
        }
      }

      if (options.replace) {
        w.alertlog = info;
      } else {
        w.alertlog = `${info}<br>${w.alertlog}`;
      }

      let closeText = '<div style="text-align:right;">'
        +'<a href="javascript:w.unalert();" '
        +'style="color:#696365;font-size:105%;text-decoration:none;cursor:pointer;">'
        +'&nbsp;X&nbsp;</a>'
        +'</div>';

      if (options.notClose) {
        closeText = '';
      }

      w[domname].className = 'w-global-alert-info';

      if (options.transparent) w[domname].className += ' w-global-alert-trans';

      if (typeof info === 'object') {
        w[domname].innerHTML = `${closeText}${info.innerHTML}`;
      } else {
        w[domname].innerHTML = `${closeText}${w.alertlog}`;
      }
      w.initPageDomEvents(options.context || w.curpage, w[domname]);
    }

    if (options.withCover && w[coverdomname]) {
      !options.shadow && (w.alertLock = true);
      w[coverdomname].className = 'w-alert-cover-page';
    }

    return w[domname];
  };

  this.unalert = function (mode = 'self') {

    let domlist = [ 'alertdom' ];
    let cdomlist = [ 'alertcoverdom' ];

    if (mode === 'shadow') {
      domlist = ['alertdom1'];
      cdomlist = ['alertcoverdom1'];
    } else if (mode === 'all') {
      domlist = ['alertdom', 'alertdom1'];
      cdomlist = ['alertcoverdom', 'alertcoverdom1'];
    }

    if (mode !== 'shadow') {
      this.alertLock = false;
      w.alertlogcount = 0;
      w.alertlog = '';
    }

    for (let a of domlist) {
      if (w[a]) {
        w[a].innerHTML = '';
        w[a].className = '';
      }
    }

    for (let a of cdomlist) {
      if (w[a]) {
        w[a].className = '';
        w[a].innerHTML = '';
        w[a].style.cssText = '';
      }
    }
  };

  this.uncover = function () {
    this.unalert();
  };

  this.uncoverShadow = function () {
    this.unalert('shadow');
  };

  this.coverShadow = function (info, trans = false) {
    this.alert(info, {
      replace: true,
      notClose: true,
      withCover: true,
      shadow: true,
      transparent: trans
    });
  };

  this.acover = function (info, trans = false) {
    this.alert(info, {
      replace: true,
      notClose: true,
      withCover: true,
      transparent: trans
    });
  };

  this.alertError = function (info, tmout = 0) {
    info = `<span style="color:#e73949;">${info}</span>`;
    w.alert(info);
    if (tmout > 0) {
      setTimeout(() => {
        w.unalert();
      }, tmout);
    }
  };

  this.notifyError = function (info, tmout = 2000) {
    w.notify(info, {tmout: tmout, ntype: 'error'});
  };

  this.notifyLight = function (info, tmout = 2000) {
    w.notify(info, {tmout: tmout, ntype: 'light'});
  };

  this.notifyTop = function (info, tmout = 2500) {
    w.notify(info, {tmout:tmout, ntype: 'top'});
  };

  this.notifyTopError = function (info, tmout = 2500) {
    w.notify(info, {tmout: tmout, ntype: 'top-error'});
  };

  this.notifyOnly = function (info, tmout = 2500) {
    w.notify(info, {tmout: tmout, ntype: 'only'});
  };

  this.notifyTimer = null;

  this.notify = function (info, options = {}) {
    let tmout = options.timeout || options.tmout;

    tmout = tmout !== undefined && !isNaN(tmout)
                  ? tmout : 3500;

    let ntype = options.ntype || 'notify';

    if (tmout < 0) {
      w.notifyTimer && clearTimeout(w.notifyTimer);
      w.notifyTimer = null;
      w.unnotify();
    }

    info = w.fmtHTML(w.curpagename, info);

    let check_stat = true;

    w.checkhtml && (check_stat = w._htmlcheck(info));

    if (!check_stat) {
      return w.notifydom;
    }

    if (ntype.indexOf('error') >= 0) {
      info = `<span style="color:#f76567;font-size:95%;">${info}</span>`;
    }

    let where_is = 'w-notify-bottom';
    if (ntype.indexOf('top') >= 0) {
      where_is = 'w-notify-top';
    }

    let colorText = '#e5e5e9';

    if (ntype.indexOf('light') >= 0) {
      where_is += ' w-notify-light';
      colorText = '#4a4a4a';
    }

    if (ntype.indexOf('only') >= 0) {
      w.notifylogcount = 6;
      if (w.notifydom.className.length > 0) {
        w.unnotify();
      }
    }

    if (w.notifydom) {
      w.notifylogcount += 1;
      if (w.notifylogcount > 5) {
        w.notifylog = '';
        w.notifylogcount = 1;
      }
      
      w.notifylog = `${info}<br>${w.notifylog}`;

      w.notifydom.className = `w-global-notify-box ${where_is} w-global-notify-info`;

      if (ntype.indexOf('noclose') >= 0) {
        w.notifydom.innerHTML = `<p style="color:${colorText};">${w.notifylog}</p>`;
      } else {
        w.notifydom.innerHTML = `<div style="text-align:right;">`
          +`<a href="javascript:w.unnotify();" `
          +`style="color:#dfdfdf;font-size:109%;text-decoration:none;">&nbsp;X&nbsp;</a>`
          +`</div><p style="color:${colorText};">${w.notifylog}</p>`;
      }
      w.initPageDomEvents(w.curpage, w.notifydom);
    }

    if (tmout >= 0) {
      w.notifyTimer && clearTimeout(w.notifyTimer);
      w.notifyTimer = setTimeout(() => {
        w.unnotify();
      }, tmout);
    }

    return w.notifydom;
  };

  this.unnotify = function () {
    if (w.notifydom) {
      w.notifylog = '';
      w.notifylogcount = 0;
      w.notifydom.className = '';
      w.notifydom.innerHTML = '';
      w.notifyTimer = null;
    }
  };

  this.notice = function (info) {
    w.notify(info, {tmout: -1});
  };

  this.promptMiddle = function (info, options = {}) {
    options.wh = 'middle';
    w.prompt(info, options);
  };

  this.promptMiddleGlass = function (info, options = {}) {
    options.wh = 'middle';
    options.glass = 'glass';
    this.promptGlass(info, options);
  };

  this.promptGlass = function (info, options = {}) {
    options.glass = 'glass';
    this.prompt(info, options);
  };

  this.promptDark = function (info, options = {}) {
    options.glass = 'dark';
    this.prompt(info, options);
  };

  this.promptMiddleDark = function (info, options = {}) {
    options.wh = 'middle';
    options.glass = 'dark';

    this.promptDark(info, options);
  };

  this.promptTop = function (info, options = {}) {
    options.wh = 'top';
    this.prompt(info, options);
  };

  this.promptTopGlass = function (info, options = {}) {
    options.wh = 'top';
    options.glass = 'glass';
    this.prompt(info, options);
  };

  this.promptTopDark = function (info, noclose = false) {
    this.promptTop(info, noclose, 'dark');
  };

  //wh = 'bottom', noclose = false, glass = false
  this.prompt = function (info, options = {}) {

    info = w.fmtHTML(w.curpagename, info);

    let wh = options.wh || 'bottom';
    let noclose = options.noclose || false;
    let glass = options.glass || false;

    if (w.promptdom) {
      w.promptdom.className = `w-prompt-box w-prompt-${wh} w-prompt-display`;
      let pcolor = '#424242';

      if (glass === true || glass === 'glass') {
        w.promptdom.className += ' w-prompt-glass';
      } else if (glass === 'dark') {
        w.promptdom.className += ' w-prompt-dark';
        pcolor = '#efefef';
      }

      if (options.color) pcolor = options.color;

      if (noclose) {
        w.promptdom.innerHTML = `<p style="color:${pcolor};">${info}</p>`;
      } else {
        w.promptclosedom.className = 'w-prompt-close';
        if (glass === true || glass === 'glass')
          w.promptclosedom.className += ' w-prompt-close-glass';
        w.promptclosedom.onclick = evt => {
          w.unprompt();
        };

        w.promptdom.innerHTML = `<div style="overflow:auto;word-wrap:break-word;">`
          + `<p style="color:${pcolor};">${info}</p></div>`;
      }
      w.initPageDomEvents(w.curpage, w.promptdom);
    }
    return w.promptdom;
  };

  this.promptBlock = function (info) {
    if (w.promptdom) {
      w.promptdom.className = 'w-prompt-box w-prompt-block';
      w.promptdom.innerHTML = `<div style="color:#4a4a4f;padding:0.8rem;margin-top:5%;">`
          + `${w.fmtHTML(w.curpagename, info)}`
          + `</div>`;
    }
    w.initPageDomEvents(w.curpage, w.promptdom);
    return w.promptdom;
  };

  this.unprompt = function () {
    if (w.promptdom) {
      w.promptdom.className = '';
      w.promptdom.innerHTML = '';
    }

    if (w.promptclosedom) {
      w.promptclosedom.className = '';
      w.promptclosedom.innerHTML = '';
    }

  };

  this.parseHashUrl = function (h) {
    let url = {
      query : {},
      path  : '',
      orgpath : ''
    };

    if (h.length > 0 && h[0] == '#') {
      h = h.substring(1);
    }

    url.orgpath = h;

    let hsp = h.split('?');
    url.path = hsp[0];

    let qs = '';
    if (hsp.length > 1) {
      qs = hsp[1];
    }
    let qsp = qs.split('&');
    let tmp = [];
    for (let i=0; i<qsp.length; i++) {
      tmp = qsp[i].split('=');
      if (tmp.length < 1) {
        tmp.push('');
      }
      url.query[tmp[0]] = tmp[1];
    }
    
    return url;
  };

  this.firstListenHash = true;
  this.listenHashLock = false;
  this.historyList = ['#'];
  this.historyLength = history.length;
  this.pageShowType = '';
  this.pageShowTypeLock = false;
  
  this.listenHash = function (op = '') {
    if (this.listenHashLock === true) {
      return ;
    }

    if (!this.pageShowTypeLock) {
      this.pageShowType = op;
    }
    
    this.pageShowTypeLock = false;

    try {
      this.listenHashLock = true;
      let h = location.hash;
      let r = this.parseHashUrl(h);

      if (w.tabs.pages.indexOf(r.path) >= 0) {
        this.listenHashLock = false;
        if (this.firstListenHash) {
          location.hash = '';
          return;
        }
        return;
      }

      this.firstListenHash = false;

      //表示从其他页面到了tab主页
      if (r.path == '' && w.tabs.list.length > 0) {
        this.listenHashLock = false;
        let tp = w.tabs.cur;
        w.tabs.cur = '';
        return w.switchTab(tp || w.tabs.pages[0]);
      }

      this.loadPage(r);
      this.listenHashLock = false;
    } catch (err) {
      this.listenHashLock = false;
    }
  };

  this.pages = {};
  this.curpage = null;
  this.curpagename = null;

  this.storage = new function () {
    this.length = 0;

    this.set = function (k, d) {
      try {
        let tmp;
        switch (typeof d) {
          case 'number':
            tmp = `${d}`;
            break;
          case 'object':
            tmp = JSON.stringify(d);
            break;
          case 'function':
            tmp = 'function';
            break;
          case 'string':
            tmp = d;
            break;
          default:
            tmp = d.toString();
        }

        localStorage.setItem(k, tmp);
        this.length += tmp.length;
        return true;

      } catch (err) {
        return false;
      }
    };

    this.get = function (k, jsonserial = false) {
      let tmp = localStorage.getItem(k);
      if (tmp === null) {
        return null;
      }
      try {
        return jsonserial ? JSON.parse(tmp) : tmp;
      } catch (err) {
        return null;
      }
    };

    this.remove = function (k) {
      let tmp = localStorage.getItem(k);
      if (tmp !== null) {
        localStorage.removeItem(k);
        this.length -= tmp.length;
      }
    };

    this.delete = this.remove;

    this.clear = function () {
      localStorage.clear();
      this.length = 0;
    };

    this.getPre = function (pre, options = null) {
      let total = localStorage.length;
      let nk;
      let dlist = [];
      for (let i = 0; i < total; i++) {
        nk = localStorage.key(i);
        if (nk.indexOf(pre) !== 0) continue;

        if (options && options.justKeys) {
          dlist.push(nk);
        } else {
          dlist.push({
            key: nk,
            data: this.jget(nk)
          });
        }
      }

      return dlist;
    };

    this.removePre = function (pre, callback = null) {
      let dlist = this.getPre(pre);
      for (let a of dlist) {
        if (callback && typeof callback === 'function') {
          callback(a) && this.remove(a.key);
        } else {
          this.remove(a.key);
        }
      }
    };

    this.jget = function (k) {
      return this.get(k,true);
    };

  };

  this.initFlag = false;

  this.initPage = function () {
    for (let k in this.pages) {
      this.pages[k].__dom__ = this.pgcdom.insertBefore(
                  document.createElement('div'),
                  this.pgcdom.firstChild
                );
      this.pages[k].initCount = 0;
      this.pages[k].loaded = false;
      this.pages[k].scroll = 0;
      this.pages[k].bottomTime = 0;
      this.pages[k].pageKey = k;
      this.pages[k].__name__ = k;
      this.pages[k].init = false;
      this.pages[k].__dom__.onscroll = w.events.scroll;
      
      this.pages[k].tabsPlace = '';

      if (w.tabs.list.length > 0) {

        this.pages[k].tabsPlace = '<div style="height:3.8rem;">&nbsp;</div>';

        if (w.tabs.pages.indexOf(k) >= 0) {
          this.pages[k].__dom__.style.cssText = 'z-index:1;';
        }
      }

    }
    this.initFlag = true;
  };

  this.destroyAllPage = function () {
    for (let k in w.pages) {
      this.destroyPage(w.pages[k]);
    }
  };

  this.destroyPage = function (page = null) {
    if (page === null) {
      page = this.curpage;
      if (page === null) {
        return ;
      }
    }
    if (page.onunload && typeof page.onunload === 'function') {
      try {
        page.onunload();
      } catch (err) {
        w.notifyError(`Page：${page.__name__} 执行onunload失败：<p>${err.message}</p>`, 10000);
      }
    }
    
    page.__dom__.innerHTML = '';
    page.__dom__.className = 'w-hide-cur-page';
    page.init = false;
    page.loaded = false;
    page.bottomTime = 0;
  };

  this.stopPage = function (page = null) {
    if (page === null) {
      page = this.curpage;
      if (page === null) {
        return ;
      }
    }
    page.__dom__.className = 'w-hide-cur-page';
  };

  this.unStopPage = function (page = null) {
    if (page === null) {
      page = this.curpage;
      if (page === null) {
        return ;
      }
    }
    page.__dom__.className = 'w-current-page-display';
  };

  this.hidePage = function (page = null) {
    if (!page) page = w.curpage;
    if (page === null) {
      return ;
    }

    if (w.pageShowType === 'back') {
      page.__dom__.className = 'w-hide-cur-page w-hide-cur-page-back';
    } else {
      page.__dom__.className = 'w-hide-cur-page';
    }

    if (page.onhide && typeof page.onhide === 'function') {
      try {
        page.onhide();
      } catch (err) {
        console.error(err);
      }
    }
  };

  this.showPage = function (page) {
    if (!w.pageShowType || location.hash === '#' || w.curpagename === w.homepage || location.hash === '') {
      page.__dom__.className = 'w-current-page-display';
    }
    else if (w.pageShowType === 'forward') {
      page.__dom__.className = 'w-current-page-display w-current-page-display-forward';
    } else if (w.pageShowType === 'back') {
      page.__dom__.className = 'w-current-page-display w-current-page-display-back';
    }
  };

  this.hideAll = function () {
    for (let k in this.pages) {
      this.pages[k].__dom__.className = 'w-hide-cur-page';
    }
  };

  this.context = function () {
    return {
      path : '',
      model : {},
      request : w.request,
      dom : null,
      url : {}
    };
  };

};

w._htmlparse = new __htmlstate();

w._htmlcheck = function (data) {
  if (!w._htmlparse.parse(data)) {
    w.notify(w._htmlparse.lastErrorMsg, {tmout: 10000, ntype: 'top-error'});
    return false;
  }
  return true;
};

w.getCoverDom = () => {
  return w.alertcoverdom;
};

w.setCoverText = (text = '', style = '') => {
  w.alertcoverdom.innerHTML = text;
  w.alertcoverdom.style.cssText = style;
};

w.setCoverShadowText = (text = '', style = '') => {
  w.alertcoverdom1.innerHTML = text;
  w.alertcoverdom1.style.cssText = style;
};

w.sliderPage = function(html = null, append = true, obj=null) {
  if (w.slidedom) {
    w.slidedom.className = 'w-common-slide-right';
    w.slidexdom.className = 'w-common-slide-right-close';
    w.slidexdom.onclick = w.hideSliderPage;

    if (html !== null) {
      if (typeof html === 'string') {
        let fmthtml = w.fmtHTML(w.curpagename, html);
        let check_stat = true;

        w.checkhtml && (check_stat = w._htmlcheck(fmthtml));
        check_stat && (w.slidedom.innerHTML = fmthtml);

      } else {
        if (append) {
          w.slidedom.innerHTML = '';
          w.slidedom.appendChild(html);
        } else {
          w.slidedom.innerHTML = w.fmtHTML(w.curpagename, html.innerHTML);;
        }
      }
      w.initPageDomEvents(obj || w.curpage, w.slidedom);
    }
  }

  return w.slidedom;
};

w.hideSliderPage = function () {
  if (w.slidedom) {
    w.slidedom.className = 'w-hide-common-slide-right';
    w.slidexdom.className = 'w-hide-common-slide-right-close';
    w.slidedom.innerHTML = '';
  }
};
w.hideSlider = w.hideSliderPage;

w.pageTop = function () {
  if (w.curpage) {
    w.curpage.__dom__.scrollTop = 0;
  }
};

w.loadPageLock = false;

w.handleNotFound = function () {
  if (!w.config.notFound || typeof w.config.notFound === 'string') {
    this.coverShadow(w.config.notFound || '<div>404: 没有此页面</div>');
  } else {
    if (typeof w.config.notFound === 'function') {
      w.config.notFound();
    } else if (typeof w.config.notFound === 'object') {
      let obj = w.config.notFound;
      if (obj.redirect && w.pages[obj.redirect]) {
        w.redirect(obj.redirect);
      } else {
        this.coverShadow('<div>404: 没有此页面</div>');
      }
    }
  }
};

w.going = null;

w.loadPage = async function (R) {
  if (w.loadPageLock) {
    return;
  }
  w.loadPageLock = true;

  let route = R.path;
  if (route == '' || route == '/') {
    route = this.homepage;
  }

  if (this.pages[route] === undefined) {
    w.loadPageLock = false;
    this.handleNotFound();
    return ;
  }

  let pg = this.pages[route];

  //临时的解决方案，如果没有准备好，则等待一会。
  if (this.initFlag===false) {
    await new Promise((rv,rj) => {
      setTimeout(()=>{rv();}, 52);
    });
  }

  let c = this.context();
  c.path = route;
  c.query = R.query;
  c.orgpath = R.orgpath;

  c.goTop = function () {
    pg.scroll = 0;
    c.dom.scrollTop = 0;
  };
  
  c.dom = pg.__dom__;
  c.loaded = pg.loaded;

  c.name = pg.__name__;
  this.going = pg.__name__;

  if (false === await w.runHooks(c)) {
    w.loadPageLock = false;
    return false;
  }

  let oldpg = this.curpage;
  this.curpage = pg;
  this.curpagename = pg.__name__;
  this.hidePage(oldpg);
  this.showPage(pg);

  w.loadPageLock = false;

  if (pg.init === false) {
    if (!w._htmlcheck(pg.orgHTML)) {
      w.notifyTopError(`页面初始化错误：${pg.__name__}.html`, 10000);
      return false;
    }
    pg.init = true;

    pg.__dom__.innerHTML = `${pg.orgHTML}${pg.tabsPlace}`;

    w.initPageDomEvents(pg, pg.__dom__);
  }

  if (pg.onload && typeof pg.onload === 'function' && pg.loaded === false) {
    pg.loaded = true;
    try {
      pg.onload(c);
    } catch (err) {
      w.notify(err.message);
    }
  }

  if (pg.onshow && typeof pg.onshow === 'function') {
    try {
      pg.onshow(c);
    } catch (err) {
      w.notify(err.message);
    }
  }

  pg.__dom__.scrollTop = pg.scroll;

};

w.reload = function (force = true) {
  let pg = w.curpage;

  if (!pg || force) {
    return w.listenHash();
  }

  w.destroyPage(pg);
  let R = w.parseHashUrl(pg.__name__);
  w.loadPage(R);
};

w.qs = function (args) {
  let qrs_list = [];

  for (let k in args) {
    qrs_list.push(`${k}=${encodeURIComponent(args[k])}`);
  }

  return qrs_list.join('&');
};

w.go = function (path, args = {}, op = 'forward') {
  if (typeof args === 'string') {
    op = args;
    args = {};
  }
  
  this.pageShowTypeLock = true;
  w.pageShowType = op;

  let qrs = w.qs(args);
  
  location.hash = `${path}${qrs.length>0?'?':''}${qrs}`;
};

w.redirect = function (path, args = {}) {
  this.pageShowTypeLock = true;
  w.pageShowType = 'forward';
  
  if (path[0] !== '#') path = `#${path}`;

  let qrs = w.qs(args.query || {});

  let startRedirect = () => {
    history.replaceState({id: path}, '', `${path}${qrs.length > 0 ? '?' : ''}${qrs}`);
    w.listenHash();
  };

  if (args.delay) {
    return setTimeout(startRedirect, args.delay);
  }

  startRedirect();
};

w.fmtHTML = function (pagename, ht) {

  if (!ht || !ht.replace || typeof ht.replace !== 'function') {
    return ht || '';
  }

  ht = ht.replace(/ on[^(=|"|'|;)]+="[^"]+"/g, m => {
    let sp = m.split('=');
    let fstr = sp[1].substring(1, sp[1].length-1);
    let retFalse = '';

    if (fstr.indexOf('w.') != 0) {
      fstr = `w.pages.${pagename}.${fstr}(this);`;
      if (sp[0] === ' onsubmit') {
        retFalse = 'return false;';
      }
      return `${sp[0]}="${fstr}${retFalse}"`;
    }

    return m;
  });

  ht = ht.replace(/ on[^=]+=[^(\s|>|"|')]+/g, m => {
    let sp = m.split('=');
    let fstr = sp[1];

    if (fstr.indexOf('w.') != 0) {
      fstr = `w.pages.${pagename}.${fstr}(this);`;
      if (sp[0] === ' onsubmit') {
        return `${sp[0]}="${fstr}return false;"`;
      }
      return `${sp[0]}=${fstr}`;
    }

    return m;
  });

  return ht;
};

w.setAttr = function (pagename, data) {

  if (this.pages[pagename] === undefined) {
    return;
  }

  if (typeof data !== 'object') {
    return;
  }

  let pg = this.pages[pagename];
  let pgdom = pg.__dom__;

  let qcss, nds, attr;

  for (let k in data) {
    qcss = `[data-name=${k}]`;

    if (k[0] === '#') {
      qcss = k;
    } else if (k[0] === '@') {
      qcss = `[name=${k.substring(1)}]`;
    } else if (k[0] === '.') {
      qcss = `[class=${k.substring(1)}]`;
    } else if (k[0] === '[') {
      qcss = k;
    } else if (k[0] === ':') {
      qcss = `[data-bind=${k.substring(1)}]`;
    }

    nds = pgdom.querySelectorAll(qcss);

    if (nds.length === 0) {
      nds = w._queryGlobal(qcss);
    }

    attr = data[k];

    for (let d of nds) {
      for (let a in attr) {
        switch (a) {
          case 'class':
            d.className = attr[a];
            break;

          case 'style':
            if (typeof attr[a] === 'string') {
              d.style.cssText = attr[a];
            } else if (typeof attr[a] === 'object') {
              for (let ak in attr[a]) {
                d.style[ak] = attr[a][ak];
              }
            }
            break;

          default:
            d[a] = attr[a];
        }
        
      }
    }

  }

};

w._globaldoms = [
  'alertdom', 'slidedom', 'promptdom', 'navibtndom', 'notifydom', 
];

w._queryGlobal = function (qstr) {
  let nds = [];
  let t = [];
  
  for (let a of w._globaldoms) {
    if (!w[a]) {
      continue;
    }
    
    t = w[a].querySelectorAll(qstr);

    for (let n of t) {
      nds.push(n);
    }

  }

  return nds;
};

w.errorHandle = null;

w.__cacheError = function (err) {
  if (w.errorList.length > 500) {
    for (let i = 0; i < 100; i++) {
      w.errorList.shift();
    }
  }
  w.errorList.push(err);
  if (w.errorHandle && typeof w.errorHandle === 'function') {
    try {
      w.errorHandle(w.errorList);
    } catch (err) {
      w.notifyError(`errorHandle:<p>${err.message}</p>`, 5000);
    }
  }
};

/**
 * 如果页面对象存在和名字对应的模板函数，则把数据传递给模板函数，否则直接进行渲染。
 * @param {string} pagename 
 * @param {any} data 
 * @param {object} options 
 */
w.view = function (pagename, data) {

  if (this.pages[pagename] === undefined) {
    return;
  }

  if (typeof data !== 'object') {
    return;
  }

  let pg = this.pages[pagename];
  let pgdom = pg.__dom__;

  let qcss = '';
  let nds = '';
  

  for (let k in data) {
    qcss = `[data-name=${k}]`;
    
    if (k[0] === '#') {
      qcss = k;
    } else if (k[0] === '@') {
      qcss = `[name=${k.substring(1)}]`;
    } else if (k[0] === '.') {
      qcss = `[class=${k.substring(1)}]`;
    } else if (k[0] === '[') {
      qcss = k;
    }

    nds = pgdom.querySelectorAll(qcss);

    if (nds.length === 0) {
      nds = w._queryGlobal(qcss);
    }

    try {
      w._setData(pagename, pg, nds, data[k]);
    } catch (err) {
      if (w.debug) {
        w.notifyError(err.message, 3500);
        console.error(err);
      } else {
        w.__cacheError(err);
      }
    }
  }

};

w._setData = function (pagename, pg, nds, data) {

  let dtemp = '';
  let dtemp_fmtval = '';
  let dataType = typeof data;

  for (let i = 0; i < nds.length; i++) {

    if (nds[i].dataset.map && typeof pg[nds[i].dataset.map] === 'function') {
      dtemp = pg[nds[i].dataset.map]({
        data: data,
        target: nds[i],
        type: 'map',
        dataType}) || '';

    } else if (nds[i].dataset.list && typeof pg[nds[i].dataset.list] === 'function') {
      if (data instanceof Array) {
        data.forEach((a, ind) => {
          dtemp += pg[nds[i].dataset.list]({
            data: a, 
            index: ind, 
            key: ind, 
            target: nds[i], 
            type: 'list', 
            dataType: (typeof a)}) || '';
        });
      } else if (data && typeof data === 'object') {
        for (let k in data) {
          dtemp += pg[nds[i].dataset.list]({
            data: data[k], key: k, target: nds[i], type: 'list', dataType: (typeof data[k])
          }) || '';
        }
      } else {
        dtemp = pg[nds[i].dataset.list]({data: data, target: nds[i], type: 'list', dataType}) || '';
      }
    } else {
      if (typeof data === 'object') {
        dtemp = JSON.stringify(data);
      } else {
        dtemp = data;
      }
    }

    if (nds[i].tagName === 'IMG') {
      nds[i].src = dtemp;
      continue;
    }

    if (pagename)
      dtemp_fmtval = w.fmtHTML(pagename, dtemp);
    else dtemp_fmtval = dtemp;

    if (nds[i].dataset.insert === undefined) {
      nds[i].dataset.insert = 'replace';
    }

    if (nds[i].tagName === 'SELECT') {

      if (!((/<option .*option>/i).test(dtemp_fmtval)) ) {

        for (let o of nds[i].options) {
          if (o.value == dtemp) {
            o.selected = true;
            break;
          }
        }

        continue;
      }
    } else if (nds[i].tagName === 'INPUT') {
      if (['checkbox', 'radio'].indexOf(nds[i].type) >= 0) {
          if (typeof dtemp === 'boolean') {
            nds[i].checked = dtemp;
            continue;
          }
      }
    }

    if (nds[i].value !== undefined && nds[i].tagName !== 'SELECT') {
      switch (nds[i].dataset.insert) {
        case 'before':
          nds[i].value = `${dtemp}${nds[i].value}`;
          break;
        case 'end':
          nds[i].value = `${nds[i].value}${dtemp}`;
          break;
        default:
          nds[i].value = dtemp;
      }
    } else {
      //开启后，则检测html文本是否存在语法错误。
      if (w.checkhtml) {
        if (!w._htmlcheck(dtemp_fmtval)) {
          return false;
        }
      }

      switch (nds[i].dataset.insert) {
        case 'before':
          nds[i].insertAdjacentHTML('afterbegin', dtemp_fmtval);
          break;
        case 'end':
          nds[i].insertAdjacentHTML('beforeend', dtemp_fmtval);
          break;
        default:
          nds[i].innerHTML = dtemp_fmtval;
      }
      if (pagename)
        w.initPageDomEvents(pg, nds[i]);
      else if (pagename === 0) {
        //如果在组件里，使用view，则需要执行initPageDomEvents，目前使用pagename为0表示组件内调用。
        w.initPageDomEvents(pg, nds[i]);
      }
    }

    dtemp = '';
    dtemp_fmtval = '';
  }

};

w.data = {};

w.bind = new Proxy(w.data, {
  set: (obj, k, data) => {
    obj[k] = data;

    let qstr = `[data-bind=${k}]`;
    let nds = w._queryGlobal(qstr);

    for (let n of nds) {
      n.innerHTML = data;
    }

    return true;
  },

  deleteProperty : (obj, k) => {
    delete obj[k];

    let qstr = `[data-bind=${k}]`;
    let nds = w._queryGlobal(qstr);
    
    for (let d of nds) {
      d.innerHTML = '';
    }
    return true;
  }
});

w._make_page_bind = function (pagename) {
  let pxy = new Proxy(w.pages[pagename].data, {
    set: (obj, k, data) => {
      obj[k] = data;

      let qstr = `[data-bind=${k}]`;
      let nds = w.pages[pagename].queryAll(qstr);

      if (nds.length === 0) {
        nds = w._queryGlobal(qstr);
      }

      try {
        w._setData(pagename, w.pages[pagename], nds, data);
      } catch (err) {
        if (w.debug) {
          w.notifyError(err.message, 3500);
          console.error(err);
        } else {
          w.__cacheError(err);
        }
      }

      return true;
    },

    deleteProperty : (obj, k) => {
      delete obj[k];

      let qstr = `[data-bind=${k}]`;
      let nds = w.pages[pagename].queryAll(qstr);

      if (nds.length === 0) {
        nds = w._queryGlobal(qstr);
      }
      
      for (let d of nds) {
        d.innerHTML = '';
      }

      return true;
    }
  });
  
  Object.defineProperty(w.pages[pagename], 'bind', {
    value: pxy,
    writable: false
  });
};

w._page_style_bind = function (pname) {
  w.pages[pname].__style__ = {};

  let pxy = new Proxy(w.pages[pname].__style__, {
    set: (obj, k, data) => {
      obj[k] = data;

      let styleData = {}
      
      styleData[`:${k}`] = {
        style: data
      };

      w.setAttr(pname, styleData);

      return true;
    },

    get: (obj, k) => {
      if (obj[k]) return obj[k];
      return null;
    },

    deleteProperty: (obj, k) => {
      delete obj[k];
    }
  });

  Object.defineProperty(w.pages[pname], 'style', {
    value: pxy,
    writable: false
  });
};

w.parseform = function (fd) {
  var m = {
    node : fd,
    childs : {},
    buttons : {},
    submit : null,
    files : {},
    values : {}
  };

  var inds = fd.querySelectorAll('input');
  var secnds = fd.querySelectorAll('select');
  var textnds = fd.querySelectorAll('textarea');

  for (let i=0; i<inds.length; i++) {
    if (inds[i].name === undefined || inds[i].name === '') {
      continue;
    }

    m.childs[inds[i].name] = inds[i];
    switch (inds[i].type) {
      case 'text':
      case 'number':
      case 'email':
        m.values[inds[i].name] = inds[i].value.trim(); break;
      case 'button':
        m.buttons[inds[i].name] = inds[i]; break;
      case 'submit':
        m.submit = inds[i]; break;
      case 'file':
        if (inds[i].files.length > 0) {
          m.files[inds[i].name] = inds[i].files;
        }break;

      case 'checkbox':
        if (inds[i].checked) {
          if (m.values[inds[i].name]) {
            m.values[inds[i].name].push(inds[i].value);
          } else {
            m.values[inds[i].name] = [ inds[i].value ];
          }
        } break;
      case 'radio':
        if (inds[i].checked) {
          m.values[inds[i].name] = inds[i].value;
        } break;
      default:
        m.values[inds[i].name] = inds[i].value;
    }
  }

  for (let i=0; i < secnds.length; i++) {
    if (secnds[i].name === undefined || secnds[i].name === '') {
      continue;
    }
    if (secnds[i].options.length <= 0) {
      continue;
    }

    m.childs[secnds[i].name] = secnds[i];
    m.values[ secnds[i].name ] = secnds[i].options[secnds[i].selectedIndex].value;
  }

  for (let i = 0; i < textnds.length; i++) {
    if (textnds[i].name === undefined || textnds[i].name === '') {
      continue;
    }

    m.childs[textnds[i].name] = textnds[i];
    m.values[ textnds[i].name ] = textnds[i].value;
  }

  return m;
};

//需要钩子机制来全局处理一些操作然后再调用真正的页面。
//钩子是一个对象，其中要包括hook函数（async function），执行此函数时会
//把请求上下文传递过去,如果函数返回false或null则表示禁止执行下一步，
//抛出错误也禁止执行下一步。
w.hooks = [];
w.hookFunc = {};

w.hashchange = null;

w.runHooks = async function (ctx) {
  try {
    for (let h of w.hooks) {
      if (!w.hookFunc[h] || typeof w.hookFunc[h] !== 'function') continue;
      if (false === await w.hookFunc[h](ctx)) {
        return false;
      }
    }
  } catch (err) {
    w.notify(err.message, {ntype:'error'});
    return false;
  }
  return true;
};

w.events = {
  scroll : function () {
    if (w.curpage) {
      w.curpage.scroll = w.curpage.__dom__.scrollTop;
      let h = w.curpage.__dom__.clientHeight + w.curpage.scroll;
      
      if (typeof w.curpage.onscroll === 'function') {
        try {
          w.curpage.onscroll(w.curpage.__dom__.scrollTop,
            w.curpage.__dom__.clientHeight,
            w.curpage.__dom__.scrollHeight);
        } catch (err){}
      }

      var isBottom = false;
      if (w.isFirefox) {
        isBottom = (Math.abs(h - w.curpage.__dom__.scrollHeight) <= 1.21);
      } else {
        isBottom = (Math.abs(h - w.curpage.__dom__.scrollHeight) < 1.56);
      }

      if (w.curpage.scroll <= 0.0000001) {
        if (typeof w.curpage.ontop === 'function') {
          if (!w.curpage.onTopLock) {
            w.curpage.onTopLock = true;
            try {
              w.curpage.ontop();
            } catch (err){}
            w.curpage.onTopLock = false;
          }
        }
      } else if (isBottom) {
        if (typeof w.curpage.onbottom === 'function') {
          try {
            let tm = Date.now();
            if (tm - w.curpage.bottomTime > 900) {
              w.curpage.bottomTime = tm;
              setTimeout(() => {
                let t = w.curpage.__dom__.clientHeight + w.curpage.__dom__.scrollTop;
                if (w.curpage.__dom__.scrollHeight - t < 1.56) {
                  w.curpage.onbottom(w.curpage.__dom__.scrollHeight);
                }
              }, 350);
            }
          } catch (err) {console.log(err);}
        } else {}
      }
    } else { }
    
  },
  resize : function () {
    if (w.curpage && typeof w.curpage.onresize === 'function') {
      try {
        w.curpage.onresize(w.curpage.__dom__);
      } catch (err) {
        w.notifyError(err.message);
      }
    }
  },
};

//如果设置为函数，会首先进行初始化，但是会在初始化页面以后
w.init = null;

w.tabs = {
  cur : null,
  background : '#fafaff',
  selectedBackground : '#f1f2f3',
  list : [],
  pages : [],
  pageIndex : {}
};

w.switchTab = function (p) {
  if (w.tabs.cur === p || w.tabs.pages.indexOf(p) < 0) {
    return;
  }

  this.listenHashLock = true;
  location.hash = '';
  this.listenHashLock = false;

  let nds = w.tabsmenudom.childNodes;
  let pind = 0;
  for (let i = 0; i < nds.length; i++) {
    pind = nds[i].id.indexOf(p);
    if (pind > 0 && nds[i].id.substring(pind) === p) {
      nds[i].style.background = w.tabs.selectedBackground;
      if (w.tabs.list[i].selectedIcon && w.tabs.list[i].selectedIcon.length > 0) {
        let imgdom = nds[i].querySelector('img')
        if (imgdom) {
          imgdom.src = imgdom.dataset.url + w.tabs.list[i].selectedIcon;
        }
      }
    } else {
      nds[i].style.background = w.tabs.background;
      if (w.tabs.list[i].icon && w.tabs.list[i].icon.length > 0) {
        let imgdom = nds[i].querySelector('img')
        if (imgdom) {
          imgdom.src = imgdom.dataset.url + w.tabs.list[i].icon;
        }
      }
    }
  }

  w.tabs.cur = p;
  w.loadPage(w.parseHashUrl(p));
};

w.navi = function (htext, opts = {}) {
  let classtext = `w-navigate-btn`;
  if (opts.position) {
    if (['left','right', 'bottom'].indexOf(opts.position) < 0 ) {
      opts.position = 'left';
    }
  } else {
    opts.position = 'left';
  }
  
  classtext += ` w-navigate-btn-${opts.position}`;
  if (opts.background === undefined) {
    opts.background = true;
  }

  if (opts.background === true || opts.background === 'default') {
    classtext += ` w-navigate-btn-bk`;
  } else if (opts.background === 'rgba') {
    classtext += ` w-navigate-btn-bkrgba`;
  } else if (opts.background === 'lucency') {
    classtext += ` w-navigate-btn-bklucency`;
  }

  if (opts.up && opts.position !== 'bottom') {
    classtext += ' w-navigate-btn-up';
  }

  setTimeout(() => {
    w.navibtndom.className = classtext;
    w.navibtndom.innerHTML = w.fmtHTML(w.curpagename, htext);
    w.initPageDomEvents(opts.context || w.curpage, w.navibtndom);
  }, 5);
  
};

w.naviGlass = function (htext, lr='left', up = false) {
  w.navi(htext, {position: lr, background: 'glass', up: up});
};

w.naviHide = function () {
  w.navibtndom.innerHTML = '';
  w.navibtndom.className = '';
};

w._devents = [
  'click', 'blur', 'submit', 'input', 'dblclick', 'copy', 
  'fullscreenchange','fullscreenerror',
  'focus', 'focusin', 'focusout', 'keyup', 'keydown', 'scroll', 'change',
  'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
  'touchcancel', 'touchend', 'touchmove', 'touchstart', 'select', 'wheel', 
  'paste', 'cut', 'contextmenu', 
  'drag', 'dragend', 'dragleave', 'dragstart', 'dragover', 'dragenter', 'drop'
];

w.initDomEvent = function (pg, dom, evtname) {
  if (!dom || !dom.querySelectorAll) return false;
  
  let nds = dom.querySelectorAll('form');

  for (let d of nds) {
    if (!d.onsubmit) {
      d.onsubmit = () => {
        return false;
      };
    }
  }

  nds = dom.querySelectorAll(`[data-on${evtname}]`);

  for (let d of nds) {
    d.addEventListener(evtname, 
      w.genEventProxy(pg, d.dataset[`on${evtname}`])
    );
  }

};

w.initPageDomEvents = function (pg, dom) {
  for (let e of w._devents) {
    w.initDomEvent(pg, dom, e);
  }
};

w.eventProxy = function (evt, pg, funcname) {

  let wind = funcname.trim().indexOf('w.ext.');
  let wfunc = null;

  if (wind === 0) {
    wfunc = w.ext[funcname.substring(8)];
    if (typeof wfunc !== 'function') {
      if (evt.target && evt.target.dataset.noterror) return false;
      w.notifyError(`${funcname} is not a function.`);
      return false;
    }
  }
  else if (!pg || !pg[funcname] || !(typeof pg[funcname] === 'function')) {
    if (evt.target && evt.target.dataset.noterror) return false;
    w.notifyError(`${funcname} is not a function.`);
    return false;
  }

  let a = {
    target: evt.target,
    currentTarget: evt.currentTarget,
    event: evt,
    type: evt.type,
    value: '',
  }

  let tag = evt.target.tagName.toLowerCase();

  a.tag = tag;

  if (tag === 'form') {
    a.form = w.parseform(evt.target);
    a.value = a.form.values;
  } else if (tag === 'input' || tag === 'textarea') {
    a.value = a.target.value || '';

    switch (a.target.type) {
      case 'file':
        a.files = a.target.files;
        break;
      case 'checkbox':
        a.checked = a.target.checked;
        break;
      default:
        ;
    }
  } else if (tag === 'select') {
    a.value = a.target.options[ a.target.selectedIndex ].value;
  }

  a.data = a.value;

  try {
    if (wind === 0) {
      return wfunc(a);
    }

    return pg[funcname](a);
  } catch (err) {
    w.notify(err.message, 'error');
  }
};

w.genEventProxy = function (pg, funcname) {
  return (evt) => {
    return w.eventProxy(evt, pg, funcname);
  };
};

w._http_preg = new RegExp('^http[s]?:/'+'/', 'i');

Object.defineProperty(w, '__mod__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: Object.create(null)
});

window._import = w.import = async function (path, reload=false) {
  if (w.__mod__[path] && !reload) {
    return w.__mod__[path];
  }

  try {
    let mod;
    if (w._http_preg.test(path)) {
      mod = await import(path).then(mod => {
        return mod;
      });
    }

    if (path[0] !== '/') path = `/${path}`;
    
    let randnm = parseInt(Math.random() * 10000);

    mod = await import(`${w.prepath}${path}?rand=${randnm}`)
                .then(m => {
                  return m;
                });

    w.__mod__[path] = mod;

    return mod;
  } catch (err) {
    w.notifyError(`import module:<p>${err.message}</p>`, 5000);
  }
};

Object.defineProperty(w, '__ext__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: Object.create(null)
});

w.ext = new Proxy(w.__ext__, {
  set: (obj, k, data) => {
    if (!obj[k]) {
      obj[k] = data;
      return true;
    }
    else {
      console.error(`${k}: 扩展名重复，请检查。`);
    }
    
  },

  get: (obj, k) => {
    if (obj[k]) return obj[k];
    console.error(`${k}: 没有此扩展。`);
  },

  deleteProperty : (obj, k) => {
    if (obj[k])
      delete obj[k];

    return true;
  }
});

Object.defineProperty(w, '__require_loop__', {
  value: 5,
  configurable: false,
  writable: false,
  enumerable: false
});

window.require = async function (name) {
  try {
    if (w.__ext__[name]) return w.__ext__[name];
    
    let loop = w.__require_loop__;

    for (let i = 0; i < loop; i++) {
      await new Promise((rv) => {
        setTimeout(() => { rv(); }, 2);
      });

      if (w.__ext__[name]) return w.__ext__[name];
    }

    throw new Error(`${name}: 没有此扩展。`);
  } catch (err) {
    console.error(err.message);
    console.error('请检查扩展是否启用或是否存在循环引用。');
  }
};

Object.defineProperties(w, {
  'shareData': {
    writable: false,
    value: {}
  },
  'shareNoticeList': {
    writable: false,
    value: {
      length: 0,
      funcmap: {}
    }
  }
});

/**
 * mode默认为一直执行，或者是选择once表示执行一次则删除。
 * @param {object} options callback, type, mode
 */
w.registerShareNotice = function (options) {

  if (w.shareNoticeList.length >= 500) {
    w.notifyError('注册通知函数已达上限，不能超过500。');
    return false;
  }

  if (!options.type) options.type = 'set';
  if (!options.mode) options.mode = 'always';
  if (!options.key) {
    w.notifyError('注册通知函数必须明确指定key，若要全部监听，则使用*作为key值。');
    return false;
  }

  options.count = 0;

  if (!options.callback || typeof options.callback !== 'function') {
    w.notifyError('没有callback函数用于通知回调。');
    return false;
  }

  options.id = `${options.key}.${Math.random().toString(16).substring(2)}${Date.now()}`;

  if (!w.shareNoticeList.funcmap[ options.key ]) {
    w.shareNoticeList.funcmap[ options.key ] = [ options ];
  } else {
    if (options.only) return false;
    let kn = w.shareNoticeList.funcmap[ options.key ];
    if (kn.length >= 10) {
      w.notifyError('同一个key注册通知函数不能超过10个。');
      return false;
    }
    kn.push(options);
  }

  w.shareNoticeList.length += 1;

  return options.id;
};

w.removeShareNotice = function (id) {
  let dotind = id.indexOf('.');

  let km;
  if (dotind < 0) km = id;
  else km = id.substring(0, dotind);

  if (!km || !w.shareNoticeList.funcmap[km]) return false;

  if (km === id) {
    w.shareNoticeList.funcmap[km] = null;
    return true;
  }

  let kmap = w.shareNoticeList.funcmap[km];
  let ind = 0;

  for (let a of kmap) {
    if (a.id === id) {
      kmap.splice(ind, 1);
      w.shareNoticeList.length -= 1;
      return a;
    }
    ind += 1;
  }
};

w.runShareNotice = function (type, obj, k, data = null) {
  let kmlist = w.shareNoticeList.funcmap[k];
  let gkmlist = w.shareNoticeList.funcmap['*'];

  if (!kmlist && !gkmlist) return;

  if (!kmlist) kmlist = [];
  if (!gkmlist) gkmlist = [];

  let rlist = kmlist.concat(gkmlist);

  let delids = [];

  for (let a of rlist) {
    if (a.type !== 'all' && a.type !== type) continue;
    if (a.mode === 'once' && a.count > 0) {
      delids.push(a.id);
      continue;
    }

    a.count < 10000000 && (a.count += 1);
    try {
      a.callback({
        type,
        obj,
        key: k,
        data: data
      });
    } catch (err) {
      w.notifyError(err.message);
    }
  }

  if (delids.length > 0) {
    for (let id of delids) {
      w.removeShareNotice(id);
    }
  }

};

Object.defineProperty(w, 'share', {
  writable: false,
  value: new Proxy(w.shareData, {
    set: (obj, k, data) => {
      obj[k] = data;
      w.runShareNotice('set', obj, k, data);
      return true;
    },
  
    get: (obj, k) => {
      w.runShareNotice('get', obj, k);
      return obj[k] || null;
    },
  
    deleteProperty : (obj, k) => {
      w.runShareNotice('delete', obj, k);
      delete obj[k];
      return true;
    }
  })
});

w.loadScript = async function (src, cname = '') {

  if (!w._http_preg.test(src)) {
    if (cname && src.indexOf('./static') === 0) {
      src = src.replace('./static', '/component/' + cname);
    }

    if (src[0] !== '/') src = `/${src}`;

    src = `${w.prepath}${w.prepath.length > 0 ? '/' : ''}${src}`;
  }

  let d = document.createElement('script');

  return new Promise((rv, rj) => {
    d.type = 'text/javascript';
    d.src = src;
    document.body.appendChild(d);

    d.onerror = err => {
      rj(err);
    };

    d.onload = () => {
      rv({ok: true, msg: 'success'});
    };

  });

};

w.__comps_loop__ = {};

class Component extends HTMLElement {
  constructor () {
    super();

    this.shadow = this.attachShadow({mode: 'closed'});

    Object.defineProperty(this, 'attrs', {
      value: Object.create(null),
      configurable: false,
      writable: false,
      enumerable: true
    });

    if (!this.properties || typeof this.properties !== 'object') this.properties = {}; 
    
    for (let a of this.attributes) {
      if (this.properties[a.name]) {
        this.attrs[a.name] = this._propValue(this.properties[a.name], a.value);
        continue;
      }
      this.attrs[a.name] = a.value;
    }

    if (this.init && typeof this.init === 'function') {
      this.init();
    }

    if (this.render && typeof this.render === 'function') {

      let d = this.render() || '';
      if (typeof d === 'object') {
        this.shadow.appendChild(d);

      } else if (typeof d === 'string' && d.length > 0) {
        let st = this.checkLoopRef(d);
        if ( st.ok === false ) {
          return this.notifyLoopRefError(st);
        }

        w._htmlcheck(d) && (this.shadow.innerHTML = d);
      }
    }

    w.initPageDomEvents(this, this.shadow);

    if (this.afterRender && typeof this.afterRender === 'function') {
      this.afterRender();
    }
  }

  _propValue (obj, val) {
    if (!obj || typeof obj !== 'object') return val;

    if (!obj.type) return val;

    switch (obj.type) {
      case 'number':
      case 'int':
        val = parseInt(val);
        break;
      case 'float':
        val = parseFloat(val);
        break;

      case 'json':
        try {
          val = JSON.parse(val);
        } catch (err) {
          val = {};
        }
        break;
    }

    if (typeof val !== 'object' && obj.limit !== undefined && Array.isArray(obj.limit)) {
      if (obj.limit.indexOf(val) < 0)
        return (obj.default !== undefined ? obj.default : obj.limit[0]);
    } else if (typeof val === 'number') {
      let valState = 0;
      if (obj.min !== undefined && val < obj.min) valState = -1;
      if (obj.max !== undefined && val > obj.max) valState = 1;

      if (valState !== 0)
        return (obj.default !== undefined ? obj.default : (valState < 0 ? obj.min : obj.max));
    }

    return val;
  }

  checkLoopRef (d) {
    let lname = `<${this.tagName.toLowerCase()}`;
    
    let tagname = lname + '>';

    let istart = this.outerHTML.indexOf(lname);
    let iend = this.outerHTML.indexOf('>') + 1;
    let outername = this.outerHTML.substring(istart, iend);

    let st = {ok: true, outername, tagname};

    if (typeof d === 'string') {
      if (d.indexOf(outername) >= 0) {
        st.ok = false;
        return st;
      }
    }
    else if (d.innerHTML.indexOf(outername) >= 0) {
      st.ok = false;
      return st;
    }

    let p = this.parentNode;

    let localname = lname.substring(1);
    if (!w.__comps_loop__[localname])
      w.__comps_loop__[localname] = [];
    
    while (p) {
      if (p.toString() !== '[object ShadowRoot]') {
        return st;
      }

      w.__comps_loop__[localname].push(p.host.localName);

      p = p.parentNode;
    }

    let ref_count = 1;

    let loopcheck = (arr, name) => {
      for (let a of arr) {
        if (a === name) ref_count++;
        if (ref_count > 2) return false;

        if (w.__comps_loop__[a].length > 0) {
          loopcheck(w.__comps_loop__[a], name);
        }
      }

      return true;
    };

    let lr = loopcheck(w.__comps_loop__[localname], localname);

    if (!lr) st.ok = false;

    return st;
  }

  notifyLoopRefError (st) {
    let outerText = st.outername.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    w.notifyError(`${this.tagName} [${outerText}]存在循环引用${st.ref ? ' &lt;--&gt; ' : ''}${st.ref || ''}`, 20000);
    return '';
  }

  /**
   * @param {string} id 
   * @param {object} data 
   */
  plate (id = null, data = {}) {
    if (typeof id === 'object' || !id) {
      data = id || {};
      id = this.tagName.toLowerCase();
    }
    
    if (id[0] === '#') id = id.substring(1);

    let nd = document.querySelector(`template[id=${id}]`);

    if (!nd) {
      nd = document.querySelector(`div[data-id=${id}]`);
      if (nd) nd = nd.querySelector('template');
    }

    if (!nd) return false;

    let st = this.checkLoopRef(nd);
    if ( st.ok === false ) {
      return this.notifyLoopRefError(st);
    }

    let d = nd.content.cloneNode(true);

    let nds;
    for (let k in data) {
      nds = d.querySelectorAll(`[data-name=${k}]`);
      w._setData(null, this, nds, data[k]);
    }

    return d;
  }

  _fmtquery (k) {
    let qcss = `[data-name=${k}]`;

    if (k[0] === '#') {
      qcss = k;
    } else if (k[0] === '@') {
      qcss = `[name=${k.substring(1)}]`;
    } else if (k[0] === '.') {
      qcss = `[class=${k.substring(1)}]`;
    } else if (k[0] === '[') {
      qcss = k;
    }
    return qcss;
  }

  view (data) {
    let qcss = '';
    let nds;
    
    for (let k in data) {
      
      qcss = this._fmtquery(k);
  
      nds = this.shadow.querySelectorAll(qcss);

      try {
        w._setData(0, this, nds, data[k]);
      } catch (err) {
        if (w.debug) {
          w.notifyError(err.message, 3500);
          console.error(err);
        } else {
          w.__cacheError(err);
        }
      }
    }
  }

  setAttr (data) {
    if (!data || typeof data !== 'object') {
      return;
    }

    let qcss, nds, attr;

    for (let k in data) {
      qcss = this._fmtquery(k);

      nds = this.shadow.querySelectorAll(qcss);
      if (nds.length === 0) continue;

      attr = data[k];
      for (let d of nds) {
        for (let a in attr) {
          switch (a) {
            case 'class':
              d.className = attr[a];
              break;

            case 'style':
              if (typeof attr[a] === 'string') {
                d.style.cssText = attr[a];
              } else if (typeof attr[a] === 'object') {
                for (let ak in attr[a]) {
                  d.style[ak] = attr[a][ak];
                }
              }
              break;

            default:
              d[a] = attr[a];
          }
        }
      }//end for nds

    }//end for data
  }

  queryAll (qss) {
    return this.shadow.querySelectorAll(qss);
  }

  query (qss) {
    return this.shadow.querySelector(qss);
  }

  connectedCallback () {
    if (this.onload && typeof this.onload === 'function') {
      this.onload();
    }
  }

  //remove from page
  disconnectedCallback () {
    if (this.onremove && typeof this.onremove === 'function') {
      this.onremove();
    }
  }

  //to new page
  adoptedCallback() {
    if (this.onadopted && typeof this.onadopted === 'function') {
      this.onadopted();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.onattrchange && typeof this.onattrchange === 'function') {
      this.onattrchange(name, oldValue, newValue);
    }
  }

  naviGlass (text, pr = 'left', up = false) {
    w.navi(text, { context: this, position: pr, background: 'glass', up });
  }

  naviHide () { w.naviHide(); }

  cover (info, options = {notClose: false, transparent: false}) {
    let notclose = !!options.notClose;

    if (!notclose) {
      info = `<div style="text-align:right;">`
            + `<span style="user-select:none;padding:0.15rem;text-decoration:none;cursor:pointer;" data-onclick=uncover>X</span>`
            + `</div>${info}`;
    }

    w.alert(info, {
      context: this,
      replace: true,
      notClose: true,
      withCover: true,
      shadow: true,
      transparent: !!options.transparent
    });
  };

  uncover () { w.unalert('shadow'); }

  loadScript (src) {
    return w.loadScript(src, this.tagName.toLowerCase());
  }
}
