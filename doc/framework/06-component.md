<!--name:组件-->
# 组件

组件的功能基于浏览器的自定义组件，基于此封装了一个类Component，所有的组件都继承自这个类。

组件的目录是components，一个组件就是一个目录，命名必须是x-y的形式。

封装处理是十分必要的：

- 要和框架完美贴合。

- 给出更方便使用的方法和更强的功能。

- 解决循环引用问题：

浏览器的自定义组件不会解决此问题，循环引用会导致死循环直到超出浏览器限制，控制台会报错，此封装类解决了循环引用问题并在检测到循环引用时使用消息通知给出提示。


**创建组件：**

```shell
#创建组件x-user x-login
node newcomps.js x-user x-login
```

一个组件包含的文件：

- explain.json

- [name].js 实际是组件的名字命名的文件。

- readme.md

- template.html

template.html是初始的html布局代码。


js文件是组件的具体逻辑。这里面已经给出了基本的结果，包括生命周期函数、注释说明等。


explain.json是组件的说明文件。


## 数据渲染

组件内同样是通过this.view进行数据渲染。组件内的渲染、data-map处理函数等和page是一样的。

## 事件

组件内的事件同样使用data-on[eventName]的形式进行事件绑定。示例：

```html
<div data-onclick="clickHandle">Event Test</div>
```

## 组件的生命周期函数

- onload 组件被挂载到节点上触发。

- onremove 组件被从节点上一出的时候上触发。

- onadopted 组件被移动到另一个节点上触发。

- onattrchange 组件的属性发生改变触发。

- init 组件初始化时执行此函数。

- render 初始化后首次渲染使用此函数的返回值。

- afterRender render渲染后，执行此函数。

组件首次加载的执行顺序：

```shell
onload init render afterRender
```

## 组件的可用方法

- query和queryAll

就是对querySelector的封装，但是查询的节点仅限于组件内。


- sliderPage和hideSlider

对w.sliderPage和w.hideSlider的封装。


- render()

用于渲染的逻辑操作，组件初始化后会自动执行render，如果返回值为Node或文本，同时还没有进行template初始化，则会进行初始化。


- view(data)

用于渲染数据，如果你在render中调用view，此时还没有进行初始化操作，这个时候view内部会自动进行初始化。


- plate(id, data)

此方法最主要的作用是获取要初始化的template节点，id可以不传，直接传递data，默认会选择第一个template。如果传递了id，则表示要使用指定id的template。这意味着你可以在template.html中编写多个template，并使用id属性进行标记。

- bindEvent(DOM)

绑定DOM节点的事件，如果渲染过程不是通过HTML文本，直接通过DOM API，这个时候，要利用框架的事件绑定机制，可以通过此方法。

示例：

```javascript

class TestComp {
  //....
  
  loadImage() {
    let img = new Image()

    img.src = '/static/images/a.jpg'

    img.dataset.onclick = 'handleImageClick'

    this.bindEvent(img)
  }

  handleImageClick(dom) {

  }
  //....
}
```

## properies

用于指定组件的属性接受的值的约束条件，可以指定类型和允许的范围，示例：

```javascript

this.properties = {
    atype: {
        type: 'string',
        //可选范围
        limit: ['a', 'b', 'c'],
        //如果指定了limit但是没有指定default，此时若atype属性不符合要求则默认值是limit第一个元素。
        default: 'a'
    },

    nm: {
        type: 'int',
        min: 1,
        max: 10,
        default: 5
    },

    list: {
        //会自动进行JSON.parse处理。但是如果数据不是合法的JSON则会设置为默认值或空对象。
        type: 'json',
    }

}

```

目前支持的类型有：

- int或number

同时可以指定min、max、limit


- float

同时可以指定min、max、limit


- string

同时可以指定min、max、limit

- json

目前没有更多辅助属性，但是json的处理要和encodeURIComponent配合使用。因为你不可能直接把json字符串通过属性传递给组件，json文本包含了双引号，还可能包括单引号，还有其他各种可能的字符，但是你可以通过encodeURIComponent把json字符串进行序列化，这种在url中可以传递的字符用在属性里是没有问题的。

