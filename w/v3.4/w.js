'use strict';

class HtmlState_ {

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

    this.script_reg = new RegExp('<SCRIPT>', 'ig')
    this.script_end_reg = new RegExp('<\/SCRIPT>', 'ig')
    this.html_comment_reg = new RegExp('<!--(.|[\r\n])*?-->','mg')
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
      if (next_char === '=' && this.curState === this.STATE.TAG_ATTR) {
        return true
      }
      
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
      // a="''" or a='""'
      if (cur_char !== this.attrType) {
        if (this.curState === this.STATE.TAG_ATTR_VALUE_START) {
          //中间的属性值允许出现空格
          if (next_char === '\n') {
            return false
          }
          this.curState = this.STATE.TAG_ATTR_VALUE
          return true
        }
        
        if (next_char === '\n') {
          return false
        }
        //this.STATE.TAG_ATTR_VALUE 不用改
        return true
      }

      /* if (cur_char !== this.attrType) {
        return false
      } */
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

    //=“==”这种方式，仍然是等号，但是属于属性值部分。
    if (this.curState === this.STATE.TAG_ATTR_VALUE_START) {
      this.curState = this.STATE.TAG_ATTR_VALUE
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE) {
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
        || this.STATE.TAG_ATTR_VALUE_END === this.curState
      ) {
        this.cursor += 1
        this.curState = this.STATE.TAG_CLOSE_END
        return true
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
    
    return true
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
    this.tagCloseStack = []
    this.is_script = false
    this.data = ''
    this.cursor = 0
  }

  parse (data) {
    this.init();

    if ( !(typeof data === 'string' || (data instanceof String)) ) {
      return true;
    }

    if (data.indexOf('<!doctype html>') >= 0) {
      this.lastErrorMsg = '渲染数据不可出现&lt;!doctype html&gt;声明';
      return false;
    }

    this.data = data.replace(this.script_reg, '<script>')
                    .replace(this.script_end_reg, '<\/script>')
                    .replace(this.html_comment_reg, '');

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
        
        this.lastErrorMsg = `位置： ${this.lastCursor} ~ ${this.cursor}, 错误的语法：<p style="color:#df6878;">...`
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
      let codeHintText = this.data.substring(this.lastCursor, this.cursor+1);
      this.lastErrorMsg = '标签结束状态错误，请检查模板字符串的语法格式，以及属性的闭合引号。<br>'
          + `...${codeHintText.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}...`;
      return false
    }

    if (!this.diffStack()) {
      this.lastErrorMsg = `模板标签包含嵌套不一致：&lt;${this.tagStack.join('&gt;...&lt;')}&gt;...`
      return false
    }

    return true
  }

}

