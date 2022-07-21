# Team Application

![Team-Application](https://img.shields.io/badge/Team--Application-v1.2.1-000.svg) ![Electron](https://img.shields.io/badge/Electron-v13.0.0-faf.svg) ![Vue](https://img.shields.io/badge/Vue-v3.2.31-eee.svg) ![Element Plus](https://img.shields.io/badge/ElementPlus-v1.0.2--beta.28-234894.svg) ![Tailwind Css](https://img.shields.io/badge/TailwindCss-v3.0.2-678111.svg)

## 应用概述

Team 是一个基于 Vue.js 与 Electron 的 Windows 桌面应用。

提供了 Leetcode 刷题的解决方案，同时共享同一区域内所有人的有效提交记录。以加强互相之间解题思路的交流。

## 为什么制作 Team

🏓 磨练自己的技术

🎃 尝试新的领域与框架（Electron）

⚽ 为自己实验室下的伙伴提供更好的考勤与日常刷题的解决方案

## 如何使用

Team 可支持在局域网或是公网提供服务与管理方案。

### 自建服务器

Ⅰ 首先下载并安装最新的可供使用的版本

Ⅱ 打开安装好的 Team ，如果欢迎屏提示路径错误，请再重新打开一次应用以重新创建路径。

Ⅲ 下载源代码目录下的 server 文件夹与 sql 文件夹，前者为 Team 服务的主进程，提供 Team 应用的 WebAPI；后者则为 MySQL 数据库建表文件。先创建数据库与数据表，后修改 server 中的 db.js 存储的数据库名、用户名、地址端口与密码等。

安装 Team 后端服务所需依赖

```shell
$ npm install express
$ npm install mysql
$ npm install body-parser
```

完成前边的步骤后，使用 node.js 运行 teamServer.js 脚本文件。推荐使用 pm2 守护服务进程。

```shell
$ npm install pm2 -g
$ pm2 start teamServer.js --name teamServer

// 重启、停止与输出
$ pm2 restart teamServer
$ pm2 stop teamServer
$ pm2 log
```

Ⅳ 启动 Team，转到顶部的设置界面，填写目标服务器地址（不含端口）和服务端口号。尝试注册并登录，若失败则重复 Ⅱ 到 Ⅳ 。

Ⅴ 成功登录后，此时只可使用 Team 的考勤系统，若想使用 Leetcode 刷题集成需要获取 Leetcode Cookie 键值并填入对应的位置。键值获取方式：在浏览器中成功登录 Leetcode 后按下 F12 打开开发人员工具转至 网络 选项卡，进行刷新，查看相应名为 graphql 的响应体表头，找到 x-csrftoken 与 LEETCODE_SESSION对应的值并填入对应的设置中，之后转到 Team 顶部的代码界面，此时会自动进行一次 Leetcode 登录，如上述步骤产生错误则重新开始 Ⅴ 步骤。

Ⅵ 欢迎体验 Team。目前可能还有一些地方有不足，也欢迎各位提出 issue 。

### 只使用客户端

忽略步骤 Ⅲ 。

## 试用服务器

可提供的公共服务器地址 < 114.115.164.199 > : 5999

本公用服务器只提供 Team 试用相关服务功能 api，请不要进行其他行为，感谢。

## 许可

本项目持有并遵守 [MIT许可](https://github.com/NeserCode/Team-Application/blob/NeserCode/LICENSE)
