<!--name:利用w.share通信-->
# 利用w.share通信

w.share是框架层面提供的全局可用的数据共享和监听机制。相对应的配合的方法是：

- w.registerShareNotice(options)

- w.removeShareNotice(id)

这在文档部分已经有说明，这个机制可以实现这样的功能：**页面和组件进行私有化数据通信**。

这样的方式其实主要是页面调用组件，但是需要给组件传递数据，并且即使是相同的组件也可以具备不同的数据监听和处理方式。

## 实现方案

- 组件内通过一个属性获取要监听的key值。

- 页面内初始化组件传递key值。

- 监听key值。


### 页面js代码

```javascript
class page {
    constructor() {
        //用于记录已经生成的key
        this.keymap = {}
        this.makeKey = (cname='') => {
            let id = `${this.name}_${cname ? cname+'_' : ''}${Math.random().toString(16).substring(2)}`
            this.keymap[id] = cname || true
            return id
        }
    }

    async onload(ctx) {
        this.view({
            test: `<x-test key="${this.makeKey('x-test')}"></x-test>`
        })
    }

    async onshow(ctx) {
        //触发事件监听的处理
        setTimeout(() => {
            for (let k in this.keymap) {
                w.share[k] = {
                    action: 'test',
                    message: (new Date).toLocaleString() + ' : test for key'
                }
            }
        }, 2000)
    }

    //...
}

definePage(page);
```

### 组件js代码

```javascript
//x-test组件js代码
class Xtest extends Component {
    constructor () {
        super();

        this.properties = {
            key: {
                type: 'string',
                default: ''
            }
        }
    }

    async init() {
        if (this.__init__)return;

        this.attrs.key
            &&
        w.registerShareNotice({
            type: 'set',
            key: this.attrs.key,
            callback: (ctx) => {
                //执行相关处理，这里只是示例代码，此处表示识别传递的数据是object并使用action指定动作。
                if (ctx.data && typeof ctx.data === 'object' && ctx.data.action) {
                    switch (ctx.data.action) {
                        case 'test':
                            this.view({
                                message: ctx.data.message
                            })
                            break

                        case 'xxxx':
                            //...
                            break
                    }
                }
            }
        })
    }

}

```
