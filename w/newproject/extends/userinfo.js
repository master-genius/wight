exports.userinfo = new function () {

  this.key = 'userinfo';

  this.get = () => {
    return w.storage.jget(this.key);
  };

  this.set = (info) => {
    w.storage.jset(this.key, info);
  };

  this.remove = () => {
    w.storage.remove(this.key);
  };

};
