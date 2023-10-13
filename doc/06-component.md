# 组件

组件的功能基于浏览器的自定义组件，基于此封装了一个类Component，所有的组件都继承自这个类。

组件的目录是components，一个组件就是一个目录，命名必须是x-y的形式。

封装处理是十分必要的：

- 要和框架完美贴合。

- 给出更方便使用的方法和更强的功能。

- 解决循环引用问题：

浏览器的自定义组件不会解决此问题，循环引用会导致死循环直到超出浏览器限制，控制台会报错，此封装类解决了循环引用问题并在检测到循环引用时使用消息通知给出提示。

<br>

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

<br>

js文件是组件的具体逻辑。这里面已经给出了基本的结果，包括生命周期函数、注释说明等。

<br>

explain.json是组件的说明文件。


## 数据渲染

组件内同样是通过this.view进行数据渲染。组件内的渲染、data-map处理函数等和page是一样的。

## 事件

组件内的事件同样使用data-on[eventName]的形式进行事件绑定。示例：

```html
<div data-onclick="clickHandle">Event Test</div>
```

## 组件的可用方法

- query和queryAll

就是对querySelector的封装，但是查询的节点仅限于组件内。

<br>

- sliderPage和hideSliderPage

对w.sliderPage和w.hideSlidePage的封装。

<br>

- render()

用于渲染的逻辑操作，组件初始化后会自动执行render，如果返回值为Node或文本，同时还没有进行template初始化，则会进行初始化。

<br>

- view(data)

用于渲染数据，如果你在render中调用view，此时还没有进行初始化操作，这个时候view内部会自动进行初始化。

<br>

- plate(id, data)

此方法最主要的作用是获取要初始化的template节点，id可以不传，直接传递data，默认会选择第一个template。如果传递了id，则表示要使用指定id的template。这意味着你可以在template.html中编写多个template，并使用id属性进行标记。

<br>


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
        //会自动进行JSON.parse处理。但是如果数据不是合法的JSON则会设置为空对象。
        type: 'json',

    }

}

```

目前支持的类型有：

- int或number

同时可以指定min、max、limit

<br>

- float

同时可以指定min、max、limit

<br>

- string

同时可以指定min、max、limit

- json

目前没有更多辅助属性

<br>

## attrs和attributes

组件解析后的属性可以通过this.attrs获取，attrs属性是一个object。attributes是浏览器自定义组件给出的用于获取组件属性的方式，Component封装利用properties和attributes解析后放在attrs中方便使用。

## 组件编译成模块

当一个组件很大，或者它不是十分频繁的使用，可以考虑编译成模块(module)，在需要时导入。模块就是ES6的标准。

导入的方式就是w.import或_import，浏览器默认的import仍然可用，同样的，w.import是对import的封装，_import是全局可用的，是w.import的别名。

<br>

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

<br>

findMethod将默认从w.config和w.ext上查找方法，你可以通过第二个参数来设置查找的顺序：

```javascript
//将会从w.ext查找login并确定如果是方法则返回。
this.findMethod('login', 'ext');

//更改顺序，默认的是['config', 'ext]
this.findMethod('login', ['ext', 'config']);

```

## 组件的解耦合以及通用性

通用型的组件编写起来更加复杂，但是好处是一次编写，可以在很多场景下进行直接复用，可以用在很多项目上。不必每次都要修改。

<br>

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
