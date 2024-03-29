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
    let sql = $sql.user.detail.update.all
    let params = req.body

    conn.query(sql, [params.avatar, params.bound, params.introduce, params.nickname, params.sex, params.id], (err, result) => {
        if (err) return res.status(502).send(err)
        else {
            console.log(`[${params.username} uid_${params.id} update all √]`);
            res.status(200).send(result)
        }
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
        else if (idresult[0]) conn.query(sql, [idresult[0].id], (err, result) => {
            if (err) return res.status(502).send(err)
            else {
                if (idresult[0])
                    console.log(`[${params.username} uid_${idresult[0].id} check get √]`);
                res.status(200).send(result)
            }
        })
    })
})

router.get('/checkDay/all', (req, res) => {
    let sql = $sql.user.checkDay.all
    let ssql = $sql.user.checkDay.order
    const t = new Date(new Date().toLocaleDateString()).getTime()
    let all = {}

    conn.query(sql, [t], (err, result) => {
        if (err) return res.status(502).send(err)
        else {
            // need sort by timestamp
            conn.query(ssql, [t], (serr, sresult) => {
                if (serr) return res.status(502).send(serr)
                else {
                    let orders = []
                    for (let i = 0; i < sresult.length; i++) {
                        orders.push(sresult[i].userid)
                    }

                    all = {
                        detail: result,
                        order: orders
                    }

                    console.log(`[checkDay all √]`);
                    res.status(200).send(all)
                }
            })
        }
    })
})

router.post('/checkDay/oid', (req, res) => {
    let sql = $sql.user.checkDay.oid
    let params = req.body

    conn.query(sql, [params.oid], (err, result) => {
        if (err) res.status(502).send(err)
        else {
            console.log(`[checkDay oid ${params.oid} √]`);
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

// 获取用户信息 | uid
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

// 获取所有组织 | get method
router.get('/organization/query/all', (req, res) => {
    let sql = $sql.organization.query.all

    conn.query(sql, (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization query all √]`);
            res.status(200).send(result)
        }
    })
})


// 组织管理者 获取所管理组织 | hid
router.post('/organization/query/hid', (req, res) => {
    let sql = $sql.organization.query.hid
    let params = req.body

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization query hid ${params.id} √]`);
            res.status(200).send(result)
        }
    })
})

// 获取组织信息 | oid
router.post('/organization/detail/get', (req, res) => {
    let sql = $sql.organization.detail.get
    let params = req.body

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization query oid ${params.id} √]`);
            res.status(200).send(result)
        }
    })
})

// 获取组织成员 | id
router.post('/organization/query/members', (req, res) => {
    let sql = $sql.organization.query.members
    let params = req.body
    let sql2 = $sql.organization.query.membersDetail
    let all = { members: [], detail: [] }

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization query members ${params.id} √]`);
            all.members = result
            conn.query(sql2, [params.id], (err2, result2) => {
                if (err2) return res.status(502).send({ message: err2.sqlMessage, errorCode: err2.errno })
                else {
                    console.log(`[organization query members detail ${params.id} √]`);
                    all.detail = result2
                    res.status(200).send(all)
                }
            })
        }
    })
})

// 新建组织 | appKey, hostId, name, organizationKey
router.post('/organization/create/init', (req, res) => {
    let sql = $sql.organization.create.init
    let params = req.body

    conn.query(sql, [params.appKey, params.hostId, params.name, params.organizationKey], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization create hid ${params.hostId} √]`);
            res.status(200).send(result)
        }
    })
})

// 组织名重复检查
router.post('/organization/check/oname', (req, res) => {
    let sql = $sql.organization.check.oname
    let params = req.body

    conn.query(sql, [params.name], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization check name ${params.name} √]`);
            res.status(200).send(result)
        }
    })
})

