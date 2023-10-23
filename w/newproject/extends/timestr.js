
let fmtbits = (n) => {
  return n < 10 ? `0${n}` : n;
}

module.exports = function (mode='long', t=null) {
  if (typeof mode === 'number' || mode && mode instanceof Date) {
    t = mode;
    mode = 'long';
  }

  if (t === null) {
    t = Date.now();
  } else if (typeof t === 'string') {
    t = parseInt(t);
  }

  let tm = typeof t === 'number' ? new Date(t) : t;

  let tmstr = `${tm.getFullYear()}-${fmtbits(tm.getMonth()+1)}-${fmtbits(tm.getDate())}`;

  if (mode === 'short') {
    return tmstr; 
  }

  if (mode === 'middle') {
    return tmstr + '_' + `${fmtbits(tm.getHours())}-${fmtbits(tm.getMinutes())}`;
  }
  
  return tmstr + `_${fmtbits(tm.getHours())}-${fmtbits(tm.getMinutes())}-${fmtbits(tm.getSeconds())}`;
};