对一个声明为json类型的属性，如果JSON.parse失败，会检测一些特殊字符并自动进行decodeURIComponent解码处理，并自动再次进行JSON.parse处理。

- urijson uri-json encodejson

这三种写法都可以，都认为是进行了encodeURIComponent的json数据。会自动进行 `decodeURIComponent(JSON.parse(data))` 处理。


## attrs和attributes

组件解析后的属性可以通过this.attrs获取，attrs属性是一个Proxy实例对象，内部包装处理的是__attrs__属性，此属性是记录属性的对象。attributes是浏览器自定义组件给出的用于获取组件属性的方式，Component封装利用properties和attributes解析后放在attrs中方便使用。

## 组件编译成模块

当一个组件很大，或者它不是十分频繁的使用，可以考虑编译成模块(module)，在需要时导入。模块就是ES6的标准。

导入的方式就是w.import或_import，浏览器默认的import仍然可用，同样的，w.import是对import的封装，_import是全局可用的，是w.import的别名。


w.import会自动加入构建时的路径前缀，并作了运行时缓存处理。

若要把组件编译成模块的方式需要使用config.json的配置项：

```json

{
    "componentModule": [
        "user-post", "x-plan"
    ]
}

```

此配置项支持3个值：true、false、数组。

true表示对所有组件都使用module模式，false表示都集成到主应用。使用数组则只有在数组内的才会编译成模块。

import、w.import、_import 都是返回Promise实例的异步处理，所以需要.then接受结果：

```javascript

_import('/static/module/x-plan.js').then(res => {
    console.log(res.default)
})

```

返回值res.default只是一个字符串，是组件的名字。你不需要更多的结果，导入成功后，组件就可以使用了。

## 组件属性的大小写问题

> **html的缺陷是标签名和属性区分大小写，组件的属性在浏览器查看只有小写。所以目前组件属性推荐只使用小写，properties定义的约束条件，以及attrs使用大写的属性名访问会拿不到数据，请知悉。**

## 组件的UI交互

组件内部可以调用以下方法：

- this.cover(text)

- this.uncover()

- this.prompt(text)

- this.unprompt()

- this.promptDark(text)

- this.prompt(text)

- this.promptTop(text)

- this.promptTopDark(text)

- this.promptMiddle(text)

- this.promptMiddleDark(text)

## 查找并返回方法：findMethod

- findMethod(name)

- findMethod(name, wh)

通过调用this.findMethod(name)可以查找指定name的方法，注意区分大小写。


findMethod将默认从w.config和w.ext上查找方法，你可以通过第二个参数来设置查找的顺序：

```javascript
//将会从w.ext查找login并确定如果是方法则返回。
this.findMethod('login', 'ext');

//更改顺序，默认的是['config', 'ext]
this.findMethod('login', ['ext', 'config']);

```

## 组件的解耦合以及通用性

通用型的组件编写起来更加复杂，但是好处是一次编写，可以在很多场景下进行直接复用，可以用在很多项目上。不必每次都要修改。


要编写通用型组件，需要利用框架提供的各种机制来实现逻辑的解耦合。比如要编写一个user-login组件，用户输入后，执行的login操作并不在组件中，而是在w.config中设置的。

### user-login组件示例

**user-login.js**

