<!--name:全局对象的API-->
# w全局对象的API

浏览器环境的window对象仍然是可用的。框架在初始化的时候，会初始化全局对象w。

w上提供了一切框架环境运行期间的功能封装。在代码的任何位置，你都可以直接通过w.xx的形式访问属性或调用接口。

> 一般你只能在组件、页面、扩展的js文件中调用这些API。

> ----
> ## 路由和页面相关
> ----

### 跳转到页面：w.go

```javascript
//函数定义
w.go = function (path, args={}){}
```

示例：
```javascript
//url会变成 #user?id=12
w.go('user', {id: 12})
```

### 页面滚动： w.scroll

```javascript
//函数定义，参考MDN element.prototype.scroll文档。
w.scroll = function(x,y){}
```

示例：

```javascript
w.scroll(10, 100)
w.scroll({
    top: 100,
    left: 200,
    behaviro: 'smooth'
})
```

w.scrollTop()可以直接滚动到页面顶部。

### 返回上一页：w.goBack

此函数没有参数，如果检测到历史记录大于1才会返回，并且返回值为true，否则返回false。

### 重定向：w.redirect

```javascript
//函数定义
w.redirect = function(path, args={}){}
```

示例：

```javascript
w.redirect('home')
```

重定向会替换当前页面，不会产生新的历史记录。

**延迟重定向**

```javascript
//300毫秒后重定向到login页面
w.redirect('login', {delay:300})
```

延迟重定向针对不能立即执行的函数中，比如在下面要讲到的钩子函数，检测到未登录要重定向到login页面，但是要先返回false阻止继续加载页面，然后重定向。

> 在之前的版本上，存在w.redirect

### 重新加载页面：w.reload

此函数不必传参，直接调用：
```javascript
w.reload()
```

执行会先销毁当前页面，然后重新加载。


> ----
> ## 钩子函数：hooks
> ----

钩子函数是一种在加载页面之前要运行的函数，可以添加多个，一旦某个函数返回false则会终止对页面的加载。

### w.addHook

注册hook函数：

```javascript
w.addHook((ctx) => {
    //检测如果token失效则返回false
    if (!w.ext.checkToken()) {
        w.redirect('login', {delay:100});
        return false;
    }
}, {name: 'login-check', exclude: ['login', 'aboutus']});
//选项：钩子函数名字是login-check，exclude表示对login和aboutus页面不执行。
```

### w.removeHook

移除hook函数：

```javascript
//根据名字移除钩子函数
w.removeHook('login-check')

```

> ----
> ## 共享数据和消息通知
> ----

框架层面提供了w.share用于共享数据，你可以在页面、组件、扩展等任何js文件里使用。通过w.share可以共享各种数据。

w.share是一个Proxy实例，因此，基于此机制，实现了数据状态变化的通知函数：

- w.registerShareNotice(object) {String}id

- w.removeShareNotice(id)


示例：

```javascript
//返回值为唯一标识id
let id = w.registerShareNotice({
    //mode支持always或once
    mode: 'always',
    //要监听的key，如果w.share.datalist变化则会执行回调函数
    key: 'datalist',
    //操作类型，type支持 get、set、delete、all，默认为set。
    type: 'set',
    callback: (ctx) => {
        //ctx中包括data、type、key
        console.log(ctx)
    }
})

setTimeout(() => {
    w.removeShareNotice(id)
}, 5000)

```

key支持前缀模式和正则表达式，这带来了极大的灵活性。前缀使用`data*`这种格式表示。对于执行的顺序问题，如果是确定的key值则先执行，如果是前缀匹配或正则匹配则后执行，最后是*表示的key执行。前缀和正则没有规则上的顺序，按照添加顺序执行。

请不要让添加执行函数的逻辑和状态依赖于执行顺序，这会带来未知的问题。

前缀示例：

```javascript
//返回值为唯一标识id
let id = w.registerShareNotice({
    //mode支持always或once
    mode: 'always',
    //要监听的key，data开头的key都会执行。
    key: 'data*',
    //操作类型，type支持 get、set、delete、all，默认为set。
    type: 'set',
    callback: (ctx) => {
        //ctx中包括data、type、key
        console.log(ctx)
    }
})

```

