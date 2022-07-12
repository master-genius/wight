exports.storageEvent = new function () {

  this.events = ['set', 'remove']

  this.eventMap = {}

  this.idMap = {}

  this._initEventMap = function (key) {
    this.eventMap[key] = {}

    this.events.forEach(a => {
      this.eventMap[key][a] = []
    })

    if (key === '@all') this.eventMap[key].clear = []

  }

  this._setEventHandle = function (key, type, options) {
    let h = this.eventMap[key][type]
    if (h.length >= 10) {
      w.alertError('每个storage事件最多允许注册10个处理函数。')
      return false
    }

    h.push(options)
  }

  this._addHandle = function (key, options) {
    if (!this.eventMap[key]) this._initEventMap(key)

    let id = `${Date.now()}${Math.random().toString(16).substring(2)}`

    if (options.type === 'all') {
      this.events.forEach(e => {
        this._setEventHandle(key, e, options)
      })
    } else {
      if (this.events.indexOf(options.type) < 0 && options.type !== 'clear') return false
      this._setEventHandle(key, options.type, options)
    }

    options.id = id

    this.idMap[id] = key
    
    return id
  }

  this.register = function (options) {
    if (typeof options !== 'object') {
      w.alertError('storageEvent注册事件参数必须为object');
      return false;
    }

    if (!options.callback || typeof options.callback !==  'function') {
      w.alertError('storageEvent注册事件callback必须为函数。');
      return false;
    }

    if (!options.type) options.type = 'all';

    if (options.type === 'clear') return this._addHandle('@all', options)

    if (options.key === undefined) options.key = '';

    if (options.key === '') {
      return this._addHandle('@all', options);
    }

    return this._addHandle(key, options);
  }

  this._run = async function (key, type, data) {
    if (!this.eventMap[key] || !this.eventMap[key][type]) return false;

    let ret

    let handles = this.eventMap[key][type]

    let rmids = []

    for (let f of handles) {
      if (f.callback.constructor.name === 'AsyncFunction') {
        ret = await f.callback(data)
      } else {
        ret = f.callback(data)
      }

      if (f.mode === 'once') {
        rmids.push(f.id)
      }

      if (ret === '::stop::') break

      if (ret === '::clear::') {
        w.storage.remove(key)
        break
      }
    }

    rmids.forEach(id => {
      this.removeHandle(id)
    })

  }

  this.removeHandle = function (id, type = '') {
    let ky = this.idMap[id]
    if (!ky) return false

    let m = this.eventMap[ky]

    if (!m) return false

    for (let k in m) {
      if (type !== '' && k !== type) continue

      for (let i = 0; i < m[k].length; i++) {
        if (m[k][i].id === id) {
          m[k].splice(i, 1)
          break
        }
      }
    }

    return true

  }

  this.handle = async function (evt) {

    let self = this

    let obj = {
      type: evt.key === null ? 'clear' : (evt.newValue === null ? 'remove' : 'set'),
      event: evt,
      data: evt.newValue,
      key: evt.key,
      stop: () => { return '::stop::' },
      clear: () => {
        return '::clear::'
      }
    }

    this._run(obj.key || '@all', obj.type, obj)

  };


};

window.addEventListener('storage', exports.storageEvent.handle.bind(exports.storageEvent));
