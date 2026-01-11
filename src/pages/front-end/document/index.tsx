import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Menu, 
  Search,
  BookOpen,
  FileText,
  Hash
} from 'lucide-react';
import { Input, Button, Drawer } from 'antd';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { DOCS_DATA, DocSection } from './data';

const DocumentPage = () => {
  const [activeDocId, setActiveDocId] = useState<string>('intro');
  const [expandedIds, setExpandedIds] = useState<string[]>(['quick-start', 'features', 'api']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Find current active document content
  const findDocContent = (items: DocSection[], id: string): DocSection | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findDocContent(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeDoc = findDocContent(DOCS_DATA, activeDocId);

  // Toggle expand/collapse
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Render Sidebar Item
  const renderSidebarItem = (item: DocSection, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.includes(item.id);
    const isActive = activeDocId === item.id;
    
    // Filter logic if searching
    if (searchText) {
      const matchSelf = item.title.toLowerCase().includes(searchText.toLowerCase());
      const matchChildren = item.children?.some(child => 
        child.title.toLowerCase().includes(searchText.toLowerCase())
      );
      
      if (!matchSelf && !matchChildren && depth === 0) return null;
    }

    return (
      <div key={item.id} className="select-none">
        <div 
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm
            ${isActive 
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
          `}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={() => {
            if (!hasChildren) {
              setActiveDocId(item.id);
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
               // If it has children, clicking the row toggles expansion
               // But usually parent nodes also have content in some doc sites.
               // Here we assume parent nodes are just categories unless they have content.
               if (item.content) {
                   setActiveDocId(item.id);
               } else {
                   // Toggle expand
                   setExpandedIds(prev => 
                    prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                  );
               }
            }
          }}
        >
          {hasChildren && (
            <div 
              className="p-0.5 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={(e) => toggleExpand(item.id, e)}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          )}
          {!hasChildren && <span className="w-4" />} {/* Spacer for alignment */}
          
          <span className="truncate flex-1">{item.title}</span>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderSidebarItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Markdown Components
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-lg text-sm my-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 text-red-500 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4 flex items-center gap-2 group">
        <Hash size={20} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600 dark:text-gray-300">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-600 dark:text-gray-300">
        {children}
      </ol>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary-500 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-r-lg mb-4 text-gray-600 dark:text-gray-400 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-gray-50 dark:bg-gray-800">
        {children}
      </thead>
    ),
    th: ({ children }: any) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
        {children}
      </td>
    ),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30">
        <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <BookOpen size={20} className="text-primary-500" />
          <span>文档中心</span>
        </div>
        <Button 
          type="text" 
          icon={<Menu size={20} />} 
          onClick={() => setMobileMenuOpen(true)}
        />
      </div>

      <div className="flex flex-1 max-w-[1920px] mx-auto w-full">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-64px)] sticky top-[64px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="p-4 sticky top-0 bg-white dark:bg-gray-900 z-10">
            <Input 
              prefix={<Search size={16} className="text-gray-400" />}
              placeholder="搜索文档..."
              className="rounded-lg bg-gray-50 dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-900"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <nav className="flex-1 px-2 pb-8 space-y-1">
            {DOCS_DATA.map(item => renderSidebarItem(item))}
          </nav>
        </aside>

        {/* Sidebar - Mobile Drawer */}
        <Drawer
          title="文档目录"
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={280}
          bodyStyle={{ padding: 0 }}
        >
           <div className="p-4">
            <Input 
              prefix={<Search size={16} className="text-gray-400" />}
              placeholder="搜索文档..."
              className="rounded-lg"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <nav className="px-2 pb-8 space-y-1">
            {DOCS_DATA.map(item => renderSidebarItem(item))}
          </nav>
        </Drawer>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 lg:py-10">
          <div className="max-w-4xl mx-auto">
            {activeDoc ? (
              <div className="animate-in fade-in duration-500">
                {/* Breadcrumb-like Header */}
                <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FileText size={16} />
                  <span>文档</span>
                  <ChevronRight size={14} />
                  <span className="text-gray-900 dark:text-gray-200 font-medium">
                    {activeDoc.title}
                  </span>
                </div>

                {/* Markdown Content */}
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponents}
                  >
                    {activeDoc.content || ''}
                  </ReactMarkdown>
                </article>

                {/* Bottom Navigation */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between">
                  <Button type="link" className="text-gray-500 hover:text-primary-500 pl-0">
                    ← 上一篇
                  </Button>
                  <Button type="link" className="text-gray-500 hover:text-primary-500 pr-0">
                    下一篇 →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                <BookOpen size={64} className="mb-4 opacity-20" />
                <p>请在左侧选择文档查看</p>
              </div>
            )}
          </div>
        </main>
        
        {/* Right TOC (Optional, for now just a placeholder or could be implemented later) */}
        <aside className="hidden xl:block w-64 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto p-8">
           <div className="text-sm font-medium text-gray-900 dark:text-white mb-4">本页目录</div>
           <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-800 pl-4">
              {/* This would ideally be generated from the markdown headings */}
              <li className="hover:text-primary-500 cursor-pointer">顶部</li>
              {/* We can parse headings from markdown content here if needed */}
           </ul>
        </aside>
      </div>
    </div>
  );
};

export default DocumentPage;
