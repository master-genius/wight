exports.token = new function () {
  this.key = 'token';

  this.get = function () {
    return w.storage.jget(this.key);
  };

  this.set = function (tk) {
    tk.time = Date.now()
    w.storage.set(this.key, tk);
  };

  this.remove = function () {
    w.storage.remove(this.key);
  };

  this.verify = function (k='') {
    let tk = this.get();
    if (!tk) return false;
    if (typeof tk !== 'object') return false;
    if (!tk.token) return false;

    let tm = Date.now()

    if (k === 'refresh') {
      if (tk.time + tk.refresh_expires < tm) return false;
      return true;
    }

    if (tk.time + tk.expires < tm) return false;
    return true;
  }

};
