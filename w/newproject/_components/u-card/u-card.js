'use strict';
/**
 * 从w.share获取全局共享数据。
 */
class uCard extends Component {

  constructor () {
    super();

    /* 到这一步即可，super之后，组件的render已经执行完毕，
    若要在这期间精确的控制一些数据处理和逻辑，请在init中完成。*/
  }

  //在shadow DOM创建之后，render执行之前执行init函数。
  init () {

  }

  showId (a) {
    let uid = a.currentTarget.dataset.id

    prompt(uid)
  }

  /**
   * 
   * @param {*} t 包装对象，包括属性：data、target、type
   * @returns 
   */

  fmtList (t) {
    let html = '';
    let ulist = t.data;

    ulist.forEach( a => {
      html += `<div class=cell data-onclick=showId data-id="${a.id}">
        <h4>${a.name}</h4>
        <p>Level: ${a.level}</p>
      </div>`;
    });
    
    return html;
  }

  //返回字符串或DOM节点。
  render () {
    
    let ulist = w.share.userlist;

    if (!ulist) return '';

    return this.plate({
      ulist: ulist
    });
  }

  onLoad () {

  }

  onRemove () {

  }

  onAttrChange (name, oldValue, newValue) {

  }

  onAdopted () {

  }


}