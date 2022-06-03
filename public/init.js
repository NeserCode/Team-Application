const { app } = window.require("electron").remote;
const fs = window.require("fs");

let ibody = document.querySelector(".info");
ibody.innerHTML = `检查路径 ${app.getPath("userData")}\\user`;

fs.readdir(`${app.getPath("userData")}\\user`, (err, data) => {
    if (err) {
        ibody.innerHTML += "<br />" + err;
        fs.mkdir(`${app.getPath("userData")}\\user`, () => {
            console.log("新建成功");
            ibody.innerHTML += "<br />" + " 新建成功";
        });
    } else {
        ibody.innerHTML += "<br />检测到目录存在";
        console.log(data);
        fs.rmdir(`${app.getPath("userData")}\\user`, () => {
            console.log("删除成功");
            ibody.innerHTML += "<br />删除成功";
        });
    }
});