exports.loginRedirect = function () {

  let redirect = `${location.href}`;

  location.href = `${w.host}/wx/oauth-code?redirect=${encodeURIComponent(redirect)}`;

};
