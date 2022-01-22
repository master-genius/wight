'use strict';

const fs = require('fs');
const terser = require('terser');
const csso = require('csso');
const htmlstate = require('./htmlstate');

const htmlparser = new htmlstate();

function delayOutError (err, info, delay = 1280) {
  setTimeout(() => {
    let errText = '';

    if (typeof err === 'string') {
      errText = `\x1b[1;35m${info}\n\x1b[0m  \x1b[1;33m${err}\x1b[0m`;
    } else {
      errText = `\x1b[1;35m${info}\n\x1b[0m  ${err.message}`;
    }

    console.error(errText);
  }, delay);
}

/**
 * 要根据pages记录的页面去指定的目录中加载页面，并生成一些初始化的代码。
 */
var _page_dir = __dirname;

var wapp = function (options = {}) {

  if (!(this instanceof wapp) ) {
    return new wapp(options);
  }

  this.mydir = _page_dir;

  this.pageUrlPath = '/';

  this.defaultVersion = '2.0';

  this.version = '2.0';

  this.forceCompress = false;

  this.config = {
    test : false,
    debug: false,
    title : '',
    tabs : [],
    tabsPages : [],
    tabsPageIndex : {},
    pages : [],
    css : '',
    cssurl : '',
    jsurl : '',
    jsbottom: '',
    hooks : [],
    host : '',
    port : '',
    prepath: '',
    closePrompt: true,
    pagedir : '',
    components : [],
    extends: [],
    exts: [],
    iconPath: '/favicon.ico'
  };

  this.jch = {
    css : '',
    js  : '',
  };

  this.getCssCode = (cssfile, attach = false) => {
    let csscode = fs.readFileSync(
                    `${this.mydir}/v${this.version}/${cssfile}`,
                    {encoding: 'utf8'}
                  );

    if (attach) {
      this.jch.css += csscode;
    } else {
      this.jch.css = csscode;
    }
  };

  this.init = async () => {
    let wdir = `${this.mydir}/v${this.version}`;

    try {
      fs.accessSync(wdir);
    } catch (err) {
      console.error(err);
      wdir = `${this.mydir}/v${this.defaultVersion}`;
    }

    this.jch.css += fs.readFileSync(`${wdir}/w.css`, {encoding: 'utf8'});
    this.jch.js = fs.readFileSync(wdir + '/w.js', {encoding: 'utf8'});

    if (this.forceCompress || this.config.debug === false || (this.isbuild && this.config.buildCompress)) {
      let data = await terser.minify(this.jch.js+'\n');
      if (data.code === undefined) {
        console.error(data.error);
      } else {
        this.jch.js = data.code;
      }
    }

    if (!this.isbuild) {
      let ds = this.pageUrlPath[this.pageUrlPath.length - 1] === '/' ? '' : '/';

      this.iconlink = `<link href="${this.pageUrlPath}${ds}favicon.ico" rel="icon" type="image/x-icon">`;
    } else if (this.isbuild && this.config.iconPath) {
      this.iconlink = `<link rel="icon" href="${this.config.iconPath}" type="image/x-icon">`;
    }

  };

  if (typeof options === 'object') {
    for (let k in options) {
      switch (k) {
        case 'debug':
        case 'closePrompt':
        case 'test':
          this.config[k] = options[k]; break;
        
        case 'pagedir':
          this.config.pagedir = options[k];
          let psplit = this.config.pagedir.split('/').filter(p => p.length > 0);
          if (psplit.length > 0) {
            this.pageUrlPath = `/${psplit[psplit.length - 1]}/`;
          }
          //this.config.prepath = this.pageUrlPath;
          break;

        default:;
      }
    }
  }

  this.pagesCode = '';
  this.tabsHTML = '';

  this.hooksText = '';
  this.components = '';
  this.extends = '';
  this.jstext = '';
  this.cssCode = '';
  this.csstext = '';
  this.jsbottom = '';
  this.isbuild = false;
  this.buildPrePath = '';
  this.iconlink = '';
  this.templates = '';

  this.compile = function () {

    let closePromptText = `window.onbeforeunload = function () {return '退出？';};`
      +`window.onunload = function () {return '退出？';};`
      +`window.onpagehide = evt => {if (evt.persisted) {} return '退出?';}`;

    if (this.config.closePrompt === false) {
      closePromptText = '';
    }

    return `<!DOCTYPE html><html>
      <head>
        <title id="app-title">${this.config.title}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,user-scalable=no">
        ${this.iconlink}
        ${this.csstext}
        <style>
          ${csso.minify(this.jch.css+'\n').css}
          ${csso.minify(this.cssCode+'\n').css}
        </style>
        <style>a{outline:none;text-decoration: none;}</style>
          ${this.jstext}
        <script>
          ${this.jch.js}
        </script>
      </head>
      <body style="overflow-x:hidden;overflow-wrap:break-word;">
        <div>${this.templates}</div>
        <script>
          'use strict';
          w.host = '${this.config.host}';
          window.__prepath__ = w.prepath = '${this.config.prepath}';
          w.homepage = '${this.config.pages[0]}';
          w.__title__ = '${this.config.title}';
          w.curTitle = '${this.config.title}';
          w.debug = ${this.config.debug ? 'true' : 'false'};

          w.tabs.list = ${JSON.stringify(this.config.tabs)};
          w.tabs.pages = ${JSON.stringify(this.config.tabsPages)};
          w.tabs.pageIndex = ${JSON.stringify(this.config.tabsPageIndex)};
          w.tabs.background = '${this.config.tabsBackground}';
          w.tabs.selectedBackground = '${this.config.tabsSelectedBackground}';
          
          window.alert = w.alert.bind(w);
          window.unalert = w.unalert.bind(w);
          window.alertError = w.alertError.bind(w);
          window.notify = w.notify.bind(w);
          window.notice = w.notice.bind(w);
          window.notifyError = w.notifyError.bind(w);
          window.prompt = w.prompt.bind(w);
          window.unprompt = w.unprompt.bind(w);
          window.notifyTop = w.notifyTop.bind(w);
          window.notifyLight = w.notifyLight.bind(w);
          window.notifyTopError = w.notifyTopError.bind(w);
          window.notifyOnly = w.notifyOnly.bind(w);
          window.unnotify = w.unnotify.bind(w);
          window.promptMiddle = w.promptMiddle.bind(w);
          window.promptGlass = w.promptGlass.bind(w);
          window.promptMiddleGlass = w.promptMiddleGlass.bind(w);
          window.promptDark = w.promptDark.bind(w);
          window.promptMiddleDark = w.promptMiddleDark.bind(w);
          window.acover = w.acover.bind(w);
          window.coverShadow = w.coverShadow.bind(w);
          window.uncover = w.uncover.bind(w);
          window.uncoverShadow = w.uncoverShadow.bind(w);
          window.setCoverText = w.setCoverText.bind(w);
        </script>
        <script>'use strict';${this.libCode}</script>
        <script>'use strict';${this.extends}</script>
        <script>'use strict';${this.components}</script>
        <script>'use strict';${this.hooksText}</script>
        <script>'use strict';${this.pagesCode}</script>
        <script>
        'use strict';

        window.onload = async function () {
          let dms = [
            'pgcdom','coverdom','notifydom','alertdom','alertdom1', 'slidedom', 'alertcoverdom',
            'alertcoverdom1', 'tabsdom','tabsmenudom', 'historydom','slidexdom', 'promptdom', 'navibtndom', 'promptclosedom'
          ];

          for (let i=0; i<dms.length; i++) {
            w[ dms[i] ] = document.body.insertBefore(
              document.createElement('div'),
              document.body.firstChild
            );
          }
          w.initPage();
          if (w.tabs.list.length > 0) {
            w.tabsmenudom.className = 'w-tabbar-row-x';
            w.tabsmenudom.background = '${this.config.tabsBackground}';
            w.tabsmenudom.innerHTML = \`${this.tabsHTML}\`;
          }
        };
        
        let pname = '';
        for (let p in w.pages) {
          w.pages[p].view = function (data,options={}) {return w.view(p,data,options);};
          w.pages[p].render = function (htext) {return w.fmtHTML(p, htext);};
          w.pages[p].setScroll = function(scr) {
            if (scr < 0) { w.pages[p].__dom__.scrollTop += scr; }
            else { w.pages[p].__dom__.scrollTop = scr; }
          };
          w.pages[p].destroy = function () {w.destroyPage(w.pages[p]);};
          w.pages[p].query = function(qstr) {return w.pages[p].__dom__.querySelector(qstr);};
          w.pages[p].queryAll = function(qstr) {return w.pages[p].__dom__.querySelectorAll(qstr);};
          w.pages[p].setAttr = function (data) {w.setAttr(p,data);};
          if (!w.pages[p].data || typeof w.pages[p].data !== 'object') {
            w.pages[p].data = {};
          }
          w._make_page_bind(p);
          w._page_style_bind(p);
        }

        window.onpageshow = async function() {
          await new Promise(rv => {setTimeout(() => {rv();}, 50);});
          if (w.init && typeof w.init === 'function') {
            w.init();
          }
          if (w.tabs.list.length > 0 && w.tabs.pageIndex[w.homepage] !== undefined && location.hash.length < 2)
          {
            w.switchTab(w.homepage);
          } else {
            w.listenHash();
          }
          Object.seal(w);
        };

        window.jump_page_forward = false;

        document.addEventListener('click', evt => {
          let t = evt.target;
          let ft = evt.currentTarget;
          if ((!t || !t.tagName || t.tagName !== 'A') && ft) {
            t = ft;
          }

          if (t.activeElement && t.activeElement.tagName === 'A') {
            let href = t.activeElement.href || '';
            if (href === 'javascript:history.back();' || href === 'javascript:history.go(-1);')
            {
              window.jump_page_forward = -1;
              return;
            }
          }
        
          let url = '';
          if (t && t.tagName && t.tagName === 'A') {
            url = t.href;
          } else if (t.documentURI) {
            url = t.documentURI;
          }

          if (url) {
            let cur_url = location.protocol + '/'+'/' + location.host + location.pathname;
            if (url.indexOf(cur_url) === 0 && url.indexOf('#') > 0) {
              window.jump_page_forward = true;
            }
          }
        });

        window.onhashchange = async function(e) {
          if (w.hashchange && typeof w.hashchange === 'function') {
            if (w.hashchange(e) === false) {
              return;
            }
          }

          await new Promise((rv, rj) => { setTimeout( () => { rv(); }, 20); });

          let parsehash = (h) => {
            let ind = h.indexOf('#');
            if (ind < 0) return '#';
            return h.substring(ind);
          };
          
          let hashstr = parsehash(e.oldURL);
          let new_hashstr = parsehash(e.newURL);

          if (w.historyList.length > 95) {
            for (let i = 0; i < 50; i++) {
              w.historyList.shift();
            }
            w.historyList.unshift('#');
          }

          let ind = w.historyList.indexOf(hashstr);

          let op = '';
          if (w.historyLength < history.length || window.jump_page_forward === true) {
            op = 'forward';
            window.jump_page_forward = false;
          } else {
            
            if (ind > 1) {
              if (w.historyList[ind-1] === new_hashstr) {
                op = 'back';
              } else {
                op = 'forward';
              }
            } else {
              op = 'back';
            }

            if (window.jump_page_forward === -1) {
              window.jump_page_forward = false;
              op = 'back';
            }

          }

          w.historyList.push(new_hashstr);
          w.historyLength = history.length;

          w.listenHash(op);
        };

        window.onscroll = function (){w.events.scroll();};
        window.onresize = function (){w.events.resize();};
        ${closePromptText}
        </script>
        ${this.jsbottom}
      </body>
    </html>`;
  }
  
};

