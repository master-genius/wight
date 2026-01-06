
let cexp = {};

exports.confirmExp = cexp;

exports.confirmExec = function (ctx) {

  let id = ctx.target.dataset.id;

  if (cexp[id] === undefined) {
    return false;
  }

  let {callback, args, aid} = cexp[id];

  delete cexp[id];

  w.cancelAlert(aid);

  if (typeof callback !== 'function') {
    return false;
  }

  return callback(args);
};

exports.confirmCancel = function (ctx) {
  
  let id = ctx.target.dataset.id;

  if (cexp[id] === undefined) {
    return false;
  }

  w.cancelAlert(cexp[id].aid);

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
    callback : opts.ok || opts.callback,
    args : opts.args || null
  };

  if (opts.cancel) {
    cexp[id].cancel = opts.cancel;
  }

  let color = '#4a4a4a';
  if (opts.dark) color = '#f1f2f3';


  let okStyle = '';
  let cancelStyle = '';

  if (opts.buttonStyle && Array.isArray(opts.buttonStyle) && opts.buttonStyle.length > 0) {
    okStyle = opts.buttonStyle[0];
    cancelStyle = opts.buttonStyle[1] || '';
  } else if (opts.smallButton) {
    okStyle = cancelStyle = 'line-height:2rem;padding:0 0.65rem;'
  }

  let atext = `<div style="text-align:center;font-size:95%;color:${color};">
    <p>${opts.text || ''}</p>
    <div style="box-sizing: border-box;display: flex;flex-flow: row wrap;margin-top:1.5rem;">
      <div style="padding:0.2rem 0.5rem;flex: 1;box-sizing: border-box;text-align:center">
      <button class="small"
        style="font-weight:bold;background:var(--w-button-bg, #1680e1);color: #ffffff;${okStyle}" 
        data-onclick="w.builtin.confirmExec" 
        data-id="${id}">
          确定</button>
      </div>

      <div style="padding:0.2rem 0.5rem;flex: 1;box-sizing: border-box;text-align:center">
        <button class="small inverse" 
          style="background:var(--w-button-bg-cancel, #777879);color:#fcfdfe;${cancelStyle}" 
          data-onclick="w.builtin.confirmCancel" 
          data-id="${id}">
            取消</button>
      </div>
    </div>
  </div>`;

  let func = opts.dark ? w.coverDark.bind(w) : w.cover.bind(w);
  
  let options = {
    transparent: !!opts.transparent
  };

  let aid = func(atext, options);

  cexp[id].aid = aid;
  
};

window.confirm = exports.confirm.bind(exports);
