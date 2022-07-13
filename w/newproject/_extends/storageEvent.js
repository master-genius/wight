exports.storageEvent = new function () {

  this.events = ['set', 'remove']

  this.eventMap = {}

  this.idMap = {}

  this.frequency = 500

  this._initEventMap = function (key) {
    this.eventMap[key] = {}

    this.events.forEach(a => {
      this.eventMap[key][a] = []
    })

    if (key === '@all') this.eventMap[key].clear = []

  }

  this._setEventHandle = function (key, type, options) {
    let h = this.eventMap[key][type]
    if (h.length >= 5) {
      !options.quiet && w.alertError('每个storage事件最多允许注册5个处理函数。')
      return false
    }

    for (let a of h) {
      if ((options.name && a.name === options.name) || options.callback === a.callback)
        return false
    }

    h.push(options)

    return true
  }

  this._addHandle = function (key, options) {
    if (!this.eventMap[key]) this._initEventMap(key)

    let id = `${Date.now()}${Math.random().toString(16).substring(2)}`

    let false_count = 0

    if (options.type === 'all') {
      this.events.forEach(e => {
        if (false === this._setEventHandle(key, e, options)) false_count += 1
      })

      if (false_count === this.events.length) return false
    } else {
      if (this.events.indexOf(options.type) < 0 && options.type !== 'clear') return false
      if (false === this._setEventHandle(key, options.type, options)) return false
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

    if (options.mode == undefined) options.mode = 'always';

    (options.quiet === undefined) && (options.quiet = false);

    if (!options.type) options.type = 'all';

    if (options.type === 'clear') return this._addHandle('@all', options)

    if (options.key === undefined) options.key = '';

    (options.name === undefined) && (options.name = `${w.curpagename}-${options.key || '@all'}-${options.type}`);

    if (options.test) return true

    if (options.key === '') {
      return this._addHandle('@all', options);
    }

    return this._addHandle(options.key, options);
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
    let ky
    let key_index = 'id'

    if (id.indexOf('-') < 0) {
      ky = this.idMap[id]
      if (!ky) return false
    } else {
      let karr = id.split('-').filter(p => p.length > 0)
      if (karr.length !== 3) return false
      ky = karr[1]
      type = karr[2]
      key_index = 'name'
    }

    let keyHandles = this.eventMap[ky]

    if (!keyHandles) return false

    for (let k in keyHandles) {
      if (type !== '' && k !== type) continue
  
      for (let i = 0; i < keyHandles[k].length; i++) {
        if (keyHandles[k][i][key_index] === id) {
          keyHandles[k].splice(i, 1)
          break
        }
      }
    }

    return true

  }

  this.frequencyRecord = {}

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

    if (this.frequency <= 0) {
      this._run(tr.data.key || '@all', tr.data.type, tr.data)
      return
    }

    let tm = Date.now()
    let frkey = `${obj.key || '@all'} ${obj.type}`

    if (this.frequencyRecord[frkey] === undefined) {
      this.frequencyRecord[frkey] = {
        tm: tm - this.frequency,
        timer: null,
        data: null
      }
    }

    let tr = this.frequencyRecord[frkey]

    tr.data = obj

    !tr.timer &&
      (
        tr.timer = setTimeout(() => {
          let obj = tr.data
          this._run(obj.key || '@all', obj.type, obj)
          tr.timer = null
          tr.data = null
          tr.tm = tm
        }, this.frequency)
      )

  };


};

window.addEventListener('storage', exports.storageEvent.handle.bind(exports.storageEvent));
