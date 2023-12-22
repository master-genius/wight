module.exports = function (data) {
  if (typeof data === 'string') {
    let d = null
    
    try {
      d = decodeURIComponent(data)
    } catch (err) {
      d = data
    }

    try {
      JSON.parse(d)
    } catch (err) {
      return data
    }
  }

  return data
}
