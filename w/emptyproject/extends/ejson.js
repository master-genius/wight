module.exports = function (data) {
  if (typeof data === 'string') {
    return encodeURIComponent(data)
  }

  return encodeURIComponent(JSON.stringify(data))
}
