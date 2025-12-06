import '@xyflow/react/dist/style.css';
import {BookMarked, BookOpen, Code, MessageCircleQuestionMark, Music, Rss} from "lucide-react";
// 导入 Swiper 样式
import 'swiper/css';
import 'swiper/css/effect-cards';
import {Swiper, SwiperSlide} from 'swiper/react';
import type {Swiper as SwiperType} from 'swiper';
import {EffectCards,} from 'swiper/modules';
import './index.css'
import {Card} from "antd";
import {useRef, useState} from "react";

const {Meta} = Card;

const webSites = [
    {
        title: '木瓜一块八',
        url: 'https://www.pawpaw18.cn/',
        description: '这是一段描述',
        icon: <Rss/>,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    },
    {
        title: '学习后台',
        url: 'https://stu.pawpaw18.cn/', description: '这是一段描述',
        image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800',
        icon: <BookOpen/>
    },
    {
        title: '音乐盒',
        url: 'https://stu.pawpaw18.cn/',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        description: '这是一段描述',
        icon: <Music/>
    },
    {
        title: '刷题平台',
        url: 'https://stu.pawpaw18.cn/', description: '这是一段描述',
        image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
        icon: <MessageCircleQuestionMark/>
    },
    {
        title: '木瓜编程',
        url: 'https://stu.pawpaw18.cn/',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        description: '这是一段描述',
        icon: <Code/>
    },
    {
        title: '语雀知识库',
        url: 'https://stu.pawpaw18.cn/',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        description: '这是一段描述',
        icon: <BookMarked/>
    }
]


export default function Index() {
    const swiperRef = useRef<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleCardClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const handleSwiperSlideChange = (swiper: SwiperType) => {
        setActiveIndex(swiper.activeIndex);
    };

    return (
        <div style={{background: 'linear-gradient(75deg, #1e81c0, #2b20a0 39%, #131951)'}}
             className="w-full min-h-[100vh] flex  items-center justify-start py-8 px-4">
            <div className="w-[1000px] border pl-[25px]">
                <div className="font-bold text-white text-3xl mb-2">木瓜生态</div>
                <div
                    className=" text-white text-xl">木瓜生态 现代化 学习管理系统
                </div>

                <div className="grid grid-cols-3 gap-6 mb-12">
                    {
                        webSites.map((item, index) => {
                            return <div key={index}>
                                <Card
                                    style={{
                                        width: 300,
                                        cursor: 'pointer',
                                        border: activeIndex === index ? '2px solid #1890ff' : '2px solid #d9d9d9',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => handleCardClick(index)}
                                    hoverable
                                >
                                    <Meta
                                        avatar={item.icon}
                                        title={item.title}
                                        description={item.description}
                                    />
                                </Card>
                            </div>
                        })
                    }
                </div>

            </div>

            <div className="flex-1 border overflow-hidden">
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    modules={[EffectCards]}
                    className="mySwiper w-[500px] h-[350px]"
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={handleSwiperSlideChange}
                >
                    {webSites.map((item, index) => (
                        <SwiperSlide onClick={() => window.open(item.url)} key={index}>
                            <div
                                className="w-full h-full rounded-lg overflow-hidden relative"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"/>
                                <div className="absolute bottom-[50px] left-0 right-0 p-6 ">
                                    <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                                    <span className="text-base text-white">{item.description}</span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    );
}