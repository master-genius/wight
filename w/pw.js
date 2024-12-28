'use strict';

const fs = require('fs');
const terser = require('terser');
const csso = require('csso');
const htmlstate = require('./htmlstate.js');
const path = require('path');
const zipdata = require('zipdata');
const ssecode = require('./ssecode.js');

const fsp = fs.promises;

const htmlparser = new htmlstate();

function delayOutError(err, info, delay = 1280) {
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

function simpleComporessHTML (html) {
  return html.replace(/\/\*(.|[\r\n])*?\*\//mg, '')
            .replace(/>[\s]+/g, '>')
            .replace(/[\s]+</g, '<')
            .replace(/;[\r\n][\s]+/g, ';')
            //.replace(/\}[\s]+/g, '}')
            //.replace(/\{[\s]+/g, '{')
            //.replace(/>[\s]+</g, '><')
}

/**
 * 要根据pages记录的页面去指定的目录中加载页面，并生成一些初始化的代码。
 */
let _pw_dir = __dirname;

let wapp = function (options = {}) {

  if (!(this instanceof wapp) ) {
    return new wapp(options);
  }

  this.mydir = _pw_dir;

  this.codeTempPath = this.mydir + '/temp';

  try {
    fs.accessSync(this.codeTempPath)
  } catch(err) {
    fs.mkdirSync(this.codeTempPath)
  }
  
  this.errorCount = 0;

  this.pageUrlPath = '/';

  this.defaultVersion = '3.6';

  this.version = '3.6';

  this.usedVersion = this.version;

  this.forceCompress = false;

  this.debug = false;

  this.buildInApp = true;
  this.lockBuildInApp = false;

  this.config = {
    buildInApp: true,
    lang: '',
    manifest: '',
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
    componentCss: {},
    componentReplaceSrc: [],
    extends: [],
    exts: [],
    iconPath: '/favicon.ico',
    asyncPage: false,
    metaDescription: '',
    metaKeywords: '',
    //使用模板的页面
    templatePages: {}
  };

  this.builtinExtends = [
    'htmltag', 'apicall', 'ejson', 'djson', 'confirm',
    'pushStart', 'querybind', 'renders', 'storageEvent'
  ]

  this.jch = {
    css : '',
    js  : '',
    orgjs: ''
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
      this.usedVersion = this.defaultVersion;
      wdir = `${this.mydir}/v${this.defaultVersion}`;
    }

    this.jch.css += fs.readFileSync(`${wdir}/w.css`, {encoding: 'utf8'});
    this.jch.js = fs.readFileSync(wdir + '/w.js', {encoding: 'utf8'});
    this.jch.orgjs = this.jch.js;

    if (this.forceCompress || this.config.debug === false || (this.isbuild && this.config.buildCompress)) {
      let data = await terser.minify(this.jch.js+'\n');
      if (data.code === undefined) {
        console.error(data.error);
      } else {
        this.jch.js = data.code;
      }
    }

    let ds = this.pageUrlPath[this.pageUrlPath.length - 1] === '/' ? '' : '/';

    if (!this.isbuild) {
      this.iconlink = `<link href="${this.pageUrlPath}${ds}favicon.ico" rel="icon" type="image/x-icon">`;
    } else if (this.isbuild && this.config.iconPath) {
      this.iconlink = `<link rel="icon" href="${this.config.iconPath}" type="image/x-icon">`;
    }

    this.manifest = '';

    if (this.config.manifest) {
      if (typeof this.config.manifest === 'boolean') {
        this.manifest = `<link rel="manifest" href="${this.pageUrlPath}${ds}manifest.json">`;
      } else {
        this.manifest = `<link rel="manifest" href="${this.config.manifest}">`;
      }
      
    }

  };

  if (typeof options === 'object') {
    for (let k in options) {
      switch (k) {
        case 'buildInApp':
          this.buildInApp = !!options[k];
          this.lockBuildInApp = true;
        case 'debug':
          this.debug = !!options[k];
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
  this.sseCode = '';
  this.appInitCode = '';
  this.compsCssCode = '';
  //构建时，打包到应用内部的css代码。
  this.buildCssCode = '';
  this.w_script_src = '';
  this.componentReplaceRegex = '';

  this.oid = Math.random().toString(16).substring(2);

  /**
   * Object.defineProperty(w, 'prepath', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: '${this.config.prepath}'
    });
   */

  this.compile = function () {
    let closePromptText = `
      window.addEventListener('beforeunload', (e) => {
        for (let k in w.pages) {
          if (w.pages[k].onbeforeunload && typeof w.pages[k].onbeforeunload === 'function') {
            w.pages[k].onbeforeunload();
          }
        }
      }, {capture:true});
      window.addEventListener('beforeunload', (e) => { return e.returnValue = '退出应用？';});
      window.addEventListener('pagehide', (evt) => {if (evt.persisted) {} return '退出?';});
      window.addEventListener('unload', (evt) => { w.destroyAllPage(); });
    `;

    if (this.config.closePrompt === false) {
      closePromptText = `
        window.addEventListener('beforeunload', (e) => {
          for (let k in w.pages) {
            if (w.pages[k].onbeforeunload && typeof w.pages[k].onbeforeunload === 'function') {
              w.pages[k].onbeforeunload();
            }
          }
        }, {capture:true});
        window.addEventListener('unload', (evt) => { w.destroyAllPage(); });
      `;
    }

    return `<!DOCTYPE html><html${this.config.lang}>
<head>
  <title id="app-title">${this.config.title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,user-scalable=no">
  ${this.config.metaDescription}
  ${this.config.metaKeywords}
  ${this.iconlink}
  ${this.manifest}
  ${this.csstext}
  <style>
    ${csso.minify(this.buildCssCode+'\n').css}
    ${csso.minify(this.jch.css+'\n').css}
    ${csso.minify(this.cssCode+'\n').css}
  </style>
  <style>a{outline:none;text-decoration: none;}</style>
    ${this.jstext}${this.config.buildInApp ? '' : this.w_script_src}
    ${this.config.buildInApp ? '<script>' + this.jch.js + '</script>' : ''}
</head>
<body style="overflow-x:hidden;overflow-wrap:break-word;">
  <div id="w-pages-container-${this.oid}"></div>
  <div id="w-templates-${this.oid}">${this.templates}</div>
  <div id="w-interface-${this.oid}"></div>
  <script>
    'use strict';
    w.pgcdom = document.querySelector('#w-pages-container-${this.oid}');
    w.interfacedom = document.querySelector('#w-interface-${this.oid}');
    w.__templatedom__ = document.querySelector('#w-templates-${this.oid}');
    if (!w.__templatedom__) {
      w.notifyTopError('无法获取template容器节点');
    }
    w.pageNameList = ["${this.config.pages.join('","')}"];
    w.host = '${this.config.host}';
    window.__prepath__ = w.prepath = '${this.config.prepath}';
    w.homepage = '${this.config.pages[0]}';
    w.__title__ = '${this.config.title}';
    w.curTitle = '${this.config.title}';
    w.debug = ${this.config.debug ? 'true' : 'false'};
    w.dev = ${this.config.test ? 'true' : 'false'};

    w.tabs.list = ${JSON.stringify(this.config.tabs)};
    w.tabs.pages = ${JSON.stringify(this.config.tabsPages)};
    w.tabs.pageIndex = ${JSON.stringify(this.config.tabsPageIndex)};
    w.tabs.background = '${this.config.tabsBackground}';
    w.tabs.selectedBackground = '${this.config.tabsSelectedBackground}';
    Object.defineProperty(w, '__replace_src_regex__', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: ${this.componentReplaceRegex.toString()||'null'}
    });

    window.alert = w.alert.bind(w);
    window.unalert = w.unalert.bind(w);
    window.alertError = w.alertError.bind(w);
    window.notify = w.notify.bind(w);
    window.notifyError = w.notifyError.bind(w);
    window.prompt = w.prompt.bind(w);
    window.unprompt = w.unprompt.bind(w);
    window.unpromptMiddle = w.unpromptMiddle.bind(w);
    window.unpromptTop = window.unpromptMiddle;
    window.notifyTop = w.notifyTop.bind(w);
    window.notifyTopError = w.notifyTopError.bind(w);
    window.notifyOnly = w.notifyOnly.bind(w);
    window.unnotify = w.unnotify.bind(w);
    window.promptMiddle = w.promptMiddle.bind(w);
    window.promptTop = w.promptTop.bind(w);
    window.promptGlass = w.promptGlass.bind(w);
    window.promptTopGlass = w.promptTopGlass.bind(w);
    window.promptTopDark = w.promptTopDark.bind(w);
    window.promptMiddleGlass = w.promptMiddleGlass.bind(w);
    window.promptDark = w.promptDark.bind(w);
    window.promptMiddleDark = w.promptMiddleDark.bind(w);
    window.cover = w.cover.bind(w);
    window.uncover = w.uncover.bind(w);
    window.alertDark = w.alertDark.bind(w);
    window.coverDark = w.coverDark.bind(w);
    window.cancelAlert = w.cancelAlert.bind(w);
  </script>
  <script>'use strict';${this.extends}</script>
  <script>'use strict';${this.components}</script>
  <script>'use strict';${this.hooksText}</script>
  <script>'use strict';${this.pagesCode}</script>
  <script>'use strict';${this.appInitCode}</script>
  <script>
  'use strict';

  window.addEventListener('load', async function () {
    let dms = [
      'coverdom','notifydom','alertdom', 'slidedom', 'alertcoverdom', 'notifytopdom',
      'tabsdom','tabsmenudom', 'historydom','slidexdom', 'navibtndom', 'promptdom', 'promptclosedom', 'promptmiddledom', 'promptmiddleclosedom',
    ];

    for (let i=0; i<dms.length; i++) {
      Object.defineProperty(w, dms[i], {
        enumerable: false,
        writable: false,
        value: w.interfacedom.insertBefore(
          document.createElement('div'),
          w.interfacedom.firstChild
        )
      });
    }

    ${this.config.asyncPage ? 'await new Promise(rv => {setTimeout(rv, 5);});' : ''}

    w.initPage();

    if (w.tabs.list.length > 0) {
      w.tabsmenudom.className = 'w-tabbar-row-x';
      w.tabsmenudom.background = '${this.config.tabsBackground}';
      w.tabsmenudom.innerHTML = \`${this.tabsHTML}\`;
    }
  });

  window.addEventListener('pageshow', async function() {
    await new Promise(rv => {setTimeout(() => {rv();}, 35);});
    if (w.init && typeof w.init === 'function') {
      try{await w.init();}catch(err){alertError(err.message);console.error(err)}
    }
    if (w.tabs.list.length > 0 && w.tabs.pageIndex[w.homepage] !== undefined && location.hash.length < 2)
    {
      w.switchTab(w.homepage);
    } else {
      w.listenHash();
    }
  });

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

  window.addEventListener('hashchange', async function(e) {
    if (w.hashchange && typeof w.hashchange === 'function') {
      if (w.hashchange(e) === false) {
        return;
      }
    }

    await new Promise((rv, rj) => { setTimeout(rv, 9); });

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
  });

  window.addEventListener('scroll', function (){w.events.scroll();});
  window.addEventListener('resize', function (){w.events.resize();});
  ${closePromptText}
  ;(()=>{ w.__components_css__=${JSON.stringify(this.config.componentCss)};w.__css_code_map__=${this.compsCssCode}; })();
  </script>
  ${this.sseCode}
  ${this.jsbottom}
</body>
</html>`;
  }
  
};

wapp.prototype.loadConfig = function (cfgfile, isbuild = false) {

  let makeTabMenu = function (m, width, urlpath) {
    let mtext = `<div class="w-tabbar-row-cell" id="w-t-mmmm-${m.page}" onclick="w.switchTab('${m.page}');" name="${m.page}" style="width:${width}%;">`;
    
    if (m.icon && typeof m.icon === 'string' && m.icon.length > 0) {
      mtext += `<img data-url="${urlpath}" src="${urlpath}${m.icon}" style="max-height: 1.35rem;height:auto;width:auto;" name="${m.page}">`;
    }

    if (m.name && typeof m.name === 'string') {
      mtext += `<div name="${m.page}" style="box-sizing:border-box;font-size:81%;line-height:102%;padding-bottom:3.2px;padding-top:2px;">${m.name}</div>`;
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
          } else if (typeof cfg[k] === 'string' && cfg[k]) {
            this.getCssCode(cfg[k], true);
          }
          break;

        case 'pageAnimation':
          if (cfg[k] === true) {
            this.getCssCode('w-page-animation.css', true);
          } else if (cfg[k] === 'dropdown') {
            this.getCssCode('w-page-animation-dropdown.css', true);
          } else if (typeof cfg[k] === 'string' && cfg[k]) {
            this.getCssCode(cfg[k], true);
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

        case 'componentCss':
          if (typeof cfg[k] === 'object')
            this.config[k] = cfg[k];
          break;
        
        case 'componentReplaceSrc':
          if (Array.isArray(cfg[k])) {
            this.config[k] = cfg[k];
          }
          break;

        case 'lang':
          if (cfg[k] && typeof cfg[k] === 'string') {
            this.config.lang = ` lang="${cfg[k].replace(/[\'\"]/g,'').trim()}"`;
          }
          break;
        
        case 'description':
          if (cfg[k] && typeof cfg[k] === 'string') {
            this.config.metaDescription = `<meta name="description" content="${cfg[k].replaceAll('"', '')}">`;
          }
          break;

        case 'keywords':
          if (cfg[k]) {
            let kwdtext = Array.isArray(cfg[k]) ? cfg[k].join(',') : cfg[k];
            this.config.metaKeywords = `<meta name="keywords" content="${kwdtext.replaceAll('"', '')}">`;
          }
          break;

        case 'buildInApp':
          if (!this.lockBuildInApp)
            this.config[k] = !!cfg[k];
          break;

        case 'debug':
          //如果传参指定了开启调试模式，则选项不再生效
          if (!this.debug) {
            this.config.debug = !!cfg[k];
          }
          break;

        case 'templatePages':
          if (cfg[k] && typeof cfg[k] === 'object') {
            this.config.templatePages = cfg[k];
          }
          break;

        default:
          this.config[k] = cfg[k];
      }
    }
    if ((cfg.testHost || cfg.devHost) && this.config.test) {
      this.config.host = cfg.testHost || cfg.devHost;
    }
  } catch (err) {
    console.error(err.message);
  }

};

wapp.prototype.parseErrorStack = function (stack, linestart, filename) {
  let arr = stack.split('\n');

  if (arr.length <= 0) return stack;

  let ind = arr[0].length - 1;

  while (ind > 0) {
    if (arr[0][ind] === ':') break;
    ind--;
  }

  let linenumber = parseInt(arr[0].substring(ind+1).trim());

  if (isNaN(linenumber) ) return stack;

  let n = linenumber - linestart - 1;

  let narr = [ `${filename}:${n}` ];

  for (let i = 1; i < arr.length; i++) {
    narr.push(arr[i]);
    if (arr[i].indexOf('SyntaxError') >= 0 || (/.*Error/ig).test(arr[i])) break;
  }

  return narr.join('\n');

}

//如果Function检测出现错误，这说明存在语法问题。此时为了更精确的得到问题代码，利用require的方式来打包代码进行检测。
wapp.prototype.requireCheckCode = function (filename, ctext, options = {}) {
  let requireFile = `${this.codeTempPath}/__require_module__.js`;

  let initRequireEnv = () => {
    return `let require = async function (name) {
      try {
        if (w.__ext__[name]) return w.__ext__[name];
        
        let loop = w.__require_loop__;
    
        for (let i = 0; i < loop; i++) {
          await new Promise((rv) => {
            setTimeout(() => { rv(); }, 2);
          });
    
          if (w.__ext__[name]) return w.__ext__[name];
        }
    
        return function () {};
      } catch (err) {
        console.error(err.message);
      }
    };`;
  }

  let globalBind = () => {
    return `for (let k in window) {
      globalThis[k] = window[k];
    }
    
    for (let k in window.globalThis) globalThis[k] = window(k);
    `;
  };

  let flag_tag = `;/* ${Math.random()} */;`;

  let pkgCode = `'use strict';\nconst {window,document,w,Component} = require('../webenv.js');`
              + `\n;(async (exports) => {\n${initRequireEnv()}\n`
              + `\n${flag_tag}\n${ctext}\n})(w.${options.exportsKey || 'ext'});`;

  let flagind = pkgCode.indexOf(flag_tag);
  let linestart = 0;
  for (let i = 0; i < flagind; i++) {
    if (pkgCode[i] === '\n') linestart += 1;
  }

  fs.writeFileSync(requireFile, pkgCode, {encoding: 'utf8'});

  let st = true;

  try {
    let r = require(requireFile);
    console.log(filename, 'ok');
  } catch (err) {
    this.errorCount += 1;
    st = false;
    if (err.stack !== undefined) {
      delayOutError(this.parseErrorStack(err.stack, linestart, filename), '');
    }
    else delayOutError(err, filename);
  }

  //检测后必须删除对应的缓存。
  delete require.cache[requireFile];
  delete require.cache[path.resolve(requireFile+'/../../webenv.js')];

  return st;
}

wapp.prototype.checkCode = async function (filename, ctext, options = {async: true}) {
  let asy = 'async';
  if (options.async === undefined) options.async = true;
  !options.async && (asy = '');

  //return this.requireCheckCode(filename, ctext, options);

  try {
    let testcode = `'use strict';
                let w = {ext:{},hooks:[],events:{},config:{},__ext__:{},};let alert = () => {};
                let notify = () => {}; let confirm = () => {}; function Component () {};
                let window = {}; let document={};let exports = {};let require = function (pkg) {};
                \n;(${asy} (exports) => {${ctext}})(w.ext);`;

    let t = Function(testcode);
    console.log(filename, 'ok');
  } catch (err) {
    //console.error('--CHECK-CODE:', filename, err);
    //delayOutError(err, filename);
    return this.requireCheckCode(filename, ctext, options);
  }
  return true;
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
  /* ht = ht.replace(/ on[^(=|"|'|;)]+="[^"]+"/g, m => {
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
  replaceSelf('=self.', ''); */

  return ht;
};

//检测页面是否使用模板
wapp.prototype.pageUseTemplate = function (name) {
  if (this.config.templatePages) {
    for (let k in this.config.templatePages) {
      let tp = this.config.templatePages[k]
      if (typeof tp === 'string') {
        if (k === '!*') {
          if (name === tp) return false;
        }

        if (tp === name || tp === '*') return k;
      } else if (Array.isArray(tp)) {
        if (k === '!*') {
          if (tp.indexOf(name) >= 0) return false;
        }
        if (tp.indexOf(name) >= 0) return k;
      }
    }
  }

  return false;
}

wapp.prototype.getTemplateData = function (appdir, template_name) {
  let tempfile = appdir + `/templatePages/${template_name}`

  if (template_name.lastIndexOf('.html') < 0) {
    tempfile = `${tempfile}.html`
  }

  try {
    return fs.readFileSync(tempfile, {encoding: 'utf8'})
  } catch (err) {
    this.debug && console.error(err);
    return false;
  }
}

wapp.prototype.makePageTemplateData = function (pagedata, tempdata) {
  if (!tempdata || typeof tempdata !== 'string') return pagedata;

  return tempdata.replaceAll('__WIGHT_PAGE__', pagedata);
}

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

wapp.prototype.replaceSrc = function (codetext, is_comps = false, comp_name = '', is_jscode=false) {

  if (is_jscode) return codetext;

  let replace_src = (url, plist, offset, text) => {
    if ((/^http[s]?:\/\//).test(url)) {
      return url;
    }

    let turl = url.trim();
    if (turl.indexOf('${') === 0) {
      return url;
    }

    //不做替换处理。
    if (turl[0] === '!') {
      return turl.substring(1).trim();
    }

    if (this.isbuild) {
      if (this.buildPrePath && turl.indexOf(this.buildPrePath) === 0) return turl;

      return `${this.buildPrePath}/${turl}`.replace(/\/{2,}/ig, '/');
    }

    if (turl.indexOf(this.pageUrlPath) === 0) return turl;

    return `${this.pageUrlPath}/${turl}`.replace(/\/{2,}/ig, '/');

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
    //return match_replace(m.replace(/ src\s+=\s+/g, ' src='));
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

  //如何替换组件的src：需要配置哪些组件是需要替换的。
  if (this.componentReplaceRegex) {
    codetext = codetext.replace(this.componentReplaceRegex, match_replace);
  }

  /* codetext = codetext.replace(
      /<(audio|embed|iframe|img|input|source|track|video)[^>]* src=[^\s]+ [^>]*>/g, 
      match_replace); */

  return codetext;

};

wapp.prototype.loadPage = async function (pagefile, htmlfile, cssfile, pagename, appdir='') {
  let pdir = appdir || this.config.pagedir

  let htext = '';

  try {
    fs.accessSync(htmlfile);
    htext = fs.readFileSync(htmlfile, {encoding: 'utf8'});

    //检测页面是否启用了模板
    let template_name = this.pageUseTemplate(pagename)
    if (template_name) {
      let tempdata = this.getTemplateData(pdir, template_name)
      if (tempdata) {
        htext = this.makePageTemplateData(htext, tempdata)
      }
    }

    if (!htmlparser.parse(htext)) {
      throw new Error(htmlfile + '\n    ' + htmlparser.lastErrorMsg)
    }

    htext = simpleComporessHTML(htext.replaceAll('`', ''));
    htext = this.fmtPageHTML(htext, pagename);
    htext = this.replaceSrc(htext, false, '', false);
  } catch (err) {
    delayOutError(err, '--LOAD-PAGE--');
    this.errorCount += 1;
  }

  try {
    this.pagesCode += '\n';
    let ctext = fs.readFileSync(pagefile, {encoding: 'utf8'});

    if (this.config.asyncPage) {
      ctext = this.replaceRequire(ctext);
    }

    await this.checkCode(pagefile, ctext, {async: this.config.asyncPage});

    this.replaceSrc(ctext, false, '', true);

    this.pagesCode += `;(${this.config.asyncPage ? 'async ' : ''}`
      + `function(definePage,exports){${ctext};exports['${pagename}'].orgHTML=\`${htext}\`;})`
      + `(w.__bindpage__('${pagename}'),w.pages);`;
  } catch (err) {
    delayOutError(err, '--LOAD-PAGE--');
    delayOutError('有错误或不存在，请检查', pagefile);
    this.errorCount += 1;
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

// replace <- to await require
wapp.prototype.replaceRequire = function (ctext) {
  return ctext.replace(/\=[\s]{0,}<-[\s]{0,}\([\s]{0,}\'/ig, '= await require(\'')
              .replace(/\=[\s]{0,}<-[\s]{0,}\([\s]{0,}\"/ig, '= await require("')
              .replace(/\=[\s]{0,}<-[\s]{0,}\([\s]{0,}\`/ig, '= await require(`')
              .replace(/\=[\s]{0,}require[\s]{0,}\([\s]{0,}\'/ig, '= await require(\'')
              .replace(/\=[\s]{0,}require[\s]{0,}\([\s]{0,}\"/ig, '= await require("')
              .replace(/\=[\s]{0,}require[\s]{0,}\([\s]{0,}\`/ig, '= await require(`');
}

wapp.prototype.loadExt = async function (cdir) {
  let extend_name_preg = /^[a-z][a-z0-9\_\-\/]{0,100}(\.js)?$/i;
  try {
    let data = '';
    let orgdata = '';

    if (this.config.extends === '*' || this.config.extends[0] === '/*'
      || (this.config.extends.length > 0 
          && (this.config.extends[0] === '*'
              || this.config.extends[0] === '/*'
              || this.config.extends[0] === 'extends/*'
              || this.config.extends[0] === '/extends/*')
        )
    ){
      let flist = fs.readdirSync(`${cdir}`, {withFileTypes: true})
      this.config.extends = []

      for (let f of flist) {
        if (f.isDirectory()) {
          try {
            let subflist = fs.readdirSync(`${cdir}/${f.name}`, {withFileTypes: true})
            for (let a of subflist) {
              a.isFile() && flist.push({
                name: `${f.name}/${a.name}`,
                isFile:()=>{return true},
                isDirectory:()=>{return false}
              })
            }
          } catch (err) {
            delayOutError(err, 'load sub extends: ' + f.name)
          }
        }

        if (!f.isFile() || f.name.substring(f.name.length - 3) !== '.js')
          continue;

        if (f.name[0] === '!') continue;

        if (!extend_name_preg.test(f.name)) {
          console.error(`${f.name} 不是合法的扩展文件名字，请更改，允许字母数字下划线减号，字母开头。`);
          continue;
        }

        this.config.extends.push(f.name.substring(0, f.name.length - 3));
      }
    } else {
      let real_extends = []
      let subcount = 0
      for (let a of this.config.extends) {
        a = a.replaceAll('//', '/').trim()
        let ind = a.indexOf('/*')

        if (ind > 0) {
          let submod = a.substring(0, ind)
          try {
            let subflist = fs.readdirSync(cdir + '/' + submod, {withFileTypes: true})
            for (let f of subflist) {
              if (!f.isFile() || f.name.substring(f.name.length - 3) !== '.js') {
                continue
              }

              real_extends.push(submod + '/' + f.name.substring(0, f.name.length - 3))
            }
          } catch (err) {
            delayOutError(err, 'load sub extends: ' + submod)
          }
          continue
        }

        real_extends.push(
          a.substring(a.length - 3) === '.js' ? a.substring(0, a.length - 3) : a
        )
      }

      this.config.extends = real_extends
    }

    let need_push = [];
    this.builtinExtends.forEach(x => {
      if (this.config.extends.indexOf(x) < 0) {
        need_push.push(x);
      }
    });

    if (need_push.length > 0) {
      this.config.extends = this.config.extends.concat(need_push);
    }
    
    let names = this.config.extends;

    for (let i=0; i < names.length; i++) {

      if (!extend_name_preg.test(names[i])) {
        delayOutError(`${names[i]} 不是合法的扩展文件名字，请更改，允许字母数字下划线减号，字母开头。`, 'extends:');
        continue;
      }

      try {
        orgdata = fs.readFileSync(`${cdir}/${names[i]}.js`, 'utf8') + '\n';
        
        orgdata = this.replaceRequire(orgdata);

        await this.checkCode(`${cdir}/${names[i]}.js`, orgdata);

        this.extends += `;(async function(exports, module){${orgdata}})(w.ext, w.__module__('${names[i].replaceAll('\'', '').replaceAll('"','')}'));`;

      } catch (err) {
        console.error(err.message);
        this.errorCount += 1;
      }
    }

    //进行src替换处理
    this.extends = this.replaceSrc(this.extends, false, '', true);

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

wapp.prototype.buildCompsStatic = async function (cdir, names, stdir) {
  
  let d;
  let flist;
  let src = '';

  for (let a of names) {
    d = `${stdir}/${a}`;

    await fsp.access(d).then(async state => {
      let flist = await fsp.readdir(d);
      if (flist.length > 0) {
        //此目录存在文件则删除
        return fsp.rm(d, {recursive: true, force:true})
                  .catch(err => {
                    delayOutError(err, '删除旧的组件静态文件失败')
                  })
      }
    })
    .catch(err => {})

    await fsp.access(d).catch(err => {
      return fsp.mkdir(d);
    });

    src = `${cdir}/${a}/static`;

    try {
      flist = await fsp.readdir(src, {withFileTypes: true});
    } catch (err) {
      continue;
    }

    let sublist;
    for (let f of flist) {
      if (f.isDirectory()) {
        sublist = await fsp.readdir(src + '/' + f.name, {withFileTypes:true});
        for (let a of sublist) {
          if (!a.isFile())continue;
          try {
            await fsp.mkdir(d + '/' + f.name);
          } catch (err) {}
          await fsp.copyFile(src + '/' + f.name + '/' + a.name, d + '/' + f.name + '/' + a.name)
                    .catch(err => {
                      delayOutError(err, '复制组件静态文件出错：')
                    });
                      
        }
        continue;
      }
      if (!f.isFile()) continue;

      await fsp.copyFile(`${src}/${f.name}`, `${d}/${f.name}`)
                .catch(err => {
                    console.error(err);
                });
    }
    
  }

  try {
    let dlist = await fsp.readdir(stdir, {withFileTypes: true});
    let oldlist;

    for (let r of dlist) {
      if (!r.isDirectory()) continue;

      //删除不再启用的组件。
      if (names.indexOf(r.name) < 0) {
        await fsp.rm(`${stdir}/${r.name}`,{recursive:true}).catch(err => {
          console.error(err);
        });
        continue;
      }

      oldlist = await fsp.readdir(`${stdir}/${r.name}`, {withFileTypes: true});

      for (let o of oldlist) {
        await fsp.access(`${cdir}/${r.name}/static/${o.name}`)
          .catch(async err => {
            return await fsp.unlink(`${stdir}/${r.name}/${o.name}`);
          })
          .catch(err => {
            console.error(err);
          });
      }

    }
  } catch (err) {
    console.error('--CLEAR-COMPONETS-STATIC--', err);
  }

};

/**
 * 加载组件引入的css.
 * 此CSS代码通过变量存储，在加载组件时，自动创建style节点。
 */
wapp.prototype.loadCompsCss = async function (cdir, cssdir) {
  let csscodemap = {};
  let flist = [];
  let ctemp = '';
  let cssMap = {};
  let notGlobal = [];
  if (this.config.componentCss['!*'] !== undefined) {
    if (Array.isArray(this.config.componentCss['!*'])) {
      notGlobal = this.config.componentCss['!*'];
    } else if (typeof this.config.componentCss['!*'] === 'string') {
      notGlobal =[ this.config.componentCss['!*'] ];
    }
  }

  for (let k in this.config.componentCss) {
    flist = this.config.componentCss[k];
    if (typeof flist === 'string') {
      flist = [flist];
    }

    if (k === '!*') continue;

    if (k === '*') {
      for (let c of this.config.components) {
        if (!cssMap[c]) cssMap[c] = [];
        //如果配置了 !* 则查看是否此组件在不加载全局css的配置中。
        if (notGlobal.indexOf(c) >= 0) continue;

        for (let i = flist.length - 1; i>=0; i--) {
          //按照全局css顺序添加到已有css配置name的前面。如果在!*配置中则不会添加。
          if (cssMap[c].indexOf(flist[i]) < 0) {
            cssMap[c].unshift(flist[i]);
          }
        }
      }
      continue;
    }

    if (!cssMap[k]) cssMap[k] = [];
    for (let a of flist) {
      if (cssMap[k].indexOf(a) < 0)
        cssMap[k].push(a);
    }

  }

  this.config.componentCss = cssMap;

  for (let k in this.config.componentCss) {
    if (this.config.components.indexOf(k) < 0) {
      delete cssMap[k];
    }
  }

  /**
   * ---- componentCss:
    {
      'head-menu': [ 'mgrid.css', 'basic.css', 'concise.min.css', 'concise-ui.min.css' ],
      'user-info': [ 'mgrid.css', 'basic.css', 'concise.min.css', 'concise-ui.min.css' ],
      'doc-list': [ 'mgrid.css', 'basic.css', 'concise.min.css', 'concise-ui.min.css' ],
      'doc-content': [ 'mgrid.css', 'basic.css', 'concise.min.css', 'concise-ui.min.css' ],
      'x-app': [ 'mgrid.css', 'basic.css', 'concise.min.css', 'concise-ui.min.css' ],
      'x-test': [
        'mgrid.css',
        'basic.css',
        'concise.min.css',
        'concise-ui.min.css',
        './static/css/a.css'
      ]
    }
   */

  let makemapkey = (f, name) => {
    if (f.indexOf('./') === 0) return name + '/' + f;
    return f;
  }

  for (let k in this.config.componentCss) {
  
    if (this.config.components.indexOf(k) < 0) continue;

    flist = this.config.componentCss[k];

    if (!Array.isArray(flist)) continue;

    let css_key;
    for (let f of flist) {
      css_key = makemapkey(f, k);
      if (csscodemap[css_key]) continue;
      try {
        let css_pathfile = `${cssdir}/${f}`;
        //引入组件自己的css
        if (f.indexOf('./') === 0) css_pathfile = `${cdir}/${k}/${f}`;
        ctemp = fs.readFileSync(css_pathfile, {encoding: 'utf8'})
        ctemp = this.replaceCssUrl(ctemp)
        csscodemap[css_key] = csso.minify(ctemp).css
        //csscodemap[f] = encodeURIComponent(csso.minify(ctemp).css)
      } catch(err) {
        console.error(err)
      }
    }

  }
  
  this.compsCssCode = JSON.stringify(csscodemap);
};

/* wapp.prototype.loadOneComponent = async function (compdir, appdir) {

}
 */
/**
 * 一个组件是一个目录，其中包括和目录同名的.js文件、explain.json文件、.html文件，若html文件不存在则表示不存在template。
 * explain.json文件描述组件的类名和组件名称，以及相关其他描述，其属性如下：
 *  - name 组件名称
 *  - className 类名称
 *  - detail 相关的详细描述
 * @param {string} cdir 
 */
wapp.prototype.loadComps = async function (cdir, appdir) {
  try {
    fs.accessSync(cdir + '/@css');
  } catch (err) {
    fs.mkdirSync(cdir + '/@css');
  }

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

    //replace-src::this.config.components是最终解析后的数组。
    if (Array.isArray(this.config.componentReplaceSrc)) {
      let comarr = [];
      this.config.componentReplaceSrc.forEach(x => {
        if (this.config.components.indexOf(x) >= 0) {
          comarr.push(x);
        }
      });

      if (this.config.componentReplaceSrc.length !== comarr.length) {
        this.config.componentReplaceSrc = comarr;
      }

      if (this.config.componentReplaceSrc.length > 0) {
        this.componentReplaceRegex = new RegExp(`<(${this.config.componentReplaceSrc.join('|')})[^>]* src\\s*=\\s*"[^"]+"[^>]*>`, 'ig');
      }
    } else {
      this.config.componentReplaceSrc = [];
    }
    
    let names = this.config.components;
    let cex;
    let opts = '';
    let tempdata = '';

    //判断一个组件是否编译成模块
    let checkIfToModule = (name) => {
      let cmod = this.config.componentModule;

      if (cmod === true || (Array.isArray(cmod) && cmod.indexOf(name) >= 0)) {
        return true;
      }

      return false;
    };

    for (let i=0; i < names.length; i++) {
      //检测组件是否存在相关文件。
      try {
        fs.accessSync(`${cdir}/${names[i]}/explain.json`);
        fs.accessSync(`${cdir}/${names[i]}/${names[i]}.js`);
        cex = require(`${cdir}/${names[i]}/explain.json`);
      } catch (err) {
        delayOutError(err, '检测组件文件是否存在');
        this.errorCount += 1;
      }

      tempdata = '';
      try {
        fs.accessSync(`${cdir}/${names[i]}/template.html`);
        tempdata = fs.readFileSync(`${cdir}/${names[i]}/template.html`, {encoding: 'utf8'});
        if (!htmlparser.parse(tempdata)) {
          delayOutError(htmlparser.lastErrorMsg, `语法检测：${names[i]}/template.html`);
          this.errorCount += 1;
        } else {
          tempdata = tempdata.replace(/<!--(.|[\r\n])*?-->/mg, '');
          tempdata = this.replaceSrc(tempdata, true, names[i]);
          //检测是否有@import导入css文件，根据@import导入@css目录的css。
          //tempdata = this.replaceImportCss(tempdata, `${cdir}/${names[i]}`);

          //使用div包装模板。
          this.templates += `<div data-templateid="${cex.name}">${simpleComporessHTML(tempdata)}</div>`;
        }
      } catch (err) {
      
      }

      try {
        orgdata = fs.readFileSync(`${cdir}/${names[i]}/${names[i]}.js`, 'utf8') + '\n';
        
        orgdata = this.replaceRequire(orgdata);
        await this.checkCode(`${cdir}/${names[i]}.js`, orgdata);

        opts = '';
        if (cex.options && cex.options.extends) {
          opts = `,{extends: '${cex.options.extends}'}`;
        }

        orgdata = this.replaceSrc(orgdata, true, names[i], true);

        let comps_jscode = `;(async()=>{${orgdata};customElements.define('${cex.name}', ${cex.className}${opts});})();`;

        if (checkIfToModule(names[i])) {
          let mod_dir = `${appdir}/static/module`;
          try {
            fs.accessSync(mod_dir);
          } catch (err) {
            fs.mkdirSync(mod_dir);
          }

          let compress_jscode = comps_jscode;
          if (this.forceCompress || this.config.debug === false || (this.isbuild && this.config.buildCompress)){
            data = await terser.minify(comps_jscode);
            if (data.error) {
              console.error(data.error);
            } else {
              compress_jscode = data.code;
            }
          }
          compress_jscode = `${compress_jscode} export default '${names[i]}';`;
          fs.writeFileSync(mod_dir + '/' + names[i] + '.js', compress_jscode, {encoding: 'utf8'});
        } else {
          this.components += comps_jscode;
        }
      } catch (err) {
        console.error(err.message);
        this.errorCount += 1;
      }

      //检测依赖
      if (cex.dependency) {
        if (typeof cex.dependency === 'string') {
          cex.dependency = [cex.dependency]
        }

        if (Array.isArray(cex.dependency)) {
          cex.dependency.forEach(x => {
            if (x && typeof x === 'string' && x.trim() && names.indexOf(x.trim()) < 0) {
              names.push(x.trim())
            }
          })
        }
      }
    }

    this.loadCompsCss(cdir, `${cdir}/@css`);

    /* if (this.isbuild) {
      let comp_dir = appdir + '/static/components';
      await fsp.access(comp_dir).catch(err => {
        return fsp.mkdir(comp_dir);
      });

      this.buildCompsStatic(cdir, names, comp_dir);
    } */

    let comp_dir = appdir + '/static/components';
    await fsp.access(comp_dir).catch(err => {
      return fsp.mkdir(comp_dir);
    });

    this.buildCompsStatic(cdir, names, comp_dir);

    //进行src替换处理
    //this.components = this.replaceSrc(this.components, true);

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
  this.errorCount = 0;

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
  } else {
    this.config.autoRefresh && (this.sseCode = ssecode())
  }

  if (this.config.prepath.length > 0) {
    let lend = this.config.prepath.length - 1;
    if (this.config.prepath[lend] === '/')
      this.config.prepath = this.config.prepath.substring(0, lend);
  }

  if (!this.config.buildInApp) {
    let fname = `w-${this.usedVersion}.js`;

    if (!this.config.debug) {
      fname = `w-min-${this.usedVersion}.js`;
      try {
        fs.writeFileSync(`${pdir}/static/${fname}`, this.jch.js, {encoding:'utf8'});
      } catch (err) {
        console.error(err);
      }
    }

    let script_url = `${this.config.prepath}/static/${fname}`;
    if (this.config.scriptUrl) {
      script_url = this.config.scriptUrl;
    }

    this.w_script_src = `<script src="${script_url}"></script>`;

    try {
      fs.writeFileSync(`${pdir}/static/w-${this.usedVersion}.js`, this.jch.orgjs, {encoding:'utf8'});
    } catch (err) {
      console.error(err);
    }
  }

  if (this.config.buildCss && Array.isArray(this.config.buildCss)) {
    let real_cssfile = ''
    for (let cssfile of this.config.buildCss) {
      if (!cssfile) continue;
      if (cssfile.indexOf('./') == 0) {
        real_cssfile = pdir + cssfile.substring(1)
      } else if (cssfile[0] === '/') {
        real_cssfile = pdir + cssfile
      } else {
        real_cssfile = pdir + '/' + cssfile
      }

      try {
        fs.accessSync(real_cssfile)
        this.buildCssCode += fs.readFileSync(real_cssfile, {encoding: 'utf8'}) + '\n';
      } catch (err) {
        console.error(err)
      }
    }
  }

  try {
    fs.accessSync(`${pdir}/app.css`);
    let appcss = fs.readFileSync(`${pdir}/app.css`, {encoding: 'utf8'}) + '\n';
    appcss = this.replaceCssUrl(appcss);
    this.cssCode += appcss;
  } catch(err){
    
  }

  try {
    let appath = `${pdir}/app.js`;
    fs.accessSync(appath);
    let appcode = fs.readFileSync(appath, {encoding: 'utf8'});
    appcode = this.replaceRequire(appcode);
    await this.checkCode(appath, appcode);
    appcode = `w.init = async () => {${appcode}};`;
    
    if (this.forceCompress || this.config.debug === false || (this.isbuild && this.config.buildCompress)) {
      let cdata = await terser.minify(appcode+'\n');
      if (cdata.error) {
        console.error(cdata.error);
      } else if (cdata.code) {
        appcode = cdata.code;
      }
      
    }
    this.appInitCode = `;${appcode}`;
  } catch (err) {
    console.error(err)
  }

  try {
    fs.accessSync(`${pdir}/extends`, fs.constants.F_OK);
    await this.loadExt(`${pdir}/extends`);
  } catch (err){
    console.error(err);
  }

  try {
    fs.accessSync(`${pdir}/components`, fs.constants.F_OK);
    await this.loadComps(`${pdir}/components`, pdir);
  } catch (err){
    console.error(err);
  }

  if (this.templates.length > 0) {
    this.templates = this.replaceCssUrl(this.templates);
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

    let attr = '';

    for (let j of this.config.jsurl) {
      attr = '';
      if (typeof j === 'string') {
        this.jstext += `<script src="${makeRealSrc(j)}"></script>`;
      } else if (typeof j === 'object' && j.url) {
        if (j.defer) {
          attr = ' defer';
        }
        this.jstext += `<script src="${makeRealSrc(j.url)}"${attr}></script>`;
      }
    }

  }

  if (this.config.jsbottom) {
    if (typeof this.config.jsbottom === 'string') {
      this.config.jsbottom = [ this.config.jsbottom ];
    }

    let attr = '';

    for (let jb of this.config.jsbottom) {
      attr = '';
      if (typeof jb === 'string') {
        this.jsbottom += `<script src="${makeRealSrc(jb)}"></script>`;
      } else if (typeof jb === 'object' && jb.url) {
        if (jb.async) {
          attr = ' async';
        }

        this.jsbottom += `<script src="${makeRealSrc(jb.url)}"${attr}></script>`;
      }
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
    try {
      fs.accessSync(`${pdir}/pages/${page}`)
    } catch (err) {
      this.newPage(page, pdir)
    }

    await this.loadPage(
      `${pdir}/pages/${page}/${page}.js`,
      `${pdir}/pages/${page}/${page}.html`,
      `${pdir}/pages/${page}/${page}.css`,
      page,
      appdir
    );
  }

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

  let appfile = `${appdir}/${appname || 'index'}.html`;

  try {
    fs.writeFileSync(appfile, data, {encoding:'utf8'});
  } catch (err) {
    err && console.error(err);
  }

  zipdata(data, true).then(zdata => {
    fs.writeFileSync(appfile + '.gz', zdata);
  }).catch(err => {
    console.error('压缩html文件失败，若有需要你可以自己手动进行。')
    console.error(err)
  });
  
};

wapp.prototype.newPage = function (name, pagedir) {
  
  let html = `'use strict';\n\nclass Page {

  constructor() {

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

}\n\ndefinePage(Page);\n`;

  try {
    fs.accessSync(`${pagedir}/pages`)
  } catch (err) {
    fs.mkdirSync(`${pagedir}/pages`)
  }
  let name_preg = /^[a-z0-9\-\_][a-z0-9\-\_]{0,100}$/i

  if (!name_preg.test(name)) {
    delayOutError(`${name} 不是合法的页面名称，允许字母数字减号下划线，不能出现其他非法字符`);
    return false;
  }

  let pdir = `${pagedir}/pages/${name}/`;
  let pagefile = `${pagedir}/pages/${name}/${name}.js`;
  let htmlfile = `${pagedir}/pages/${name}/${name}.html`;
  let cssfile = `${pagedir}/pages/${name}/${name}.css`;

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

function checkCompsName(cname) {
  cname = cname.trim();
  if (cname.length < 3) return false;

  if (cname.indexOf('-') < 0) return false;

  if (!(/^[a-z]/i).test(cname)) return false;

  return true;
}

function fmtCompsClassName(name) {
  let namearr = []

  let cname = name.trim().replace(/[\-]{2,}/g, '-');
  if (!cname || cname === '-') return `Component_${Math.random().toString(16).substring(2)}`;
  let end = cname.length - 1;

  for (let i = 0; i < cname.length; i++) {
    if (i === 0) namearr.push(cname[i].toUpperCase());
    else if (cname[i] === '-' && i < end && (/[a-z]/i).test(cname[i+1])) {
      namearr.push(cname[i+1].toUpperCase());
      i += 1;
    } else {
      namearr.push(cname[i])
    }
  }

  return namearr.join('');
};

function renderExplainJSON(cname) {
  let className = fmtCompsClassName(cname);
  return `{
    "name" : "${cname}",
    "version": "1.0.0",
    "className" : "${className}",
    "detail" : "...",
    "doc" : "readme.md",
    "dependency": []
}`;
}

function parseDependency(arr) {
  if (typeof arr === 'string') arr = [arr]

  let obj = {}
  for (let a of arr) {
    if (!a || typeof a !== 'string') continue
    let names = a.split('@')
    let name = names[0].trim()
    let version = names[1] ? names[1].trim() : '1.0.0'
    obj[name] = version
  }

  return obj
}

function renderCompsClass(cname) {
  let className = fmtCompsClassName(cname);

  return `'use strict';\n
class ${className} extends Component {

  constructor() {
    super(); //必须写在最开始。

    //通过this.attrs访问所有属性。this.attributes是浏览器原始提供的属性对象。
    //this.attrs是为了方便而做的映射。

    //this.shadow可以访问shadow DOM，注意这是shadowRoot。
    //直接通过this访问组件节点自己。
    
    //属性声明示例：用于声明支持的属性和类型限制，若不需要请去掉properties的定义。
    this.properties = {
      style: {
        //type默认就是字符串
        type: 'string',
        default: ''
      },

      channel: {
        type: 'string',
        //chan::开头表示这是通道类型。
        default: 'chan::${cname}'
      },

      //是否唯一，不允许重复注册。
      'channel-only': {
        type: 'boolean',
        default: false
      },

      //是否采用action模式
      'channel-action': {
        type: 'boolean',
        default: false
      },
    }
  }

  //在render之前执行，此时已经创建好shadow DOM。
  init() {

  }

  //返回字符串或DOM节点。
  render() {
    // 也可以返回字符串，比如： return '${cname}组件';
    return this.plate();
  }

  //渲染完成后执行
  afterRender() {
    
  }

  onload() {

  }

  //从DOM树中移除时触发。
  onremove() {

  }

  //通道获取了数据时触发，相当于外界进行输入。
  channelInput(ctx) {
  
  }

  //有其他模块获取通道数据时触发。
  channelOutput(ctx) {

  }

  onattrchange(name, oldValue, newValue) {
    //当改变this上的属性时，会触发此函数。
  }

  //被移动到新文档时触发。
  onadopted() {

  }

  static get observedAttributes() {
    //如果你要监控某些属性的变化，你需要在onattrchange中处理。
    //要在属性变化时触发onattrchange函数，你需要在此函数中返回对应的属性。
    //return ['class', 'name'];
  }

}`;

}

wapp.prototype.newComps = function (cname, cdir) {

  if (!checkCompsName(cname)) {
    console.error(`${cname} 不符合要求，至少3字符长度，字母开头，包含 - 。`);
    return false;
  }

  let compsdir = `${cdir}/components/${cname}`;

  try {
    fs.accessSync(compsdir)
    console.error(`${cname} 组件已存在。`);
    return false;
  } catch (err) {
    
  }

  fs.mkdirSync(compsdir);

  fs.mkdirSync(compsdir + '/static');

  fs.writeFileSync(`${compsdir}/explain.json`, renderExplainJSON(cname), {encoding: 'utf8'});

  fs.writeFileSync(`${compsdir}/readme.md`, `# ${cname}\n`, {encoding: 'utf8'});

  fs.writeFileSync(`${compsdir}/${cname}.js`, renderCompsClass(cname), {encoding: 'utf8'});

  fs.writeFileSync(`${compsdir}/template.html`, 
    `<template>\n<style></style>\n\n<div>${cname}组件</div>\n</template>\n`, 
    {encoding: 'utf8'});

  return true;
}

//new project
wapp.prototype.newProject = function (project_dir, project_template='newproject') {
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

  if (!project_template) project_template = 'newproject';

  let new_project_dir = __dirname + '/' + project_template;

  let cpfiles = ['app.js', 'app.css', 'config.json', 'manifest.json', 'favicon.ico'];

  for (let i = 0; i < cpfiles.length; i++) {
    try {
      fs.copyFileSync(`${new_project_dir}/${cpfiles[i]}`, `${project_dir}/${cpfiles[i]}`);
    } catch (err) {
      console.error(err.message);
    }
  }

  let loopcp = [
    'components', 'extends', 'static', 'pages',
    'static/css', 'static/icon', 'static/images','static/components',
    'components/@css', 'pages/home', 'pages/user'
  ];

  if (project_template === 'newproject') {
    loopcp.push('pages/list', 'pages/test', 'components/u-card');
  }

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
  }

  for (let i=0; i < loopcp.length; i++) {
    try {
      fs.accessSync(`${new_project_dir}/${loopcp[i]}`, fs.constants.F_OK);
    } catch (err) {
      //console.error(err.message);
      continue;
    }

    copyFile(`${new_project_dir}/${loopcp[i]}`, `${project_dir}/${loopcp[i]}`);
  }

}

module.exports = wapp;

/**

wapp.prototype.readImportCss = function (cssfiles, cdir) {

  let css_dir = cdir + '/../@css';

  let code = '';
  let temp = '';

  for (let f of cssfiles) {
    try {
      temp = fs.readFileSync(`${css_dir}/${f.file}`, {encoding: 'utf8'});
      code += csso.minify(temp + '\n').css;
    } catch (err) {
      console.error(err)
    }
  }

  return code;
};

wapp.prototype.replaceImportCss = function (text, cdir) {

  text = text.replace(/\/\*(.|[\r\n])*?\*\//mg, '');

  let style_start = text.indexOf('<style>');
  let endind = text.indexOf('</style>');

  if (style_start < 0) return text;

  let i = 0;
  let cssfiles = [];

  let parseFile = (t) => {
    let f = t.substring(('@import').length).trim();
    if (f.indexOf('url(') >= 0) {
      f = f.substring(4, f.length - 1);
    }
    return f.substring(1, f.length - 1);
  }

  let iend = 0;
  let start = style_start + 7;

  while (start < endind) {
    i = text.indexOf('@import', start);

    if (i < 0) break;

    iend = text.indexOf(';', i);

    cssfiles.push({
      pos: {
        start: i,
        end: iend
      },
      file: parseFile(text.substring(i, iend))
    });

    start = iend + 1;
  }

  if (cssfiles.length === 0) {
    let compress_css = csso.minify(text.substring(style_start+7, endind)+'\n').css;
    return text.substring(0, style_start + 7) 
          + this.replaceCssUrl(compress_css)
          + text.substring(endind);
  }

  let csscode = this.readImportCss(cssfiles, cdir);

  let replace_start = cssfiles[0].pos.start;

  let replace_end = cssfiles[ cssfiles.length - 1 ].pos.end;

  let replace_text = text.substring(0, replace_start) 
                        + this.replaceCssUrl(csscode)
                        + text.substring(replace_end+1);
  
  endind = replace_text.indexOf('</style>');

  let compress_css = csso.minify(replace_text.substring(style_start+7, endind)+'\n').css;
  return replace_text.substring(0, style_start + 7) 
              + compress_css
              + replace_text.substring(endind);
}
 * 
 */
