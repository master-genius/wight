<!--name:静态资源的自动替换-->
# 静态资源是如何处理的

对于组件来说，要引入组件自己的static目录下的文件，必须是以 ./static 开头：

```html
<img src="./static/a.png">
```

对于引入项目static目录下的静态资源则需要以 /static开头：

```html
<img src="/static/images/x.png">
```

无论是html文件中还是js中拼接的html模板字符串。其统一的静态资源都是放在static目录中，对于组件来说，组件要引用的静态资源要放在当前组件目录下的static目录内。

对应的服务端路由也需要是这样的形式，但是服务端处理可能会比较复杂，路由很多，这个时候如果提供/static/*这样的路由很可能会冲突。所以这个时候，config.json的buildPrePath配置项可以用于在静态资源前面加一个前缀路径。

<br>

## src替换操作

但是框架本身就是支持多个应用同时运行的，所以当启动一个应用，在开发模式默认的前缀路径是应用的名字，比如在apps目录下存在：xtest。

则实际请求静态资源是以下的形式：

```html
<audio src="/xtest/static/audios/x.mp3" />
```

当你运行命令进行应用构建（打包处理）：

```shell
node build.js xtest
```

这个时候会把前缀路径在打包的时候换成buildPrePath配置的项，无论哪种模式，在应用运行时，你都可以通过w.prepath获取当前的前缀路径。

这种替换操作发生在以下阶段：

- 应用打包的时候对html内容进行src替换以及css文件url路径的替换。

- 运行时，在渲染时，对html字符串进行src替换。

所以，你在开发时，可以不必考虑前缀路径，这个过程是自动完成的，它会在以下情况下发生替换操作：

- **src引入的资源路径是/static开头但是w.prepath为真。**

如果src已经是w.prepath开头或者是完整的url，是https://xxx.cn/xxx这种形式则不会替换。

<br>

## 构建过程组件的静态资源处理

注意构建过程仅支持static下的一级子目录，也就是说你可以把组件的静态资源组织成以下形式：

```plain
static/:
    x.js
    icon/:
        a.png
        b.png
    images/:
        bg.jpg
```

当进行应用的构建操作，会把组件目录内的static目录下的内容复制到 项目的static/components/[组件名]下面，这种方式实现了开发的一致性，你不必更改任何代码。
