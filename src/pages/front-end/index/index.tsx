import '@xyflow/react/dist/style.css';
import { BookMarked, BookOpen, Code, MessageCircleQuestionMark, Music, Rss } from "lucide-react";
// 导入 Swiper 样式
import 'swiper/css';
import 'swiper/css/effect-cards';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCards } from 'swiper/modules';
import './index.css'
import { Button, Card } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const webSites = [
    {
        title: '木瓜一块八',
        url: 'https://www.pawpaw18.cn/',
        description: '这是一段描述',
        icon: <Rss />,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    },
    {
        title: '学习后台',
        url: 'https://stu.pawpaw18.cn/', description: '这是一段描述',
        image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800',
        icon: <BookOpen />
    },
    {
        title: '音乐盒',
        url: 'https://stu.pawpaw18.cn/',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        description: '这是一段描述',
        icon: <Music />
    },
    {
        title: '刷题平台',
        url: 'https://stu.pawpaw18.cn/', description: '这是一段描述',
        image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
        icon: <MessageCircleQuestionMark />
    },
    {
        title: '木瓜编程',
        url: 'https://stu.pawpaw18.cn/',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        description: '这是一段描述',
        icon: <Code />
    },
    {
        title: '语雀知识库',
        url: 'https://stu.pawpaw18.cn/',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        description: '这是一段描述',
        icon: <BookMarked />
    }
]


export default function Index() {
    const swiperRef = useRef<SwiperType | null>(null);
    const swiperContainerRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const handleCardClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const handleSwiperSlideChange = (swiper: SwiperType) => {
        setActiveIndex(swiper.activeIndex);
    };

    // 处理鼠标滚轮事件
    useEffect(() => {
        const container = swiperContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (!swiperRef.current) return;

            e.preventDefault();
            e.stopPropagation();

            if (e.deltaY > 0) {
                // 向下滚动，切换到下一张
                swiperRef.current.slideNext();
            } else if (e.deltaY < 0) {
                // 向上滚动，切换到上一张
                swiperRef.current.slidePrev();
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);
    const goHome = () => {
        navigate('/front/home')
    }
    return (
        <div style={{ background: 'linear-gradient(75deg, #1e81c0, #2b20a0 39%, #131951)' }}
            className="w-full min-h-[100vh] flex  items-center justify-start py-8 px-4">
            <div className="w-[1000px] border pl-[25px]">
                <div className="font-bold text-white text-[56px] mb-2">木瓜生态</div>
                <div
                    className="my-2 text-white text-xl mb-16">木瓜生态 现代化 学习管理系统
                </div>
                <Button onClick={() => goHome()}> 去首页</Button>
                <div className="grid grid-cols-3 gap-6">
                    {
                        webSites.map((item, index) => {
                            return <div key={index}>
                                <Card
                                    style={{
                                        width: 300,
                                        cursor: 'pointer',
                                        border: activeIndex === index ? '2px solid #3d0bf0ff ' : '2px solid #d9d9d9',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: activeIndex === index ? '#b0bff0ff' : 'white',
                                    }}  

                                    onClick={() => handleCardClick(index)}
                                    hoverable
                                >
                                    <div className='flex justify-start items-center'>
                                        {item.icon} 
                                        <div className={`font-bold  flex-1 flex flex-col pl-4 `}>
                                            <span className={`font-bold text-[20px] ${activeIndex === index ? 'text-primary-500' : 'text-gary-500'}`}>{item.title}
                                            </span>
                                            <span className={` ${activeIndex === index ? 'text-primary-500' : 'text-gary-500'}`}>{item.description}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        })
                    }
                </div>

            </div>

            <div
                ref={swiperContainerRef}
                className="flex-1 border overflow-hidden"
            >
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
                                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                <div className="absolute bottom-[25px] left-0 right-0 p-6 ">
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