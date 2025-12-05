import '@xyflow/react/dist/style.css';
import {Button, Card} from "antd";
import {useNavigate} from "react-router-dom";
import {BookMarked, BookOpen, Code, MessageCircleQuestionMark, Music, Rss} from "lucide-react";


const {Meta} = Card;
const webSites = [
    {
        title: '木瓜一块八',
        url: 'https://www.pawpaw18.cn/',
        icon: <Rss/>
    },
    {
        title: '学习后台',
        url: 'https://stu.pawpaw18.cn/',
        icon: <BookOpen/>
    },
    {
        title: '音乐盒',
        url: 'https://stu.pawpaw18.cn/',
        icon: <Music/>
    },
    {
        title: '刷题平台',
        url: 'https://stu.pawpaw18.cn/',
        icon: <MessageCircleQuestionMark/>
    },
    {
        title: '木瓜编程',
        url: 'https://stu.pawpaw18.cn/',
        icon: <Code/>
    },
    {
        title: '语雀知识库',
        url: 'https://stu.pawpaw18.cn/',
        icon: <BookMarked/>
    }
]
export default function Index() {
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/front/home')
    }
    return (
        <div className="w-full h-[100vh] flex flex-col items-center justify-start mt-0">

            <Button onClick={goHome}>去学习</Button>
            {/*<div className="w-[500px] h-[350px] border bg-amber-200 rounded-md overflow-hidden relative"*/}
            {/*     style={{minHeight: '350px'}}>*/}
            {/*    <MyFlow></MyFlow>*/}
            {/*</div>*/}
            <div className="grid grid-cols-3 gap-6">
                {
                    webSites.map((item, index) => {
                        return <div key={index}>
                            <Card
                                style={{width: 300}}


                            >
                                <Meta
                                    avatar={item.icon}
                                    title={item.title}
                                    description="这是一个个人博客"
                                />
                            </Card>
                        </div>
                    })
                }

            </div>
        </div>
    );
}