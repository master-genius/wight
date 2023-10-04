# 框架整体设计

![](./wight-design.jpg)


整体设计和当前主流的方式不同，它主要特点如下：

- 没有虚拟DOM，虚拟DOM其实问题也很多。目前的前端API基本统一，尽可能使用浏览器的原生API。

- **单向数据绑定，提供了view方法用于数据渲染，大部分不必进行dom操作。**

- 支持并且鼓励在特殊情况下使用DOM标准API。

- 事件响应函数接受的参数直接带有对应的DOM节点，可以直接进行DOM操作。

- 使用封装模板字符串的函数进行HTML渲染。

- 提供onload、onshow、onhide、onunload、onscroll、onbottom、onresize等事件函数支持。

- 每个页面是独立的目录，存在对应的.js, .html, .css文件(注意这里css文件没有域的支持)。

- 使用config.json进行项目的配置。监听hashchange进行页面切换。

- **所有页面的切换都不是真的切换，只是通过css来控制显示和隐藏。**

- **w是全局对象，提供了很多组件和功能函数。**

- alert、confirm、prompt被重写为新的组件，可以提示信息，还可以作为弹出层提供复杂的交互功能。

- 通过w.ext挂载所有扩展，在config.json中配置需要启用哪些扩展。

- 在config.json中配置需要启用哪些组件。

- **提供require在ext中用于导入扩展（require是异步操作，需要await require，直接写require也可以，会被替换成await require）。**

- **通过config.json配置直接可以启用底部菜单栏，方便移动端开发。**

- 静态资源都统一放在 static 目录中，组件的静态资源统一放在static/components目录。

- **提供了w.share用于数据共享，使用w.registerShareNotice和w.removeShareNotice注册和移除共享数据通知函数。**

- **w.share用于解决全局数据共享和通信的问题，并且利用各种数据变化的事件函数完成复杂逻辑的解耦。**

