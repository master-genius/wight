<!--name:页面-->
# 页面

一个页面就是一个功能集合的容器，因为各种因素，页面不是组件，并且从一开始的设计上，页面是类比为一个进程，而整个应用就好像是一个小的系统。页面内可以随意使用组件，不必声明组件对哪个页面，只要是启用的组件，在任何位置都可以使用。


整个框架的设计方式是：整个应用类比为一个微型操作系统，每个页面都是一个进程。一旦一个进程被创建，在任务结束之前会一直运行，你可以通过编程的方式控制重新运行（重新加载页面），页面的显示和隐藏是通过css控制的。


因为是单页应用，所以这里每个页面本质上就是一个div标签。


这种设计带来的好处是非常明显的，页面的显示隐藏不会对数据产生影响。也就是说直接保留了栈环境（页面的结构数据等不会销毁），这是非常有用的一个功能，这个功能在其他框架上是无法实现的，或者说很难实现，因为设计模式就是不同的。

## 页面文件结构

以home页面为例，一个home页面的结构如下：

```
home/:
  home.js
  home.html
  home.css
```

home.html文件用于编写基础布局结构。所有的逻辑都在home.js文件中完成。

## 页面的生命周期函数

当一个页面首次加载时，会执行onload方法，然后是onshow，以后只要页面不销毁（不涉及到重新加载），就不会再次执行onload，但是每次显示都会执行onshow。

页面的隐藏，会执行onhide、当浏览器窗口发生变化，会执行onresize函数。页面滚动条滚动，会执行onscroll。

当页面要销毁时候（刷新页面，或调用了重新加载的方法），会执行onunload。

页面触底，会执行onbottom，此函数框架层面做了频率限制，不会十分频繁的触发，用于保证逻辑处理更加稳定。


## 数据的渲染过程

数据的绑定是单向流动，从数据到视图，视图层(html文件)通过事件绑定和js进行交互。页面的js文件中可以直接使用this.view方法：

```javascript

class page {
    constructor() {

    }

    async onload() {
        this.view({
            //html文件中data-name为rand的标签将会显示一个随机数。
            rand: Math.random()
        })
    }

    async onshow() {
        this.view({
            list: [
                {
                    id: 12,
                    rand: Math.random()
                },

                {
                    id: 13,
                    rand: Math.random()
                }
            ]
        })
    }

    //ctx包含属性：data、target、type、dataType
    renderList(ctx) {
        console.log(ctx)
        let html = '';
        ctx.data.forEach(x => {
          html += `<div c-12 lh2>${x.id} ${x.rand}</div>`
        });

        return html;
    }

    //...
}


definePage(page);

```

html文件：

```html

<div data-name="rand"></div>

<!--data-map指定了数据要交给renderList函数处理，并把处理的结果显示到此处-->
<div data-name="list" data-map="renderList"></div>
```

## 使用默认的视图处理：提供display属性

如果页面的js文件中存在display属性，则在不提供data-map的时候会先检测是否存在display属性，并且是一个object，在这上面如果存在和data-name指定的属性值一样的属性并且是一个函数则会交给它处理：

```javascript

let renderList = (ctx) => {
    console.log(ctx)
    let html = '';
    ctx.data.forEach(x => {
        html += `<div c-12 lh2>${x.id} ${x.rand}</div>`
    });

    return html;
}

class page {
    constructor() {
        //display属性用于默认的view数据渲染绑定。
        this.display = {
            list: renderList
        }
    }

    async onload() {
        this.view({
            //html文件中data-name为rand的标签将会显示一个随机数。
            rand: Math.random()
        })
    }

    async onshow() {
        this.view({
            list: [
                {
                    id: 12,
                    rand: Math.random()
                },

                {
                    id: 13,
                    rand: Math.random()
                }
            ]
        })
    }

    //...
}


definePage(page);

```

html文件：

```html

<div data-name="rand"></div>

<!--不指定data-map，会使用display指定的函数-->
<div data-name="list"></div>
```

## 相关属性

- this.name 访问页面的名字，用于唯一标识页面。

- this.init 页面是否已经初始化。


## DOM查询

通过this.query()可以查询DOM节点，内部就是调用的querySelector，但是每个页面使用此方法只会查询自己页面内的节点。

## view方法

view可以进行链式调用，并且可以传递第一个参数是字符串，第二个参数是渲染的数据：

```javascript
this.view('[data-tag=icons]', `<img src="/static/icon/a.png">`)
    .view('[data-group=grp]', 'OK')
```
