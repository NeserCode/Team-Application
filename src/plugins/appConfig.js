import path from "path"
import fs from "fs"
import Axios from "axios"
import crypto from "crypto"

var app = require('electron').remote.app
// var BrowserWindow = require('electron').remote.BrowserWindow

const appConfig = {
    getPath: () => {
        return path.join(appConfig.getUserPath("userData"), "/user/appConfig.json")
    }
    , getHost: async () => {
        return appConfig.getConfPromise().then((res) => {
            const { appInfo } = res.data
            return {
                port: appInfo.port,
                domain: appInfo.domain,
                host: appInfo.host
            }
        }).catch((e) => {
            return {
                status: 502,
                message: e.message
            }
        })
    }
    , getUserPath: (str) => {
        return app.getPath(str)
    }
    , getPathPromise: async () => {
        return new Promise((resolve) => {
            resolve({
                data: path.join(appConfig.getUserPath("userData"), "/user/appConfig.json"),
                status: 200
            })
        }).then((resolve) => { return resolve })
    }
    , getConfPromise: async () => {
        return Axios.get(appConfig.getPath())
    }
    , getRandomKey: (length) => {
        return crypto
            .randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .slice(0, length)
    }
    , getMd5String: (string) => {
        return crypto.createHash("md5").update(string).digest("hex")
    }
    , updateLocalConfig: async (obj, callback) => {
        return fs.writeFile(appConfig.getPath(), JSON.stringify(obj), callback)
    }
    , updateDBConfig: async (host, key, value, username) => {
        if (key != 'all') return Axios.post(`${host}/api/user/detail/update/${key}`, {
            username,
            key: value
        })
    }
    , updateCheckDay: async ({ host, username, appKey, timeStamp }) => {
        return Axios.post(`${host}/api/user/checkDay/check`, {
            username, appKey, timeStamp
        })
    }
    , getCheckDay: async ({ host, username }) => {
        return Axios.post(`${host}/api/user/checkDay/get`, {
            username
        })
    }
    , allCheckToday: async (host) => {
        return Axios.post(`${host}/api/user/checkDay/all`)
    }
    , getLocalIP: async () => {
        //https://api.ipify.org?format=json
        return Axios.get("https://api.ipify.org?format=json").then((d) => {
            return d.data.ip
        })
    }
    , handleUserSignIn: async ({ host, username, password, appkey, checkkey }) => {
        return Axios.post(`${host}/api/user/signin`, {
            username, password, appkey, checkkey,
        })
    }
    , handleUserSignUp: async ({ host, username, password, appkey, userkey, sex, bound }) => {
        return Axios.post(`${host}/api/user/signup`, {
            username, password, appkey, userkey, sex, bound
        })
    }
    , getHttpString: (s) => `http://${s}`
    , addLeetcodeSubmission: ({ host, leetname, username, appkey, submitid, status, timestamp }) => {
        return Axios.post(`${host}/api/user/leetcode/add`, {
            leetname, username, appkey, submitid, status, timestamp
        })
    }
    , getLeetcodeSubmission: ({ host, username, offset, limit }) => {
        return Axios.post(`${host}/api/user/leetcode/get`, { username, offset: offset ?? 0, limit: limit ?? 10 })
    }
    , allLeetcodeSubmission: ({ host, offset, limit }) => {
        return Axios.post(`${host}/api/user/leetcode/all`, { offset: offset ?? 0, limit: limit ?? 10 })
    }
    , getUserDetailById: ({ host, id }) => {
        return Axios.post(`${host}/api/user/detail/all`, { id })
    }
    , checkUsername: ({ host, username }) => {
        return Axios.post(`${host}/api/user/signin/username`, { username })
    }
    , queryHostOganizationById: ({ host, id }) => {
        return Axios.post(`${host}/api/user/oganization/query/hid`, { id })
    }

}

export default appConfig