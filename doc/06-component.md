# 组件

组件的目录是components，一个组件就是一个目录，命名必须是x-y的形式。

创建组件：

```shell
#创建组件x-user x-login
node newcomps.js x-user x-login
```

一个组件包含的文件：

- explain.json

- [name].js

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