```javascript
'use strict';

class UserLogin extends Component {

  constructor() {
    super();
    
    this.properties = {
      func: {
        type: 'string'
      },

      hideforgetusername: {
        type: 'boolean',
        default: false,
      },

      hideforgetpasswd: {
        type: 'boolean',
        default: false,
      }
    };

    this.loginFunc = null

    this.forgetUsernameFunc = null

    this.forgetPasswdFunc = null
  }

  //在render之前执行，此时已经创建好shadow DOM。
  init() {
    let fname = this.attrs.func || 'login'

    if (w.config[fname] && typeof w.config[fname] === 'function') {
      this.loginFunc = w.config[fname]
    }
  }

  login(fm) {
    if (!this.loginFunc) {
      return notifyTopError('没有配置login方法用于登录，请通过属性func配置对应的方法名字，或者直接在app.js中设置w.config.login作为登录的处理函数。', 15000)
    }

    let {username,passwd} = fm.value
    if (!username || !passwd) {
      notifyTopError('用户名和密码不能为空')
    }

    this.loginFunc(fm.value)
    
  }

  //返回字符串或DOM节点。
  render() {
    // 也可以返回字符串 return 'user-login组件';
    return this.plate();
  }

  //渲染完成后执行
  afterRender() {

    if (this.attrs.hideforgetpasswd) {
      this.view({
        forgetPasswd: ''
      })
    }

    if (this.attrs.hideforgetusername) {
      this.view({
        forgetUsername: ''
      })
    }
  }

  forgetUsername() {
    let ff = w.config.forgetUsername
    if (!ff || typeof ff !== 'function') {
      return w.notifyTopError('未定义w.config.forgetUsername函数。')
    }

    w.config.forgetUsername()
  }

  forgetPasswd() {
    let ff = w.config.forgetPasswd
    if (!ff || typeof ff !== 'function') {
      return w.notifyTopError('未定义w.config.forgetPasswd函数。')
    }

    w.config.forgetPasswd()
  }

  onload() {

  }

}
```

**template.html**

```html
<template>
<style>
</style>

<div row c-12 padding inset-shadow>
  <form data-onsubmit="login" style="width: 100%;" autocomplete="off">
    <input type="text" name="username" long-input placeholder="用户名" required><br>
    <input type="password" name="passwd" mtop-0-5 long-input placeholder="密码" required><br>
    <div align-center mtop>
      <input type="submit" value="登录">
    </div>
  </form>
  <div c-12 row mtop-2 text-shadow>
    <div c-6 data-name="forgetUsername">
      <span middle click click-middle data-onclick="forgetUsername">忘记用户名</span>
    </div>
    <div c-6 align-right data-name="forgetPasswd">
      <span middle click click-middle data-onclick="forgetPasswd">找回密码</span>
    </div>
  </div>
</div>
</template>

```

## 组件的属性和状态变化

this.attributes是组件原始的属性，它是一个NamedNodeMap实例对象。但是使用起来十分复杂并且还需要自己去处理得到的数据，比如转换成数字或数组等。

this.attributes仍然存在另一个问题，那就是如果不是节点的默认具备的属性，是无法监听到属性变化的事件的。就要是明确写在html代码中的属性才会出现在这里，也才可以具备监听的机制。

组件内必须存在以下方法才可以具备监听属性变化和处理变化回调函数的能力：

```javascript

  onattrchange (name, oldValue, newValue) {
    console.log(name, oldValue, newValue)
  }

  static get observedAttributes() {
    //如果你要监控某些属性的变化，你需要在onattrchange中处理。
    //要在属性变化时触发onattrchange函数，你需要在此函数中返回对应的属性。
    return ['class', 'name', 'id'];
  }

```

以上代码是说只有class、name、id三个属性发生变化，才会触发onattrchange函数。

还有一个问题是，如果你在程序里设置this.attributes是不会触发事件函数的。你需要在一个使用组件的外部，通过获取到的DOM节点，设置属性，会触发onattrchange事件函数。

----

组件提供了this.attrs用于获取和设置属性，this.attrs是对this.__attrs__的代理对象，当给this.attrs设置属性或删除属性，同样会触发onattrchange事件，不过需要注意的是，这个是每个属性都会触发。

## 相关属性和函数

### this.\_\_init\_\_

用于标记是否已经执行过初始化，若为true则表示已经进行过shadow节点的模板内容加载。并且在此之前已经执行了init函数。

### this.allAttrs()

获取所有的属性，返回值是一个object，其实就是把this.__attrs__属性返回了。


----

## 组件的数据传递

组件在需要进行数据操作的时候，比如要进行网络请求。这些都不是通用的处理，不同的应用会有不同的需求，所以组件要做到尽可能通用，就要把这些操作独立出来。有两种方式可以让组件尽可能做到通用：

1. 通过传递一个函数，让组件去执行。

2. 组件把数据传递出去。

### 第一种方式：传递函数

组件支持某些属性，利用属性告知组件在某些动作完成的时候进行某些操作。但是属性传递的都是字符串，需要利用w.runFunc接口。

