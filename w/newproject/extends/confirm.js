
let cexp = {};

exports.confirmExp = cexp;

exports.confirmExec = function (ctx) {

  unalert('shadow');

  let id = ctx.target.dataset.id;

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

exports.confirmCancel = function (ctx) {
  unalert('shadow');

  let id = ctx.target.dataset.id;  

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
    <div style="box-sizing: border-box;display: flex;flex-flow: row wrap;">
      <div style="padding-left: 0.5rem;padding-right: 0.5rem;flex: 1;box-sizing: border-box;text-align:center">
      <button class="small" 
        style="font-weight:bold;background:#00b2ee;" 
        data-onclick="w.ext.confirmExec" 
        data-id="${id}">
          确定</button>
      </div>

      <div style="padding-left: 0.5rem;padding-right: 0.5rem;flex: 1;box-sizing: border-box;text-align:center">
        <button class="small inverse" 
          style="background:#777879;" 
          data-onclick="w.ext.confirmCancel" 
          data-id="${id}">
            取消</button>
      </div>
    </div>
  </div>`;

  unalert('all');

  coverShadow(atext, !!opts.transparent);
  
};

window.confirm = exports.confirm.bind(exports);
