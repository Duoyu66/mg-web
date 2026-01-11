import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Divider } from 'antd';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { title: "题库算法", href: "/front/questionBank" },
            { title: "面试真题", href: "/front/company" },
            { title: "在线编程", href: "/codeEdit" },
            { title: "学习榜单", href: "/front/rank" },
        ],
        resources: [
            { title: "技术专栏", href: "#" },
            { title: "简历模板", href: "/front/resume" },
            { title: "每日一练", href: "#" },
            { title: "开发者API", href: "#" },
        ],
        about: [
            { title: "关于我们", href: "#" },
            { title: "加入我们", href: "#" },
            { title: "联系方式", href: "#" },
            { title: "免责声明", href: "#" },
        ]
    };

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-[1920px] mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-300 to-orange-500 rounded-xl shadow-lg">
                                <span className="text-white font-bold text-xl leading-none font-mono">mg</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                木瓜编程
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm leading-relaxed">
                            专注于程序员成长的在线学习平台。提供海量算法题库、真实面试经验和高效的在线编程环境，助你通过大厂面试。
                        </p>
                        <div className="flex gap-4">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-500 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-all duration-300 group">
                                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">产品服务</h4>
                        <ul className="space-y-4">
                            {footerLinks.product.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">开发资源</h4>
                        <ul className="space-y-4">
                            {footerLinks.resources.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">联系我们</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <Mail size={16} />
                                <span>contact@mgcode.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <Phone size={16} />
                                <span>+86 10-8888-8888</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <MapPin size={16} />
                                <span>北京市朝阳区科技园</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Divider className="dark:border-gray-800" />

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-sm text-gray-500 dark:text-gray-400">
                    <div className="mb-4 md:mb-0">
                        © {currentYear} MG Code. All rights reserved.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">隐私政策</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">服务条款</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">京ICP备88888888号</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

