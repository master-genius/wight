module.exports = new function clipboard() {
  
  // 读取剪贴板
  this.get = async function () {
    // 1. 尝试直接使用新版 API
    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        const text = await navigator.clipboard.readText();
        return text;
      } catch (err) {
        // Firefox 可能会在这里抛出错误（如果用户没有授予权限或不在用户交互上下文中）
        console.warn('Clipboard read failed:', err);
        // 这里可以根据需要处理 fallback，或者提示用户“请允许粘贴”
        return null;
      }
    }
    
    // 2. 如果不支持 API
    console.error('Clipboard API not supported.');
    return null;
  }

  // 写入剪贴板
  this.set = async function (text, type = 'text/plain') {
    // 1. 尝试直接使用新版 API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        // 注意：这必须在点击等用户交互事件中直接调用，不能延迟太久
        await navigator.clipboard.writeText(text);
        return; // 成功
      } catch (err) {
        console.warn('Clipboard write failed (API):', err);
        // 如果 API 失败，尝试降级处理
      }
    }

    // 2. 降级方案 (Fallback): 使用老旧的 document.execCommand (兼容性极强)
    // 虽然被标记为废弃，但它是目前兼容性最好的兜底方案
    /* try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      
      // 把它藏起来但保持可见（为了能选中文本）
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (!successful) {
        throw new Error('execCommand returned false');
      }
    } catch (err) {
      console.error('Clipboard write failed (Fallback):', err);
    } */
  }

}