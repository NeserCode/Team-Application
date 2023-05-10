var sqlMap = {
    user: {
        register: {
            init: {
                info: "insert into team_user_info(username,password,appKey,userKey) values (?,?,?,?)",
                detail: "insert into team_user_detail(id,sex,bound) values (?,?,?)"
            },
        },
        login: {
            check: "select * from team_user_info where username = ? and password = ?",
            update: {
                all: "update team_user_info set appKey = ? , checkKey = ? where username = ?",
            },
            detail: "select * from team_user_detail where id = ?"
        },
        detail: {
            update: {
                all: 'update team_user_detail set nickname = ?, avatar = ?, introduce = ?, sex = ? where id = ?',
                nickname: 'update team_user_detail set nickname = ? where id = ?',
                avatar: 'update team_user_detail set avatar = ? where id = ?',
                introduce: 'update team_user_detail set introduce = ? where id = ?',
                sex: 'update team_user_detail set sex = ? where id = ?',
                access: 'update team_user_detail set access_status = ?, access_team = ?, access_position = ? where id = ?',
            },

        },
        leetcode: {
            add: 'insert into team_leetcode_submit(userid,leetName,appKey,submitId,status,timestamp) values (?,?,?,?,?,?)',
            get: 'select * from team_leetcode_submit where userid = ? ORDER BY submitId DESC limit ?,?',
            count: 'select count(*) from team_leetcode_submit',
            all: 'select * from team_leetcode_submit ORDER BY submitId DESC limit ?,?'
        },
        checkDay: {
            check: 'insert into team_user_checkday(userid,appKey,timestamp) values (?,?,?)',
            get: 'select * from team_user_checkday where userid = ?',
            all: 'select * from team_user_checkday where timeStamp > ? ORDER BY timeStamp ASC'
        },
        get: {
            uid: "select id from team_user_info where username = ?",
            all: "select * from team_user_info where id = ?"
        }
    },
    oganization: {
        create: {
            init: {
                info: "insert into team_oganization_info(id, appKey, hostId, name, oganizationKey) values (?,?,?,?,?)",
            },
        },
        detail: {
            update: 'update team_oganization_info set name = ?, introduce = ?, avatar = ? where id = ?',
            change: 'update team_oganization_info set hostId = ? where id = ?',
            get: 'select * from team_oganization_info where id = ?',
        },
        query: {
            all: 'select * from team_oganization_info ORDER BY id ASC',
            name: "select * from team_oganization_info where name like '%?%' ORDER BY id ASC",
            hid: 'select * from team_oganization_info where hostId = ?',
            members: 'select * from team_user_info where id in (select id from team_user_detail where access_team = ?)',
        },
    },
}
module.exports = sqlMap;