const w = new function () {
  Object.defineProperty(this, 'notifylog', {
    value: {
      bottom: {
        count: 0,
        dmap: Object.create(null)
      },
      top: {
        count: 0,
        dmap: Object.create(null)
      }
    },
    enumerable: true,
    configurable: false,
    writable: false
  });

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
  
  Object.defineProperty(this, 'randid', {
    value: (pre='') => {
      return `${pre}${Date.now().toString(16)}.${Math.random().toString(16).substring(2)}`;
    },
    writable: false
  });

  this.attachTitle = (t) => {
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

  Object.defineProperty(this, 'alertStack', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: {
      max: 10,
      zindex: 105,
      dmap: {},
      closemap: {},
      count: 0,
      coverCount:0,
      maxZIndex: 9999,
      curZIndex: 105
    }
  });

  this.alertStyles = ['left', 'right', 'bottom', 'transform', 'color', 'background', 'boxShadow', 'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'];

  //replace=false, notClose=false, withCover = false
  this.alert = function (info, options = {}) {
    if (!this.alertStack.max || typeof this.alertStack.max !== 'number' || this.alertStack.max > 49 || this.alertStack.max < 1) this.alertStack.max = 10;

    if (!options || typeof options !== 'object') options = {};

    let domname = 'alertdom';
    let coverdomname = 'alertcoverdom';
    let astack = this.alertStack;

    if (w.alertLock) return false;

    let check_stat = true;
    w.checkhtml && (check_stat = w._htmlcheck(info));

    if (!check_stat) {
      w.notifyTopError(w._htmlcheck.lastErrorMsg);
      return false;
    }

    if (Object.keys(astack.dmap).length >= astack.max) {
      if (options.onmax && typeof options.onmax === 'function') {
        try {
          options.onmax();
        } catch (err) {
          w.debug && console.error(err);
        }
        if (Object.keys(astack.dmap).length >= astack.max) return false;
      } else {
        w.debug && console.error('alert弹框超出最大限制');
        return false;
      }
    }

    if (options.context && options.context.tagName) {
      info = w.replaceSrc(info, true, options.context.tagName.toLowerCase());
    } else {
      info = w.replaceSrc(info);
    }

    let total = Object.keys(astack.dmap).length;
    let dom = document.createElement('div');
    
    dom.className = 'w-global-alert-info';
    if (options.transparent) dom.className += ' w-global-alert-trans';
    dom.style.zIndex = astack.curZIndex;

    let realTop = parseInt(10 + 0.07 * total);
    dom.style.top = `${realTop}%`;

    if (options.autoOffset && total > 1) {
      let p_num = parseInt((this.alertStack.max-1) / 2 * Math.random() + 3);
      let factor = 1.25;
      let ox = parseInt(49 + (total % p_num) * factor);
      if (total >= p_num) {
        ox = parseInt(49 + total*factor - total);
      }

      realTop = parseInt(10 + (total % p_num) * factor);
      if (total >= p_num) {
        realTop = parseInt(10 + total*factor - total);
      }
      dom.style.transform = `translateX(-${ox}%)`;
      dom.style.top = `${realTop}%`;
      dom.style.boxShadow = `2px 2px 2px #e0e0e0`;
    }

    w.alertStyles.forEach(x => {
      options[x] && (dom.style[x] = options[x]);
    });

    astack.curZIndex <= astack.maxZIndex && astack.curZIndex++;

    let aid = w.randid('a_');

    astack.dmap[aid] = dom;
    astack.count++;

    let width = 0;
    if (options.width && typeof options.width === 'number' && options.width > 1 && options.width <= 100) {
      width = options.width;
    }

    width && width > 0 && (dom.style.width = `${width}%`);

    if (!options.notClose) {
      let closedom = document.createElement('div');
      astack.closemap[aid] = closedom;
      closedom.className = 'w-global-alert-info-close';
      closedom.style.position = 'fixed';
      closedom.style.transform = 'translateX(-50%)';
      closedom.style.left = '50%';
      if (dom.style.transform) closedom.style.transform = dom.style.transform;
      if (dom.style.left) closedom.style.left = dom.style.left;

      width && width > 0 && (closedom.style.width = `${width}%`);

      closedom.style.boxShadow = dom.style.boxShadow;
      closedom.style.bottom = `${100 - realTop - 0.09}%`;
      //closedom.style.bottom = `${100 - parseInt(dom.style.top) - 0.09}%`;
      closedom.style.zIndex = dom.style.zIndex;
      closedom.style.background = options.closeBackground 
                                  || options.background
                                  || 'var(--w-alert-close-bg-color, #f5f6f7)';
      if (options.closeBorderBottom) closedom.style.borderBottom = options.closeBorderBottom;
      closedom.innerHTML = `<div style="text-align:right;padding:0.085%;">`
        +`<a data-onclick="w.cancelAlert" data-aid="${aid}" `
        +'style="color:#989595;font-size:111%;text-decoration:none;user-select:none;" click>'
        +'&nbsp;X&nbsp;</a>'
        +'</div>';

      w[domname].appendChild(closedom);
      w.initPageDomEvents(options.context || w.curpage, closedom, false);
    }

    if (typeof info === 'object' && info.innerHTML) {
      dom.innerHTML = info.innerHTML;
    } else {
      dom.innerHTML = info;
    }

    w.initPageDomEvents(options.context || w.curpage, dom);

    w[domname].appendChild(dom);

    if (options.withCover && w[coverdomname]) {
      astack.coverCount++;
      w[coverdomname].className = 'w-alert-cover-page';
    }

    return aid;
  };

  this.cancelAlert = function (ctx) {
    if (!ctx) {
      ctx = this.getLastAlert();
      if (!ctx) return false;
    }

    let aid = typeof ctx === 'string' ? ctx : (ctx.target.dataset.aid || this.getLastAlert());
    if (!aid) return false;

    let domname = 'alertdom';
    let dom = this.alertStack.dmap[aid];
    if (!dom) {
      w.debug && console.error(aid, 'not found');
      return false;
    }

    let d_zindex = dom.style.zIndex;
    if (this.alertStack.curZIndex - 1 === d_zindex) {
      this.alertStack.curZIndex--;
    }

    let closedom = this.alertStack.closemap[aid];
    if (closedom) closedom.remove();
    dom.remove();

    delete this.alertStack.dmap[aid];
    delete this.alertStack.closemap[aid];
    this.alertStack.count--;

    if (Object.keys(this.alertStack.dmap).length === 0) {
      w['alertcoverdom'].className = '';
      w['alertcoverdom'].innerHTML = '';
      this.alertStack.coverCount = 0;
      this.alertStack.curZIndex = this.alertStack.zindex;
    }

    return true;
  };

  this.alertDark = function (info, options=null) {
    if (!options || typeof options !== 'object') options = {};
    if (!options.background) options.background = '#4f4f4f';
    if (!options.closeBackground) options.closeBackground = '#4a4a4a';
    if (!options.color) options.color = '#f0f0f1';
    if (!options.boxShadow) options.boxShadow = '2px 2px 3px #828282';
    return this.alert(info, options);
  };

  this.coverDark = function (info, options=null) {
    if (!options || typeof options !== 'object') options = {};
    options.withCover = true;
    options.notClose = true;
    return this.alertDark(info, options);
  };

  this.unalert = this.cancelAlert;

  this.cover = function (info, options=null) {
    if (!options || typeof options !== 'object') options = {};
    options.withCover = true;
    options.notClose = true;

    return this.alert(info, options);
  };

  this.getLastAlert = function() {
    let idlist = Object.keys(this.alertStack.dmap);
    if (idlist.length === 0) return false;
    return idlist.pop();
  };

  this.uncover = function (aid='last') {
    if (aid === 'last' || !aid) {
      aid = this.getLastAlert();
    }

    if (!aid) return false;

    this.cancelAlert(aid);
    if (this.alertStack.coverCount > 0) {
      this.alertStack.coverCount--;
    } else {
      this.alertStack.coverCount = 0;
      w['alertcoverdom'].className = '';
      w['alertcoverdom'].innerHTML = '';
    }

    return true;
  };

  this.alertError = function (info, tmout = 0) {
    info = `<span style="color:#e73949;">${info}</span>`;
    let aid = w.alert(info);
    if (tmout > 0) {
      setTimeout(() => { w.cancelAlert(aid); }, tmout);
    }
  };

  this.notifyError = function (info, tmout = 10000) {
    if (typeof tmout === 'object') {
      tmout.ntype = 'error';
      return w.notify(info, tmout);
    }
    return w.notify(info, {timeout: tmout, ntype: 'error'});
  };

  this.notifyTop = function (info, tmout = 3500) {
    if (typeof tmout === 'object') {
      tmout.ntype = 'top';
      return w.notify(info, tmout);
    }
    return w.notify(info, {timeout:tmout, ntype: 'top'});
  };

  this.notifyTopError = function (info, tmout = 10000) {
    if (typeof tmout === 'object') {
      tmout.ntype = 'top-error';
      return w.notify(info, tmout);
    }
    return w.notify(info, {timeout: tmout, ntype: 'top-error'});
  };

  this.notifyOnly = function (info, tmout = 3500) {
    if (typeof tmout === 'object') {
      tmout.ntype = 'only';
      return w.notify(info, tmout);
    }
    return w.notify(info, {timeout: tmout, ntype: 'only'});
  };

  this.notifyStyles = [
    'boxShadow', 'margin', 'marginBottom', 'border', 'borderBottom', 'borderLeft',
    'borderRight', 'borderTop', 'background', 'color', 'fontSize', 'padding',
    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'
  ];

  this.notify = function (info, options = {}) {
    if (!options) options = {};
    if (typeof options === 'number') options = {timeout: options};

    let tmout = (options.timeout && !isNaN(options.timeout) && options.timeout > 0)
                ? options.timeout : 3500;

    let check_stat = true;
    w.checkhtml && (check_stat = w._htmlcheck(info));
    if (!check_stat) return false;

    let ntype = options.ntype || 'notify';

    let posi = 'bottom';
    let domname = 'notifydom';
    let where_is = 'w-notify-bottom';
    if (ntype.indexOf('top') >= 0) {
      domname = 'notifytopdom';
      where_is = 'w-notify-top';
      posi = 'top';
    }

    let nstack = this.notifylog[posi];

    info = w.replaceSrc(info);
    
    if (ntype.indexOf('error') >= 0) {
      info = `<span style="color:#f96567;font-size:95%;">${info}</span>`;
    }

    let colorText = '#e5e5e9';

    if (ntype.indexOf('light') >= 0) {
      where_is += ' w-notify-light';
      colorText = '#4a4a4a';
    }

    if (ntype.indexOf('only') >= 0) {
      for (let k in nstack.dmap) {w.cancelNotify(k);}
    }

    if (nstack.count > 111) {
      w.debug && console.error('超出消息通知最大限制：111。');
      return false;
    }

    let ndom = document.createElement('div');
    let nid = w.randid(posi[0]+'_');
    
    ndom.style.boxSizing = 'border-box';
    ndom.style.lineHeight = '1.5';
    this.notifyStyles.forEach(x => {
      if ((x === 'borderBottom' || x === 'marginBottom') && nstack.count <= 0)return;
      options[x] && (ndom.style[x] = options[x]);
    });

    if (nstack.count > 0) {
      if (!options.marginBottom) ndom.style.marginBottom = '1.5rem';
    }

    if (ntype.indexOf('noclose') < 0) {
      ndom.style.display = 'flex';
      ndom.style.flexFlow = 'row wrap';
      ndom.innerHTML = `<div style="width:95%;">${info}</div>
        <div data-onclick="w.cancelNotify" data-nid="${nid}" style="display: grid;place-items: center;color:#df4567;cursor:pointer;user-select:none;">X</div>`
    } else {
      ndom.innerHTML = info;
    }

    nstack.dmap[nid] = {
      nid: nid,
      dom: ndom,
      position: posi,
      timer: setTimeout(() => {
        w.cancelNotify(nid, false);
      }, tmout)
    };

    nstack.count++;

    let real_dom = w[domname];
    real_dom.insertBefore(ndom, real_dom.firstChild|| null);
    real_dom.className = `w-global-notify-box ${where_is} w-global-notify-info`;
    
    w.initPageDomEvents(options.context || w.curpage, ndom);
    return nid;
  };

  this.cancelNotify = function (ctx, clearTimer=true) {
    if (!ctx) return false;

    let nid = typeof ctx === 'string' ? ctx : ctx.target.dataset.nid;
    if (!nid) return false;

    let nstack, realdom;
    
    if (nid[0] === 'b') {
      nstack = w.notifylog.bottom;
      realdom = w.notifydom;
    } else {
      nstack = w.notifylog.top;
      realdom = w.notifytopdom;
    }

    let nt = nstack.dmap[nid];
    if (!nt) return false;

    nstack.count--;
    nt.dom.remove();
    delete nstack.dmap[nid];
    if (nstack.count <= 0) {
      realdom.className = '';
      realdom.innerHTML = '';
      nstack.count = 0;
    }

    clearTimer && nt.timer && clearTimeout(nt.timer);

    return true;
  };

  this.unnotify = function () {
    w.notifylog.bottom.dmap = {};
    w.notifylog.top.dmap = {};
    w.notifylog.bottom.count = 0;
    w.notifylog.top.count = 0;

    w.notifydom.className = '';
    w.notifydom.innerHTML = '';
    w.notifytopdom.className = '';
    w.notifytopdom.innerHTML = '';
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

  this.promptTopDark = function (info, options = {}) {
    options.wh = 'top';
    options.glass = 'dark';
    this.prompt(info, options);
  };

  //wh = 'bottom', noclose = false, glass = false
  this.prompt = function (info, options = {}) {
    if (!options || typeof options !== 'object') options = {};
    let wh = options.wh || 'bottom';
    let noclose = options.noclose || false;
    let glass = options.glass || false;

    if (!w._htmlcheck(info)) return false;

    let domname = 'promptdom';
    let closedom = 'promptclosedom';
    if (wh !== 'bottom') {
      domname = 'promptmiddledom';
      closedom = 'promptmiddleclosedom';
    }

    if (!w[domname]) return false;

      w[domname].className = `w-prompt-box w-prompt-${wh} w-prompt-display`;
      let pcolor = '#424242';

      if (glass === true || glass === 'glass') {
        w[domname].className += ' w-prompt-glass';
      } else if (glass === 'dark') {
        w[domname].className += ' w-prompt-dark';
        pcolor = '#efefef';
      }

      if (options.color) pcolor = options.color;

      if (noclose) {
        w[domname].innerHTML = `<p style="color:${pcolor};">${info}</p>`;
      } else {
        w[closedom].className = 'w-prompt-close';
        if (glass === true || glass === 'glass')
          w[closedom].className += ' w-prompt-close-glass';

        if (wh !== 'bottom') {
          w[closedom].style.zIndex = 102;
          w[closedom].onclick = evt => {
            w.unprompt(false);
          };
        } else {
          w[closedom].onclick = evt => {
            w.unprompt();
          };
        }

        w[domname].innerHTML = `<div style="overflow:auto;word-wrap:break-word;">`
          + `<p style="color:${pcolor};">${info}</p></div>`;
      }

      if (options.target && options.target.tagName) {
        info = w.replaceSrc(info, true, options.target.tagName.toLowerCase());
      } else {
        info = w.replaceSrc(info);
      }

      w.initPageDomEvents(options.target || w.curpage, w[domname], false);

    if (options.unpromptHandle && typeof options.unpromptHandle === 'function') {
      w.unprompt.__unprompt_handle__ = options.unpromptHandle;
    }

    return w[domname];
  };

  this.promptBlock = function (info, options = {}) {
    if (!w._htmlcheck(info)) return false;
    if (w.promptdom) {
      w.promptdom.className = 'w-prompt-box w-prompt-block';
      w.promptdom.innerHTML = `<div style="color:#4a4a4f;padding:0.8rem;margin-top:5%;">`
          + `${info}`
          + `</div>`;
    }
    w.initPageDomEvents(options.target || w.curpage, w.promptdom, false);
    return w.promptdom;
  };

  //有些时候prompt需要一个监听操作，当某些数据改变，取消弹框的时候需要询问用户是否继续。
  this.unprompt = async function (isbottom=true) {
    if (w.unprompt.__unprompt_handle__) {
      try {
        if (!(await w.unprompt.__unprompt_handle__())) return false;
      } catch (err){
        w.debug && console.error(err);
      }
      w.unprompt.__unprompt_handle__ = null;
    }

    let domname = isbottom ? 'promptdom' : 'promptmiddledom';
    let closedom = isbottom ? 'promptclosedom' : 'promptmiddleclosedom';

    if (w[domname]) {
      w[domname].className = '';
      w[domname].innerHTML = '';
    }

    if (w[closedom]) {
      w[closedom].className = '';
      w[closedom].innerHTML = '';
      w[closedom].style.zIndex = 0;
    }

  };

  this.unpromptMiddle = function () {
    return this.unprompt(false);
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

    if (qs) {
      let qsp = qs.split('&');
      let tmp = [];
      for (let i=0; i<qsp.length; i++) {
        tmp = qsp[i].split('=');
        if (tmp.length < 1) {
          tmp.push('');
        }
        url.query[tmp[0]] = tmp[1];
      }
    }
    
    return url;
  };

  this.firstListenHash = true;
  this.listenHashLock = false;
  this.historyList = ['#'];
  this.historyLength = history.length;
  this.pageShowType = '';
  this.pageShowTypeLock = false;
  
  this.listenHash = async function (op = '') {
    if (this.listenHashLock === true) {
      return false;
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
    
      await this.loadPage(r);
      this.listenHashLock = false;
    } catch (err) {
      this.listenHashLock = false;
    }finally{this.listenHashLock = false;}

    return true;
  };

  this.pageNameList=[];
  Object.defineProperty(this, 'pages', {
    value: Object.create(null),
    enumerable: true,
    configurable: false,
    writable: false
  });

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

  this.initOnePage = function (name, obj=null) {
    let pg = this.pages[name];
    if (!pg) {
      pg = this.pages[name] = obj || {};
    }

    if (pg.__state__) return false;

    pg.__dom__ = this.pgcdom.insertBefore(document.createElement('div'),
                                          this.pgcdom.firstChild);
    pg.initCount = 0;
    pg.loaded = false;
    pg.scroll = 0;
    pg.bottomTime = 0;
    pg.pageKey = name;
    Object.defineProperty(pg, '__name__', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: name
    });
    pg.name = name;
    pg.init = false;
    pg.__dom__.onscroll = w.events.scroll;
    pg.__state__ = true;
    pg.tabsPlace = '';

    if (w.tabs.list.length > 0) {
        pg.tabsPlace = '<div style="height:3.8rem;">&nbsp;</div>';

        if (w.tabs.pages.indexOf(name) >= 0) {
          pg.__dom__.style.cssText = 'z-index:1;';
        }
    }

    pg.view = function (data, obj=null) {
      if (typeof data === 'string') {
        let rd = {};
        rd[data] = obj;
        w.view(name, rd);
      } else {
        w.view(name, data);
      }
      return this;
    };
    
    pg.resetView = function (data) {return w.resetView(name, data);};
    pg.setScroll = function(scr) {
        if (scr < 0) { w.pages[name].__dom__.scrollTop += scr; }
        else { w.pages[name].__dom__.scrollTop = scr; }
    };
    pg.destroy = function () {w.destroyPage(w.pages[name]);};
    pg.query = function(qstr,callback=null) {
      let nod = w.pages[name].__dom__.querySelector(qstr);
      if (!nod) return null;
      if (callback && typeof callback === 'function') callback(nod);
      return nod;
    };
    pg.queryAll = function(qstr, callback=null) {
      let nds = w.pages[name].__dom__.querySelectorAll(qstr);
      if (callback && typeof callback === 'function') nds.forEach(callback);
      return nds;
    };
    pg.bindEvent = function (dom, bindSelf=true) {
      w.initPageDomEvents(pg, dom, bindSelf);
    };
    pg.setAttr = function (data) {w.setAttr(name, data);};
    pg.setStyle = function(data) {
      let obj;
      for(let k in data) {
        obj = {};
        obj[k] = {style: data[k]};
        w.setAttr(name, obj);
      }
    };

    pg.alert = function (info, options=null) {
      if (!options || typeof options !== 'object') options = {};
      options.context = this;
      return w.alert(info, options);
    };
  
    pg.alertDark = function (info, options={}) {
      if (!options || typeof options !== 'object') options = {};
      options.context = this;
      return w.alertDark(info, options);
    };
  
    pg.cover = function (info, options=null) {
      if (!options || typeof options !== 'object') options = {};
      options.notClose = true;
      options.withCover = true;
      return this.alert(info, options);
    };
  
    pg.coverDark = function (info, options=null) {
      if (!options || typeof options !== 'object') options = {};
      options.notClose = true;
      options.withCover = true;
      return this.alertDark(info, options);
    };
  }

  this.initPage = function () {
    for (let k in this.pages) {
      this.initOnePage(k);
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

//因为JS的主线程以事件循环的方式运转，目前的浏览器模式不必考虑多线程竞争问题。
w._htmlparse = new HtmlState_();
w._htmlcheck = function (data) {
  if (!w._htmlparse.parse(data)) {
    w.notify(w._htmlparse.lastErrorMsg, {tmout: 10000, ntype: 'top-error'});
    return false;
  }
  return true;
};

w.setCoverText = (text = '', style = '') => {
  w.alertcoverdom.innerHTML = text;
  w.alertcoverdom.style.cssText = style;
};

w.sliderPageLeft = function (html=null, append=true, obj=null) {
  return w.sliderPage(html, append, obj, 'left');
};

w.sliderPage = function(html=null, append=true, obj=null, pos='right') {
  if (w.slidedom) {
    let cname = 'w-common-slide-public';
    let close_name = 'w-common-slide-close-public';
    if (pos === 'left') {
      cname += ' w-common-slide-left';
      close_name += ' w-common-slide-left-close';
    } else {
      cname += ' w-common-slide-right';
      close_name += ' w-common-slide-right-close';
    }

    w.slidedom.className = cname;
    w.slidexdom.className = close_name;
    w.slidexdom.onclick = w.hideSlider;

    //直接显示
    if (html === null) {
      return w.slidedom;
    }

    let html_type = typeof html;

    if (html !== null) {
      if (html_type === 'string') {
        let check_stat = true;
        w.checkhtml && (check_stat = w._htmlcheck(html));
        check_stat && (w.slidedom.innerHTML = html);
      } else if (html_type === 'object') {
        if (append) {
          w.slidedom.innerHTML = '';
          w.slidedom.appendChild(html);
        } else {
          w.slidedom.innerHTML = html.innerHTML;
        }
      } else if (html_type === 'number' || html_type === 'boolean') {
        w.slidedom.innerHTML = html.toString();
      }
      
      w.initPageDomEvents(obj || w.curpage, w.slidedom, false);
    }
  }

  return w.slidedom;
};

w.lockSliderText = false;
w.hideSlider = function (clearText=true) {
  if (w.slidedom) {
    w.slidedom.className = 'w-hide-common-slide-right';
    w.slidexdom.className = 'w-hide-common-slide-right-close';
    if (!w.lockSliderText && clearText) {
      w.slidedom.innerHTML = '';
    }
    //w.lockSliderText = false;
  }
};

w.scrollTop = function (bh='smooth') {
  w.scroll({
    top: 0,
    behavior: bh
  });
};

w.scroll = function (x, y) {
  if (w.curpage && w.curpage.__dom__) {
    w.curpage.__dom__.scroll(x, y);
  }
};

w.loadPageLock = false;

w.handleNotFound = function () {
  if (!w.config.notFound || typeof w.config.notFound === 'string') {
    let notfoundText = `<div style="font-size:125%;font-weight:bold;">404: 没有此页面</div><p>${location.hash} 页面不存在！！</p><p style="text-align:center;"><a href="javascript:unalert();w.redirect('#');">回到首页</a></p>`;
    this.alert(w.config.notFound || notfoundText);
  } else {
    if (typeof w.config.notFound === 'function') {
      w.config.notFound();
    } else if (typeof w.config.notFound === 'object') {
      let obj = w.config.notFound;
      if (obj.redirect && w.pages[obj.redirect]) {
        w.redirect(obj.redirect);
      } else {
        this.alert('<div>404: 没有此页面</div>');
      }
    }
  }
};

w.going = null;
w.routeInfo = function() {
  return w.curpage ? (w.curpage.__ctx__ || null) : null;
};

w.loadPage = async function (R) {
  if (w.loadPageLock) {
    return false;
  }

  w.loadPageLock = true;
  let route = R.path;
  if (route == '' || route == '/') {
    route = this.homepage;
  }

  let pageindex = w.pageNameList.indexOf(route);

  if (this.pages[route] === undefined && pageindex >= 0) {
    alert('正在等待页面初始化···', {notClose: true});
  
    for (let i = 0; i < 222; i++) {
      await new Promise(rv => {setTimeout(rv, 5)});
      if (this.pages[route] && this.pages[route].__state__) break;
    }

    setTimeout(()=>{w.unalert();},111);

    if (this.pages[route] === undefined) {
      w.notify('等待页面超时！', {ntype: 'top error noclose'});
      //经过这个延迟，页面有可能已经准备好。
      await new Promise(rv => {setTimeout(rv, 1101)});
    }
  }

  if (this.pages[route] === undefined) {
      w.loadPageLock = false;
      this.handleNotFound();
      return false;
  }

  let pg = this.pages[route];
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
  pg.__ctx__ = c;

  //loadPage是一个异步函数，如果此时在runHook中的函数执行了重定向操作会导致页面显示失败。
  //因为此时，listenHasLock为true
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
      w.notifyTopError(`页面初始化错误：${pg.__name__}.html`, 15000);
      return false;
    }
    pg.init = true;

    pg.__dom__.innerHTML = `${pg.orgHTML}${pg.tabsPlace}`;

    w.initPageDomEvents(pg, pg.__dom__);
  }

  //为了避免在重定向或跳转页面的操作时出现冲突。
  //这里先解锁hash，允许listenHash执行，避免后续的事件函数执行出现漫长等待。
  w.listenHashLock = false;

  if (pg.onload && typeof pg.onload === 'function' && pg.loaded === false) {
    pg.loaded = true;
    try {
      await pg.onload(c);
    } catch (err) {
      w.notify(err.message);
    }
  }

  if (pg.onshow && typeof pg.onshow === 'function') {
    try {
      await pg.onshow(c);
    } catch (err) {
      w.notify(err.message);
    }
  }

  pg.__dom__.scrollTop = pg.scroll;
};

w.reload = function (force = true) {
  let pg = w.curpage;

  w.destroyPage(pg);

  if (!pg || force) {
    return w.listenHash();
  }

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

w.go = async function (path, args = {}, op = 'forward') {
  if (typeof args === 'string') {
    op = args;
    args = {};
  }
  
  this.pageShowTypeLock = true;
  w.pageShowType = op;

  let qrs = w.qs(args);

  if (w.listenHashLock) {
    for (let i = 0; i < 500; i++) {
      await new Promise(rv => {setTimeout(rv, 5)});
      if (!w.listenHashLock) break;
    }
  }
  
  location.hash = `${path}${qrs.length>0?'?':''}${qrs}`;
};

w.goBack = function () {
  if (window.history.length > 1) {
    window.history.back();
    return true;
  }
  return false;
}

w.redirectBack = function (n=1) {
  if (w.historyList.length < n) {
    return false;
  }

  let last_url = w.historyList[w.historyList.length - n];

  if (!last_url) {
    return false;
  }

  w.redirect(last_url);
}

w.redirect = function (path, args = {}) {
  this.pageShowTypeLock = true;
  w.pageShowType = 'forward';
  
  if (path[0] !== '#') path = `#${path}`;

  let qrs = w.qs(args.query || {});

  let startRedirect = async () => {
    history.replaceState({id: path}, '', `${path}${qrs.length > 0 ? '?' : ''}${qrs}`);
    if (args.noticeInfo) {
      w.notify(args.noticeInfo, {ntype: 'top noclose', timeout: 5000});
    }

    if (w.listenHashLock) {  
      //有可能某些页面还没准准备好导致页面初始化需要等待，此时listenHash会等待，这里也要等待。
      for (let i = 0; i < 500; i++) {
        await new Promise(rv => {setTimeout(rv, 5)});
        if (!w.listenHashLock) break;
      }
    }

    if (args.noticeInfo) {
      if (args.noticeTimeout && typeof args.noticeTimeout === 'number') {
        setTimeout(()=>{w.unnotify();}, args.noticeTimeout);
      } else w.unnotify();
    }

    w.listenHash();
  };

  if (args.delay && typeof args.delay === 'number') {
    return setTimeout(startRedirect, args.delay);
  }

  startRedirect();
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

    if (k[0] === '&') {
      qcss = k.substring(1);
    } else if ([':', '.', '#'].indexOf(k[0]) >= 0) {
      qcss = k;
    } else if (k.indexOf('[') >= 0) {
      qcss = k;
    }

    nds = pgdom.querySelectorAll(qcss);

    attr = data[k];

    for (let d of nds) {
      for (let a in attr) {
        switch (a) {
          case 'class':
          case 'className':
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
    
    if (k[0] === '&') {
      qcss = k.substring(1);
    } else if ([':', '.', '#'].indexOf(k[0]) >= 0) {
      qcss = k;
    } else if (k.indexOf('[') >= 0) {
      qcss = k;
    }

    nds = pgdom.querySelectorAll(qcss);

    if (data[k] === null) {
      w._resetData(pagename, pg, nds);
      continue;
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

w.resetView = function(pagename, qss) {
  if (!Array.isArray(qss)) {
    qss = [qss];
  }
  
  let data = {};
  for (let q of qss) {
    if (q && typeof q === 'string') {
      data[q] = null;
    }
  }
  w.view(pagename, data);
};

w._resetData = function (pagename, pg, nds) {
  let tagname = '';
  for (let d of nds) {
    tagname = d.tagName.toLowerCase();
    if (tagname === 'img') {
      d.src = '';
      continue;
    }
    
    if (tagname === 'input') {
      if (['checkbox', 'radio'].indexOf(d.type) >= 0) {
        d.checked = false;
        continue;
      }
    }

    if (d.value !== undefined) {
      ;(tagname !== 'select') && (d.value = '');
    } else {
      d.innerHTML = '';
    }
  }
};

//w.replaceRegex = /\{\:[A-Za-z0-9\-\_]{1,100}\:\}/;
/**
 *
 * @param {string} codetext 
 * @param {boolean} is_comps 
 * @param {string} comp_name 
 * @returns {string}
 */
w.replaceSrc = function (codetext, is_comps = false, comp_name = '') {
  if (!codetext || typeof codetext !== 'string') return codetext;

  let replace_src = (url, plist, offset, text) => {
    if ((/^http[s]?:\/\//).test(url)) {
      return url;
    }

    let turl = url.trim();

    //只会对 /static开头的数据做替换处理
    if ((w.prepath !== '/static' && turl.indexOf(w.prepath) === 0) 
      || w.prepath === '/static' && turl.indexOf('/static/static') === 0)
    {
        return turl;
    }
    
    if (w.prepath && turl.indexOf('/static') === 0) {
      return `${w.prepath}/${turl}`.replace(/\/{2,}/ig, '/');
    }

    return turl;
  };

  let match_replace = m => {
    let arr = m.split(' src=');
    
    let q = arr[1][0];
    let startind = 1;
    let endind = arr[1].indexOf(q, 1);

    if (q !== '"' && q !== "'") {
      q = '';
      startind = 0;
      endind = arr[1].indexOf(' ', 1);
      if (endind < 0) endind = arr[1].length - 1;
    }

    let orgsrc = arr[1].substring(startind, endind);
    //针对组件
    if (is_comps) {
      orgsrc = orgsrc.replace('./static', '/static/components/' + comp_name);
    }

    let final_src = `${arr[0]} src=${q}${replace_src(orgsrc)}${arr[1].substring(endind)}`;
    return final_src;
  };

  let fix_src_space = (m) => {
    return m.replace(/ src\s+=\s+/g, ' src=');
  }

  codetext = codetext.replace(
    /<(audio|embed|iframe|img|input|source|track|video|script)[^>]* src\s+=\s+"[^"]+"[^>]*>/ig, 
    fix_src_space);

  codetext = codetext.replace(
    /<(audio|embed|iframe|img|input|source|track|video|script)[^>]* src\s+=\s+'[^']+'[^>]*>/ig, 
    fix_src_space);

  //audio embed iframe img input source track video
  codetext = codetext.replace(
    /<(audio|embed|iframe|img|input|source|track|video|script)[^>]* src="[^"]+"[^>]*>/ig, 
    match_replace);

  codetext = codetext.replace(
    /<(audio|embed|iframe|img|input|source|track|video|script)[^>]* src='[^']+'[^>]*>/ig, 
    match_replace);

  return codetext;
};

w._setData = function (pagename, pg, nds, data) {
  let dtemp = '';
  let dataType = typeof data;
  let tagname = '';

  for (let i = 0; i < nds.length; i++) {
    
    if (nds[i].dataset.map && typeof pg[nds[i].dataset.map] === 'function') {
      dtemp = pg[nds[i].dataset.map]({
        data: data,
        target: nds[i],
        type: 'map',
        dataType}) || '';

    } else if (nds[i].dataset.list && typeof pg[nds[i].dataset.list] === 'function') {
      if (Array.isArray(data)) {
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
      if (pg.display && typeof pg.display === 'object' && nds[i].dataset.name
        && pg.display[nds[i].dataset.name]
        && typeof pg.display[nds[i].dataset.name] === 'function')
      {
        dtemp = pg.display[nds[i].dataset.name]({
          data: data, target: nds[i], type: 'display', dataType
        }) || (typeof data === 'object' ? JSON.stringify(data) : data);
      } else if (typeof data === 'object') {
        dtemp = JSON.stringify(data);
      } else {
        dtemp = data;
      }
    }

    tagname = nds[i].tagName.toLowerCase();

    if (tagname === 'img') {
      nds[i].src = dtemp;
      continue;
    }

    if (nds[i].dataset.insert === undefined) {
      nds[i].dataset.insert = 'replace';
    }

    if (tagname === 'select') {
      if (!((/<option .*option>/i).test(dtemp)) ) {
        for (let o of nds[i].options) {
          if (o.value == dtemp) {
            o.selected = true;
            break;
          }
        }
        continue;
      }
    } else if (tagname === 'input') {
      if (['checkbox', 'radio'].indexOf(nds[i].type) >= 0) {
          if (typeof dtemp === 'boolean') {
            nds[i].checked = dtemp;
            continue;
          }
      }
    }

    if (nds[i].value !== undefined && tagname !== 'select') {
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
        if (!w._htmlcheck(dtemp)) {
          return false;
        }
      }

      if (pagename) {
        dtemp = w.replaceSrc(dtemp);
      } else {
        //组件
        dtemp = w.replaceSrc(dtemp, true, pg.tagName.toLowerCase());
      }

      switch (nds[i].dataset.insert) {
        case 'before':
          nds[i].insertAdjacentHTML('afterbegin', dtemp);
          break;
        case 'end':
          nds[i].insertAdjacentHTML('beforeend', dtemp);
          break;
        default:
          nds[i].innerHTML = dtemp;
      }
      //初始化和上一层的操作已经让nds[i]绑定了事件。
      if (pagename)
        w.initPageDomEvents(pg, nds[i], false);
      else if (pagename === 0) {
        //如果在组件里，使用view，则需要执行initPageDomEvents，目前使用pagename为0表示组件内调用。
        w.initPageDomEvents(pg, nds[i], false);
      }
    }

    dtemp = '';
  }

};

w.parseform = function (fd) {
  let m = {
    node : fd,
    childs : {},
    buttons : {},
    submit : null,
    files : {},
    values : {}
  };

  let inds = fd.querySelectorAll('input');
  let secnds = fd.querySelectorAll('select');
  let textnds = fd.querySelectorAll('textarea');

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
Object.defineProperties(w, {
  hooks: {
    value: [],
    writable: false,
    enumerable: false,
    configurable: false,
  },

  hookFunc: {
    value: {},
    writable: false,
    enumerable: false,
    configurable: false,
  }
});

//w.hooks = [];
//w.hookFunc = {};

/**
 * 
 * @param {function} callback 
 * @param {string|object} name 
 * @returns 
 */
w.addHook = function (callback, name='') {
  if (typeof callback !== 'function') {
    return w.notifyError(`${callback}不是function`);
  }

  let opts = {
    name: typeof name === 'string' ? name : '',
    page: null,
    exclude: null,
    mode: 'always',
    count: 0
  };

  if (typeof name === 'object') {
    if (name.name) opts.name = name.name;

    if (name.page) {
      if (typeof name.page === 'string') {
        name.page = [name.page];
      }
      if (Array.isArray(name.page)) opts.page = [...name.page];
    }

    if (name.exclude) {
      if (typeof name.exclude === 'string') {
        name.exclude = [name.exclude];
      }

      if (Array.isArray(name.exclude)) opts.exclude = [...name.exclude];
    }

    if (name.mode && ['always', 'once'].indexOf(name.mode) >= 0) {
      opts.mode = name.mode;
    }
  }

  if (!opts.name) opts.name = w.randid();

  if (!w.hookFunc[opts.name]) {
    w.hookFunc[opts.name] = {func: callback, options: opts};
    w.hooks.push(opts.name);
  } else {
    w.hookFunc[opts.name] = {func: callback, options: opts};
  }

  return w;
};

w.removeHook = function (name) {
  let ind = w.hooks.indexOf(name);
  if (ind < 0) return false;
  delete w.hookFunc[name];
  w.hooks.splice(ind, 1);
  return true;
};

w.resetHookCount = function (name) {
  let ind = w.hooks.indexOf(name);
  if (ind < 0 || !w.hookFunc[name]) return false;
  w.hookFunc[name].options.count = 0;
};

w.hashchange = null;

w.runHooks = async function (ctx) {
  try {
    let cname = ctx.path;
    let ch;
    for (let h of w.hooks) {
      ch = w.hookFunc[h];
      if (!ch || !ch.func || typeof ch.func !== 'function')
        continue;
      if (ch.options.exclude && ch.options.exclude.indexOf(cname) >= 0) {
        continue;
      }

      if (ch.options.page && ch.options.page.indexOf(cname) < 0) {
        continue;
      }

      if (ch.options.mode === 'once' && ch.options.count > 0) {
        continue;
      }

      ch.options.count += 1;
      if (false === await ch.func(ctx)) {
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
    w.navibtndom.innerHTML = htext;
    w.initPageDomEvents(opts.context || w.curpage, w.navibtndom, false);
  }, 5);
  
};

w.naviGlass = function (htext, lr='left', up = false) {
  w.navi(htext, {position: lr, background: 'glass', up: up});
};

w.naviHide = function () {
  w.navibtndom.innerHTML = '';
  w.navibtndom.className = '';
};

Object.defineProperty(w, '_devents', {
  enumerable: false,
  writable: false,
  configurable: false,
  value: [
    "animationcancel", "animationend", "animationiteration", "animationstart", "auxclick",
    "beforematch", "blur", "canplay", "change", "click", "close", "compositionend",
    "compositionstart", "compositionupdate", "contextmenu", "copy", "cut", "dblclick",
    "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop",
    "ended", "error", "focus", "focusin", "focusout", "fullscreenchange",
    "fullscreenerror", "input", "invalid", "keydown", "keyup", "load", "mousedown",
    "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup",
    "paste", "play", "playing", "pointercancel", "pointerdown", "pointerenter",
    "pointerleave", "pointermove", "pointerout", "pointerover", "pointerup", "reset",
    "resize", "scroll", "scrollend", "securitypolicyviolation", "seeked", "seeking",
    "select", "submit", "touchcancel", "touchend", "touchmove", "touchstart",
    "transitioncancel", "transitionend", "transitionrun", "transitionstart", "wheel"
  ]
});

w.initDomEvent = function (pg, dom, evtname, bindSelf=true) {
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

  let bind_event = (d) => {
    let evtlist = d.dataset[`on${evtname}`].trim().split(' ').filter(x => x.length > 0);
    if (!d.__events_map__) {
      Object.defineProperty(d, '__events_map__', {
        enumerable: false,
        writable: true,
        value: {}
      });
    }
    let ek = '';
    evtlist.forEach(ehandle => {
      ek = evtname + ':' + ehandle;
      if (d.__events_map__[ek]) return;
      d.__events_map__[ek] = ek;
      d.addEventListener(evtname, w.genEventProxy(pg, ehandle));
    });
  };

  bindSelf && dom.dataset && dom.dataset[`on${evtname}`] && bind_event(dom);

  if (bindSelf === 'self') return;

  for (let d of nds) {
    bind_event(d);
  }
};

w.initPageDomEvents = function (pg, dom, bindSelf=true) {
  for (let e of w._devents) {
    w.initDomEvent(pg, dom, e, bindSelf);
  }
};

w.eventProxy = function (evt, pg, funcname) {
  let wind = funcname.trim().indexOf('w.');
  let wfunc = null;
  
  let wheretext = '';
  if (pg.tagName) {
    wheretext = `<div style="line-height:1.1;">${pg.tagName.toLowerCase()}:</div>`;
  } else {
    wheretext = `<div style="line-height:1.1;">${pg.name}:</div>`
  }

  if (wind === 0) {
    let wf = w.getFunc(funcname.trim());
    if (!wf) {
      if (evt.target && evt.target.dataset.noterror) return false;
      
      w.notifyError(`${wheretext}<div>${funcname} is not a function.</div>`);
      return false;
    }

    wfunc = wf.func;
  }
  else if (!pg || !pg[funcname] || !(typeof pg[funcname] === 'function')) {
    if (evt.target && evt.target.dataset.noterror) return false;
    w.notifyError(`${wheretext}<div>${funcname} is not a function.</div>`);
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
    if (obj[k]) delete obj[k];

    return true;
  }
});

Object.defineProperty(w, '__require_loop__', {
  value: 111,
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
        setTimeout(() => { rv(); }, 5);
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
      funcmap: {},
      idmap: {}
    }
  }
});

/**
 * mode默认为一直执行，或者是选择once表示执行一次则删除。
 * @param {object} options callback, type, mode
 */
w.registerShareNotice = function (options) {
  if (!options || typeof options !== 'object') {
    w.notifyError('options不是object类型。');
    return false;
  }

  if (w.shareNoticeList.length >= 10101) {
    w.notifyError('注册通知函数已达上限，不能超过10101个。');
    return false;
  }

  if (!options.key) {
    w.notifyError('注册通知函数必须明确指定key，若要全部监听，则使用*作为key值。');
    return false;
  }

  if (!options.callback || typeof options.callback !== 'function') {
    w.notifyError('没有callback函数用于通知回调。');
    return false;
  }

  if (!options.type) options.type = ['set'];
  else if (options.type !== 'all' && !Array.isArray(options.type)) {
    options.type = [options.type];
  }

  if (!options.mode) options.mode = 'always';

  options.count = 0;

  options.id = w.randid(`${options.key}::`);

  if (!w.shareNoticeList.funcmap[ options.key ]) {
      let okey = options.key;
      let key_match = (k) => {
        return okey === '*' ? true : (k === okey);
      };
      let keypre = '';
      let ktype = 's';
      //支持key*模式，表示前缀为key,后续为任何值的模式，同时支持正则表达式
      if (options.key instanceof RegExp) {
        ktype = 'r';
        key_match = (k) => {
          return okey.test(k);
        };
      } else if (options.key !== '*' && options.key[options.key.length - 1] === '*') {
        ktype = 'p';
        keypre = options.key.substring(0, options.key.length - 1);
        key_match = (k) => {
          return k.indexOf(keypre) === 0;
        };
      }

      w.shareNoticeList.funcmap[ options.key ] = {
        type: ktype,
        match: key_match,
        list: [options]
      };
  } else {
    if (options.only) return false;
    let kn = w.shareNoticeList.funcmap[options.key];
    if (kn.list.length >= 111) {
      w.notifyError('同一个key注册通知函数不能超过111个。');
      return false;
    }
    kn.list.push(options);
  }

  w.shareNoticeList.length += 1;

  w.shareNoticeList.idmap[options.id] = options;

  return options.id;
};

w.removeShareNotice = function (id) {
  if (!id) return false;
  if (!w.shareNoticeList.idmap[id]) return false;

  let opts = w.shareNoticeList.idmap[id];
  
  if (!w.shareNoticeList.funcmap[opts.key]) {
    delete w.shareNoticeList.idmap[id];
    return opts;
  }

  let kmap = w.shareNoticeList.funcmap[opts.key].list;
  let ind = 0;

  for (let a of kmap) {
    if (a.id === id) {
      kmap.splice(ind, 1);
      w.shareNoticeList.length -= 1;
      if (kmap.length === 0) delete w.shareNoticeList.funcmap[opts.key];
      return a;
    }
    ind += 1;
  }

  return opts;
};

w.runShareNotice = function (type, obj, k, data = null) {
  let kmlist = [];
  let gkmlist = null;
  if (w.shareNoticeList.funcmap['*']) {
    gkmlist = w.shareNoticeList.funcmap['*'].list;
  }

  if (k !== '*' && w.shareNoticeList.funcmap[k]) {
    kmlist = kmlist.concat(w.shareNoticeList.funcmap[k].list);
  }

  let rtmp;
  for (let sk in w.shareNoticeList.funcmap) {
    if (sk === '*' || sk === k) continue;

    rtmp = w.shareNoticeList.funcmap[sk];
    if (rtmp.type !== 's' && rtmp.match(k)) kmlist = kmlist.concat(rtmp.list);
  }

  if (kmlist.length == 0 && !gkmlist) return;

  gkmlist && (kmlist = kmlist.concat(gkmlist));

  let delids = [];

  for (let a of kmlist) {
    if (a.type !== 'all' && a.type.indexOf(type) < 0) continue;
    if (a.mode === 'once' && a.count > 0) {
      delids.push(a.id);
      continue;
    }

    a.count < 100000000 && (a.count += 1);
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
      if (obj[k] !== undefined) {
        w.runShareNotice('delete', obj, k);
        delete obj[k];
      }
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

Object.defineProperty(w, '__bindpage__', {
  enumerable: false,
  writable: false,
  configurable: false,
  value: (pname) => {
    return (obj) => {
      if (typeof obj === 'function') {
        try {
          if (obj.prototype) { w.pages[pname] = new obj(); }
          else { w.pages[pname] = obj(); }
        } catch (err) {w.alertError(err.message);}
      } else if (typeof obj === 'object') {
        w.pages[pname] = obj;
      } else {
        w.pages[pname] = {};
        setTimeout(() => {
          w.alertError(`${pname} 页面初始化失败。`);
        }, 1500);
      }

      w.initOnePage(pname);
    }
  }
});

Object.defineProperty(w, '__module__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: (name) => {
    let oo = {}
    Object.defineProperty(oo, 'exports', {
      set: (val) => {
        if (w.__ext__[name]) delete w.__ext__[name];
        w.ext[name] = val;
      },
      get: () => {
        return name;
      }
    });

    return oo
  }
});

w.getFunc = function(str, supportTrue=false) {
  let arr;
  if (Array.isArray(str)) {
    arr = str;
  } else {
    arr = str.split('.').filter(p => p.length > 0);
  }

  if (arr[0] === 'w') arr = arr.slice(1);
  
  if (arr.length <= 0) return null;

  let oo = null;
  let ftemp = w;
  for (let a of arr) {
    oo = ftemp;
    ftemp = ftemp[a];
    if (!ftemp) return null;
  }

  let typ = typeof ftemp;
  if (typ === 'function') {
    return {
      type: typ,
      value: ftemp,
      object: oo,
      key: arr[arr.length - 1],
      func: ftemp.bind(oo)
    };
  }

  if (ftemp && ftemp !== w && supportTrue) {
    return {
      type: typ,
      value: ftemp,
      object: oo,
      key: arr[arr.length - 1]
    };
  }
}

w.runFunc = function (str, ...args) {
  let f = w.getFunc(str)
  if (!f) {
    w.debug && console.error(str, '没有此方法')
    return false;
  }

  return f.func(...args)
}

//--------Component---------------
w.__comps_loop__ = {};

class Component extends HTMLElement {
  constructor () {
    super();

    //this就是节点。
    this.shadow = this.attachShadow({mode: 'closed'});
    
    Object.defineProperty(this, '__attrs__', {
      value: Object.create(null),
      configurable: false,
      writable: false,
      enumerable: true
    });

    Object.defineProperty(this, '__init__', {
      value: false,
      configurable: false,
      writable: true,
      enumerable: false
    });

    this.allAttrs = () => {return this.__attrs__;};

    this.attrs = new Proxy(this.__attrs__, {
      set: (obj, k, data) => {
        let oldval = (obj[k] === undefined) ? null : obj[k];
        if (this.properties[k]) {
          obj[k] = this._propValue(this.properties[k], data);
          this[k] = data;
        } else {
          obj[k] = data;
        }
        
        try {
          ;(typeof this.onattrchange === 'function') && this.onattrchange(k, oldval, obj[k]);
        } catch (err) {
          w.debug && console.error(err);
        }
        return true;
      },

      get: (obj, k) => {
        if (this.attributes[k] !== undefined && obj[k] === undefined) {
          obj[k] = this._propValue(this.properties[k]||{}, this.attributes[k].value);
        }

        if (obj[k] === undefined) return null;
        return obj[k];
      },

      deleteProperty: (obj, k) => {
        if (obj[k] !== undefined) {
          let oldval = obj[k];
          delete obj[k];
          //声明了properties的会默认设置到this上，也会删除。
          if (this.properties[k] && (!this.notDelete || this.notDelete.indexOf(k) < 0)) {
            delete this[k];
          }

          try {
            ;(typeof this.onattrchange === 'function') && this.onattrchange(k, oldval, null);
          } catch (err) {
            w.debug && console.error(err);
          }
        }

        return true;
      }
    });

    queueMicrotask(this.__queue_task_init__.bind(this));
  }

  async __queue_task_init__() {
    if (!this.properties || typeof this.properties !== 'object') this.properties = {};
    if (this.notDelete && !Array.isArray(this.notDelete)) {
      this.notDelete = [this.notDelete];
    }

    let typ;
    for (let k in this.properties) {
      typ = typeof this.properties[k];
      if (typ === 'string') {
        this.properties[k] = {
          type: this.properties[k]
        };
      } else if (typ !== 'object') { continue; }
      
      if (this.properties[k].default !== undefined) {
        this.__attrs__[k] = this.properties[k].default;
      }
    }
    
    for (let a of this.attributes) {
      if (this.properties[a.name]) {
        this.__attrs__[a.name] = this._propValue(this.properties[a.name], a.value);
        continue;
      }
      this.__attrs__[a.name] = a.value;
    }

    if (this.init && typeof this.init === 'function') {
      try {
        if (this.init.constructor.name === 'AsyncFunction') {
          await this.init();
        } else {
          this.init();
        }
      } catch (err) {
        w.debug && console.error(err);
        w.debug && w.notifyTopError(err.message);
      }
    }

    if (this.render && typeof this.render === 'function') {
      let d = this.render() || '';
      this.initPlateTemplate(null, d);
    }

    if (this.afterRender && typeof this.afterRender === 'function') {
      this.afterRender();
    }
  }

  _propValue (obj, val) {
    if (!obj || typeof obj !== 'object') return val;

    if (!obj.type) return val;

    switch (obj.type) {
      case 'string':
        if (typeof val === 'string') {
          if (obj.match && obj.match instanceof RegExp) {
            !obj.match.test(val) && (val = obj.default || '');
          }
        } else { val = `${val}`; }
        break;
      case 'number':
      case 'int':
        val = parseInt(val);
        break;

      case 'float':
        val = parseFloat(val);
        break;

      case 'boolean':
        if (typeof val !== 'boolean') {
          if (val === 'false' || val === '0' || val === undefined || val === null) val = false;
          else val = true;
        }
        break;

      case 'urijson':
      case 'encodejson':
      case 'uri-json':
        if (typeof val === 'string') {
          try {
            let jval = decodeURIComponent(val);
            val = JSON.parse(jval);
          } catch (err) {
            val = obj.default || {};
          }
        } else {val = obj.default || {}}
        break;

      case 'json':
        if (typeof val === 'string') {
          try {
            val = JSON.parse(val);
          } catch (err) {
            //可能是encodeURIComponent编码的
            try {
              if (val.indexOf('%22') > 0 || val.indexOf('%5B') >= 0 || val.indexOf('%7B') >= 0) {
                val = JSON.parse(decodeURIComponent(val));
              }
            } catch (err) {
              val = obj.default || {};
            }
          }
        } else {val = obj.default || {}}
        break;
    }

    let val_type = typeof val;

    if (val_type !== 'object' && obj.limit !== undefined && Array.isArray(obj.limit)) {
      if (obj.limit.indexOf(val) < 0)
        return (obj.default !== undefined ? obj.default : obj.limit[0]);
    } else if (val_type === 'number') {
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
          if (loopcheck(w.__comps_loop__[a], name) === false) return false;
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
  
  //不会重复初始化基础结构。
  initPlateTemplate(id=null, d=null) {
    if (this.__init__) {
      return true;
    }

    if (!d) d = this.plate(id);
  
    if (typeof d === 'object' && d) {
      this.shadow.appendChild(d);
    } else if (typeof d === 'string' && d.length > 0) {
      let st = this.checkLoopRef(d);
      if ( st.ok === false ) {
        return this.notifyLoopRefError(st);
      }

      w._htmlcheck(d) && (this.shadow.innerHTML = d);
    }

    this.__init__ = true;

    w.initPageDomEvents(this, this.shadow);

    return true;
  }

  /**
   * 一个组件对应于一个template，plate可以有选择的使用不同的template。
   * @param {string} id 
   * @param {object} data 
   */
  plate (id = null, data = {}) {
    if (typeof id === 'object' && id) {
      data = id;
      id = null;
    }

    let tempid = this.tagName.toLowerCase();
    
    if (id && id[0] === '#') id = id.substring(1);

    let nd = w.__templatedom__.querySelector(`div[data-templateid=${tempid}]`);
    if (!nd) return false;
    if (id) {
      nd = nd.querySelector(`template[id=${id}]`);
    } else {
      nd = nd.querySelector('template');
    }

    if (!nd) return false;

    let init_style = true;
    let cssmap_key;
    if (w.__components_css__ && w.__components_css__[tempid]) {
      let csslist = w.__components_css__[tempid];
      if (csslist && Array.isArray(csslist) && csslist.length > 0) {
        let sty = '';
        let ctext= '';
        cssmap_key = csslist[0].indexOf('./') === 0 ? (tempid + '/' + csslist[0]) : csslist[0];
        if (nd.content.firstChild && nd.content.firstChild.id === cssmap_key) {
          init_style = false;
        }

        if (init_style) {
            for (let i = csslist.length - 1; i>=0; i--) {
              cssmap_key = csslist[i].indexOf('./') === 0 ? (tempid + '/' + csslist[i]) : csslist[i];
              if (!w.__css_code_map__ || !w.__css_code_map__[cssmap_key]) continue;
              try {
                sty = document.createElement('style');
                sty.id = cssmap_key;
                //ctext = decodeURIComponent(w.__css_code_map__[csslist[i]]);
                ctext = w.__css_code_map__[cssmap_key];
                sty.appendChild(document.createTextNode(ctext));
                nd.content.insertBefore(sty, nd.content.firstChild);
              } catch (err) {
                console.error(err);
              }
            }
        }
      }
    }

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
    if (k[0] === '&') {
      qcss = k.substring(1);
    } else if (['.', ':', '#'].indexOf(k[0]) >= 0) {
      qcss = k;
    } else if (k.indexOf('[') >= 0) {
      return k;
    }

    return qcss;
  }

  view (data, obj=null) {
    if (!this.__init__) {
      this.initPlateTemplate(null, null);
    }

    if (typeof data === 'string') {
      let orgdata = data;
      data = {};
      data[orgdata] = obj;
    }

    let qcss = '';
    let nds;
    
    for (let k in data) {
      qcss = this._fmtquery(k);
      nds = this.shadow.querySelectorAll(qcss);
      if (data[k] === null) {
        w._resetData(0, this, nds);
        continue;
      }

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

    return this;
  }

  resetView(qss) {
    if (!Array.isArray(qss)) qss = [qss];
    let data = {};
    for (let q of qss) {
      if (q && typeof q === 'string') {
        data[q] = null;
      }
    }
    this.view(data);
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
            case 'className':
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

  setStyle(data) {
    let obj;
    for (let k in data) {
      obj = {};
      obj[k] = {style: data[k]};
      this.setAttr(obj);
    }
  }

  queryAll (qss, callback=null) {
    let nds = this.shadow.querySelectorAll(qss);
    if (callback && typeof callback === 'function') nds.forEach(callback);
    return nds;
  }

  query (qss,callback=null) {
    let nod = this.shadow.querySelector(qss);
    if (!nod) return null;
    if (callback && typeof callback === 'function') callback(nod);
    return nod;
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

  alert(info, options=null) {
    if (!options || typeof options !== 'object') options = {};
    options.context = this;
    return w.alert(info, options);
  }

  alertDark(info, options={}) {
    if (!options || typeof options !== 'object') options = {};
    options.context = this;
    return w.alertDark(info, options);
  }

  cancelAlert(aid='') {return w.cancelAlert(aid);}

  cover (info, options=null) {
    if (!options || typeof options !== 'object') options = {};
    options.notClose = true;
    options.withCover = true;
    return this.alert(info, options);
  }

  coverDark(info, options=null) {
    if (!options || typeof options !== 'object') options = {};
    options.notClose = true;
    options.withCover = true;
    return this.alertDark(info, options);
  }

  uncover (aid='last') { return w.uncover(aid); }

  loadScript (src) {
    return w.loadScript(src, this.tagName.toLowerCase());
  }

  sliderPage(text, append=false) { w.sliderPage(text, append, this); }

  hideSlider(clearText=true) { w.hideSlider(clearText); }

  prompt(info, options={}) {
    if (!options || typeof options !== 'object') {
      options = {};
    }

    options.target = this;
    w.prompt(info, options);
  }

  unprompt(isbottom=true) {w.unprompt(isbottom);}
  unpromptMiddle(){w.unprompt(false);}

  promptTop(info, options={}) {
    options.wh = 'top';
    this.prompt(info, options);
  }

  promptMiddle(info, options={}) {
    options.target = this;
    w.promptMiddle(info, options);
  }

  promptDark(info, options={}) {
    options.target = this;
    w.promptDark(info, options);
  }

  promptMiddleDark(info, options={}) {
    options.target = this;
    w.promptMiddleDark(info, options);
  }

  promptTopDark(info, options={}) {
    options.target = this;
    w.promptTopDark(info, options);
  }

  bindEvent(dom, bindSelf=true) {
    w.initPageDomEvents(this, dom, bindSelf);
  }

  findMethod(name, wh=['config', 'ext']) {
    if (typeof wh === 'string') wh = [wh];

    if (!wh || !Array.isArray(wh) || wh.length === 0) {
      wh = ['config', 'ext'];
    }

    for (let k of wh) {
      if (w[k] && w[k][name] && typeof w[k][name] === 'function') {
        return w[k][name];
      }
    }

    return null;
  }
}
