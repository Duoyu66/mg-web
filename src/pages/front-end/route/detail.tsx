import { Button } from 'antd';
import { ArrowLeft, ExternalLink, FileText, ListChecks, Lightbulb, Link as LinkIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { backendRoadmap, frontendRoadmap, ROADMAP_DOCS } from './data';

type Track = 'frontend' | 'backend';

const RoadmapDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const track = (params.track === 'backend' ? 'backend' : 'frontend') as Track;
  const id = params.id ?? '';

  const nodes = track === 'frontend' ? frontendRoadmap : backendRoadmap;

  const node = useMemo(() => nodes.find(n => n.id === id) ?? null, [nodes, id]);
  const doc = useMemo(() => (id ? ROADMAP_DOCS[id] ?? null : null), [id]);

  const fallback = useMemo(() => {
    if (!node) return null;
    return {
      title: node.title,
      summary: node.description,
      why: ['提升核心能力与工程质量', '面试与实战都很常见'],
      core: [
        { title: '关键概念', points: ['基本概念与原理', '常见使用场景', '常见坑与排查思路'] },
        { title: '实践建议', points: ['做一个小项目练手', '总结常见模板与最佳实践'] }
      ],
      checklist: ['能解释核心概念', '能在项目中落地', '能排查常见问题'],
      resources: [{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org/zh-CN/' }]
    };
  }, [node]);

  const finalDoc = doc ?? fallback;

  if (!node || !finalDoc) {
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

  const primaryResource = finalDoc.resources?.[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <Button onClick={() => navigate(-1)} icon={<ArrowLeft size={16} />}>
            返回路线图
          </Button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Link className="hover:text-primary-500" to="/front/route">学习路线</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-gray-200">{track === 'frontend' ? '前端' : '后端'}</span>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 sm:p-10 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {track === 'frontend' ? '前端学习路线' : '后端学习路线'} · 知识点详情
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                {finalDoc.title}
              </div>
              <div className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                {finalDoc.summary}
              </div>
            </div>

            <div className="hidden sm:flex gap-2">
              {primaryResource?.url && (
                <Button
                  type="primary"
                  icon={<ExternalLink size={16} />}
                  href={primaryResource.url}
                  target="_blank"
                >
                  官方/参考
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold">
                <Lightbulb size={18} className="text-primary-500" />
                为什么要学
              </div>
              <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                {finalDoc.why.map((w, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500/70 shrink-0" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold">
                <FileText size={18} className="text-primary-500" />
                核心知识点
              </div>

              <div className="mt-5 space-y-4">
                {finalDoc.core.map((g, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5">
                    <div className="font-bold text-gray-900 dark:text-gray-100">{g.title}</div>
                    <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-300">
                      {g.points.map((p, pi) => (
                        <li key={pi} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400/70 dark:bg-gray-600 shrink-0" />
                          <span className="leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold">
                <ListChecks size={18} className="text-primary-500" />
                自测清单
              </div>
              <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                {finalDoc.checklist.map((c, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500/70 shrink-0" />
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold">
                <LinkIcon size={18} className="text-primary-500" />
                推荐资料
              </div>
              <div className="mt-4 space-y-2">
                {finalDoc.resources.map((r, idx) => (
                  <a
                    key={idx}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-4 py-3 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {r.title}
                    </div>
                    <ExternalLink size={16} className="text-gray-300 dark:text-gray-700 group-hover:text-primary-500 transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetailPage;

