const { app } = window.require("electron").remote;
const fs = window.require("fs");

let ibody = document.querySelector(".info");
ibody.innerHTML = `检查设置路径 ${app.getPath("userData")}\\user\\appConfig.json`;

function readExitPath(fn) {
    fs.readdir(`${app.getPath("userData")}\\user`, (err, data) => {
        if (err) fs.mkdir(`${app.getPath("userData")}\\user`, () => { });
        else fn()
        return data
    });
}

function readMain() {
    fs.readFile(
        `${app.getPath("userData")}\\user\\appConfig.json`,
        (err, data) => {
            if (err) {
                handleLog(`读取设置时发生错误 ${err}`);
                fs.writeFile(
                    `${app.getPath("userData")}\\user\\appConfig.json`,
                    JSON.stringify(initConfig()),
                    () => {
                        handleLog("新建设置写入成功");
                    }
                );
            } else {
                handleLog("应用设置路径正常 请等待应用启动");
                // fs.rm(`${app.getPath("userData")}\\user\\appConfig.json`, () => {
                //     handleLog("删除设置成功");
                // });
            }
            return data;
        }
    );

}

function handleLog(msg) {
    ibody.innerHTML += `<br/> ${msg}`
}

function initConfig() {
    return {
        appInfo: {
            name: "Team Beta",
            version: "v1.0.0 Beta",
            key: null,
            host: null,
            port: null,
            domain: null,
            orgnization: null,
        },
        userInfo: {
            name: null,
            access: null,
            key: null,
            orgnization: null,
            orPosition: null,
            bound: null,
            avatar: null,
            sex: null,
            exp: 0,
            introduce: null,
            nickname: null
        },
        userSetting: {
            alwaysOnTop: false,
            alwaysCloseDirect: false,
            colorSchemeMode: 'light',
        },
        userAccount: {
            cookie_leetcode: {
                'x-csrftoken': null,
                LEETCODE_SESSION: null,
            }
        }
    }
}

(readExitPath(readMain()))()