function mapObj (name, obj, notGet = false) {
  let objattr
  if (!notGet)
    objattr = Object.getOwnPropertyDescriptors(obj)
  else objattr = obj

  let codetext = `let ${name} = {};`;

  let makeVal = (oo, just = false) => {
    let val = oo && oo.value

    if (notGet || just) val = oo

    if (typeof val === 'function') {
      return 'function () {}';
    } else if (Array.isArray(val)) {
      return '[]';
    } else if (typeof val === 'object') {
      let otext = '{';
      for (let k in val) otext += `${k.replaceAll('-', '')}: ${typeof val[k] === 'function' ? 'function () {}' : (typeof val[k] === 'object' ? '{}' : '')},`;
      return otext + '}';
    } else if (typeof val === 'string') {
      return `'${val.replaceAll("'", '')}'`;
    }
    return val || "''";
    
  }

  let has_
  for (let k in objattr) {
    has_ = k.indexOf('-') >= 0 ? true : false;

    codetext += `${name}${has_ ? "['" : '.'}${k}${has_ ? "']" : ''} = ${makeVal(objattr[k])};\n`
  }

  console.log(codetext);

  return codetext;
}

/**
 * 
  let ctext = '';
  ctext += mapObj('window', window);
  ctext += mapObj('document', document, true);
  prompt(ctext.replaceAll('\n', '<br>'))
 * 
 */