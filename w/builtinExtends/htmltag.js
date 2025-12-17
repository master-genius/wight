const hstate = new HtmlSyntaxState()

function fmtcode(data, encodehtml=true) {
  if (data.indexOf('<') >= 0 || data.indexOf('>') >= 0) {
    if (encodehtml || !hstate.parse(data)) {
      return data.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    }
  }

  return data
}

function _html(strings, keys, encodehtml=true) {
  let kindex = 0
  let arr = []
  let ftext = ''
  let ktmp = ''
  for (let s of strings) {
    arr.push(s)
    if (kindex < keys.length) {
      ktmp = keys[kindex]
      ftext = typeof ktmp === 'string' ? fmtcode(ktmp, encodehtml) : ktmp
      arr.push(ftext)
      kindex++
    }
  }
  
  return arr.join('')
}

function htmltag(strings, ...keys) {
  return _html(strings, keys, false)
}

htmltag.ehtml = (strings, ...keys) => {
  return _html(strings, keys, true)
}

module.exports = htmltag
