<!--name:扩展的本质-->
# wight框架

wight尽可能使用原生浏览器功能，摒弃虚拟DOM，鼓励在必要的时候使用DOM的API。因此带来的好处是一切前端应用不必因为虚拟DOM而做优化甚至不得不放弃框架采用其他方案。

> 比如，你要做实时渲染以及canvas和前端游戏类的应用。
> 或者，你需要更加细致的控制某个元素，这在通常的虚拟DOM框架实现起来相对很复杂。

请不要考虑在html中使用模板代码，这种方式早期版本支持，现在已经废弃。

所有的逻辑操作都在js文件中完成，并通过模板字符串(字符串字面量)完成页面的显示。

html文件完成固定的结构，并通过data-name来确定一个可以被替换的容器，通过data-map确定数据渲染的方法：

```html
<div data-name=info data-map=renderinfo></div>
```

在js文件中，通过this.view来渲染到页面：

```javascript
this.view({
    info: {name: 'OO', id: '100293', detail: 'ok, success'}
})
```

那应该以哪种形式来渲染到html中，这需要在页面或组件的js文件中提供rendinfo方法，框架层面会把数据传递到renderinfo并把返回的结果渲染到页面上：

```javascript
renderinfo(ctx) {
    //ctx.data是数据，ctx.target是具体的DOM节点。
    let d = ctx.data
    return `<h4>${d.name}</h4>
        <div row>
            <div cell>${d.id}</div>
            <div cell>${d.detail}</div>
        </div>`
}
```

如果采用模板字符串，并支持简单的表达式，这就会导致大量的计算逻辑放在了html文件中，因此把逻辑和渲染做了彻底的分离。html中不会出现计算的东西。

注意：以后也不会考虑支持JSX，也就是说js中拼接html就是模板字符串，并直接进行渲染(不必进行转码)，而不是react采用的JSX。

**如果渲染时html代码出现错误，会进行提示，不会因为标签引用错误导致整个页面不正常。**
