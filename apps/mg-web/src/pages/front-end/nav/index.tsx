import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Code2, 
  PenTool, 
  Palette, 
  MessageSquare, 
  Cpu, 
  GraduationCap, 
  Search,
  Layout,
  Globe,
  Database,
  Terminal,
  Server,
  Box
} from 'lucide-react';
import { Spin } from 'antd';
import { useVisualSearch } from './hooks/useVisualSearch';

// --- Data Definition ---

interface NavItem {
  title: string;
  desc: string;
  url: string;
  icon?: string; // URL to icon or generic type
}

interface NavCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const NAV_DATA: NavCategory[] = [
  {
    id: 'docs',
    name: '常用文档',
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      { title: 'MDN Web Docs', desc: 'Web 开发最权威的参考文档', url: 'https://developer.mozilla.org/zh-CN/' },
      { title: 'React', desc: '用于构建用户界面的 JavaScript 库', url: 'https://react.dev/' },
      { title: 'Vue.js', desc: '渐进式 JavaScript 框架', url: 'https://vuejs.org/' },
      { title: 'TypeScript', desc: 'JavaScript 的超集', url: 'https://www.typescriptlang.org/' },
      { title: 'Tailwind CSS', desc: '原子化 CSS 框架', url: 'https://tailwindcss.com/' },
      { title: 'Next.js', desc: 'React 框架', url: 'https://nextjs.org/' },
      { title: 'Ant Design', desc: '企业级 UI 设计语言和 React 组件库', url: 'https://ant.design/index-cn' },
    ]
  },
  {
    id: 'tools',
    name: '在线工具',
    icon: <PenTool className="w-5 h-5" />,
    items: [
      { title: 'Can I Use', desc: '浏览器兼容性查询', url: 'https://caniuse.com/' },
      { title: 'Carbon', desc: '生成漂亮的代码图片', url: 'https://carbon.now.sh/' },
      { title: 'JSON Crack', desc: '可视化 JSON 数据', url: 'https://jsoncrack.com/' },
      { title: 'RegExr', desc: '正则表达式测试工具', url: 'https://regexr.com/' },
      { title: 'Squoosh', desc: '图片压缩工具', url: 'https://squoosh.app/' },
      { title: 'Excalidraw', desc: '手绘风格的虚拟白板', url: 'https://excalidraw.com/' },
      { title: 'Transform', desc: '各种代码转换工具 (SVG to JSX等)', url: 'https://transform.tools/' },
    ]
  },
  {
    id: 'community',
    name: '技术社区',
    icon: <MessageSquare className="w-5 h-5" />,
    items: [
      { title: 'GitHub', desc: '全球最大的代码托管平台', url: 'https://github.com/' },
      { title: 'Stack Overflow', desc: '全球最大的程序员问答社区', url: 'https://stackoverflow.com/' },
      { title: '掘金', desc: '帮助开发者成长的社区', url: 'https://juejin.cn/' },
      { title: 'V2EX', desc: '创意工作者们的社区', url: 'https://www.v2ex.com/' },
      { title: 'SegmentFault', desc: '思否技术社区', url: 'https://segmentfault.com/' },
      { title: 'Dev.to', desc: '开发者分享与成长的社区', url: 'https://dev.to/' },
    ]
  },
  {
    id: 'design',
    name: '设计灵感',
    icon: <Palette className="w-5 h-5" />,
    items: [
      { title: 'Dribbble', desc: '设计师作品分享平台', url: 'https://dribbble.com/' },
      { title: 'Behance', desc: '展示和发现创意作品', url: 'https://www.behance.net/' },
      { title: 'Pinterest', desc: '图片灵感搜集', url: 'https://www.pinterest.com/' },
      { title: 'Iconfont', desc: '阿里巴巴矢量图标库', url: 'https://www.iconfont.cn/' },
      { title: 'Figma', desc: '在线协作设计工具', url: 'https://www.figma.com/' },
      { title: 'Huemint', desc: 'AI 色彩生成工具', url: 'https://huemint.com/' },
    ]
  },
  {
    id: 'learning',
    name: '学习提升',
    icon: <GraduationCap className="w-5 h-5" />,
    items: [
      { title: 'LeetCode', desc: '技术面试准备平台', url: 'https://leetcode.cn/' },
      { title: 'FreeCodeCamp', desc: '免费学习编程', url: 'https://www.freecodecamp.org/' },
      { title: 'Coursera', desc: '在线课程平台', url: 'https://www.coursera.org/' },
      { title: 'Refactoring Guru', desc: '设计模式与重构指南', url: 'https://refactoring.guru/' },
      { title: 'Roadmap.sh', desc: '开发者学习路线图', url: 'https://roadmap.sh/' },
    ]
  },
  {
    id: 'backend',
    name: '后端/架构',
    icon: <Server className="w-5 h-5" />,
    items: [
      { title: 'Node.js', desc: 'JavaScript 运行时', url: 'https://nodejs.org/' },
      { title: 'Go', desc: 'Go 编程语言', url: 'https://go.dev/' },
      { title: 'Rust', desc: '一门赋予每个人构建可靠且高效软件能力的语言', url: 'https://www.rust-lang.org/' },
      { title: 'Docker', desc: '容器化平台', url: 'https://www.docker.com/' },
      { title: 'Kubernetes', desc: '容器编排系统', url: 'https://kubernetes.io/' },
    ]
  },
  {
    id: 'resources',
    name: '资源素材',
    icon: <Box className="w-5 h-5" />,
    items: [
      { title: 'Unsplash', desc: '免费高质量图片', url: 'https://unsplash.com/' },
      { title: 'Pexels', desc: '免费素材图片和视频', url: 'https://www.pexels.com/' },
      { title: 'Undraw', desc: '开源插画库', url: 'https://undraw.co/' },
      { title: 'Lorem Picsum', desc: '图片占位符生成', url: 'https://picsum.photos/' },
    ]
  }
];

