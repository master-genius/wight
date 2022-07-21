'use strict'

/**
单标签元素：<br><hr><img><input><param><meta><link>
*/

class htmlstate {

  /**
   * NONE ----> CHAR | TAG_START
   * CHAR ----> TAG_START | TAG_CLOSE | TAG_CLOSE_END
   * TAG_START ----> TAG_NAME
   * TAG_NAME ----> TAG_ATTR_PRE | TAG_END
   * TAG_ATTR_PRE ----> TAG_ATTR
   * TAG_ATTR ----> TAG_ATTR_PRE | TAG_ATTR_SET_VALUE
   * TAG_ATTR_SET_VALUE ----> TAG_ATTR_VALUE_START
   * TAG_ATTR_VALUE_START ----> TAG_ATTR_VALUE | TAG_ATTR_VALUE_END
   * TAG_ATTR_VALUE ----> TAG_ATTR_VALUE_END | TAG_ATTR_PRE
   * TAG_CLOSE_END | TAG_END ----> CHAR | TAG_START
   * TAG_CLOSE ----> TAG_CLOSE_NAME
   * TAG_CLOSE_NAME ----> TAG_CLOSE_END
   */

  constructor () {
    this.STATE = {
      CHAR: 'c',
      TAG_ATTR_PRE: '_',
      TAG_ATTR: 'a',
      TAG_START: '<',
      TAG_END: '>',
      TAG_CLOSE : '/',
      TAG_CLOSE_END: '/>',
      SPACE: ' ',
      TAG_ATTR_VALUE_START: '@',
      TAG_ATTR_VALUE_END: '/@',
      TAG_CLOSE_START: '</',
      TAG_ATTR_SET_VALUE: '=',
      TAG_ATTR_VALUE: 'v',
      TAG_NAME: 'n',
      TAG_CLOSE_NAME: 'cn',
      NONE: 0
    }

    //记录当前属性值的类型：单引号、双引号、无
    this.attrType = ''
    this.curState = this.STATE.NONE
    this.startState = this.STATE.NONE
    this.endState = this.STATE.NONE
    this.cursor = 0
    this.lastCursor = 0

    this.tagStack = []
    this.tagCloseStack = []

    this.singleTags = [
      'br', 'hr', 'img', 'input', 'param', 'meta', 'link'
    ]

    this.lastErrorMsg = ''

    this.curTagIndex = 0
    this.curTagEndIndex = 0

    this.data = ''

    this.is_script = false
  }

  diffCloseTag () {
    let tagname = ''
    let endIndex = this.curTagEndIndex

    while (this.data[endIndex] !== ' ' && endIndex < this.cursor) {
      endIndex += 1
    }

    tagname = this.data.substring(this.curTagEndIndex, endIndex)

    if (tagname.toLowerCase() !== this.tagStack.pop()) {
      return false
    }

    return true
  }

  pushTag () {
    
    let tagname = ''
    let endIndex = this.curTagIndex

    while (this.data[endIndex] !== ' ' && endIndex < this.cursor) {
      endIndex += 1
    }

    tagname = this.data.substring(this.curTagIndex, endIndex).toLowerCase()

    this.singleTags.indexOf(tagname) < 0 && this.tagStack.push(tagname)

    if (tagname === 'script')
      this.is_script = true

  }

  /**
   * 在不是设置属性值的状态下（TAG_ATTR_VALUE），如果出现了< >则为非法格式。
   * 在属性值中，如果出现了单引号或双引号的冲突则为非法格式。
   */

