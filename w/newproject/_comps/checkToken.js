exports.checkToken = function (autoRemove = false) {

  w.comps.parseUrl();

  let tk = w.comps.token.get();
  if (tk === null) {
    return false;
  }

  let u = w.storage.jget('wxuserinfo');

  if (parseInt(u.logintime) + parseInt(u.expires) <= Date.now()) {
    if (autoRemove) {
      w.comps.token.remove();
    }
    return false;
  }

  return true;

};
