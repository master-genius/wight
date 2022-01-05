function qs (args) {
  if (!args || typeof args !== 'object') {
    return '';
  }
  
  let qsarr = [];

  for (let k in args) {
    qsarr.push(`${k}=${encodeURIComponent(args[k])}`);
  }

  return qsarr.join('&');
}

exports.apicall = async function (api, options = {}) {

  if (typeof api === 'object') {
    options = api;
    api = options.url;
    delete options.url;
  }

  options.mode = 'cors';

  if (options.dataType === undefined) {
    options.dataType = 'json';
  }
  
  if (options.headers === undefined || !options.headers || typeof options.headers !== 'object') {
    options.headers = {};
  }

  let token = w.comps.token.get();
  if (token) options.headers.authorization = token;

  if (api.indexOf('http') !== 0) {
    api = `${w.host}${api}`;
  }

  if (options.query) {
    let qstr = qs(options.query);
    if (api.indexOf('?') > 0) {
      api += '&' + qstr;
    } else {
      api += '?' + qstr;
    }
  }

  if (options.method && options.body) {

    let bodyType = typeof options.body;

    if (!options.headers['content-type']) {
      if (options.form && bodyType === 'object') {
        options.headers['content-type'] = 'application/x-www-form-urlencoded';
      } else if ((bodyType === 'object' && !(options.body instanceof FormData))
        || (bodyType === 'string' && '{['.indexOf(options.body[0]) >= 0) )
      {
        options.headers['content-type'] = 'text/json';
      }
      else if (bodyType === 'string') {
        options.headers['content-type'] = 'text/plain';
      }
    }
    
    let ctype = options.headers['content-type'] || '';

    if (ctype === 'application/x-www-form-urlencoded') {
      options.body = qs(options.body);
    } else {
      switch (ctype) {
        case 'text/json':
        case 'application/json':
          if (bodyType === 'object') {
            options.body = JSON.stringify(options.body);
          }
          break;
      }
    }

  }

  let ret = {
    ok: false,
    status: 0,
    data: null,
    statusText: '',
    headers: {}
  }

  await fetch (api, options)
          .then(res => {
            ret.ok = res.ok;
            ret.status = res.status;
            ret.statusText = res.statusText;
            ret.headers = res.headers;

            if (res.ok) {
              if (options.dataType === 'blob') {
                return res.blob();
              }
              return res.text();
            }
            
            return res.text();

          })
          .then(d => {
            if (!ret.ok) {
              if (ret.status == 403 && (/token.*/i).test(d)) {
                w.hidePage();w.curpage = null;
                w.comps.loginModal();
                w.comps.token.remove();
                w.comps.userinfo.remove();
              } else {
                w.notify(`${ret.status}: ${ret.statusText}<br>${d}`, {ntype: 'error'});
              }

              return ret;
            }

            if (options.dataType === 'json') {
              try {
                ret.data = JSON.parse(d);
              } catch (err) {
                ret.data = d;
              }
            } else {
              ret.data = d;
            }
            return ret;
          })
          .catch(err => {
            w.notify(err.message, {ntype: 'error'});
          });
  
  return ret;
};