在only模式，可以使用选项reuse开启重用。


> ----
> ## 界面交互
> ----

### w.alert w.cancelAlert w.unalert

w.alert用于替换window.alert，并且你可以直接写alert，因为已经挂在到window.alert，替换掉了浏览器默认的。

w.cancelAlert用于取消alert显示，w.unalert是w.cancelAlert的别名。

w.alert可以用于显示任何复杂的内容，除了信息提示，还可以是表单，info就是开发者拼接好的html文本。

```javascript
//函数定义
w.alert = function (info, options){}
```

**options选项**

- notClose 不显示关闭按钮。

- transparent 是否显示透明背景，如果选项设置了background，则此选项无效。

- withCover 是否显示一个遮罩层，遮罩层的目的是阻止其他操作。

- closeBackground 关闭框的背景颜色。

- style样式的属性，支持: background, boxShadow, border-radius以及四个分开的属性, transform。

- coverGlass 默认为false，true表示蒙层背景透明。

**返回值**

alert返回值是一个表示当前显示框id的字符串，注意这个值很重要，你需要调用w.cancelAlert(id)取消某一个弹框。

alert可以多次调用，每次显示都是在样式上覆盖已有的框，但是原来的不会撤销，直到关闭最近的。

### w.cover(info, options)

cover方法是对alert的封装，withCover和notClose为true。有对应的w.uncover方法是对unalert的封装。
**返回值**：和alert同样的返回值。

使用w.uncover(id)撤销。对于w.uncover、w.cancelAlert，如果你不传递参数，则默认会把最近的弹框取消。

如果使用cancelAlert不断地取消弹框，直到为空，那么已经启用的遮罩层也会自动取消。

----

### 消息通知：w.notify和相关封装

w.notify其实和alert实现了类似的功能，但是从默认样式，功能定位等都是不同的。这里有一个最核心的差异，就是二者是独立的DOM节点，相互不会有影响，对于复杂的应用，这是很有必要的。消息通知具备时效性，它一定会在一个时刻自动被清理。

w.notify内部管理了两个DOM节点，一个用于顶部中间位置的通知，一个用于右下角显示通知，两个互不影响。

**w.notify有对应的w.unnotify方法用于隐藏通知消息，需要注意的是，这个接口会把所有的消息通知都取消。**

**cancelNotify(nid)**

用于取消一个消息通知，nid是必须要传递的，或者是一个Element对象，属性的dataset上具备nid属性。实际上大部分情况你都不需要自己去管理消息通知，让框架层面自动处理即可，你只需要显示一个消息通知。

notify的通知消息默认在右下角位置。

```javascript
//函数定义
w.notify = function(info, options){}

```

**options 选项**

- ntype

通知类型，字符串值，默认为notify，支持的值有：

`top error light only noclose`

并且你可以组合使用：

```javascript
//此选项表示：通知位置在顶部、错误消息类型、只显示此消息，清空之前的通知。
w.notify('<h2>消息</h2><p>这是消息</p>', {
    ntype: 'top error only'
})
```

ntype包含top表示使用顶部的消息通知。

#### 选项

- **timeout**

超时，默认为3500毫秒，超时后就会自动隐藏通知，这也是和alert一个大的区别，alert是需要手动关闭的。

基于notify封装了一些方法用于提高效率：

> notifyError(info, timeout=15000)
> notifyTopError(info, timeout=15000)
> notifyTop(info, timeout=3500)
> notifyOnly(info, timeout=3500)

注意：timeout也可以是一个object，使用选项的方式传递，并传递其他选项。

- **ntype**

用于指定通知的类型和位置。

- **样式属性**

支持的样式有：

```javascript
this.notifyStyles = [
    'boxShadow', 'margin', 'marginBottom', 'border', 'borderBottom', 'borderLeft',
    'borderRight', 'borderTop', 'background', 'color', 'fontSize', 'padding',
    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'
];
```

你可以访问w.notifyStyles获取支持的自定义样式。

----

### prompt弹出模态框

浏览器也有prompt，这里的prompt和浏览器的有区别，并且这个也是重写了window.prompt。prompt默认从底部弹出一个模态框，显示的内容其实和notify以及alert差不多，主要是显示效果和功能有区别。

