const { app } = window.require("electron").remote
const fs = window.require("fs")
const crypto = window.require("crypto")
const { ipcRenderer } = window.require("electron")

let ibody = document.querySelector(".info")
ibody.innerHTML = `检查设置路径 ${app.getPath("userData")}\\user\\appConfig.json`

function readExitPath(fn) {
    fs.readdir(`${app.getPath("userData")}\\user`, (err, data) => {
        if (err) fs.mkdir(`${app.getPath("userData")}\\user`, () => { })
        else fn()
        return data
    });
}

function readMain() {
    fs.readFile(
        initPath(),
        (err, data) => {
            try {
                if (err || !JSON.parse(data) || JSON.parse(data) == null) {
                    handleLog(`读取设置时发生错误 ${err}`)
                    fs.writeFile(
                        initPath(),
                        JSON.stringify(initConfig()),
                        () => {
                            handleLog("新建设置写入成功")
                            ipcRenderer.send('loading-finish')
                        }
                    );
                } else {
                    handleLog(`应用设置正常 ${JSON.parse(data).appInfo.version}`)
                    // fs.rm(`${app.getPath("userData")}\\user\\appConfig.json`, () => {
                    //     handleLog("删除设置成功")
                    // });
                    if (JSON.parse(data).appInfo.key == null || JSON.parse(data).appInfo.key.length != 16) {
                        handleLog("应用键值检查异常及修复 AppKey")
                        let so = JSON.parse(data)
                        so.appInfo.key = getRandomKey(16)
                        fs.writeFile(initPath(), JSON.stringify(so), (err) => {
                            if (err) handleLog(`AppKey 修复失败 请联系管理员 ${err}`)
                            else handleLog(`AppKey 修复成功 请等待应用启动`)
                            ipcRenderer.send('loading-finish')
                        })
                    } else {
                        handleLog(`应用键值检查正常 ${JSON.parse(data).appInfo.key}`)
                        handleLog("请等待应用启动")
                        ipcRenderer.send('loading-finish')
                    }
                }
            }
            catch (e) {
                handleLog(`初始化设置时发生错误 ${err}`)
                fs.writeFile(
                    initPath(),
                    JSON.stringify(initConfig()),
                    () => {
                        handleLog("新建设置写入成功")
                        ipcRenderer.send('loading-finish')
                    }
                );
            }
        }
    );

}

function handleLog() {
    for (let i = 0; i < arguments.length; i++) {
        ibody.innerHTML += `<br/> ${arguments[i]}`
    }
}

function initPath() {
    return `${app.getPath("userData")}\\user\\appConfig.json`
}

function initConfig() {
    return {
        appInfo: {
            name: "Team Beta",
            version: "v1.5.0 Beta",
            key: getRandomKey(16),
            host: "",
            port: "",
            domain: "",
            organization: null,
        },
        userInfo: {
            name: null,
            access: null,
            key: null,
            organization: null,
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
                'x-csrftoken': "",
                LEETCODE_SESSION: "",
            }
        }
    }
}

function getRandomKey(length) {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length)
}

(readExitPath(readMain()))()