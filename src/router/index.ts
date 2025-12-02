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
                title: '主页',
                path: "home",
                component: Home
            },
            {
                title: '算法',
                path: "algorithm",
                component: Algorithm
            },
            {
                title: '题库',
                path: "questionBank",
                component: QuestionBank
            },
            {
                title: '消息',
                path: "message",
                component: Message
            },
            {
                title: '快捷导航',
                path: "nav",
                component: Nav
            },
        ]
    }
]

export default routes