import Axios from "axios"
import { remote } from 'electron'
const { session } = remote

const leetcode = {
    getQuestion: async (slug) => {
        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            headers: {
                'authority': 'leetcode-cn.com',
                'x-timezone': 'Asia/Shanghai',
                'x-operation-name': 'questionData',
                'accept-language': 'zh-CN',
                'content-type': 'application/json',
                'accept': '*/*',
                'x-definition-name': 'question'
            },
            data: JSON.stringify({
                "operationName": "questionData",
                "variables": {
                    "titleSlug": slug
                },
                "query": "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    categoryTitle\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    langToValidPlayground\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    envInfo\n    book {\n      id\n      bookName\n      pressName\n      source\n      shortDescription\n      fullDescription\n      bookImgUrl\n      pressImgUrl\n      productUrl\n      __typename\n    }\n    isSubscribed\n    isDailyQuestion\n    dailyRecordStatus\n    editorType\n    ugcQuestionId\n    style\n    exampleTestcases\n    __typename\n  }\n}\n"
            })
        };

        return Axios(config)
    }
    , getQuestionSet: (categorySlug, skip, limit) => {
        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            headers: {
                'authority': 'leetcode-cn.com',
                'content-type': 'application/json',
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,fr;q=0.5,zh-TW;q=0.4',
            },
            data: JSON.stringify({
                "query": "\n    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {\n  problemsetQuestionList(\n    categorySlug: $categorySlug\n    limit: $limit\n    skip: $skip\n    filters: $filters\n  ) {\n    total\n    questions {\n      acRate\n      difficulty\n    solutionNum\n     title\n      titleCn\n      titleSlug\n   }\n  }\n}\n",
                "variables": {
                    "categorySlug": categorySlug ?? "",
                    "skip": skip ?? 0,
                    "limit": limit ?? 30,
                    "filters": {}
                }
            })
        };

        return Axios(config)
    }
    , getQuestionStatus: () => {
        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            headers: {
                'authority': 'leetcode-cn.com',
                'accept': '*/*',
                'content-type': 'application/json'
            },
            data: JSON.stringify({
                "operationName": "allQuestionsStatuses",
                "variables": {},
                "query": "query allQuestionsStatuses {\n  allQuestionsBeta {\n    ...questionStatusFields\n    __typename\n  }\n}\n\nfragment questionStatusFields on QuestionNode {\n  questionId\n  status\n  __typename\n}\n"
            })
        };

        return Axios(config)
    }
    , setCookie: (url, name, value) => {
        let exp = new Date();
        const cookie = { url, name, value, expirationDate: Math.round(exp.getTime() / 1000) + 30 * 24 * 60 * 60 }
        return new Promise((resolve, reject) => {
            session.defaultSession.cookies.set(cookie)
                .then(() => {
                    // success
                    resolve(session.defaultSession.cookies)
                }, (error) => {
                    reject(error)
                })
        })
    }
    , getCookie: (url) => {
        return new Promise((resolve, reject) => {
            session.defaultSession.cookies.get({ url })
                .then((cookie) => {
                    // success
                    // cookie.forEach((item) => {
                    //     if (item.name != 'LEETCODE_SESSION')
                    //         leetcode.clearCookie("https://leetcode-cn.com/graphql/", item.name)
                    // })
                    resolve(cookie)
                }, (error) => {
                    reject(error)
                })
        })
    }
    , clearCookie: (url, arr) => {
        // console.log(session.defaultSession.cookies);
        for (let p = 0; p < arr.length; p++) {
            session.defaultSession.cookies.remove(url, arr[p].name)
            console.log('CookieRemoved:', arr[p].name, `(${url})`);
        }
    }
    , getSubmissionID: (question_id, lang, typed_code, questionSlug) => {
        session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://leetcode-cn.com/problems/*'] }, (details, callback) => {
            details.requestHeaders['Referer'] = `https://leetcode-cn.com/problems/${questionSlug}/submissions/`
            details.requestHeaders['User-Agent'] = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36 Edg/100.0.1185.39`
            callback({ cancel: false, requestHeaders: details.requestHeaders })
        })

        var config = {
            method: 'post',
            url: `https://leetcode-cn.com/problems/${questionSlug}/submit/`,
            headers: {
                'authority': 'leetcode-cn.com',
                'accept': 'application/json, text/plain, */*',
                'content-type': 'application/json',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,fr;q=0.5,zh-TW;q=0.4',
            },
            data: JSON.stringify({
                "question_id": question_id,
                "lang": lang,
                "typed_code": typed_code,
                "test_mode": false,
                "test_judger": "",
                "questionSlug": questionSlug
            })
        };
        return Axios(config)

    }
    , getSubumissionStatus: (submissionID) => {
        var config = {
            method: 'get',
            url: `https://leetcode-cn.com/submissions/detail/${submissionID}/check/`,
            headers: {
                'authority': 'leetcode-cn.com',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,fr;q=0.5,zh-TW;q=0.4',
            }
        };
        return Axios(config)
    }
    , getUserStatus: () => {
        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            headers: {
                'authority': 'leetcode-cn.com',
                'content-type': 'application/json',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,fr;q=0.5,zh-TW;q=0.4',
            },
            data: JSON.stringify({
                "query": "\n    query globalData {\n  userStatus {\n    isSignedIn\n    isPremium\n    username\n    realName\n    avatar\n    userSlug\n    isAdmin\n    useTranslation\n    premiumExpiredAt\n    isTranslator\n    isSuperuser\n    isPhoneVerified\n    isVerified\n  }\n  jobsMyCompany {\n    nameSlug\n  }\n  commonNojPermissionTypes\n}\n    ",
                "variables": {}
            })
        };
        return Axios(config)
    }


}

export default leetcode