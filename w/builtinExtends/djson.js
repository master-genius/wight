module.exports = function (data) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(decodeURIComponent(data))
    } catch (err) {

    }
  }

  return data
}
