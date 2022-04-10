//userApi.js
var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var axios = require('axios')
var $sql = require('../sqlMap')

// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect()
var jsonWrite = function (result, ret) {
    if (typeof ret === 'undefined') {
        result.json({
            code: '-1',
            msg: '操作失败'
        })
    } else {
        result.json(ret)
    }
}

// 用户注册接口 |用户名、密码、appKey、userKey
// 用户登录接口 |参数：用户名、密码、keys

router.post('/signup', (req, res) => {
    var sql = $sql.user.register;
    var params = req.body;
    console.log('[/signup] => ', params);
    conn.query(sql.init.info, [params.username, params.password, params.appkey, params.userkey], (err, result) => {
        if (err) {
            jsonWrite(res, { message: err.sqlMessage, errorCode: err.errno })
        }
        if (result) {
            console.log("[/signup] √ =>", result)
            jsonWrite(res, result);
            conn.query($sql.user.get.uid, params.username, (err, idresult) => {
                if (err) jsonWrite(res, { message: err.sqlMessage, errorCode: err.errno })
                else conn.query(sql.init.detail, idresult[0].id, (err) => {
                    if (err) jsonWrite(res, { message: err.sqlMessage, errorCode: err.errno })
                })
            })
        }
    })
})

router.post('/signin', (req, res) => {
    var sql = $sql.user.login
    var params = req.body
    let all = { info: {}, detail: {} }
    console.log('[/signin] => ', params);
    conn.query(sql.check, [params.username, params.password], (checkerr, checkresult) => {
        if (checkerr) console.log(checkerr)
        else if (checkresult.length) {
            console.log("[/signin] check √ => update allkey");
            conn.query(sql.update.all, [params.appkey, params.checkkey, params.username], (updateerr) => {
                if (updateerr) console.log(updateerr);
                else console.log("[/signin] update allkey √ => detail");
            })
            conn.query(sql.detail, checkresult[0].id, (detailerr, detailres) => {
                if (detailerr) console.log(detailerr)
                else {
                    console.log("[/signin] detail √ ");
                    all.detail = detailres
                    res.send(all)
                }
            })
            all.info = checkresult
        } else res.send(checkresult)
    })
    console.log('----------------------');
})

//用户更新资料 |updateItem、username

router.post('/detail/update/all', (req, res) => {
    let sql = $sql.user.detail.update
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) jsonWrite({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql.all, [params.nickname, params.avatar, params.introduce, params.sex, idresult[0].id], (err, reslut) => {
            if (err) jsonWrite({ message: err.sqlMessage, errorCode: err.errno })
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update all √]`);
                res.send(reslut)
            }
        })
    })
})

router.post('/detail/update/nickname', (req, res) => {
    let sql = $sql.user.detail.update.nickname
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) jsonWrite({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [params.key, idresult[0].id], (err, reslut) => {
            if (err) jsonWrite({ message: err.sqlMessage, errorCode: err.errno })
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update nickname √]`);
                res.send(reslut)
            }
        })
    })
})

router.post('/detail/update/avatar', (req, res) => {
    let sql = $sql.user.detail.update.avatar
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) jsonWrite({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [params.key, idresult[0].id], (err, reslut) => {
            if (err) jsonWrite({ message: err.sqlMessage, errorCode: err.errno })
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update avatar √]`);
                res.send(reslut)
            }
        })
    })
})

router.post('/detail/update/introduce', (req, res) => {
    let sql = $sql.user.detail.update.introduce
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) jsonWrite({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [params.key, idresult[0].id], (err, reslut) => {
            if (err) jsonWrite({ message: err.sqlMessage, errorCode: err.errno })
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update introduce √]`);
                res.send(reslut)
            }
        })
    })
})

router.post('/detail/update/sex', (req, res) => {
    let sql = $sql.user.detail.update.sex
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) jsonWrite({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [params.key, idresult[0].id], (err, reslut) => {
            if (err) jsonWrite({ message: err.sqlMessage, errorCode: err.errno })
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update sex √]`);
                res.send(reslut)
            }
        })
    })
})

//用户签到 |username、appkey、checkObj

router.post('/checkDay/check', (req, res) => {
    let sql = $sql.user.checkDay.check
    let params = req.body

    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) jsonWrite({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [idresult[0].id, params.appKey, params.checkDay, params.month, params.isSuper], (err, reslut) => {
            if (err) res.send(err)
            else {
                console.log(`[${params.username} uid_${idresult[0].id} check √]`);
                res.send(reslut)
            }
        })
    })
})

router.post('/checkDay/get', (req, res) => {
    let sql = $sql.user.checkDay.get
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) jsonWrite({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [idresult[0].id], (err, reslut) => {
            if (err) jsonWrite({ message: err.sqlMessage, errorCode: err.errno })
            else {
                console.log(`[${params.username} uid_${idresult[0].id} check get √]`);
                res.send(reslut)
            }
        })
    })
})

module.exports = router