// 申请加入组织 | uid, oid
router.post('/organization/apply', (req, res) => {
    let sql = $sql.organization.action.apply
    let params = req.body

    conn.query(sql, [params.oid, params.uid], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization join oid ${params.oid} √]`);
            res.status(200).send(result)
        }
    })
})

// 加入组织 | uid, oid
router.post('/organization/join', (req, res) => {
    let sql = $sql.organization.action.join
    let dsql = $sql.organization.detail.get
    let params = req.body

    conn.query(dsql, [params.oid], (derr, dresult) => {
        if (derr) return res.status(502).send({ message: derr.sqlMessage, errorCode: derr.errno })
        else {
            conn.query(sql, [dresult[0].status, params.oid, params.uid], (err, result) => {
                if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
                else {
                    console.log(`[organization join oid ${params.oid} √]`);
                    res.status(200).send(result)
                }
            })
        }
    })
})

// 退出组织 | uid
router.post('/organization/quit', (req, res) => {
    let sql = $sql.organization.action.quit
    let params = req.body

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization quit uid ${params.id} √]`);
            res.status(200).send(result)
        }
    })
})



// 更新用户认证状态
router.post('/access/update', (req, res) => {
    let osql = $sql.organization.detail.get
    let sql = $sql.user.access.update
    let params = req.body

    conn.query(osql, [params.oid], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            conn.query(sql, [Number(0), params.oid, result[0].hostId == params.uid ? "HOST" : "JOIN", params.uid], (err, result) => {
                if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
                else {
                    console.log(`[organization check name ${params.name} √]`);
                    res.status(200).send(result)
                }
            })
        }
    })
})

// 获取用户信息
router.post('/detail/key', (req, res) => {
    let csql = $sql.user.get.checkKey
    let sql = $sql.user.detail.get
    let params = req.body
    let all = {
        detail: {},
        info: {}
    }

    conn.query(csql, [params.userKey, params.checkKey], (cerr, cresult) => {
        if (cerr || !cresult[0]) {
            return res.status(201).send({ message: 'No Such Key', errorCode: 201 })
        }
        else {
            conn.query(sql, [cresult[0].id], (err, result) => {
                if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
                else {
                    all.info = cresult[0]
                    all.detail = result[0]
                    console.log(`[detail get by key [√]`);
                    res.status(200).send(all)
                }
            })
        }
    })
})

