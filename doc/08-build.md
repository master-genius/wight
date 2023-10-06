# 应用构建

这个过程就是把相关的页面、组件等代码打包成一个html文件，并且这个文件可能会引入static目录下的静态文件，所以打包后的应用html文件和static目录要一并给后端服务进行部署。

构建应用进行压缩：

```shell
#快捷选项是-c，等效于：node build.js -c first second 
node build.js --compress first second 
```

如果没有指定压缩的-c选项，将会根据config.json配置项buildCompress的配置决定是否进行代码压缩处理。

构建后的应用是一个以应用名称命名的html文件，并且放在项目的根目录下。
