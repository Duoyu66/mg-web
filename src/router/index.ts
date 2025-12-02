import Home from '@/pages/front-end/Home/index'
import LayoutPage from '@/component/layoutPage'
import Algorithm from "@/pages/front-end/algorithm";
import QuestionBank from "@/pages/front-end/questionBank";
import Message from "@/pages/front-end/message";
import Nav from "@/pages/front-end/nav";
import Index from "@/pages/front-end/index";

const routes = [
    {
        path: "/",
        title: "官网",
        component: Index
    },
    {
        path: "/front",
        component: LayoutPage,
        title: '前端',
        children: [
            {
                title: '首页',
                path: 'index',
                component: Index,
                meta: {
                    age: 1,
                    name: "张三"
                }
            },
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
                    name: "张三"
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
        ]
    }
]

export default routes