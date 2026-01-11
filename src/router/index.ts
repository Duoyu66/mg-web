import Home from '@/pages/front-end/Home/index'
import LayoutPage from '@/components/layoutPage'
import Algorithm from "@/pages/front-end/algorithm";
import QuestionBankLayout from "@/pages/front-end/questionBank";
import CategoryList from "@/pages/front-end/questionBank/CategoryList";
import SubCategoryList from "@/pages/front-end/questionBank/SubCategoryList";
import QuestionList from "@/pages/front-end/questionBank/QuestionList";
import QuestionDetail from "@/pages/front-end/questionBank/QuestionDetail";
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
import ArticleDetail from "@/pages/front-end/Home/articleDetail";
import CodeEdit from "@/pages/front-end/codeEdit";

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
        title: "发布文章",
        path: "/publishArticle",
        component: PublishArticle,
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
                component: QuestionBankLayout,
                meta: {
                    age: 1,
                    name: "张三"
                },
                children: [
                    {
                        path: "",
                        component: CategoryList,
                        title: '题库分类'
                    },
                    {
                        path: ":categoryId",
                        component: SubCategoryList,
                        title: '子分类列表'
                    },
                    {
                        path: ":categoryId/:subCategoryId",
                        component: QuestionList,
                        title: '题目列表'
                    },
                    {
                        path: ":categoryId/:subCategoryId/:questionId",
                        component: QuestionDetail,
                        title: '题目详情'
                    }
                ]
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
            {
                title: '文章详情',
                path: "articleDetail/:id",
                component: ArticleDetail,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },

        ]
    },
    {
        title: '代码编辑器',
        path: "/codeEdit",
        component: CodeEdit,
        meta: {
            age: 1,
            name: "张三",
            showFooter: false
        }
    }
]

export default routes
