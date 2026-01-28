import React, { useState, useEffect } from 'react';
import { Spin, Empty } from 'antd';
import { 
  BookOpen, 
  FileText, 
  Search, 
  ArrowRight,
  Sparkles,
  Code,
  Server,
  Globe
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  category: string;
  documentCount: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
  frontend: <Code className="category-icon" />,
  backend: <Server className="category-icon" />,
  default: <Globe className="category-icon" />,
};

const categoryGradients: Record<string, string> = {
  frontend: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backend: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  default: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
};

const BookcasePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const MY_DOC_URL = import.meta.env.VITE_MY_DOC_URL || 'http://localhost:3000';
      const response = await fetch(`${MY_DOC_URL}/api/books`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        const data = await response.json();
        const booksData = data.books || [];
        setBooks(booksData);
        setFilteredBooks(booksData);
      } else {
        console.error('Failed to fetch books:', response.statusText);
        setBooks(getMockBooks());
        setFilteredBooks(getMockBooks());
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      const mockBooks = getMockBooks();
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  };

  const getMockBooks = (): Book[] => {
    return [
      {
        id: 'frontend-basic',
        title: '前端基础',
        description: '前端开发的基础知识，包括 HTML、CSS、JavaScript、TypeScript 等核心技术',
        category: 'frontend',
        documentCount: 5,
      },
      {
        id: 'frontend-framework',
        title: '前端框架',
        description: '主流前端框架和库，包括 React、Vue、Next.js 等',
        category: 'frontend',
        documentCount: 4,
      },
      {
        id: 'frontend-advanced',
        title: '前端进阶',
        description: '前端高级技术和最佳实践，包括性能优化、测试、架构设计等',
        category: 'frontend',
        documentCount: 8,
      },
      {
        id: 'backend-basic',
        title: '后端基础',
        description: '后端开发的基础知识，包括编程语言、数据库等核心技术',
        category: 'backend',
        documentCount: 6,
      },
      {
        id: 'backend-framework',
        title: '后端框架',
        description: '主流后端框架和工具，包括 Express、Spring Boot、Django 等',
        category: 'backend',
        documentCount: 3,
      },
      {
        id: 'backend-advanced',
        title: '后端进阶',
        description: '后端高级技术和架构实践，包括微服务、DevOps、监控等',
        category: 'backend',
        documentCount: 8,
      },
    ];
  };

  const handleBookClick = (bookId: string) => {
    const MY_DOC_URL = import.meta.env.VITE_MY_DOC_URL || 'http://localhost:3000';
    window.open(`${MY_DOC_URL}/books/${bookId}`, '_blank');
  };

  const getCategoryGradient = (category: string): string => {
    return categoryGradients[category] || categoryGradients.default;
  };

  const getCategoryIcon = (category: string): React.ReactNode => {
    return categoryIcons[category] || categoryIcons.default;
  };

  const getCategoryLabel = (book: Book): string => {
    // 从 book.id 中提取子分类名称（如 frontend-basic -> 基础）
    if (book.id.includes('-')) {
      const [, subCategory] = book.id.split('-');
      const subCategoryMap: Record<string, string> = {
        basic: '基础',
        framework: '框架',
        advanced: '进阶',
      };
      const subCategoryLabel = subCategoryMap[subCategory] || subCategory;
      const categoryMap: Record<string, string> = {
        frontend: '前端',
        backend: '后端',
      };
      const categoryLabel = categoryMap[book.category] || book.category;
      return `${categoryLabel} - ${subCategoryLabel}`;
    }
    // 旧格式，直接返回分类名称
    const categoryMap: Record<string, string> = {
      frontend: '前端',
      backend: '后端',
    };
    return categoryMap[book.category] || book.category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      ` }} />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 px-6 py-20 md:px-8 md:py-24 overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="relative inline-block mb-6">
            <BookOpen className="w-20 h-20 text-white drop-shadow-lg animate-bounce" style={{ animationDuration: '3s' }} />
            <Sparkles className="absolute -top-2 -left-5 w-5 h-5 text-white opacity-80 animate-pulse" style={{ animationDelay: '0s', animationDuration: '2s' }} />
            <Sparkles className="absolute top-5 -right-7 w-5 h-5 text-white opacity-80 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
            <Sparkles className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 text-white opacity-80 animate-pulse" style={{ animationDelay: '1s', animationDuration: '2s' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            我的书架
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-normal">
            选择书籍开始学习，每本书都是独立完整的学习路径
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 transition-all duration-300 focus-within:shadow-2xl focus-within:-translate-y-0.5 focus-within:shadow-purple-200">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="搜索书籍..."
            className="flex-1 border-none outline-none text-base text-slate-800 bg-transparent placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <span className="text-purple-600 text-sm font-medium px-3 py-1 bg-slate-100 rounded-xl">
              {filteredBooks.length} 本
            </span>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
            <Spin size="large" />
            <p className="mt-4 text-base">加载中...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Empty
              description={
                searchQuery ? `未找到包含 "${searchQuery}" 的书籍` : '暂无书籍'
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book, index) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] group"
                onClick={() => handleBookClick(book.id)}
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Cover */}
                <div
                  className="h-56 relative overflow-hidden flex items-center justify-center"
                  style={{ background: getCategoryGradient(book.category) }}
                >
                  <div className="text-center text-white z-10 px-6">
                    <div className="mb-4">
                      {React.cloneElement(getCategoryIcon(book.category) as React.ReactElement, {
                        className: 'w-12 h-12 mx-auto opacity-95 drop-shadow-lg'
                      })}
                    </div>
                    <div className="text-2xl font-bold drop-shadow-lg leading-tight">
                      {book.title}
                    </div>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center group-hover:opacity-100">
                    <ArrowRight className="w-12 h-12 text-white transform transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
                
                {/* Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-snug">
                    {book.title}
                  </h3>
                  {book.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-5">
                      {book.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span 
                      className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-xs font-semibold tracking-wide"
                    >
                      {getCategoryLabel(book)}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{book.documentCount} 个文档</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookcasePage;