  checkSpace (next_char) {
    if (this.STATE.TAG_START === this.curState || this.STATE.TAG_CLOSE === this.curState) {
      return false
    }

    //如果下一个状态还是空格，则维持当前状态不变
    if (next_char === ' ') return true

    if (this.curState === this.STATE.TAG_ATTR_VALUE_END) {
      this.curState = this.STATE.TAG_ATTR_PRE
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE) {
      if (this.attrType === '') {
        this.curState = this.STATE.TAG_ATTR_PRE
      }

      return true
    }

    if (this.STATE.TAG_NAME === this.curState || this.curState === this.STATE.TAG_ATTR) {
      this.curState = this.STATE.TAG_ATTR_PRE
    }
    else if (this.STATE.NONE === this.curState) {
      this.curState = this.STATE.CHAR
    }
    else if (next_char === '>') {
      return false
    }

    return true
  }

  checkTagStart (next_char) {

    if (this.curState === this.STATE.TAG_ATTR_VALUE) {
      if (this.attrType !== '') {
        return false
      }
      return true
    }

    if (this.STATE.TAG_END === this.curState 
      || this.STATE.TAG_CLOSE_END === this.curState 
      || this.STATE.NONE === this.curState 
      || this.STATE.CHAR === this.curState)
    {
      if (next_char === '/') {
        this.curState = this.STATE.TAG_CLOSE
        this.cursor += 1
        this.curTagEndIndex = this.cursor + 1
      } else {
        this.curState = this.STATE.TAG_START
        this.curTagIndex = this.cursor + 1
      }
      
      return true
    }

    return false

  }

  checkTagEnd (cur_char, next_char) {
    
    if (this.curState === this.STATE.TAG_CLOSE_NAME) {
      this.curState = this.STATE.TAG_CLOSE_END
      if (!this.diffCloseTag()) {
        return false
      }
      return true
    }

    if (this.curState === this.STATE.TAG_NAME 
      || this.curState === this.STATE.TAG_ATTR
      || this.curState === this.STATE.TAG_ATTR_PRE
      || (this.curState === this.STATE.TAG_ATTR_VALUE && this.attrType === '')
      || this.curState === this.STATE.TAG_ATTR_VALUE_END)
    {
      this.curState = this.STATE.TAG_END
      this.pushTag()
      return true
    }

    return false
  }

  checkAttrQuote (cur_char, next_char) {
    if (this.curState === this.STATE.NONE 
      || this.curState === this.STATE.CHAR 
      || this.curState === this.STATE.TAG_CLOSE_END
      || this.curState === this.STATE.TAG_END)
    {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_SET_VALUE) {
      this.attrType = cur_char
      this.curState = this.STATE.TAG_ATTR_VALUE_START
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE_END) {
      return false
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE || this.curState === this.STATE.TAG_ATTR_VALUE_START)
    {
      if (cur_char !== this.attrType) {
        return false
      }
      this.curState = this.STATE.TAG_ATTR_VALUE_END
      return true
    }

    return false
  }

  checkAttrSetValue (next_char) {

    if (this.curState === this.STATE.NONE) {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.STATE.CHAR === this.curState 
      || this.curState === this.STATE.TAG_END 
      || this.curState === this.STATE.TAG_CLOSE_END)
    {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.STATE.TAG_ATTR === this.curState) {
      this.curState = this.STATE.TAG_ATTR_SET_VALUE
      return true
    }

    return false
  }

  checkChar(cur_char, next_char) {

    /**
     * 在这种情况下，如果当前状态是标签名、属性名、属性值或属性结束则转换为TAG_CLOSE_END.
     * 
     */
    if (cur_char === '/' && next_char && next_char === '>') {
      if ( (this.attrType === '' && this.curState === this.STATE.TAG_ATTR_VALUE)
        || this.STATE.TAG_NAME === this.curState
        || this.STATE.TAG_ATTR === this.curState
        || this.STATE.TAG_ATTR_PRE === this.curState
        || this.STATE.TAG_ATTR_VALUE_END === this.curState
      ) {
        this.cursor += 1;
        this.curState = this.STATE.TAG_CLOSE_END;
        return true;
      }
    }

    if (this.curState === this.STATE.TAG_ATTR_PRE) {
      this.curState = this.STATE.TAG_ATTR
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_SET_VALUE) {

      if (cur_char === '\\') {
        this.cursor += 2
        return true
      }

      this.attrType = ''
      this.curState = this.STATE.TAG_ATTR_VALUE
      return true
    }

    if (this.curState === this.STATE.NONE) {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE_START) {
      this.curState = this.STATE.TAG_ATTR_VALUE
      return true
    }

    if (this.curState === this.STATE.TAG_START) {
      this.curState = this.STATE.TAG_NAME
      return true
    }

    if (this.curState === this.STATE.TAG_CLOSE) {
      this.curState = this.STATE.TAG_CLOSE_NAME
      return true
    }
    
    return true
  }
  
