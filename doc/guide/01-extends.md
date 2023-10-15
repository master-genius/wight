<!--name:扩展的本质-->
# 扩展的本质

## reuqire导入

框架的扩展统一放在w.ext上。并且提供了require机制，require其实就是一个函数，用于从w.ext上获取扩展。


使用require而不是直接使用w.ext的好处一方面是可以降低代码耦合性，另一方面就是require在扩展找不到的时候会进行等待，直到找到或超时报错。


require其实是一个async function声明的函数，所以返回值是promise，但是你可以直接使用require，框架层面会自动替换成await require。

> 有一个快速导入的符号：<-。
> 当你使用：const api = <-('apicall')，
> 最后会被替换成：const api = await require('apicall')

## 扩展的依赖顺序

扩展不需要考虑依赖顺序，一个扩展内部导入其他扩展，如果此时扩展还没有导入，会进行循环等待，等待机制利用的是Promise，所以reuqire被设计为async function声明的函数。

