# 「狗了个狗」小游戏

[点击这里玩游戏](https://web-games.github.io/dog-dog/dist/index.html)

## 游戏逻辑

地图生成

道具的实现

* 暂存道具
* 随机道具
* 撤销道具

动效的实现

* 从排堆进入 pendding 区域
* 从 pendding 区域进入暂存区
* 使用随机道具时候的动画
* 集齐 3 个卡片时候的消除动画

## 技术栈

* 架构
    * 项目框架 [MVC](https://puremvc.org/)
* 构建
    * 项目构建/模块化打包 [webpack](https://webpack.docschina.org/)
* 开发
    * 规范
        * 代码质量 [tslint](https://palantir.github.io/tslint/)
        * 代码风格 [prettier]()
    * 技术
        * 开发语言 [TypeScript](https://www.tslang.cn/)
        * WebGL渲染 [PIXI.js](https://www.pixijs.com/)
        * 动画制作 [GreenSock](https://greensock.com/gsap/)
* 测试
    * 测试框架 [jest]()
* 部署
    * 自动化部署 [Jenkins]()
* 其他
    * 代码托管 [Git]()