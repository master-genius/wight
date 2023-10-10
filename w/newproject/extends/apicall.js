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

let _methods = [
  'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'PATCH'
];

function makeResponse (err = null) {
  let res = {
    ok: false,
    status: 0,
    data: null,
    statusText: '',
    headers: {},
    error: err,
    exec: (options) => {
      if (!options || typeof options !== 'object') {
        w.notifyTopError('你需要传递一个object，使用success、fail、onError函数来接收不同状态。');
        return false;
      }

      if (res.ok) {
        options.success && typeof options.success === 'function' && options.success({
          ok: true,
          status: res.status,
          data: res.data,
          headers: res.headers
        });
      } else if (res.error) {
        options.onError && typeof options.onError === 'function' && options.onError({
          ok: false,
          status: res.status,
          error: res.error
        });
      } else {
        options.fail && typeof options.fail === 'function' && options.fail({
          ok: false,
          status: res.status,
          headers: res.headers,
          data: res.data
        });
      }

    }
  };

  return res;
}

const token = await require('token');

exports.apicall = async function (api, options = {}, deep = 0) {

  if (typeof api === 'object') {
    options = api;
    api = options.url;
    delete options.url;
    if (!deep || typeof deep !== 'number') deep = 0;
  }

  options.mode = 'cors';

  if (options.dataType === undefined) {
    options.dataType = 'json';
  }
  
  if (options.headers === undefined || !options.headers || typeof options.headers !== 'object') {
    options.headers = {};
  }

  if (options.retry === undefined || typeof options.retry !== 'number' || options.retry < 3) {
    options.retry = 0
  }

  if (options.retryDelay === undefined || typeof options.retryDelay !== 'number') {
    options.retryDelay = 100
  }

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

  if (options.method) {
    if (_methods.indexOf(options.method) < 0) {
      options.method = options.method.toUpperCase();
    }

    if (_methods.indexOf(options.method) < 0) {
      return makeResponse(new Error('未知请求方法'))
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
        options.headers['content-type'] = 'application/json';
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

  let tk = token.get();

  if (tk && !options.headers.authorization) options.headers.authorization = tk;

  let ret = makeResponse();

  let orgtext = '';

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
            orgtext = d;

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
            ret.error = err;
          });

  if (!ret.ok && (!options.retry || deep >= options.retry) )
  {
    if (w.config.requestError && typeof w.config.requestError === 'object') {
      let errorHandle;
      if (ret.status == 0 && w.config.requestError['failed']) {
        errorHandle = w.config.requestError['failed']
      } else {
        errorHandle = w.config.requestError[ret.status]
      }
      
      if (errorHandle && typeof errorHandle === 'function') {
        errorHandle.bind(w.config)(ret);
      }
    }
  }

  if (!ret.ok) {
    if (deep > 0 && options.retry > 0
      && deep < options.retry
      && [401, 403].indexOf(ret.status) < 0)
    {
      if (options.retryDelay > 0) {
        await new Promise((rv, rj) => {
          setTimeout(rv, options.retryDelay)
        })
      }

      return await exports.apicall(api, options, deep + 1)
    }
  }

  if (!ret.ok) {
    if (ret.error) {
      if (options.error && typeof options.onError === 'function') {
        options.onError(ret);
      } else {
        options.notify && w.notify(err.message, {ntype: 'error'});
      }
    }
    else if (options.fail && typeof options.fail === 'function') {
      options.fail(ret);
    } else if (options.notify) {
      w.notify(`${ret.status}: ${ret.statusText}<br>${orgtext}`, {ntype: 'error', timeout: 5000});
    } else {
      ret.data = orgtext;
    }
  } else {
    if (options.success && typeof options.success === 'function') {
      options.success(ret);
    }
  }

  return ret;
};

let acall = exports.apicall;

;['GET', 'POST', 'DELETE', 'PUT'].forEach(m => {
  acall[m.toLowerCase()] = async function (api, options={}) {
    if (typeof api === 'object') {
      options = api;
      api = options.url;
      delete options.url;
    } else if (!options || typeof options !== 'object') {
      w.alertError(` options is not object.`);
      options = {};
    }

    options.method = m;

    if (m[0] === 'P') {
      if (!options.body) {
        let e = new Error('未添加请求body数据。');
        alertError(e.message);
        return makeResponse(e);
      }
    }

    return acall(api, options);
  }
});
