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

true表示对所有组件都使用module模式，false表示都编译成module方式。使用数组则只有在数组内的才会编译成模块。

import、w.import、_import 都是返回Promise实例的异步处理，所以需要.then接受结果：

```javascript

_import('/static/module/x-plan.js').then(res => {
    console.log(res.default)
})

```

返回值res.default只是一个字符串，是组件的名字。你不需要更多的结果，导入成功后，组件就可以使用了。
