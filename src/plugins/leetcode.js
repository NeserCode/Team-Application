import Axios from "axios"
import { remote } from 'electron'
const { session } = remote

const leetcode = {
    getQuestion: async (slug) => {
        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            data: {
                operationName: "questionData",
                variables: {
                    titleSlug: slug
                },
                query: "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    categoryTitle\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    langToValidPlayground\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    envInfo\n    book {\n      id\n      bookName\n      pressName\n      source\n      shortDescription\n      fullDescription\n      bookImgUrl\n      pressImgUrl\n      productUrl\n      __typename\n    }\n    isSubscribed\n    isDailyQuestion\n    dailyRecordStatus\n    editorType\n    ugcQuestionId\n    style\n    exampleTestcases\n    __typename\n  }\n}\n"
            }
        };

        return Axios(config)
    }
    , getQuestionSet: (categorySlug, skip, limit) => {
        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            data: {
                query: "\n    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {\n  problemsetQuestionList(\n    categorySlug: $categorySlug\n    limit: $limit\n    skip: $skip\n    filters: $filters\n  ) {\n    total\n    questions {\n      acRate\n      difficulty\n    solutionNum\n     title\n      titleCn\n      titleSlug\n   }\n  }\n}\n",
                variables: {
                    "categorySlug": categorySlug ?? "",
                    "skip": skip ?? 0,
                    "limit": limit ?? 30,
                    "filters": {}
                }
            }
        };

        return Axios(config)
    }
    , getQuestionStatus: () => {
        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            data: {
                operationName: "allQuestionsStatuses",
                variables: {},
                query: "query allQuestionsStatuses {\n  allQuestionsBeta {\n    ...questionStatusFields\n    __typename\n  }\n}\n\nfragment questionStatusFields on QuestionNode {\n  questionId\n  status\n  __typename\n}\n"
            }
        };

        return Axios(config)
    }
    , setCookie: async (url, name, value) => {
        let exp = new Date();
        const cookie = { url, name, value, expirationDate: Math.round(exp.getTime() / 1000) + 30 * 24 * 60 * 60 }
        session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://leetcode-cn.com/*'] }, (details, callback) => {
            details.requestHeaders['Referer'] = `https://leetcode-cn.com`
            callback({ cancel: false, requestHeaders: details.requestHeaders })
        })
        await session.defaultSession.cookies.set(cookie);
        session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://leetcode-cn.com/*'] }, null);
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
    , setBeforeSubmit: async (questionSlug, callback) => {
        session.defaultSession.cookies.get({ url: 'https://leetcode-cn.com/graphql/' }).then((cookies) => {
                    cookies.forEach( async(item) => {
                        const { name, value } = item
                        let exp = new Date();
                        let realcookie = { url:`https://leetcode.cn/problems/${questionSlug}/submit/`, name, value, expirationDate: Math.round(exp.getTime() / 1000) + 30 * 24 * 60 * 60 }
                        await session.defaultSession.cookies.set(realcookie)
                    })
            callback()
            })
    }
    , getSubmissionID: async (question_id, lang, typed_code, questionSlug) => {
        // session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://leetcode-cn.com/problems/*'] }, (details, callback) => {
        //     details.requestHeaders['Referer'] = `https://leetcode-cn.com/problems/${questionSlug}/submissions/`
        //     callback({ cancel: false, requestHeaders: details.requestHeaders })
        // })
        session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://leetcode.cn/problems/*'] }, (details, callback) => {
            details.requestHeaders['Referer'] = `https://leetcode.cn/problems/${questionSlug}/submissions/`
            callback({ cancel: false, requestHeaders: details.requestHeaders })
        })

        var config = {
            method: 'POST',
            url: `https://leetcode.cn/problems/${questionSlug}/submit/`,
            data: {
                question_id: question_id,
                lang: lang,
                typed_code: typed_code,
                test_mode: false,
                test_judger: "",
                questionSlug: questionSlug
            }
        };
        
        const res = await Axios(config);
        // session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://leetcode-cn.com/problems/*'] }, null);
        session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://leetcode.cn/problems/*'] }, null);
        return res;

    }
    , getSubmissionStatusOnsubmit: async (submissionID) => {
        var config = {
            method: 'get',
            url: `https://leetcode-cn.com/submissions/detail/${submissionID}/check/`,
        };

        const res = await Axios(config);
        return res;
    }
    , getSubmissionStatus: async (submissionID) => {
        session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://leetcode-cn.com/*'] }, (details, callback) => {
            details.requestHeaders['Referer'] = `https://leetcode-cn.com/submissions/detail/${submissionID}/`
            callback({ cancel: false, requestHeaders: details.requestHeaders })
        })

        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            data: {
                operationName: "mySubmissionDetail",
                variables: {
                    id: submissionID.toString()
                },
                query: "query mySubmissionDetail($id: ID!) {\n  submissionDetail(submissionId: $id) {\n    id\n    code\n    runtime\n    memory\n    rawMemory\n    statusDisplay\n    timestamp\n    lang\n    isMine\n    passedTestCaseCnt\n    totalTestCaseCnt\n    sourceUrl\n    question {\n      titleSlug\n      title\n      translatedTitle\n      questionId\n      __typename\n    }\n    ... on GeneralSubmissionNode {\n      outputDetail {\n        codeOutput\n        expectedOutput\n        input\n        compileError\n        runtimeError\n        lastTestcase\n        __typename\n      }\n      __typename\n    }\n    submissionComment {\n      comment\n      flagType\n      __typename\n    }\n    __typename\n  }\n}\n"
            }
        };

        const res = await Axios(config);
        session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://leetcode-cn.com/*'] }, null);
        return res;
    }
    , getUserStatus: () => {
        var config = {
            method: 'post',
            url: 'https://leetcode-cn.com/graphql/',
            data: {
                query: "\n    query globalData {\n  userStatus {\n    isSignedIn\n    isPremium\n    username\n    realName\n    avatar\n    userSlug\n    isAdmin\n    useTranslation\n    premiumExpiredAt\n    isTranslator\n    isSuperuser\n    isPhoneVerified\n    isVerified\n  }\n  jobsMyCompany {\n    nameSlug\n  }\n  commonNojPermissionTypes\n}\n    ",
                variables: {}
            }
        };
        return Axios(config)
    }


}

export default leetcode