wight框架具备runFunc接口，可以执行一个在w上存在的函数：

```javascript
//执行w.config.login函数。
w.runFunc('config.login', {username: 'xxxx', passwd: 'xxxxxx'})
```

### 第二种方式：组件传递数据

组件使用w.share传递数据，其实组件还可以利用w.share获取数据。

w.share是框架层面提供的全局共享数据的机制。并且利用 `w.registerShareNotice(options)` 注册的函数可以监听某些数据的更改。

具体参考全局API部分。

<br>

## channel：数据通道

从v3.6版本开始，支持channel功能，channel其实就是利用w.share的机制进行扩展的。

默认创建组件会自动具备channel属性，其格式为：'chan::组件名字'，以下是示例代码：

当channel有数据过来，则会触发channelInput事件函数，当有其他模块读取channel，则会触发channelOutput事件函数。

```javascript
'use strict';

class XTimeTest extends Component {

  constructor() {
    super(); //必须写在最开始。

    //通过this.attrs访问所有属性。this.attributes是浏览器原始提供的属性对象。
    //this.attrs是为了方便而做的映射。

    //this.shadow可以访问shadow DOM，注意这是shadowRoot。
    //直接通过this访问组件节点自己。
    
    //属性声明示例：用于声明支持的属性和类型限制，若不需要请去掉properties的定义。
    this.properties = {
      style: {
        //type默认就是字符串
        type: 'string',
        default: ''
      },

      channel: {
        type: 'string',
        //chan::开头表示这是通道类型。
        default: 'chan::x-time-test'
      },

      //是否唯一，不允许重复注册。
      'channel-only': {
        type: 'boolean',
        default: false
      },

      //是否采用action模式
      'channel-action': {
        type: 'boolean',
        default: false
      },
    }
  }

  //在render之前执行，此时已经创建好shadow DOM。
  init() {

  }

  //返回字符串或DOM节点。
  render() {
    // 也可以返回字符串，比如： return 'x-time-test组件';
    return this.plate();
  }

  //渲染完成后执行
  afterRender() {
    
  }

  onload() {

  }

  //从DOM树中移除时触发。
  onremove() {

  }

  //通道获取了数据时触发。
  channelInput(ctx) {
    this.view('text', ctx.data)
  }

  //有其他模块获取通道数据时触发。
  channelOutput(ctx) {
    return (new Date).toLocaleString().replaceAll('/', '-')
  }

  onattrchange(name, oldValue, newValue) {
    //当改变this上的属性时，会触发此函数。
  }

  //被移动到新文档时触发。
  onadopted() {

  }

  static get observedAttributes() {
    //如果你要监控某些属性的变化，你需要在onattrchange中处理。
    //要在属性变化时触发onattrchange函数，你需要在此函数中返回对应的属性。
    //return ['class', 'name'];
  }

}
```

### channel的所在空间

一个组件经常需要复用到多个地方，如果为了避免channel的冲突，就要改channel属性的名字，这种方式是在所难免的。但是为了更方便开发，框架层面提供了space的功能：

- 通过data-space属性来限制channel的所在空间。

- 利用data-space的目的在于使用data-*自定义属性是web规范，保证最大的兼容性和维护性。

- 不仅自定义组件可用，标准的标签也可以使用。

组件初始化会自动找到父级的所在空间，直到页面顶层或遇到data-space属性。

```javascript

<div data-space="space1">
  <x-time-test></x-time-test>
</div>

<div data-space="space2">
  <x-time-test></x-time-test>
  <x-time-test data-space="space3"></x-time-test>
</div>

```

以上3个组件：

- 第1个组件的channel为 'space1@chan::x-time-test'

- 第2个组件的channel为 'space2@chan::x-time-test'

- 第3个组件的channel为 'space3@chan::x-time-test'


### 通道函数

- this.sendChannel(data, key=null, sp=null)

发送数据到通道，key是channel属性的标识符，data为数据，sp为所在空间，默认为null表示组件自己的所在空间。

- this.getChannel(key, sp=null)

获取通道数据，key是channel属性的标识符，sp为所在空间，默认为null表示组件自己的所在空间。
