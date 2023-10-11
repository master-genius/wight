
const parseUrl = await require('parseUrl');
const token = await require('token');

exports.checkToken = function (autoRemove = false) {

  parseUrl();

  if (!token.verify()) {
    if (autoRemove) {
      token.remove();
    }

    return false;
  }

  return true;

};
