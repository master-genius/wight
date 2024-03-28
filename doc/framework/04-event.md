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


## 事件添加的选项


- capture 可选
    一个布尔值，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。

- once 可选
    一个布尔值，表示 listener 在添加之后最多只调用一次。如果为 true，listener 会在其被调用之后自动移除。

- passive 可选
    一个布尔值，设置为 true 时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。查看使用 passive 改善滚屏性能以了解更多。

- signal 可选
    AbortSignal，该 AbortSignal 的 abort() 方法被调用时，监听器会被移除。

幸运的是，这几个选项，首字母都是不重复的，因此可以作为唯一状态。

如果要使用选项，可以这样做：

```html
<div data-onclick="handle:cops"></div>
<div data-onclick="handle2:c"></div>
<div data-onclick="handle3:po"></div>
```
触发函数的名字后面加上:以及选项首字母，几个字母没有顺序，出现即表示启用此选项。
