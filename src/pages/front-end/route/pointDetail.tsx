import { Button, Tag } from 'antd';
import { ArrowLeft, BookOpen, CheckCircle2, Code2, FileText, Share2, Star } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { backendRoadmap, frontendRoadmap, ROADMAP_DOCS } from './data';

type Track = 'frontend' | 'backend';

const PointDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  
  const track = (params.track === 'backend' ? 'backend' : 'frontend') as Track;
  const nodeId = params.id ?? '';
  // The point parameter might need decoding if passed as URL param
  const pointTitle = decodeURIComponent(params.pointId ?? '');

  const nodes = track === 'frontend' ? frontendRoadmap : backendRoadmap;
  const node = useMemo(() => nodes.find(n => n.id === nodeId) ?? null, [nodes, nodeId]);
  const doc = useMemo(() => (nodeId ? ROADMAP_DOCS[nodeId] ?? null : null), [nodeId]);

  // Find the point context
  const pointContext = useMemo(() => {
    if (!doc) return null;
    for (const group of doc.core) {
      if (group.points.includes(pointTitle)) {
        return { groupTitle: group.title };
      }
    }
    return null;
  }, [doc, pointTitle]);

  if (!node || !doc || !pointTitle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <Button onClick={() => navigate(-1)} icon={<ArrowLeft size={16} />}>
            返回
          </Button>
          <div className="mt-10 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">未找到该知识点</div>
            <div className="text-gray-500 dark:text-gray-400">请从学习路线图点击进入</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Button type="text" className="px-0 hover:bg-transparent" onClick={() => navigate(-1)} icon={<ArrowLeft size={16} />}>
              返回
            </Button>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link className="hover:text-primary-500" to="/front/route">学习路线</Link>
            <span>/</span>
            <Link className="hover:text-primary-500" to={`/front/route/${track}/${nodeId}`}>{node.title}</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-200 font-medium">{pointTitle}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {pointContext?.groupTitle && (
                  <Tag color="blue" className="mr-0 rounded-full px-3 border-0 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    {pointContext.groupTitle}
                  </Tag>
                )}
                <Tag color="purple" className="mr-0 rounded-full px-3 border-0 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                  {track === 'frontend' ? '前端' : '后端'}
                </Tag>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
                {pointTitle}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                这里是关于 {pointTitle} 的详细知识点解析。掌握这个知识点对于深入理解 {node.title} 至关重要。
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button icon={<Star size={16} />}>收藏</Button>
              <Button icon={<Share2 size={16} />}>分享</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction Card */}
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
              <div className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                <div className="p-2 rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-900/20">
                  <BookOpen size={24} />
                </div>
                知识点详解
              </div>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>
                  这是一个待补充的详细内容区域。在这个部分，我们通常会包含以下内容：
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li><strong>基本概念：</strong> {pointTitle} 是什么，它的定义和核心思想。</li>
                  <li><strong>工作原理：</strong> 它是如何工作的，底层的机制是什么。</li>
                  <li><strong>使用场景：</strong> 在什么情况下应该使用它，解决了什么问题。</li>
                  <li><strong>优缺点分析：</strong> 它的优势在哪里，有什么局限性。</li>
                </ul>
                <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    注：当前为演示内容，具体知识点文档正在编写中...
                  </p>
                </div>
              </div>
            </section>

            {/* Code Example Card */}
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
              <div className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                <div className="p-2 rounded-lg bg-green-50 text-green-500 dark:bg-green-900/20">
                  <Code2 size={24} />
                </div>
                代码示例
              </div>
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-100">
                  <code>{`// 示例代码
function example() {
  console.log("Hello, ${pointTitle}!");
  
  // TODO: Add specific example for this topic
  return true;
}`}</code>
                </pre>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Status */}
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">学习进度</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-950/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-primary-500 transition-colors" />
                    <span className="text-gray-600 dark:text-gray-300">标记为已学完</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Topics */}
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">相关知识点</h3>
              <div className="space-y-3">
                {doc.core.map(g => 
                  g.points
                    .filter(p => p !== pointTitle)
                    .slice(0, 5)
                    .map((p, i) => (
                      <Link 
                        key={i}
                        to={`/front/route/${track}/${nodeId}/${encodeURIComponent(p)}`}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm py-1"
                      >
                        <FileText size={14} />
                        {p}
                      </Link>
                    ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointDetailPage;