// 更新组织信息 | oid, name
router.post('/organization/update/name', (req, res) => {
    let sql = $sql.organization.detail.update.name
    let params = req.body

    conn.query(sql, [params.name, params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization update name oid ${params.id} √]`);
            res.status(200).send(result)
        }
    })
})

// 激活组织状态
router.post('/organization/active', (req, res) => {
    let sql = $sql.organization.action.active
    let csql = $sql.organization.check.active
    let params = req.body

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            conn.query(csql, [params.id], (cerr, cresult) => {
                if (cerr) return res.status(502).send({ message: cerr.sqlMessage, errorCode: cerr.errno })
                else {
                    console.log(`[organization active oid ${params.id} √]`);
                    res.status(200).send(result)
                }
            })
        }
    })
})

// 吊销组织状态
router.post('/organization/deactive', (req, res) => {
    let sql = $sql.organization.action.deactive
    let csql = $sql.organization.check.deactive
    let params = req.body

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            conn.query(csql, [params.id], (cerr, cresult) => {
                if (cerr) return res.status(502).send({ message: cerr.sqlMessage, errorCode: cerr.errno })
                else {
                    console.log(`[organization deactive oid ${params.id} √]`);
                    res.status(200).send(result)
                }
            })
        }
    })
})

// 解散组织
router.post('/organization/delete', (req, res) => {
    let sql = $sql.organization.action.free
    let csql = $sql.organization.check.free

    let params = req.body

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            conn.query(csql, [params.id], (cerr, cresult) => {
                if (cerr) return res.status(502).send({ message: cerr.sqlMessage, errorCode: cerr.errno })
                else {
                    console.log(`[organization delete oid ${params.id} √]`);
                    res.status(200).send(result)
                }
            })
        }
    })
})

// 转让组织
router.post('/organization/transfer', (req, res) => {
    let sql = $sql.organization.action.transfer

    let params = req.body

    conn.query(sql, [params.uid, params.oid], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else {
            console.log(`[organization transfer oid ${params.id} => uid ${params.uid} √]`);
            res.status(200).send(result)
        }
    })
})

// 公告相关
router.post('/announcement/create', (req, res) => {
    let sql = $sql.announcement.create
    let params = req.body

    conn.query(sql, [params.oid, params.open, params.content, params.timeStamp], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else res.status(200).send(result)
    })
})

router.get('/announcement/get/all', (req, res) => {
    let sql = $sql.announcement.get.all

    conn.query(sql, (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else res.status(200).send(result)
    })
})

router.post('/announcement/get/oid', (req, res) => {
    let sql = $sql.announcement.get.oid
    let params = req.body

    conn.query(sql, [params.oid], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else res.status(200).send(result)
    })
})

router.get('/announcement/get/open', (req, res) => {
    let sql = $sql.announcement.get.open

    conn.query(sql, (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else res.status(200).send(result)
    })
})

router.get('/announcement/get/not-open', (req, res) => {
    let sql = $sql.announcement.get.notOpen

    conn.query(sql, (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno })
        else res.status(200).send(result)
    })
})

router.post('/announcement/update/open', (req, res) => {
    let sql = $sql.announcement.update.open
    let params = req.body

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno, sql: err.sql })
        else res.status(200).send(result)
    })
})

router.post('/announcement/update/content', (req, res) => {
    let sql = $sql.announcement.update.content
    let params = req.body

    conn.query(sql, [params.content, params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno, sql: err.sql })
        else res.status(200).send(result)
    })
})

router.post('/announcement/delete', (req, res) => {
    let sql = $sql.announcement.free
    let params = req.body

    conn.query(sql, [params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno, sql: err.sql })
        else res.status(200).send(result)
    })
})

// 所有用户
router.get('/all', (req, res) => {
    let dsql = $sql.user.all.detail
    let isql = $sql.user.all.info

    conn.query(dsql, (derr, dresult) => {
        if (derr) return res.status(502).send({ message: derr.sqlMessage, errorCode: derr.errno })
        else {
            conn.query(isql, (ierr, iresult) => {
                if (ierr) return res.status(502).send({ message: ierr.sqlMessage, errorCode: ierr.errno })
                else {
                    console.log(`[all users √]`);
                    res.status(200).send({ detail: dresult, info: iresult })
                }
            })
        }
    })
})

// 修改密码
router.post('/info/password/update', (req, res) => {
    let sql = $sql.user.info.update.password
    let params = req.body

    conn.query(sql, [params.password, params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno, sql: err.sql })
        else res.status(200).send(result)
    })
})

// 修改用户状态
router.post('/info/status/update', (req, res) => {
    let sql = $sql.user.info.update.status
    let params = req.body

    conn.query(sql, [params.status, params.id], (err, result) => {
        if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno, sql: err.sql })
        else res.status(200).send(result)
    })
})

// 修改用户密码
router.post('/password/update', (req, res) => {
    let sql = $sql.user.info.update.password
    let getInfo = $sql.user.get.uid
    let getDetail = $sql.user.detail.get
    let ensure = $sql.user.get.all
    let params = req.body

    conn.query(getInfo, [params.username], (infoErr, infoResult) => {
        if (infoErr) return res.status(502).send({ message: infoErr.sqlMessage, errorCode: infoErr.errno, sql: infoErr.sql })
        else
            conn.query(getDetail, [infoResult[0].id], (detailErr, detailResult) => {
                if (detailErr) return res.status(502).send({ message: detailErr.sqlMessage, errorCode: detailErr.errno, sql: detailErr.sql })
                else
                    conn.query(ensure, [infoResult[0].id], (ensureErr, ensureResult) => {
                        if (ensureErr) return res.status(502).send({ message: ensureErr.sqlMessage, errorCode: ensureErr.errno, sql: ensureErr.sql })
                        else {
                            if ((detailResult[0].bound == params.bound && ensureResult[0].userKey == params.userKey))
                                conn.query(sql, [params.password, infoResult[0].id], (err, result) => {
                                    if (err) return res.status(502).send({ message: err.sqlMessage, errorCode: err.errno, sql: err.sql })
                                    else res.status(200).send(result)
                                })
                            else return res.status(201).send({ message: 'Wrong Bound or UserKey', errorCode: 201 })
                        }
                    })
            })
    })
})


module.exports = router