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
            console.log('Host 引用');
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
    , setConfigListener: (cb) => {
        fs.watchFile(appConfig.getPath(), (curr, prev) => {
            cb && cb(prev, curr)
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
        console.log('Config 引用');
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
    , updateLocalConfig: (obj, callback) => {
        fs.writeFileSync(appConfig.getPath(), JSON.stringify(obj))
        callback && callback()
    }
    , updateDBConfig: async (host, key, value, username) => {
        if (key != 'all') return Axios.post(`${appConfig.getHttpString(host)}/api/user/detail/update/${key}`, {
            username,
            key: value
        })
    }
    , updateAllDetail: async ({ host, avatar, bound, introduce, nickname, sex, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/detail/update/all`, {
            avatar, bound, introduce, nickname, sex, id
        })
    }
    , updateCheckDay: async ({ host, username, appKey, timeStamp }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/checkDay/check`, {
            username, appKey, timeStamp
        })
    }
    , getCheckDay: async ({ host, username }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/checkDay/get`, {
            username
        })
    }
    , allCheckToday: async (host) => {
        return Axios.get(`${appConfig.getHttpString(host)}/api/user/checkDay/all`)
    }
    , getLocalIP: async () => {
        //https://api.ipify.org?format=json
        return Axios.get("https://api.ipify.org?format=json").then((d) => {
            return d.data.ip
        })
    }
    , handleUserSignIn: async ({ host, username, password, appkey, checkkey }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/signin`, {
            username, password, appkey, checkkey,
        })
    }
    , handleUserSignUp: async ({ host, username, password, appkey, userkey, sex, bound }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/signup`, {
            username, password, appkey, userkey, sex, bound
        })
    }
    , getHttpString: (s) => `http://${s}`
    , addLeetcodeSubmission: ({ host, leetname, username, appkey, submitid, status, timestamp }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/leetcode/add`, {
            leetname, username, appkey, submitid, status, timestamp
        })
    }
    , getLeetcodeSubmission: ({ host, username, offset, limit }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/leetcode/get`, { username, offset: offset ?? 0, limit: limit ?? 10 })
    }
    , allLeetcodeSubmission: ({ host, offset, limit }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/leetcode/all`, { offset: offset ?? 0, limit: limit ?? 10 })
    }
    , getUserDetailById: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/detail/all`, { id })
    }
    , checkUsername: ({ host, username }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/signin/username`, { username })
    }
    , allOrganization: ({ host }) => {
        return Axios.get(`${appConfig.getHttpString(host)}/api/user/organization/query/all`)
    }
    , queryHostOrganizationById: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/query/hid`, { id })
    }
    , getOrganizationById: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/detail/get`, { id })
    }
    , getMembersByOrganizationId: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/query/members`, { id })
    }
    , handleCreateOrganization: ({ host, appKey, hostId, name, organizationKey }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/create/init`, { appKey, hostId, name, organizationKey })
    }
    , handleApplyOrganization: ({ host, oid, uid }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/apply`, { oid, uid })
    }
    , handleJoinOrganization: ({ host, oid, uid }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/join`, { oid, uid })
    }
    , handleQuitOrganization: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/quit`, { id })
    }
    , checkOrganizationName: ({ host, name }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/check/oname`, { name })
    }
    , updateUserAccess: ({ host, oid, uid }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/access/update`, { oid, uid })
    }
    , getDetailByKeys: ({ host, userKey, checkKey }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/detail/key`, { userKey, checkKey })
    }
    , handleRenameOrganization: ({ host, name, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/update/name`, { name, id })
    }
    , handleActiveOrganization: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/active`, { id })
    }
    , handleDeactiveOrganization: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/deactive`, { id })
    }
    , handleDeleteOrganization: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/delete`, { id })
    }
    , handleTransferOrganization: ({ host, uid, oid }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/organization/transfer`, { uid, oid })
    }
    , handleCreateAnnouncement: ({ host, oid, open, content, timeStamp }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/announcement/create`, { oid, open, content, timeStamp })
    }
    , handleUpdateAnnouncementToOpen: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/announcement/update/open`, { id })
    }
    , handleUpdateAnnouncementContent: ({ host, content, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/announcement/update/content`, { content, id })
    }
    , handleDeleteAnnouncement: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/announcement/delete`, { id })
    }
    , allAnnouncement: ({ host }) => {
        return Axios.get(`${appConfig.getHttpString(host)}/api/user/announcement/get/all`)
    }
    , getAnnouncementByOid: ({ host, oid }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/announcement/get/oid`, { oid })
    }
    , getOpenAnnouncement: ({ host }) => {
        return Axios.get(`${appConfig.getHttpString(host)}/api/user/announcement/get/open`)
    }
    , getNotOpenAnnouncement: ({ host }) => {
        return Axios.get(`${appConfig.getHttpString(host)}/api/user/announcement/get/not-open`)
    }
    , allUser: ({ host }) => {
        return Axios.get(`${appConfig.getHttpString(host)}/api/user/all`)
    }
    , updateUserPassword: ({ host, password, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/info/password/update`, { password, id })
    }
    , banUser: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/info/status/update`, { status: 1, id })
    }
    , unbanUser: ({ host, id }) => {
        return Axios.post(`${appConfig.getHttpString(host)}/api/user/info/status/update`, { status: 0, id })
    }

}

export default appConfig