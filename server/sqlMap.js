var sqlMap = {
    allUser: {
        get: "select * from user"
    },
    user: {
        add: "insert into user(name,age) values (?,?)",
        search:{
            id: "select * from user where id = ?",
            name: "select * from user where name like ?",
            age: "select * from user where age = ?",
        }
    },
    class: {
        searchFromName: "select * from class where class_name like %?% ",
    }
}
module.exports = sqlMap;