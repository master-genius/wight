module.exports = function (data) {
  if (typeof data === 'string') {
    let decodeStr
    try {
      decodeStr = decodeURIComponent(data)
    } catch (err) {
      decodeStr = data
    }

    try {
      return JSON.parse(decodeStr)
    } catch (err) {
      return decodeStr
    }
  }

  return data
}
