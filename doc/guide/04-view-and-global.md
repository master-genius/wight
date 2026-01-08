<!--name:数据渲染和全局GUI-->
# 页面的view操作不能直接操作全局的GUI

对于组件来说，因为只会针对自己的shadow节点操作，无论在哪个位置都会正常运行。

对于页面来说，调用 `this.view(data)` 只会针对页面的DOM节点，根本不会对notify、sliderPage弹出的内容有所影响。

本身这些功能设计也不是为了承担过多页面视图层渲染的功能，另一方面，也是为了避免view渲染操作导致的污染。（事件处理不受影响。）

这意味着，以下操作是没有任何效果的：

```javascript
class page {
    //...
    async onload() {
        w.sliderPage('<div data-name=querytext data-onclick=clicktest>XXX</div>')
        this.view({
            querytext: '确认？'
        })
    }

    //点击XXX文本，此函数可以正常运行
    clicktest(ctx) {
        console.log(ctx)
    }

    //...
}

```

你无法把`XXX` 换成 `确定？` 因为显示的内容已经不在页面的DOM节点内。但是事件绑定可以运行，这是因为data-on*的事件是全局代理的机制。

alert、cover、prompt功能是可以正常使用的，内部会对这些进行上下文绑定。
