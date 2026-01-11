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
import Register from "@/pages/front-end/register";
import Question from "@/pages/front-end/question";
import QuestionNav from "@/pages/front-end/question/questionNav";
import QuestionHome from "@/pages/front-end/question/questionHome";
import ExamPage from "@/pages/front-end/question/questionHome/examPage";
import FinishPage from "@/pages/front-end/question/questionHome/finishPage";
import PublishArticle from "@/pages/front-end/publishArticle";
import ArticleDetail from "@/pages/front-end/Home/articleDetail";
import CodeEdit from "@/pages/front-end/codeEdit";
import CompanyList from "@/pages/front-end/company";
import CompanyDetail from "@/pages/front-end/company/detail";
import ResumeBuilder from "@/pages/front-end/resume";
import RankPage from "@/pages/front-end/rank";
import RoadmapPage from "@/pages/front-end/route";
import RoadmapDetailPage from "@/pages/front-end/route/detail";
import PointDetailPage from "@/pages/front-end/route/pointDetail";
import DocumentPage from "@/pages/front-end/document";
import UserCenter from "@/pages/front-end/center";
import NotePage from "@/pages/front-end/note";
import TodoPage from "@/pages/front-end/todo";
import BoardPage from "@/pages/front-end/board";
import MemberPage from "@/pages/front-end/member";
import AdminLayout from '@/pages/admin/layout';
import AdminDashboard from '@/pages/admin/home';
import AdminCompanyList from '@/pages/admin/company';
import AdminQuestion from '@/pages/admin/question';
import AdminArticle from '@/pages/admin/article';
import AdminUser from '@/pages/admin/user';

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
        title: '注册',
        path: "/register",
        component: Register,
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
        path: "/front/admin",
        component: AdminLayout,
        title: "后台管理",
        children: [
            {
                path: "",
                component: AdminDashboard,
                title: "控制台"
            },
            {
                path: "company",
                component: AdminCompanyList,
                title: "面试公司管理"
            },
            {
                path: "question",
                component: AdminQuestion,
                title: "题库管理"
            },
            {
                path: "article",
                component: AdminArticle,
                title: "文章管理"
            },
            {
                path: "user",
                component: AdminUser,
                title: "用户管理"
            }
        ]
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
               {
                title: '面试公司',
                path: "company",
                component: CompanyList,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '面试公司详情',
                path: "company/:id",
                component: CompanyDetail,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '简历制作',
                path: "resume",
                component: ResumeBuilder,
                meta: {
                    age: 1,
                    name: "张三",
                    showFooter: false
                }
            },
            {
                title: '学习排行榜',
                path: "rank",
                component: RankPage,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '学习路线',
                path: "route",
                component: RoadmapPage,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '学习路线详情',
                path: "route/:track/:id",
                component: RoadmapDetailPage,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '知识点详情',
                path: "route/:track/:id/:pointId",
                component: PointDetailPage,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
            {
                title: '文档管理',
                path: "document",
                component: DocumentPage,
                meta: {
                    age: 1,
                    name: "张三",
                    showFooter: false
                }
            },
            {
                title: '笔记',
                path: "note",
                component: NotePage,
                meta: {
                    showFooter: false
                }
            },
            {
                title: '代办',
                path: "todo",
                component: TodoPage,
                meta: {
                    showFooter: false
                }
            },
            {
                title: '留言板',
                path: "board",
                component: BoardPage,
                meta: {
                    showFooter: false
                }
            },
            {
                title: '会员积分机制',
                path: "member",
                component: MemberPage,
                meta: {
                    showFooter: false
                }
            },
            {
                title: '个人中心',
                path: "center",
                component: UserCenter,
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
