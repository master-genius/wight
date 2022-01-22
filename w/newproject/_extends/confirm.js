
let cexp = {};

exports.confirmExp = cexp;

exports.confirmExec = function (id) {

  unalert('shadow');

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
  
  unalert('shadow');

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
    <button class="small" style="font-weight:bold;" onclick="w.ext.confirmExec('${id}');">确定</button>
    &nbsp;&nbsp;&nbsp;
    <button class="small inverse" style="background:#676869;" onclick="w.ext.confirmCancel('${id}');">取消</button>
  </div>`;

  unalert('all');

  coverShadow(atext, !!opts.transparent);
  
};

window.confirm = exports.confirm.bind(exports);
