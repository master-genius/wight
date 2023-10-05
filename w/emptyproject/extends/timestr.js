exports.timestr = function (t = null) {
  if (t === null) {
    t = Date.now();
  } else if (typeof t === 'string') {
    t = parseInt(t);
  }

  let tm = new Date(t);

  let tmstr = `${tm.getFullYear()}-${tm.getMonth()+1}-${tm.getDate()} `
          +`${tm.getHours()}:${tm.getMinutes()}:${tm.getSeconds()}`;
  
  return tmstr;
};