// --- Helper Components ---

const NavCard = ({ item }: { item: NavItem }) => {
  // Simple favicon fetcher
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.url}&sz=64`;

  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 p-1.5 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 group-hover:border-primary-200 dark:group-hover:border-primary-600 transition-colors">
          <img 
            src={faviconUrl} 
            alt={item.title} 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to generic icon if favicon fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed h-8">
            {item.desc}
          </p>
        </div>
      </div>
    </a>
  );
};

// --- Main Component ---

const Nav = () => {
  const [activeCategory, setActiveCategory] = useState<string>(NAV_DATA[0].id);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { data: searchResults, isLoading: isSearching } = useVisualSearch(debouncedSearchText);

  // Scroll spy effect to update active category
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header + padding
      
      for (const category of NAV_DATA) {
        const element = document.getElementById(`category-${category.id}`);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(`category-${id}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveCategory(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Search Header (Optional enhancement) */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Globe className="text-primary-600" />
            开发者导航
          </h1>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索资源..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-gray-700 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchText ? (
          <div className="min-h-[400px]">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">搜索结果</h2>
            {isSearching ? (
              <div className="flex justify-center items-center py-20"><Spin size="large" /></div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {searchResults.map((item: any, index: number) => (
                  <NavCard key={index} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">未找到相关资源</p>
              </div>
            )}
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide">
              <nav className="space-y-1">
                {NAV_DATA.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <span className={`${activeCategory === category.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                      {category.icon}
                    </span>
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Category Nav (Horizontal Scroll) */}
          <div className="lg:hidden -mx-4 px-4 sticky top-16 z-10 bg-gray-50 dark:bg-gray-900 pb-2 overflow-x-auto flex gap-2 scrollbar-hide border-b border-gray-200 dark:border-gray-700 py-2">
            {NAV_DATA.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Icons might be too busy for small mobile chips, maybe just text or small icon */}
                {category.name}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-12">
            {NAV_DATA.map((category) => (
              <section 
                key={category.id} 
                id={`category-${category.id}`}
                className="scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                    {category.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {category.name}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  {category.items.map((item, index) => (
                    <NavCard key={index} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
