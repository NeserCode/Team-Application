//userApi.js
var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')

// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect()

// 用户注册接口 |用户名、密码、appKey、userKey
// 用户登录接口 |用户名、密码、keys

router.post('/signup', (req, res) => {
    var sql = $sql.user.register;
    var params = req.body;
    console.log('[/signup] => ', params);
    conn.query(sql.init.info, [params.username, params.password, params.appkey, params.userkey], (err, result) => {
        if (err) return res.status(502).send(err)
        if (result) {
            console.log("[/signup] √ =>", result)
            res.status(200).send(result);
            conn.query($sql.user.get.uid, params.username, (err, idresult) => {
                if (err) return res.status(502).send(err)
                else conn.query(sql.init.detail, [idresult[0].id, params.sex, params.bound], (err) => {
                    if (err) return res.status(502).send(err)
                })
            })
        }
    })
})

router.post('/signin', (req, res) => {
    var sql = $sql.user.login
    var params = req.body
    let all = { info: {}, detail: {} }

    conn.query(sql.check, [params.username, params.password], (checkerr, checkresult) => {
        if (checkerr) return res.status(502).send(checkerr)
        else if (checkresult.length) {
            console.log("[/signin] check √ => update allkey");
            conn.query(sql.update.all, [params.appkey, params.checkkey, params.username], (updateerr) => {
                if (updateerr) return res.status(502).send(updateerr)
                else {
                    console.log("[/signin] update allkey √ => detail");
                    conn.query(sql.detail, checkresult[0].id, (detailerr, detailres) => {
                        if (detailerr) return res.status(502).send(detailerr)
                        else {
                            console.log("[/signin] detail √ ");
                            all.detail = detailres[0]
                            res.status(200).send(all)
                        }
                    })
                    all.info = checkresult[0]
                }
            })

        } else res.status(200).send(checkresult)
    })
    console.log('----------------------');
})

router.post('/signin/username', (req, res) => {
    var sql = $sql.user.get.uid
    var params = req.body

    conn.query(sql, [params.username], (err, result) => {
        if (err) return res.status(502).send(err)
        else res.status(200).send(result)
    })
    console.log('----------------------');
})

//用户更新资料 |updateItem、username

router.post('/detail/update/all', (req, res) => {
    let sql = $sql.user.detail.update
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) return res.status(502).send({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql.all, [params.nickname, params.avatar, params.introduce, params.sex, idresult[0].id], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update all √]`);
                res.status(200).send(result)
            }
        })
    })
})

router.post('/detail/update/nickname', (req, res) => {
    let sql = $sql.user.detail.update.nickname
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) return res.status(502).send({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [params.key, idresult[0].id], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update nickname √]`);
                res.status(200).send(result)
            }
        })
    })
})

router.post('/detail/update/avatar', (req, res) => {
    let sql = $sql.user.detail.update.avatar
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) return res.status(502).send({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [params.key, idresult[0].id], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update avatar √]`);
                res.status(200).send(result)
            }
        })
    })
})

router.post('/detail/update/introduce', (req, res) => {
    let sql = $sql.user.detail.update.introduce
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) return res.status(502).send({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [params.key, idresult[0].id], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update introduce √]`);
                res.status(200).send(result)
            }
        })
    })
})

router.post('/detail/update/sex', (req, res) => {
    let sql = $sql.user.detail.update.sex
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) return res.status(502).send({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [params.key, idresult[0].id], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                console.log(`[${params.username} uid_${idresult[0].id} update sex √]`);
                res.status(200).send(result)
            }
        })
    })
})

//用户签到 |username、appkey、checkObj

router.post('/checkDay/check', (req, res) => {
    let sql = $sql.user.checkDay.check
    let params = req.body

    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) return res.status(502).send({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [idresult[0].id, params.appKey, params.timeStamp], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                console.log(`[${params.username} uid_${idresult[0].id} check √]`);
                res.status(200).send(result)
            }
        })
    })
})

router.post('/checkDay/get', (req, res) => {
    let sql = $sql.user.checkDay.get
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) return res.status(502).send({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [idresult[0].id], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                if (idresult[0])
                    console.log(`[${params.username} uid_${idresult[0].id} check get √]`);
                res.status(200).send(result)
            }
        })
    })
})

router.post('/checkDay/all', (req, res) => {
    let sql = $sql.user.checkDay.all
    conn.query(sql, [new Date(new Date().toLocaleDateString()).getTime()], (err, result) => {
        if (err) return res.status(502).send(err)
        else {
            console.log(`[${new Date().toLocaleDateString()} check all √]`);
            res.status(200).send(result)
        }
    })
})

// leetcode提交id | username,leetName,appKey,submitId,submitDay,submitMonth

router.post('/leetcode/add', (req, res) => {
    let sql = $sql.user.leetcode.add
    let params = req.body

    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) return res.status(502).send({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [idresult[0].id, params.leetname, params.appkey, params.submitid, params.timestamp, params.status], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                console.log(`[${params.username} uid_${idresult[0].id} add submission √]`);
                res.status(200).send(result)
            }
        })
    })
})

router.post('/leetcode/get', (req, res) => {
    let sql = $sql.user.leetcode.get
    let params = req.body
    conn.query($sql.user.get.uid, [params.username], (iderr, idresult) => {
        if (iderr) return res.status(502).send({ message: iderr.sqlMessage, errorCode: iderr.errno })
        else conn.query(sql, [idresult[0].id, params.offset, params.limit], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                console.log(`[${params.username} uid_${idresult[0].id} get submissions √]`);
                res.status(200).send(result)
            }
        })
    })
})

router.post('/leetcode/all', (req, res) => {
    let sql = $sql.user.leetcode.all
    let params = req.body
    conn.query($sql.user.leetcode.count, (counterr, count) => {
        if (counterr) return res.status(502).send({ message: counterr.sqlMessage, errorCode: counterr.errno })
        else {
            conn.query(sql, [params.offset, params.limit], (err, result) => {
                if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
                else {
                    console.log(`[all submissions √]`);
                    res.status(200).send({ arr: result, all: count[0]['count(*)'] })
                }
            })
        }
    })
})

// 获取用户信息 | username, uid
router.post('/detail/all', (req, res) => {
    let sql = $sql.user.login.detail
    let params = req.body

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[detail uid ${params.id} √]`);
            res.status(200).send(result)
        }
    })

})


module.exports = router