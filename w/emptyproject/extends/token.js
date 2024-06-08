exports.token = new function () {
  this.key = 'token';

  this.refresh_api = '';

  this.refresh_method = 'POST';

  this.autoRefreshTime = 0;

  this.refresh = async function (refresh_api='', quiet=false) {
    if (typeof refresh_api === 'boolean') {
      quiet = refresh_api
      refresh_api = ''
    }

    if (!this.refresh_api && !refresh_api) {
      !quiet && w.notifyTopError('没有配置自动刷新token的api')
      this.remove();
      return false
    }

    let tk = this.get();
    if (!tk) {
      !quiet && w.notifyTopError('请登录')
      this.remove();
      return false
    }

    let api_url = refresh_api || this.refresh_api
    if (!(/^https?:/).test(api_url)) {
      api_url = w.host + api_url
    }

    let ok = false;

    let data = {
      method: this.refresh_method,
      headers: {
        authorization: tk.refresh_token
      }
    }
    if (this.refresh_method.indexOf('P') === 0) {
      data.body = {action: 'refresh'}
    }

    await fetch(api_url, data)
            .then(res => {
              ok = res.ok;
              if (res.ok) {
                return res.json()
              } else {
                this.remove();
                return res.text()
              }
            })
            .then(data => {
              if (ok) {
                tk.time = Date.now();
                data.expires && (tk.expires = data.expires);
                tk.token = data.token;
                this.set(tk);
              } else {
                w.notifyTopError(data)
              }
            })
            .catch(err => {
              ok = false
            })

    return ok
  }

  this.autoRefresh = async function(refresh_api='') {
    let tm = Date.now()
    if (tm - this.autoRefreshTime < 10000) {
      return false;
    }
    this.autoRefreshTime = tm;

    let tk = this.get()

    if (!tk) {
      return false
    }

    if (!tk.expires || (tk.time + tk.expires - 101000) < tm) {
      return this.refresh(refresh_api)
    }
  }

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

    let tm = Date.now()

    if (k === 'refresh') {
      if (!tk.refresh_token) return false;
      if (tk.time + tk.refresh_expires < tm) return false;
      return true;
    }

    if (!tk.token) return false;

    if (tk.time + tk.expires < tm) return false;
    return true;
  }

};
