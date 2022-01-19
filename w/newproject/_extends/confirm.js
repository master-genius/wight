
let cexp = {};

exports.confirmExp = cexp;

exports.confirmExec = function (id) {

  unalert();

  if (cexp[id] === undefined) {
    return false;
  }

  let {callback, args} = cexp[id];

  delete cexp[id];

  if (typeof callback !== 'function') {
    return;
  }

  return callback(args);

};

exports.confirmCancel = function (id) {
  
  unalert();

  if (cexp[id] === undefined) {
    return;
  }

  try {
    if (cexp[id].cancel) {
      if (typeof cexp[id].cancel === 'function') {
        cexp[id].cancel();
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    delete cexp[id];
  }

};

exports.confirm = function (opts = {callback : null, args : null, text : ''}) {

  let id = `call_${Date.now()}${parseInt(Math.random() * 10000)+1}`;

  cexp[id] = {
    callback : opts.callback,
    args : opts.args || null
  };

  if (opts.cancel) {
    cexp[id].cancel = opts.cancel;
  }

  let atext = `<div style="text-align:center;font-size:89%;color:#4a4a4f;">
    <p>${opts.text || ''}</p>
    <button class="small" style="font-weight:bold;" onclick="w.comps.confirmExec('${id}');">确定</button>
    &nbsp;&nbsp;&nbsp;
    <button class="small inverse" style="background:#676869;" onclick="w.comps.confirmCancel('${id}');">取消</button>
  </div>`;

  //true true表示：完全替换文本而不是叠加、不显示右上角关闭按钮
  alert(atext, {
    notClose:  true,
    replace:   true,
    withCover: true,
    transparent: !!opts.transparent
  });
  
};

window.confirm = exports.confirm.bind(exports);
