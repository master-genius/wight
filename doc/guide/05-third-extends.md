<!--name:内置扩展和第三方扩展-->
# 内置扩展和第三方扩展

## 内置扩展


- PointerHandle

- clipboard

- scrollEvent

- htmltag

- apicall

- ejson

- djson

- confirm

- pushStart

- querybind

- renders

- storageEvent

内置扩展不可删除，是内置模块。

---

框架层面在创建项目的时候，会默认提供一些扩展，这些扩展为开发工作提供了巨大的方便：

| 扩展文件 | 说明 | 详细 |
| ---- | ---- | ---- |
| pushStart.js | 自动把#添加到第一条历史记录 |  |
| confirm.js | 重写了window.confirm | 传递选项用于描述提示文本，以及确认的回调函数和取消的回调函数 |
| apicall.js | 封装fetch提供的api调用扩展 | 自动检测authorization，自动执行成功或失败的回调，提供get、post、put、delete常用方法。 |
| token.js | token管理扩展 |  |
| checkToken.js | 检测是否登录 |  |
| userinfo.js | 管理登录用户的基本信息 |  |
| ejson.js | 对object进行encodeURIComponent(JSON.stringify(data))处理 |  |
| djson.js | ejson的反向操作，解析ejson的数据。 |  |
| htmltag.js | 用于模板字符串的格式化处理 | 自动进行各个插值数据的检测，并对非标准的html文本转码，使用htmltag.ehtml可以直接转码带标签的数据，htmltag默认是会检测插入的文本是不是合法的html文本，如果是合法的则不会转码 &lt; 和 &gt; |
| storageEvent.js | 监听storage变化并触发对应的函数 | 此扩展可以实现一个浏览器打开多个页面，页面之前的状态同步，比如一个页面退出了，另一个页面会检测到，并且也可以跳转到登录页。 |
| timestr.js | 格式化时间字符串 | 格式：2023-10-23_23-15-06 |
| querybind.js | 添加query和queryAll方法用于CSS选择器查询。 | 查询方式和querySelector一致，只是提供第二个参数可以传递回调函数，并针对每个查询到的节点执行回调函数。 |
| renders.js | 给数组原型添加的方法，数组类型可以直接调用，接受参数为回调函数，目的是方便为每个元素构建html并整合。 |  |
| PointerHandle | 支持鼠标、触摸轨迹，实现触摸屏的处理，方便进行方向判断，距离、速度判断等 |  |
| clipboard | 便捷的剪贴板操作 |  |
| scrollEvent | 让DOM节点元素具备onScrollTop和onScrollBottom方法 | | |

这些扩展其实就是按照扩展的规则编写的，但是从一开始就内置到项目上，开发者根据需求选择是否启用。

### htmltag扩展

htmltag是一个函数，并且htmltag.ehtml也是一个函数，两个函数都是用于模板字符串的格式化。区别在于：

- htmltag会把需要格式化的字符串做检测处理，如果是合法的html文本则不会对 &lt; 和 &gt; 进行转义处理。

- htmltag.ehtml 表示的就是直接转义处理，不会做html语法检测。

示例：

```javascript

let code = '<p>OK</p>'
let text = htmltag`<div>${code}</div>`

//输出：<div><p>OK</p></div>
console.log(text)

let text2 = htmltag.ehtml`<div>${code}</div>`

//输出：<div>&lt;p&gt;OK&lt;/p&gt;</div>
console.log(text2)

```

### querybind

此扩展无需导入。启用后，dom节点具备query和queryAll方法，第一个参数就是css选择器，和querySelector一致，第二个参数是回调函数，对查询到的节点执行此函数。返回值就是querySelector或querySelectorAll的返回值。

### apicall

用于异步请求调用的扩展，封装fetch API，返回值为Promise实例。具备常用请求的静态方法：

```javascript
async function apicall(url, options)
```

- apicall.get

- apicall.post

- apicall.put

- apicall.patch

- apicall.delete

默认会在请求失败时提示错误消息，如需要自己处理，不做提示，可以传递fail选项：

apicall.get('/api/xxx', {fail: (ret) => {}})
