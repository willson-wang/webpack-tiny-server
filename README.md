### webpack-tiny-server 搭建webpack开发环境服务

基于webpack-dev-middleware + webpack-hot-middleware + http-proxy-middleware搭建，相比webpack-dev-server会更简单、使用sse代替socket来实现服务端与客户端之间的通信

### 包含功能

- profile 控制台输出打包信息
- progress 控制台输出打包进度
- stdin 关闭webpack的stdin配置
- open 是否打开浏览器
- useLocalIp 使用本地ip打开页面
- open-page 制定打开的页面
- color 控制台输出颜色
- info 输出等级
- quiet 静默输出
- client-log-level 浏览器输出信息等级
- content-base 根目录
- port 端口号
- public 公共资源路径
- host host

### Getting Started

```
npm install webpack-tiny-server --save-dev
yarn add webpack-tiny-server --dev
```

### Usage

推荐两种使用模块的方法：

<h4>With the CLI</h4>
使用它的最简单方法是使用CLI。在webpack.config.js所在的目录中，运行

```
node_modules/.bin/webpack-tiny-server
```

<h4>With NPM Scripts</h4>
NPM package.json脚本是一种运行本地安装的二进制文件的便捷实用的方法，而不必担心它们的完整路径。
只需这样定义一个脚本：

```
"scripts": {
  "start": "webpack-tiny-server"
}
```

并在终端/控制台中运行以下命令：

```
yarn start
```

<h4>The Result</h4>
这两种方法都将启动服务器实例，并开始在端口8080上侦听来自localhost的连接。默认情况下，将webpack-tiny-server配置为在服务器运行时编辑资产时支持文件的实时重载

### License

[MIT](https://github.com/willson-wang/webpack-tiny-server/blob/master/LICENSE)