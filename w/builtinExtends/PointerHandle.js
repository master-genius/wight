'use strict'

module.exports = class PointerHandle {

  constructor(element, options = {}) {
    this.element = element || window; // 绑定目标，默认为 window
    
    // 配置合并
    this.options = Object.assign({
      key: 'page',       // page, client, screen
      preventScroll: true, // 是否阻止默认滚动行为（这对滑动操作很重要）
      onStart: null,
      onMove: null,
      onEnd: null
    }, options);

    // 坐标键名兼容处理
    const validKeys = ['page', 'screen', 'client'];
    this.coordKey = validKeys.includes(this.options.key) ? this.options.key : 'page';
    this.xKey = this.coordKey + 'X';
    this.yKey = this.coordKey + 'Y';

    // 状态存储
    this.activePointerId = null; // 记录当前的主指针 ID，防止多指冲突
    this.startState = { x: 0, y: 0, time: 0 };
    this.lastState = { x: 0, y: 0 };
    
    // 绑定 `this` 指向，方便 removeEventListener
    this._onDown = this._handleDown.bind(this);
    this._onMove = this._handleMove.bind(this);
    this._onUp = this._handleUp.bind(this);
    this._onCancel = this._handleUp.bind(this);
  }

  on(evt, callback) {
    if (['start', 'move', 'end'].includes(evt) && typeof callback === 'function') {
      this.options[`on${evt[0].toUpperCase() + evt.substring(1)}`] = callback;
    }

    return this;
  }

  /**
   * 开启监听
   */
  bind() {
    if (this.options.preventScroll && this.element.style) {
      // CSS 关键：禁用触摸滚动，否则浏览器会接管滑动导致 pointermove 中断
      this.element.style.touchAction = 'none'; 
    }
    this.element.addEventListener('pointerdown', this._onDown);
    this.element.addEventListener('pointermove', this._onMove);
    this.element.addEventListener('pointerup', this._onUp);
    this.element.addEventListener('pointercancel', this._onCancel);
    this.element.addEventListener('contextmenu', e => e.preventDefault()); //以此防止右键菜单干扰
    return this;
  }

  /**
   * 移除监听
   */
  unbind() {
    this.element.removeEventListener('pointerdown', this._onDown);
    this.element.removeEventListener('pointermove', this._onMove);
    this.element.removeEventListener('pointerup', this._onUp);
    this.element.removeEventListener('pointercancel', this._onCancel);
    if (this.options.preventScroll && this.element.style) {
      this.element.style.touchAction = '';
    }
  }

  _handleDown(e) {
    // 如果已经有手指按下了，忽略新的（实现单指逻辑，避免多指混乱）
    if (this.activePointerId !== null) return;
    
    this.activePointerId = e.pointerId;
    
    // 锁定指针：即使滑出元素外，事件依然发给该元素
    if (this.element.setPointerCapture) {
      this.element.setPointerCapture(e.pointerId);
    }

    this.startState = {
      x: e[this.xKey],
      y: e[this.yKey],
      time: Date.now()
    };
    this.lastState = { ...this.startState };

    if (typeof this.options.onStart === 'function') {
      this.options.onStart(this._packEventData(e, 'start'));
    }
  }

  _handleMove(e) {
    if (e.pointerId !== this.activePointerId) return;

    // 某些浏览器在没有实际移动时也会触发 move，过滤掉
    if (e[this.xKey] === this.lastState.x && e[this.yKey] === this.lastState.y) return;

    this.lastState.x = e[this.xKey];
    this.lastState.y = e[this.yKey];

    const data = this._calculateDirection(e[this.xKey], e[this.yKey]);
    const fullData = { ...data, ...this._getPointerDetails(e) };

    if (typeof this.options.onMove === 'function') {
      this.options.onMove(fullData, e);
    }
  }

  _handleUp(e) {
    if (e.pointerId !== this.activePointerId) return;

    const data = this._calculateDirection(e[this.xKey], e[this.yKey]);
    const fullData = { ...data, ...this._getPointerDetails(e) };

    if (typeof this.options.onEnd === 'function') {
      this.options.onEnd(fullData, e);
    }

    // 释放捕捉和重置 ID
    if (this.element.releasePointerCapture) {
        try { this.element.releasePointerCapture(e.pointerId); } catch(err){}
    }
    this.activePointerId = null;
  }

  /**
   * 核心逻辑：计算方向
   * 采用了 Math.atan2 替代原来的 Cosine 判断，更精准且无死角
   */
  _calculateDirection(currentX, currentY) {
    const startX = this.startState.x;
    const startY = this.startState.y;
    
    const distX = currentX - startX;
    const distY = currentY - startY; // 注意：屏幕坐标系中，向下是 Y 增加
    const dist = Math.sqrt(distX * distX + distY * distY);

    let direction = '';
    let dirX = '';
    let dirY = '';

    // 设置一个最小移动阈值，防抖动
    if (dist >= 10) {
      // Math.atan2 返回 -PI 到 PI 的弧度
      const angle = Math.atan2(distY, distX); 
      const degree = angle * (180 / Math.PI); // 转为角度

      // 判定 8 个方向 (每 45 度一个扇区，左右各 22.5 度)
      // 0 度是向右，90 度是向下，-90 度是向上，180/-180 是向左
      
      if (degree >= -22.5 && degree < 22.5) {
        direction = 'right'; dirX = 'right';
      } else if (degree >= 22.5 && degree < 67.5) {
        direction = 'rightdown'; dirX = 'right'; dirY = 'down';
      } else if (degree >= 67.5 && degree < 112.5) {
        direction = 'down'; dirY = 'down';
      } else if (degree >= 112.5 && degree < 157.5) {
        direction = 'leftdown'; dirX = 'left'; dirY = 'down';
      } else if ((degree >= 157.5 && degree <= 180) || (degree >= -180 && degree < -157.5)) {
        direction = 'left'; dirX = 'left';
      } else if (degree >= -157.5 && degree < -112.5) {
        direction = 'leftup'; dirX = 'left'; dirY = 'up';
      } else if (degree >= -112.5 && degree < -67.5) {
        direction = 'up'; dirY = 'up';
      } else if (degree >= -67.5 && degree < -22.5) {
        direction = 'rightup'; dirX = 'right'; dirY = 'up';
      }
    }

    return {
      movex: currentX,
      movey: currentY,
      startx: startX,
      starty: startY,
      distx: distX,
      disty: distY,
      distance: dist,
      direction: direction,
      directionx: dirX,
      directiony: dirY,
      angle: Math.atan2(distY, distX) // 保留原始弧度供高级使用
    };
  }

  /**
   * 获取 PointerEvent 特有的高级属性
   */
  _getPointerDetails(e) {
    return {
      pointerType: e.pointerType, // 'mouse', 'touch', 'pen'
      pressure: e.pressure,       // 0 - 1 (笔和3D Touch支持)
      tiltX: e.tiltX,             // 笔的倾斜 X
      tiltY: e.tiltY,             // 笔的倾斜 Y
      twist: e.twist,             // 笔的旋转
      width: e.width,             // 接触面宽
      height: e.height,           // 接触面高
      isPrimary: e.isPrimary      // 是否是主指针
    };
  }

  _packEventData(e, type) {
    return {
      type,
      x: e[this.xKey],
      y: e[this.yKey],
      ...this._getPointerDetails(e)
    };
  }
}