import path from "path"
import fs from "fs"
import Axios from "axios"
import crypto from "crypto"

var app = require('electron').remote.app
// var BrowserWindow = require('electron').remote.BrowserWindow

const appConfig = {
    getPath: () => {
        return path.join(__dirname, "../../../../../../", "src/user/appConfig.json")
    },
    getUserPath: (str) => {
        return app.getPath(str)
    },
    getPathPromise: async () => {
        return new Promise((resolve) => {
            resolve({
                data: path.join(__dirname, "../../../../../../", "src/user/appConfig.json"),
                status: 200
            })
        }).then((resolve) => { return resolve })
    },
    getConfPromise: () => {
        return Axios.get(appConfig.getPath())
    },
    getRandomKey: (length) => {
        return crypto
            .randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .slice(0, length)
    },
    getMd5String: (string) => {
        return crypto.createHash("md5").update(string).digest("hex")
    },
    updateLocalConfig: (obj, callback) => {
        console.log('insert data', obj);
        return fs.writeFile(appConfig.getPath(), JSON.stringify(obj), callback)
    },
    updateDBConfig: (host, key, value, username) => {
        if (key != 'all') return Axios.post(`${host}/api/user/detail/update/${key}`, {
            username,
            key: value
        })
    },
    updateCheckDay: (host, username, month, checkDay, appKey, isSuper) => {
        return Axios.post(`${host}/api/user/checkDay/check`, {
            username, month, checkDay, appKey, isSuper
        })
    },
    getCheckDay: (host, username) => {
        return Axios.post(`${host}/api/user/checkDay/get`, {
            username
        })
    }
}

export default appConfig