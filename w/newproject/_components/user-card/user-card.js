'use strict';

class userCard extends HTMLElement {

  constructor () {
    super();

    //创建shadow DOM。
    let shadow = this.attachShadow({mode: 'closed'});

    let style = document.createElement('style');

    style.textContent = '';

    let div = document.createElement('div');
    div.innerHTML = 'user-card组件';

    shadow.appendChild(style);
    shadow.appendChild(div);

  }

}