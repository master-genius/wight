const parseUrl = await require('parseUrl');
const token = await require('token');

exports.checkToken = function (autoRemove = false) {

  parseUrl();

  let tk = token.get();

  if (tk === null) {
    return false;
  }

  let u = w.storage.jget('userinfo');

  if (parseInt(u.logintime) + parseInt(u.expires) <= Date.now()) {
    if (autoRemove) {
      token.remove();
    }
    return false;
  }

  return true;

};
