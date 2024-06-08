module.exports = function (options={}) {

  if (!options || typeof options !== 'object') {
    options = {}
  }
  let t = options.time || null
  let m = options.mode || 'long'
  let ds = options.ds || ' '
  let time_ds = options.time_ds || ':'

  if (!t)
    t = new Date();
  else if (!isNaN(t)) {
    t = new Date(typeof t === 'string' ? parseInt(t) : t);
  }

  let year = t.getFullYear();
  let month = t.getMonth()+1;
  let day = t.getDate();
  let hour = t.getHours();
  let min = t.getMinutes();
  let sec = t.getSeconds();

  let mt = `${year}-${month > 9 ? '' : '0'}${month}-${day > 9 ? '' : '0'}${day}`;

  if (m === 'short') {
    return mt;
  }

  let md = `${mt}${ds}${hour > 9 ? '' : '0'}${hour}${time_ds}${min > 9 ? '' : '0'}${min}`;
  if (m === 'middle') {
    return md;
  }

  return `${md}${time_ds}${sec > 9 ? '' : '0'}${sec}`;
}
