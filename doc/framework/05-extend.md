<!--name:扩展-->
# 扩展

扩展就是extends目录下的js文件，但是要在config.json的配置项extends中设置要启用哪些扩展。

在扩展文件中，使用exports导出模块。一个扩展是全局可以访问的功能，类似于编程语言的模块或开发库。

示例：

```javascript
'use strict'

exports.itIsExt = function () {
    notify('这是测试扩展')
}

```

需要在config.json的extends中加入：

```json
{
    "extends": [
        "itIsExt"
    ]
}
```

框架层面已经把很多核心的功能封装成了扩展，开发者不必重复封装或寻找其他扩展。

一个文件中，exports可以导出多个扩展模块，一个好的实践方案是：一个扩展文件统一加入前缀避免名称冲突。示例：

```javascript

exports.editorCreate = function() {

}

exports.editorReload = function() {

}

```

**也可以使用module.exports**

```javascript
module.exports = function() {

}
```

**冲突的模块导出会提示错误。**

### 内置扩展

内置扩展是必须存在的，它们为组件的正常运行提供支持，很多组件都依赖于某些扩展，所以内置扩展有一部分是自动加载的，不必主现在config.json配置文件中也会默认启用。

这些扩展有：

- htmltag

- apicall

- ejson

- djson

- confirm

- pushStart

- querybind

- renders

- storageEvent

具体说明，参考《指导》部分的内置扩展说明。
