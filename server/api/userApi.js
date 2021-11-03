//userApi.js
var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')

// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect()
var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        })
    } else {
        res.json(ret)
    }
}

// 增加用户接口
router.get('/getAllUser', (req, res) => {
    var sql = $sql.allUser.get
    console.log('[/getAllUser] |===正在请求===|');
    conn.query(sql, function (err, result) {
        if (err) {
            console.log(err)
        }
        if (result) {
            console.log("[/getAllUser] |===已请求成功===|")
            res.send(result)
        }
    })
})

router.post('/addUser', (req, res) => {
    var sql = $sql.user.add;
    var params = req.body;
    console.log('[/addUser] |===正在请求===|==请求数据如下==|',params);
    conn.query(sql, [params.name, params.age], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            console.log("[/addUser] |===已请求成功===|==返回值如下==|",result)
            jsonWrite(res, result);
        }
    })
})

router.get('/searchUser/name', (req, res) => {
    var sql = $sql.user.search.name
    var params = req.query
    console.log('[/searchUser/name] |===正在请求===|==请求数据如下==|',params);
    conn.query(sql, ['%'+params.value+'%'], function (err, result) {
        if (err) {
            console.log(err)
        }
        if (result) {
            console.log("[/searchUser/name] |===已请求成功===|==返回值如下==|",result);
            res.send(result)
        }
    })
})

router.get('/searchUser/id', (req, res) => {
    var sql = $sql.user.search.id
    var params = req.query
    console.log('[/searchUser/id] |===正在请求===|==请求数据如下==|',params);
    conn.query(sql, [params.value], function (err, result) {
        if (err) {
            console.log(err)
        }
        if (result) {
            console.log("[/searchUser/id] |===已请求成功===|==返回值如下==|",result);
            res.send(result)
        }
    })
})

router.get('/searchUser/age', (req, res) => {
    var sql = $sql.user.search.age
    var params = req.query
    console.log('[/searchUser/age] |===正在请求===|==请求数据如下==|',params);
    conn.query(sql, [params.value], function (err, result) {
        if (err) {
            console.log(err)
        }
        if (result) {
            console.log("[/searchUser/age] |===已请求成功===|==返回值如下==|",result);
            res.send(result)
        }
    })
})

module.exports = router