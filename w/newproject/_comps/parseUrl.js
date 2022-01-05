exports.parseUrl = function () {

  let tk = w.comps.token.get();

  let querystring = decodeURIComponent(location.search);
  
  if ((querystring.length <= 0 || querystring[0] !== '?') && tk === null) {
    return;
  }

  var qstr = querystring.substring(1);
  
  var urlarr = qstr.split('&');
  var urlobj = {};
  var tmp = '';

  for (let i=0; i<urlarr.length; i++) {
    tmp = urlarr[i].split('=');
    if (tmp.length <= 0) {
      continue;
    }
    if (tmp.length < 2) {
      tmp.push('');
    }
    urlobj[tmp[0]] = tmp[1];
  }

  if (urlobj['bxl_token'] !== undefined) {
    w.comps.token.set(urlobj['bxl_token']);
    w.comps.userinfo.set(urlobj);
  }
  
};
