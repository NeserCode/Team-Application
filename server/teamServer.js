// rm-bp1099t6ry042ec142o.mysql.rds.aliyuncs.com:3306
// node 后端服务器
const userApi = require('./api/userApi');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 后端api路由
app.use('/api/user', userApi);

// 监听端口
app.listen(5999);

console.log('success listen at port:5999......');
