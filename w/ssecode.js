'use strict'

function makeSSE (name) {

  return `<script>
    ;(() => {
      let esTimer = null;
      let updateTime = 0;
      let es = new EventSource(__prepath__ + '/sse')

      es.onerror = function (err) {

      }

      es.addEventListener('message', e => {
      
      })

      es.addEventListener('update', e => {
        updateTime = w.storage.get('app_reload_time') || 0
        let tm = Date.now()
        if (tm - parseInt(updateTime) > 1000) {
          w.storage.set('app_reload_time', tm)
          location.reload(true)
        } else {
          if (esTimer) clearTimerout(esTimer)
          
          esTimer = setTimeout(() => {
            esTimer = null
            w.storage.set('app_reload_time', tm)
            location.reload(true)
          }, 2000)
        }
      })
    })();

  </script>`;

}

module.exports = makeSSE