wapp.prototype.loadConfig = function (cfgfile, isbuild = false) {

  let makeTabMenu = function (m, width, urlpath) {
    let mtext = `<div class="w-tabbar-row-cell" id="w-t-mmmm-${m.page}" onclick="w.switchTab('${m.page}');" name="${m.page}" style="width:${width}%;">`;
    
    if (m.icon && typeof m.icon === 'string' && m.icon.length > 0) {
      mtext += `<img src="${urlpath}${m.icon}" style="max-height: 1.35rem;height:auto;width:auto;" name="${m.page}">`;
    }

    if (m.name && typeof m.name === 'string') {
      mtext += `<div name="${m.page}" style="font-size:81%;line-height:101%;padding-bottom:0.125rem;">${m.name}</div>`;
    }
    
    mtext += `</div>`;

    return mtext;
  };

  let prepath = this.pageUrlPath;
  prepath = prepath.replace(/\/{2,}/ig, '/');

  try {
    let cfg = require(cfgfile);
    if (cfg.buildPrePath && isbuild) {
      this.buildPrePath = cfg.buildPrePath;
      prepath = cfg.buildPrePath;
      if (prepath.length > 0 && prepath[prepath.length - 1] !== '/') {
        prepath += '/';
      }
    }

    for (let k in cfg) {
      switch (k) {
        case 'title':
          this.config.title = cfg.title;
          break;

        case 'iconPath':
          this.config.iconPath = cfg[k];
          break;
        
        case 'pages':
          if (cfg[k] instanceof Array) {
            this.config.pages = cfg.pages;
          }
          break;

        case 'tabs':
          
          if (cfg.tabs.list && cfg.tabs.list instanceof Array && cfg.tabs.list.length > 0) {
            let width = 100 / cfg.tabs.list.length;
            this.config.tabs = cfg.tabs.list;
            let pageIndex = 0;
            for (let a of this.config.tabs) {
              this.tabsHTML += makeTabMenu(a, width, prepath);
              this.config.tabsPages.push(a.page);
              this.config.tabsPageIndex[a.page] = pageIndex;
              pageIndex += 1;
            }
            
          }
          if (cfg.tabs.background) {
            this.config.tabsBackground = cfg.tabs.background;
          }
          if (cfg.tabs.selectedBackground) {
            this.config.tabsSelectedBackground = cfg.tabs.selectedBackground;
          }
          break;
        
        case 'host':
          if (this.config.host === '') {
            this.config[k] = cfg[k];
          }
          break;
        
        case 'animation':
          if (cfg[k] === true) {
            this.getCssCode('w-animation.css', true);
          }
          break;

        case 'pageAnimation':
          if (cfg[k] === true) {
            this.getCssCode('w-page-animation.css', true);
          } else if (cfg[k] === 'dropdown') {
            this.getCssCode('w-page-animation-dropdown.css', true);
          }
          break;

        case 'radius':
          if (cfg[k]) {
            let rname = '';
            switch (cfg[k]) {
              case true:
                rname = '';break;
              case 'small':
              case 'large':
                rname = '-' + cfg[k];break;
            }
            this.getCssCode(`w-radius${rname}.css`, true);
          }
          break;
        
        case 'version':
          this.version = cfg[k];
          break;

        default:
          this.config[k] = cfg[k];
      }
    }
    if (cfg.testHost && this.config.test) {
      this.config.host = cfg.testHost;
    }
  } catch (err) {
    console.error(err.message);
  }

};

