<!--name:事件-->
# 事件

wight框架的事件处理使用了data-on的形式，格式如下：

```html
<div data-onlcick="handleClick">OK</div>
<input data-oninput="cacheInput">
```

对应的在js文件中就要有同样名称的方法：

```javascript
class page {
    constructor() {

    }

    async onload() {
        
    }

    async onshow() {
        
    }

    //ctx包含属性：data、value, currentTarget, target、type、event 
    cacheInput(ctx) {
        //data和value属性是同样的值
        console.log(ctx)
    }

    handleClick(ctx) {
        alert('<h3>你点击了</h3><p>这是提示框</p>')
    }

    //...
}


definePage(page);
```

data-on后面跟的事件名称就是浏览器支持的所有事件对应的名称。具体参考MDN文档。

## 事件处理函数的参数

获取的参数ctx是一个object，具备以下属性：

- data和value

具体的数据，主要是表单数据的获取。

- event

对应的事件对象，可以参考MDN的Event对象。

- currentTarget

绑定事件的目标节点。

- target

触发事件的目标节点。

- type

事件的类型。