  /**
   * 
   * @param {char} cur_char 
   * @param {char} next_char 
   */

  checkState (cur_char, next_char) {
    //console.log(cur_char, next_char)

    if (cur_char !== this.attrType && this.attrType !== '') {
      if (this.curState === this.STATE.TAG_ATTR_VALUE)
      {
        return true
      }
    }

    if (this.is_script) {
      let script_ind = this.data.indexOf('</script>', this.cursor)
      if (script_ind < 0) {
        return false
      }

      this.cursor = script_ind - 1
      this.is_script = false
      return true
    }

    switch (cur_char) {
      case '<':
        return this.checkTagStart(next_char)

      case '>':
        return this.checkTagEnd(cur_char, next_char)

      case '"':
      case "'":
        return this.checkAttrQuote(cur_char, next_char)

      case ' ':
        return this.checkSpace(next_char)

      case '=':
        return this.checkAttrSetValue(next_char)

      default:
        return this.checkChar(cur_char, next_char)
    }

  }

  diffStack () {

    if (this.tagStack.length !== this.tagCloseStack.length) {
      return false
    }
    
    return true
  }

  init () {
    this.curState = this.STATE.NONE
    this.attrType = ''
    this.curTagIndex = this.curTagEndIndex = 0
    this.tagStack = []
    this.tagCloseStack = []
    this.is_script = false
    this.data = ''
    this.cursor = 0
  }

  parse (data) {
    
    this.init()

    this.data = data.replace(/<!doctype html>/i, '')
                  .replace(/<SCRIPT>/ig, '<script>')
                  .replace(/<\/SCRIPT>/ig, '</script>')
                  .replace(/<!--(.|[\r\n])*?-->/mg, '');

    if (this.data.length === 0) {
      return true
    }

    if (this.data.length === 1) {
      if (this.data[0] === '<' || this.data[0] === '>') {
        this.lastErrorMsg = '标签符号需要转义'
        return false
      }

      return true
    }

    this.cursor = 0

    let end_index = this.data.length
    let last_index = this.data.length - 1
    let st

    while (this.cursor < end_index) {
      if (this.cursor < last_index)
        st = this.checkState(this.data[this.cursor], this.data[this.cursor+1])
      else
        st = this.checkState(this.data[this.cursor], '')

      if (this.curState === this.STATE.TAG_START)
        this.lastCursor = this.cursor

      if (!st) {
        this.lastErrorMsg = `${this.lastCursor} ~ ${this.cursor} ${this.data.substring(this.lastCursor, this.cursor+1)}: 错误的语法。`
        return false
      }

      this.cursor += 1
    }

    //console.log(this.cursor, data[this.cursor], this.curState)
    //最后的结束状态只能是字符或者标签结束
    if (this.curState !== this.STATE.CHAR 
      && this.curState !== this.STATE.TAG_END 
      && this.curState !== this.STATE.TAG_CLOSE_END)
    {
      this.lastErrorMsg = '结束状态错误，请检查语法格式。'
      return false
    }

    if (!this.diffStack()) {
      this.lastErrorMsg = `${this.lastCursor} ~ ${this.cursor} `
          + `${this.data.substring(this.lastCursor, this.cursor+1)} 标签包含嵌套不一致。`
      return false
    }

    return true

  }

}

module.exports = htmlstate
