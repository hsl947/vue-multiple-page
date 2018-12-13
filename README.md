# Vue多页面脚手架

结合 Hbuilder 使用,可以快速开发 WebApp

- `支持 Npm 生态`
- `支持 vue 语法,以及 vue 生态,比如 vux,mint,vant`
- `支持 ES6/ES7 语法`
- `使用 VConsole 调试`
- `局域网便捷调试,不插数据线也可以调试`
- `纯原生html5+开发，体验堪比原生=> ` [h5+文档](http://www.html5plus.org/doc/)

## 文件结构
```shell
.
├── build  项目构建配置
├── config  开发相关配置
├── static  打包所需静态资源
├── tests  测试相关
└── src
    └── assets 项目静态资源
        ├── css  项目css文件
        ├── img  图片资源
        └── js   项目js文件
    └── utils  项目静态资源
        ├── common.js   项目公用js
        ├── request.js  接口请求js
        ├── store.js    项目本地存储js
        ├── update.js   app检测升级js
        └── webview.js  页面组件js
    ├── components  项目复用组件
    ├── page  项目页面（可嵌套路径）
    ├── App.vue  项目入口文件
    ├── main.js  项目入口文件js
    └── page.json  页面路由配置文件
└── manifest.json   app项目配置文件
```


### First install dependencies
```
npm i
``` 

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```
