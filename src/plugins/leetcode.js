import Axios from "axios"
import { remote } from 'electron'
const { session } = remote
import appConfig from "./appConfig"

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
        await session.defaultSession.cookies.set(cookie);
    }
    , getCookie: (url) => {
        return new Promise((resolve, reject) => {
            session.defaultSession.cookies.get({ url })
                .then((cookie) => {
                    resolve(cookie)
                }, (error) => {
                    reject(error)
                })
        })
    }
    , clearCookie: (url, arr) => {
        for (let p = 0; p < arr.length; p++) {
            session.defaultSession.cookies.remove(url, arr[p].name)
            this.$log.log('CookieRemoved:', arr[p].name, `(${url})`);
        }
    }
    , setBeforeSubmit: async (questionSlug, callbackFn) => {
        appConfig.getConfPromise().then((res) => {
            let exp = new Date();
            let realcookie1 = {
                url: `https://leetcode.cn/problems/${questionSlug}/submit/`,
                name: 'LEETCODE_SESSION',
                value: res.data.userAccount.cookie_leetcode["LEETCODE_SESSION"],
                expirationDate: Math.round(exp.getTime() / 1000) + 30 * 24 * 60 * 60
            }
            let realcookie2 = {
                url: `https://leetcode.cn/problems/${questionSlug}/submit/`,
                name: 'x-csrftoken',
                value: res.data.userAccount.cookie_leetcode["x-csrftoken"],
                expirationDate: Math.round(exp.getTime() / 1000) + 30 * 24 * 60 * 60
            }
            session.defaultSession.cookies.set(realcookie1).then(() => {
                session.defaultSession.cookies.set(realcookie2).then(() => {
                    callbackFn()
                }
                )
            })

        })
    }
    , getSubmissionID: async (question_id, lang, typed_code, questionSlug) => {
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