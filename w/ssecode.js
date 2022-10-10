'use strict'

function makeSSE (name) {

  return `<script>
    let es = new EventSource(__prepath__ + '/sse')

    es.onerror = function (err) {

    }

    es.addEventListener('message', e => {
    
    })

    es.addEventListener('update', e => {
      location.reload(true)
    })

  </script>`;

}

module.exports = makeSSE
