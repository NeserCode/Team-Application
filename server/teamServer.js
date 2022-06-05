// rm-bp1099t6ry042ec142o.mysql.rds.aliyuncs.com:3306
// node 后端服务器
const userApi = require('./api/userApi');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const port = 5999

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 后端api路由
app.use('/api/user', userApi);

// 监听端口
app.listen(port);

console.log(`Server deployment finish | [Port:${port}] | [Host:127.0.0.1]`);
