'use strict'

/**
 * 给Element添加快速处理scroll事件的方法
 */

function makeHandle(cb, type='') {
  let last_scroll = 0
  let last_time = 0
  let handle_lock = false

  return evt => {
      let t = evt.target
      let diff = t.scrollTop - last_scroll
      last_scroll = t.scrollTop

      if (type === 'top') {
        if (diff > 0 || Math.abs(diff) > 0.01) return
      } else if (type === 'bottom') {
        let a = t.scrollHeight - t.clientHeight - t.scrollTop
        if (diff < 0 || Math.abs(a) > 1.5) return
      }

      let tm = Date.now()
      if (tm - last_time > 19) {
        try {
          last_time = tm
          if (handle_lock) return
          handle_lock = true
          return cb(evt)
        } catch (err) {
          console.erroe(err)
        } finally {
          handle_lock = false
        }
      }
  }
}

if (window.Element && typeof window.Element === 'function' && window.Element.prototype) {
  window.Element.prototype.onScrollTop = function onScrollTop(cb) {
    this.addEventListener('scroll', makeHandle(cb, 'top'))
  }
  
  window.Element.prototype.onScrollBottom = function onScrollBottom(cb) {
    this.addEventListener('scroll', makeHandle(cb, 'bottom'))
  }
}

if (window.DocumentFragment
    && typeof window.DocumentFragment === 'function'
    && window.DocumentFragment.prototype)
{
  window.DocumentFragment.prototype.onScrollTop = function onScrollTop(cb) {
    this.addEventListener('scroll', makeHandle(cb, 'top'))
  }

  window.DocumentFragment.prototype.onScrollBottom = function onScrollBottom(cb) {
    this.addEventListener('scroll', makeHandle(cb, 'bottom'))
  }
}

;[window.Element, window.Document, window.DocumentFragment].forEach(Interface => {
  if (Interface && Interface.prototype) {
    Interface.prototype.onScrollTop = function onScrollTop(cb) {
      this.addEventListener('scroll', makeHandle(cb, 'top'));
    };
    
    Interface.prototype.onScrollBottom = function onScrollBottom(cb) {
      this.addEventListener('scroll', makeHandle(cb, 'bottom'));
    };
  }
});
