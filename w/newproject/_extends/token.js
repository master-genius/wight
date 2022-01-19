exports.token = new function () {
  this.key = 'token';

  this.get = function () {
    return w.storage.get(this.key);
  };

  this.set = function (tk) {
    w.storage.set(this.key, tk);
  };

  this.remove = function () {
    w.storage.remove(this.key);
  };

};
