import '@xyflow/react/dist/style.css';
import { BookMarked, BookOpen, Code, MessageCircleQuestionMark, Music, Rss } from "lucide-react";
import { Button } from "antd";
import { useEffect,  useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/component/layoutPage/footer";
import bgIndex from './img/bgIndex.svg';




export default function Index() {
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/front/home')
    }

    const features = [
        { icon: Rss, title: '统一网关', description: '一个入口，管理多服务与版本。' },
        { icon: BookOpen, title: '完善文档', description: '标准化示例与错误码说明。' },
        { icon: Code, title: '多语言示例', description: 'cURL、JS、Python 快速复制。' },
        { icon: MessageCircleQuestionMark, title: '稳定 SLA', description: '高可用与监控告警保障。' },
        { icon: Music, title: '按需计费', description: '免费额度 + 灵活扩展。' },
        { icon: BookMarked, title: '安全认证', description: 'Token 与速率限制策略。' },
    ];
    useEffect(() => {
        const t = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(t);
    }, []);
    return (
        <div style={{ background: `linear-gradient(90deg, #ffffff 0%, #f3f4f6 50%, #eef2ff 100%), url(${bgIndex}) no-repeat center center / cover` }} className="w-full relative text-gray-900 transition-colors duration-300">
              <div className={`relative z-10 flex justify-between items-center pl-[150px] pr-[15px] py-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-primary-500 text-white flex items-center justify-center font-bold shadow">mg</div>
                        <span className="font-semibold">木瓜编程 API</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">特性</a>
                        <a href="#endpoints" className="text-gray-600 hover:text-gray-900 transition-colors">示例</a>
                        <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">定价</a>
                        <Button onClick={goHome} type="primary" className="transition-all duration-300">快速开始</Button>
                    </div>
                </div>

            <div className="relative z-10 max-w-[1200px] mx-auto px-6 border">
           
                <div className={`py-12 flex flex-col md:flex-row items-center md:items-start gap-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <div className="w-full">
                        <h1 className='color-gradient-primary'>木瓜生态</h1>
                        <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">简洁、高效的开发者 API 平台</h1>
                        <p className="mt-4 text-gray-700 text-lg">统一接口、清晰文档、稳定可靠。分钟级完成接入，轻松为你的应用提供数据与服务。</p>
                        <div className="mt-6 flex gap-4">
                            <Button size="large" type="primary" onClick={goHome}>立即体验</Button>
                            <a href="https://www.baidu.com" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100">查看文档</a>
                        </div>
                    
                    </div>
           
                </div>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4" id="features">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="p-4 flex items-center gap-2 rounded-xl bg-white shadow-sm border border-gray-200 transition-transform duration-300 hover:-translate-y-1">
                                        <Icon className="text-primary-500 mx-4" />
                                <div>
                                <div className="my-2 font-semibold">{feature.title}</div>
                                <div className="text-gray-600 text-sm">{feature.description}</div>
                                </div>
                                    </div>
                                );
                            })}
                        </div>
                <div className="mt-12 py-12" id="pricing">
                    <div className="text-center">
                        <div className="text-3xl font-bold">按需使用，透明价格</div>
                        <div className="mt-2 text-gray-600">免费额度适合开发与测试，生产可随时升级。</div>
                    </div>
                    <div className="mt-6 grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                            <div className="font-bold text-xl">免费版</div>
                            <div className="text-3xl mt-2">¥0</div>
                            <ul className="mt-3 text-gray-600 text-sm space-y-2">
                                <li>基础接口访问</li>
                                <li>速率限制较低</li>
                                <li>社区支持</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                            <div className="font-bold text-xl">专业版</div>
                            <div className="text-3xl mt-2">按需</div>
                            <ul className="mt-3 text-gray-600 text-sm space-y-2">
                                <li>更高速率限制</li>
                                <li>监控与告警</li>
                                <li>邮件技术支持</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                            <div className="font-bold text-xl">企业版</div>
                            <div className="text-3xl mt-2">定制</div>
                            <ul className="mt-3 text-gray-600 text-sm space-y-2">
                                <li>专属资源与 SLA</li>
                                <li>私有化部署</li>
                                <li>专属对接支持</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