wapp.prototype.checkCode = function (filename, ctext) {
  try {
    let testcode = `'use strict';
                let w = {ext:{},hooks:[],events:{},config:{},__ext__:{},};let alert = () => {};
                let notify = () => {};
                let window = {}; let document={};let exports = {};let require = async function () {};
                \nasync () => {${ctext}};`;

    let t = Function(testcode);
    console.log(filename, 'ok');
  } catch (err) {
    console.error('--CHECK-CODE:', filename, err);
    delayOutError(err, filename);
  }
};

wapp.prototype.fmtPageHTML = function (ht, pagename) {
  ht = ht.replace(/<!DOCTYPE html>/ig, '');
  ht = ht.replace('<html>', '');
  ht = ht.replace('</html>', '');
  ht = ht.replace('<body>', '');
  ht = ht.replace('</body>', '');
  ht = ht.replace('<head>', '');
  ht = ht.replace('</head>', '');
  ht = ht.replace('<meta>', '');
  ht = ht.replace(/<script>/g, '');
  ht = ht.replace(/<\/script>/g, '');

  //匹配onclick ondblclick 等事件属性，前面必须有空格，否则会引起错误，比如button class=""
  //因为onsubmit="return false;"等类似的形式，会导致处理错误，这需要引入语法分析，所以暂时注释了。
  //页面中，需要明确带上self.表示是页面对应的操作函数。
  ht = ht.replace(/ on[^(=|"|'|;)]+="[^"]+"/g, m => {
    let sp = m.split('=');
    let fstr = sp[1].substring(1, sp[1].length-1);
    let retFalse = '';

    if (fstr.indexOf('self.') != 0 && fstr.indexOf(' ') < 0 && fstr.indexOf('w.') != 0) {
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

    if (fstr.indexOf('self.') != 0 && fstr.indexOf('w.') != 0) {
      fstr = `w.pages.${pagename}.${fstr}(this);`;
      if (sp[0] === ' onsubmit') {
        return `${sp[0]}="${fstr}return false;"`;
      }
      return `${sp[0]}=${fstr}`;
    }

    return m;
  });

  let p = 0;

  let replaceSelf = (from, qs='"') => {
    p = ht.indexOf(from);
    while (p >= 0) {
      ht = ht.replace(from, `=${qs}w.pages.${pagename}.`);
      p = ht.indexOf(from, p + 10);
    }
  }

  replaceSelf('="self.');
  replaceSelf("='self.", "'");
  replaceSelf('=self.', '');

  return ht;
};

wapp.prototype.replaceCssUrl = function (codetext) {

  let replace_src = (url) => {
    if ((/^http[s]?:\/\//).test(url)) {
      return url;
    }

    if (this.isbuild) {
      return `${this.buildPrePath}/${url}`.replace(/\/{2,}/ig, '/');
    }

    return `${this.pageUrlPath}/${url}`.replace(/\/{2,}/ig, '/');
  };

  let match_replace = m => {
    let url = m.substring(5, m.length-1);
    return `url(${replace_src(url)})`;
  };

  codetext = codetext.replace(/url\([^\(]+\)/g, match_replace);

  return codetext;
};

wapp.prototype.replaceSrc = function (codetext) {

  let replace_src = (url) => {
    if ((/^http[s]?:\/\//).test(url)) {
      return url;
    }

    if (url.trim().indexOf('${') == 0) {
      return url;
    }

    if (this.isbuild) {
      return `${this.buildPrePath}/${url}`.replace(/\/{2,}/ig, '/');
    }

    return `${this.pageUrlPath}/${url}`.replace(/\/{2,}/ig, '/');

  };

  let match_replace = m => {
    let url = m.substring(5, m.length-1);
    return `src="${replace_src(url)}"`;
  };

  codetext = codetext.replace(/src="[^"]+"/g, match_replace);

  codetext = codetext.replace(/src='[^']+'/g, match_replace);

  return codetext;

};

wapp.prototype.loadPage = function (pagefile, htmlfile, cssfile, pagename) {
  try {
    this.pagesCode += '\n';
    let ctext = fs.readFileSync(pagefile, {encoding: 'utf8'});
    this.checkCode(pagefile, ctext);
    this.pagesCode += `;(function(exports){${ctext}})(w.pages);`;
  } catch (err) {
    delayOutError(err, '--LOAD-PAGE--');
    delayOutError('有错误或不存在，请检查', pagefile);
  }

  try {
    fs.accessSync(htmlfile);
    let htext = fs.readFileSync(htmlfile, {encoding: 'utf8'});
    htext = this.fmtPageHTML(htext, pagename);
    this.pagesCode += `;w.pages.${pagename}.orgHTML=\`${htext}\`;`;
  } catch (err) {
    delayOutError(err, '--LOAD-PAGE--');
  }

  try {
    fs.accessSync(cssfile);
    let csstext = fs.readFileSync(cssfile, {encoding: 'utf8'});
    csstext = this.replaceCssUrl(csstext);
    //console.log(csstext);
    this.cssCode += csstext;
  } catch (err) {
    //console.error(err.message);
  }

};

wapp.prototype.libCode = '';

/**
 * 
 * lib目录中的文件以!开头不加载。
 * @param {string} libdir 
 */
wapp.prototype.loadLib = function (libdir) {
  try {
    let kn = '';
    let names = [];
    let flist = fs.readdirSync(libdir, {withFileTypes: true});
    for (let f of flist) {
      if (!f.isFile()) continue;
      
      if (f.name[0] === '!' || f.name.substring(f.name.length - 3) !== '.js')
          continue;
      
      names.push(f.name);
    }

    let orgdata;

    for (let n of names) {
      orgdata = fs.readFileSync(`${libdir}/${n}`, 'utf8') + '\n';
      this.checkCode(`${libdir}/${n}`, orgdata);
      this.libCode += `;(function(exports){${orgdata}})(window);`;
    }

  } catch (err) {
    delayOutError(err, '--LIB-CODE--');
  }
};

wapp.prototype.loadExt = async function (cdir) {
  try {
    let data = '';
    let orgdata = '';

    if (this.config.extends === '*'
      || (this.config.extends.length > 0 && this.config.extends[0] === '*') )
    {
      let flist = fs.readdirSync(`${cdir}`, {withFileTypes: true})
      this.config.extends = []

      for (let f of flist) {
        if (!f.isFile() || f.name.substring(f.name.length - 3) !== '.js')
          continue;

        if (f.name[0] === '!') continue;

        this.config.extends.push(f.name.substring(0, f.name.length - 3));
      }
    }
    
    let names = this.config.extends;

    for (let i=0; i < names.length; i++) {

      try {
        orgdata = fs.readFileSync(`${cdir}/${names[i]}.js`, 'utf8') + '\n';
        
        this.checkCode(`${cdir}/${names[i]}.js`, orgdata);

        this.extends += `;((async function(exports){${orgdata}})(w.ext)).catch(err=> {console.error(err);});`;
      } catch (err) {
        console.error(err.message);
      }
    }

    //进行src替换处理
    this.extends = this.replaceSrc(this.extends);

    if (this.forceCompress || this.config.debug === false || (this.isbuild && this.config.buildCompress)){
      data = await terser.minify(this.extends);
      if (data.error) {
        console.error(data.error);
      } else {
        this.extends = data.code;
      }
    }

  } catch (err) {
    console.error(err.message);
  }
};

/**
 * 一个组件是一个目录，其中包括和目录同名的.js文件、explain.json文件、.html文件，若html文件不存在则表示不存在template。
 * explain.json文件描述组件的类名和组件名称，以及相关其他描述，其属性如下：
 *  - name 组件名称
 *  - className 类名称
 *  - detail 相关的详细描述
 * @param {string} cdir 
 */

wapp.prototype.loadComps = async function (cdir) {
  try {
    let data = '';
    let orgdata = '';

    if (this.config.components === '*'
      || (this.config.components.length > 0 && this.config.components[0] === '*') )
    {
      let flist = fs.readdirSync(`${cdir}`, {withFileTypes: true})

      this.config.components = []

      for (let f of flist) {
        if (!f.isDirectory()) continue;

        if (f.name[0] === '!') continue;

        this.config.components.push(f.name.substring(0, f.name.length - 3));
      }
    }
    
    let names = this.config.components;
    let cex;
    let opts = '';
    let tempdata = '';

    for (let i=0; i < names.length; i++) {

      //检测组件是否存在相关文件。
      try {
        fs.accessSync(`${cdir}/${names[i]}/explain.json`);
        fs.accessSync(`${cdir}/${names[i]}/${names[i]}.js`);
        cex = require(`${cdir}/${names[i]}/explain.json`);
      } catch (err) {
        delayOutError(err, '检测组件文件是否存在', 1234);
      }

      tempdata = '';
      try {
        fs.accessSync(`${cdir}/${names[i]}/template.html`);
        tempdata = fs.readFileSync(`${cdir}/${names[i]}/template.html`, {encoding: 'utf8'});
        if (!htmlparser.parse(tempdata)) {
          delayOutError(htmlparser.lastErrorMsg, `语法检测：${names[i]}/template.html`);
        } else {
          this.templates += tempdata.replace(/<!--(.|[\r\n])*?-->/mg, '');
        }
      } catch (err) {}

      try {
        orgdata = fs.readFileSync(`${cdir}/${names[i]}/${names[i]}.js`, 'utf8') + '\n';
        
        this.checkCode(`${cdir}/${names[i]}.js`, orgdata);

        opts = '';
        if (cex.options && cex.options.extends) {
          opts = `,{extends: '${cex.options.extends}'}`;
        }

        this.components += `${orgdata};customElements.define('${cex.name}', ${cex.className}${opts});`;
      } catch (err) {
        console.error(err.message);
      }
    }

    //进行src替换处理
    this.components = this.replaceSrc(this.components);

    if (this.forceCompress || this.config.debug === false || (this.isbuild && this.config.buildCompress)){
      data = await terser.minify(this.components);
      if (data.error) {
        console.error(data.error);
      } else {
        this.components = data.code;
      }
    }

  } catch (err) {
    console.error(err.message);
  }
};

wapp.prototype.makeApp = async function (appdir = '', isbuild = false) {

  let pdir = appdir || this.config.pagedir;

  let pathname = '';
  for (let i = pdir.length - 1; i >= 0; i--) {
    if (pdir[i] === '/' || pdir[i] === '\\') {
      break;
    }
    pathname = `${pdir[i]}${pathname}`;
  }

  try {
    let cfgfile = `${pdir}/config.json`;
    fs.accessSync(cfgfile);
    this.loadConfig(cfgfile, isbuild);
  } catch (err) {
    console.error(err);
    throw err;
  }

  await this.init();

  this.config.prepath = this.pageUrlPath;

  if (isbuild) {
    this.config.prepath = this.buildPrePath;
    this.config.debug = false;
  }

  if (this.config.prepath.length > 0) {
    let lend = this.config.prepath.length - 1;
    if (this.config.prepath[lend] === '/')
      this.config.prepath = this.config.prepath.substring(0, lend);
  }

  try {
    fs.accessSync(`${pdir}/app.css`);
    let appcss = fs.readFileSync(`${pdir}/app.css`, {encoding: 'utf8'}) + '\n';
    appcss = this.replaceCssUrl(appcss);
    this.cssCode += appcss;
  } catch(err){}

  try {
    fs.accessSync(`${pdir}/_extends`, fs.constants.F_OK);
    await this.loadExt(`${pdir}/_extends`);
  } catch (err){
    console.error(err);
  }

  try {
    fs.accessSync(`${pdir}/_components`, fs.constants.F_OK);
    await this.loadComps(`${pdir}/_components`);
  } catch (err){
    console.error(err);
  }

  if (this.templates.length > 0) {
    this.templates = this.replaceSrc(this.templates);
    this.templates = this.replaceCssUrl(this.templates);
  }

  try {
    await this.loadLib(`${pdir}/_lib`);
  } catch (err) {
    console.error(err);
  }

  let hookData = '';
  for (let h of this.config.hooks) {
    try {
      hookData = fs.readFileSync(`${pdir}/_hooks/${h}.js`,'utf8') + '\n';
      
      this.hooksText += `;w.hooks.push('${h}');(async function(exports){${hookData}})(w.hookFunc);`;
    } catch (err) {
      console.error(err.message);
    }
  }

  if (this.hooksText.length > 0) {
    if (this.config.debug === false || this.forceCompress || (this.isbuild && this.config.buildCompress)) {
        hookData = await terser.minify(this.hooksText);
        if (hookData.error) {
          console.error(hookData.error);
        } else {
          this.hooksText = hookData.code;
        }
    }
  }

  if (this.libCode.length > 0) {
    if (this.forceCompress || (this.isbuild && this.config.buildCompress)) {
      let libCodeCompress = await terser.minify(this.libCode);
      if (libCodeCompress.error) {
        console.error(libCodeCompress.error);
      } else {
        this.libCode = libCodeCompress.code;
      }
    }
  }

  let makeRealSrc = (url) => {
    if ((/^http[s]?:\/\//i).test(url)) {
      return url;
    }

    let prepath = pathname;

    if (isbuild) {
      prepath = this.config.buildPrePath;
    }

    if (prepath.length > 0 && prepath[prepath.length - 1] !== '/' && url[0] !== '/') {
      prepath += '/';
    }

    if (prepath.length > 0 && prepath[0] !== '/') {
      prepath = `/${prepath}`;
    }

    return `${prepath}${url}`;
  };

  if (this.config.jsurl) {
    if (typeof this.config.jsurl === 'string') {
      this.config.jsurl = [this.config.jsurl];
    }

    for (let j of this.config.jsurl) {
      this.jstext += `<script src="${makeRealSrc(j)}"></script>`;
    }

  }

  if (this.config.jsbottom) {
    if (typeof this.config.jsbottom === 'string') {
      this.config.jsbottom = [ this.config.jsbottom ];
    }

    for (let jb of this.config.jsbottom) {
      this.jsbottom += `<script src="${makeRealSrc(jb)}"></script>`;
    }
  }

  //load css file for link
  if (this.config.cssurl) {
    if (typeof this.config.cssurl === 'string') {
      this.config.cssurl = [this.config.cssurl];
    }

    for (let  c of this.config.cssurl) {
      this.csstext += `<link href="${makeRealSrc(c)}" rel="stylesheet">`;
    }
  }

  for (let page of this.config.pages) {
    this.loadPage(
      `${pdir}/${page}/${page}.js`,
      `${pdir}/${page}/${page}.html`,
      `${pdir}/${page}/${page}.css`,
      page
    );
  }

  //进行src替换处理
  this.pagesCode = this.replaceSrc(this.pagesCode);

  //压缩页面
  if (this.forceCompress || this.config.debug === false || (this.isbuild && this.config.buildCompress)) {
    let data = await terser.minify(this.pagesCode + '\n');
    if (data.code === undefined) {
      console.error(data.error);
    } else {
      this.pagesCode = data.code;
    }
  }

  return this.compile();

};

/**
 * @param {string} appname app的目录名字
 * @param {string} bdir 构建app的目标目录
 */
wapp.prototype.build = async function (appdir, appname = '') {
  
  this.isbuild = true;

  let data = await this.makeApp(appdir, true);

  try {
    fs.writeFileSync(`${appdir}/${appname || 'index'}.html`, data, {encoding:'utf8'});
  } catch (err) {
    err && console.error(err);
  }
};

wapp.prototype.newPage = function (name, pagedir) {
  
  let html = `exports.${name} = new function () {

  this.onload = function (c) {
  
  };

  this.onshow = function (c) {

  };

  this.onhide = function () {

  };

  this.onunload = function () {

  };

  this.onbottom = function () {

  };

  this.onscroll = function (scrollTop, clientHeight, scrollHeight) {

  };

  this.ontop = function () {

  };

  this.onresize = function () {

  };

};`;

  let pdir = `${pagedir}/${name}/`;
  let pagefile = `${pagedir}/${name}/${name}.js`;
  let htmlfile = `${pagedir}/${name}/${name}.html`;
  let cssfile = `${pagedir}/${name}/${name}.css`;

  try {
    fs.accessSync(pdir);
  } catch (err) {
    console.log('创建目录：'+pdir);
    fs.mkdirSync(pdir);
  }

  try {
    fs.accessSync(pagefile);
  } catch (err) {
    console.log('创建文件：'+pagefile);
    fs.writeFileSync(pagefile, html, {encoding:'utf8'});
  }

  try {
    fs.accessSync(htmlfile);
  } catch (err) {
    console.log('创建文件：'+htmlfile);
    fs.writeFileSync(htmlfile, `<div>This is ${name} page.</div>`, {encoding:'utf8'});
  }
  
  try {
    fs.accessSync(cssfile);
  } catch (err) {
    console.log('创建文件：'+cssfile);
    fs.writeFileSync(cssfile, '/**CSS文件，建议在样式名前面统一加上页面名称**/', {encoding:'utf8'});
  }
  
};

function checkCompsName (cname) {
  cname = cname.trim();
  if (cname.length < 3) return false;

  if (cname.indexOf('-') < 0) return false;

  if (!(/^[a-z]/i).test(cname)) return false;

  return true;
}

function fmtCompsClassName (cname) {
  let namearr = []

  let end = cname.length - 1;

  for (let i = 0; i < cname.length; i++) {
    if (cname[i] === '-' && i < end && (/[a-z]/i).test(cname[i+1])) {
      namearr.push(cname[i+1].toUpperCase());
      i += 1;
    } else {
      namearr.push(cname[i])
    }
  }

  return namearr.join('');
};

function renderExplainJSON (cname) {
  let className = fmtCompsClassName(cname);
  return `{
    "name" : "${cname}",
    "className" : "${className}",
    "detail" : "..."
}`;
}

function renderCompsClass (cname) {
  let className = fmtCompsClassName(cname);

  return `'use strict';
class ${className} extends Component {

  constructor () {
    super();

  }

  init () {

  }

  //返回字符串或DOM节点。
  render () {
    return '${cname}组件';
  }

  onLoad () {

  }

  onRemove () {

  }

  onAttrChange (name, oldValue, newValue) {

  }

  onAdopted () {

  }


}`;

}

wapp.prototype.newComps = function (cname, cdir) {

  if (!checkCompsName(cname)) {
    console.error(`${cname} 不符合要求，至少3字符长度，字母开头，包含 - 。`);
    return false;
  }

  let compsdir = `${cdir}/_components/${cname}`;

  try {
    fs.accessSync(compsdir)
    console.error(`${cname} 组件已存在。`);
    return false;
  } catch (err) {
    
  }

  fs.mkdirSync(compsdir);

  fs.writeFileSync(`${compsdir}/explain.json`, renderExplainJSON(cname), {encoding: 'utf8'});

  fs.writeFileSync(`${compsdir}/${cname}.js`, renderCompsClass(cname), {encoding: 'utf8'});

  return true;

};

//new project

wapp.prototype.newProject = function (project_dir) {
  try {
    fs.accessSync(project_dir);
    console.log(project_dir, '已经存在，如果需要重新创建，可以删除此目录或重命名。');
    return false;
  } catch (err) {

  }

  try {
    fs.mkdirSync(project_dir);
  } catch (err) {
    console.error(err);
    return false;
  }

  let new_project_dir = __dirname + '/newproject';

  let cpfiles = ['app.css', 'config.json', 'favicon.ico'];

  for (let i = 0; i < cpfiles.length; i++) {
    try {
      fs.copyFileSync(`${new_project_dir}/${cpfiles[i]}`, `${project_dir}/${cpfiles[i]}`);
    } catch (err) {
      console.error(err.message);
    }
  }

  let loopcp = [
    '_components', '_extends', '_hooks', '_static', 'home', 'user', 'test',
    '_static/css', '_static/icon', 'list', '_lib', '_components/u-card'
  ];

  for (let i = 0; i < loopcp.length; i++) {
    try {
      fs.mkdirSync(`${project_dir}/${loopcp[i]}`);
    } catch (err) {
      console.error(err.message);
    }
  }

  let copyFile = (dname, dest) => {
    let flist = fs.readdirSync(dname, {withFileTypes:true});
    for (let i = 0; i < flist.length; i++) {
      if (!flist[i].isFile()) {
        continue;
      }

      try {
        fs.copyFileSync(`${dname}/${flist[i].name}`, `${dest}/${flist[i].name}`);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  for (let i=0; i < loopcp.length; i++) {
    try {
      fs.accessSync(`${new_project_dir}/${loopcp[i]}`, fs.constants.F_OK);
    } catch (err) {
      console.error(err.message);
      continue;
    }

    copyFile(`${new_project_dir}/${loopcp[i]}`, `${project_dir}/${loopcp[i]}`);
  }

};

module.exports = wapp;
