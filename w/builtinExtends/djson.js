module.exports = function (data) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(decodeURIComponent(data))
    } catch (err) {
      w.dev && console.error(err)
    }
  }

  return data
}
