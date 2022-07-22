'use strict';

class UCard extends Component {

  constructor () {
    super(); //必须写在最开始。

    //通过this.attrs访问所有属性。this.attributes是浏览器原始提供的属性对象。
    //this.attrs是为了方便而做的映射。

    //this.shadow可以访问shadow DOM，注意这是shadowRoot。
    //this.host用于访问组件对应的DOM，this.host指向this.shadow.host。

  }

  //在render之前执行，此时已经创建好shadow DOM。
  init () {

  }

  //返回字符串或DOM节点。
  render () {
    // 也可以返回字符串 return 'u-card组件';
    return this.plate();
  }

  //渲染完成后执行
  afterRender () {
    
  }

  onload () {

  }

  //从DOM树中移除时触发。
  onremove () {

  }

  onattrchange (name, oldValue, newValue) {

  }

  //被移动到新文档时触发。
  onadopted () {

  }

  static get observedAttributes() {
    //如果你要监控某些属性的变化，你需要在onattrchange中处理。
    //要在属性变化时触发onattrchange函数，你需要在此函数中返回对应的属性。
    //return ['class', 'name']; 
  }


}