```javascript
//函数定义
w.prompt = function (info, options) {}
```

**options**

- noclose 不显示关闭按钮

- glass 玻璃效果，glass设置为true就是透明背景，设置为字符串dark表示暗色模式

- wh 位置，where的前两个字母，可以是bottom、top、middle

- unpromptHandle 传递一个值，一般是Promise或函数，传递此选项，当执行unprompt操作的时候，会先检测此选项的状态或运行函数，根据返回值是否为true确定是否继续操作，若为true则会继续执行，取消弹框。

基于prompt封装了快速调用api：

- promptMiddle(info)

- promptDark(info)

- promptGlass(info)

- promptMiddleDark(info)

- promptTopDark(info)

- promptMiddleDark(info)

- promptMiddleGlass(info)

- promptTopGlass(info)


### 侧边导航：w.navi和w.naviHide

navi是navigate缩写。w.navi用于显示一个侧边导航条。

w.naviHide用于隐藏导航条。

但是导航条的具体内容是自己定义，也就是传递html文本。

```javascript
w.navi = function(text, options={}){}
```

基于navi封装了快速调用：

- w.naviGlass(text, lr='left', up=false)

lr的值可以是right，默认是left，在左侧。up表示是否向上的位置显示，默认的导航条是在底部。

### w.sliderPage和w.hideSlider

w.sliderPage侧面滑动显示内容，左侧一条半透明用于关闭。调用w.hideSlider也可以关闭滑块页面。

w.lockSliderText是用于锁定内容的标志，默认为false。当设置为true。则在隐藏滑动页面，不会清空内容。w.sliderPage()调用不传递参数则表示使用上一次设置的值。

**w.sliderPageLeft**用于在左侧显示内容。

> ----
> ## 模块相关
> ----

### require

提供了全局函数require用于导入扩展，扩展就是extends目录中的模块。启用的扩展都被挂载到w.ext，但是强烈推荐你使用require的方式去导入，这在后续代码的维护升级都是有好处的。

### w.import

关于动态导入模块的文档，请参考 [MDN import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)

```javascript
//函数定义
window._import = w.import = async function(path, reload=false){}
```

你可以使用浏览器默认的import，w.import是对import的封装，加入了缓存机制，如果已经导入过，则直接返回结果。

可以通过第二个参数reload指定为true表示不使用缓存。

w.import另一个好处是会自动加入前缀路径，而直接使用浏览器的import则要自己构建url，就是要使用w.prepath属性进行拼接。

### w.Model

框架层面，从v3.4版本开始，提供了w.Model类方便用于接口请求。此类提供了基本的url参数格式处理，并指定apitable是编写路由表的属性。

```javascript

class Goods extends w.Model {
    constructor() {
        super()

        this.prepath = '/api'
        this.apitable = {
            get_goods: '/goods/:id',
            create_goods: '/goods',
            update_goods: '/goods/:id',
        }
    }

    getGoods(id) {
        return apicall.get(this.fmtParam('get_goods', {id}))
    }

    createGoods(data) {
        return apicall.post(this.fmtParam('create_goods'), {
            body: data
        })
    }

}

```

> ----
> ## 属性和其他相关操作
> ----

### w.title

w.title是一个getter和setter，访问w.title可以获取应用的标题，设置w.title可以改变应用的标题，也就是浏览器页面的标签显示名称会发生变化。

### w.attachTitle()

从原始标题后面追加一个标题，设置为新的标题：

```javascript
//如果应用的名称是IT资讯，则标题变成：IT资讯 - 内容详情
w.attachTitle(' - 内容详情')
```

### w.resetTitle()

重置为原始标题。

### w.loadScript(path)

动态加载js脚本文件，内部就是进行了script标签的创建。

### w.config

配置项，由开发者自行扩展的配置项，这个属性不能被直接赋值，只能添加或删除属性。

### w.curpage

当前页面，在任何位置，都可以通过此属性获取当前是哪个页面正在显示。

### w.prepath

前缀路径，你可能需要知道引入静态资源在构建时指定了哪个前缀路径。直接通过这个属性获取。