import Home from '@/pages/front-end/Home/index'
import LayoutPage from '@/component/layoutPage'
import Algorithm from "@/pages/front-end/algorithm";
import QuestionBank from "@/pages/front-end/questionBank";
import Message from "@/pages/front-end/message";
import Nav from "@/pages/front-end/nav";
import Index from "@/pages/front-end/index";
import TestBox from "@/pages/front-end/test";
import Login from "@/pages/front-end/login";
import Question from "@/pages/front-end/question";
import QuestionNav from "@/pages/front-end/question/questionNav";
import QuestionHome from "@/pages/front-end/question/questionHome";
import ExamPage from "@/pages/front-end/question/questionHome/examPage";
import FinishPage from "@/pages/front-end/question/questionHome/finishPage";
import PublishArticle from "@/pages/front-end/publishArticle";

const routes = [
    {
        path: "/",
        title: "官网",
        component: Index
    },
    {
        path: "/question",
        title: '刷题',
        component: Question,
        children: [
            {
                title: '入口',
                path: "nav",
                component: QuestionNav,
            },
            {
                title: '主页',
                path: "questionHome",
                component: QuestionHome,
            },
            {
                title: '考试',
                path: "examPage",
                component: ExamPage,
            },
            {
                title: '结束页',
                path: "finishPage",
                component: FinishPage,
            },
        ]
    },
    {
        title: '登录',
        path: "/login",
        component: Login,
        meta: {
            age: 1,
            name: "张三"
        }
    },
    {
        path: "/front",
        component: LayoutPage,
        title: '前端',
        children: [
            {
                title: '主页',
                path: "home",
                component: Home,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '发布文章',
                path: "publishArticle",
                component: PublishArticle,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '算法',
                path: "algorithm",
                component: Algorithm,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '题库',
                path: "questionBank",
                component: QuestionBank,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '消息',
                path: "message",
                component: Message,
                meta: {
                    age: 1,
                    name: "张三",
                    showFooter: false
                }
            },
            {
                title: '快捷导航',
                path: "nav",
                component: Nav,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '测试',
                path: "test",
                component: TestBox,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },

        ]
    }
]

export default routes
