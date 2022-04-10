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
                'x-csrftoken': 'UoEHSJ7RgMFrKHgHSlZWw3swog2zdxN1uLYnDG9uoYg0yQ6djrECCW3Bn7jrIeto',
                'x-definition-name': 'question'
            },
            data: JSON.stringify({
                "operationName": "questionData",
                "variables": {
                    "titleSlug": slug
                },
                "query": "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    categoryTitle\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    difficulty\n    likes\n    similarQuestions\n    topicTags {\n      name\n      slug\n      translatedName\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      code\n}\n    stats\n    hints\n    sampleTestCase\n    metaData\n    envInfo\n    exampleTestcases\n    }\n}\n"
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
                'x-csrftoken': 'UoEHSJ7RgMFrKHgHSlZWw3swog2zdxN1uLYnDG9uoYg0yQ6djrECCW3Bn7jrIeto',
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
        leetcode.setCookie('https://leetcode-cn.com/graphql/', 'LEETCODE_SESSION', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiNDAxMjE1MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImF1dGhlbnRpY2F0aW9uLmF1dGhfYmFja2VuZHMuUGhvbmVBdXRoZW50aWNhdGlvbkJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJiNjY1N2IxYzBlNmJmNzAwZmZlZjQ2N2JkZjliZjllMmNkNjg2ODNmYTYzYWJmMGY3ZTYzYjNjZGJlOWYxNzAyIiwiaWQiOjQwMTIxNTMsImVtYWlsIjoibmVzZXJjb2RlQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoibmVzZXJjb2RlIiwidXNlcl9zbHVnIjoibmVzZXJjb2RlIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUtY24uY29tL2FsaXl1bi1sYy11cGxvYWQvdXNlcnMvbmVzZXJjb2RlL2F2YXRhcl8xNjM2NjQwNDcwLnBuZyIsInBob25lX3ZlcmlmaWVkIjp0cnVlLCJfdGltZXN0YW1wIjoxNjQ4Njk1NDU3LjkxMzE1OCwiZXhwaXJlZF90aW1lXyI6MTY1MTI1ODgwMCwidmVyc2lvbl9rZXlfIjowLCJsYXRlc3RfdGltZXN0YW1wXyI6MTY0ODY5ODY4NH0.VxtdqMw7HJKTRSSRmrAY7Qfo4ZHjl_PiyHRHlLLvP08')
        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            headers: {
                'authority': 'leetcode-cn.com',
                'accept': '*/*',
                'x-csrftoken': 'T00BcqISbj3ihq7gBXthMqpyeLF5YyN1JqnyPsVFI7VYG6CgTimevijxBze1O04e',
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
        const cookie = { url, name, value }
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
    , clearCookie: (url, name) => {
        // console.log(session.defaultSession.cookies);
        session.defaultSession.cookies.remove(url, name)
        console.log('CookieRemoved:', name, `(${url})`);
    }
    , getLeetCodeSession: (cookie) => JSON.parse(`{${cookie.substring(cookie.indexOf('LEETCODE_SESSION')).replace(`LEETCODE_SESSION=`, `"LEETCODE_SESSION":"`)}"}`).LEETCODE_SESSION
    , getSubmissionID: (question_id, lang, typed_code, questionSlug) => {
        var config = {
            method: 'post',
            url: `https://leetcode-cn.com/problems/${questionSlug}/submit/`,
            headers: {
                'authority': 'leetcode-cn.com',
                'accept': 'application/json, text/plain, */*',
                'x-csrftoken': 'T00BcqISbj3ihq7gBXthMqpyeLF5YyN1JqnyPsVFI7VYG6CgTimevijxBze1O04e',
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
                'x-csrftoken': 'T00BcqISbj3ihq7gBXthMqpyeLF5YyN1JqnyPsVFI7VYG6CgTimevijxBze1O04e',
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
                'x-csrftoken': 'T00BcqISbj3ihq7gBXthMqpyeLF5YyN1JqnyPsVFI7VYG6CgTimevijxBze1O04e',
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