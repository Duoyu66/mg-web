import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROADMAP_DOCS } from '@/pages/front-end/route/data';
import { Button, Tag, Input } from 'antd';
import { ArrowLeft, BookOpen, ListChecks, Lightbulb, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type TrackType = 'frontend' | 'backend';

const RoadmapDocPage = () => {
  const { track, id } = useParams<{ track: TrackType; id: string }>();
  const navigate = useNavigate();
  const doc = ROADMAP_DOCS[id ?? ''];
  const [active, setActive] = useState<string>('overview');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const sections = useMemo(() => {
    const base = [
      { id: 'overview', label: '概览' },
      { id: 'why', label: '为什么学' },
    ];
    const core = (doc?.core ?? []).map((c, idx) => ({
      id: `core-${idx}`,
      label: c.title,
    }));
    const tail = [
      { id: 'checklist', label: '学习清单' },
      { id: 'resources', label: '推荐资源' },
    ];
    return [...base, ...core, ...tail];
  }, [doc]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ids = sections.map(s => s.id);
    const targets = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (sid: string) => {
    const el = document.getElementById(sid);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button onClick={() => navigate('/front/route')} icon={<ArrowLeft size={16} />}>
              返回路线图
            </Button>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">未找到文档</h2>
            <p className="text-gray-500 dark:text-gray-400">请选择有效的知识点进入文档视图。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-extrabold text-gray-900 dark:text-white">DocPress</span>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <a className="text-gray-700 dark:text-gray-300 hover:text-emerald-600" href="#overview">Guide</a>
              <a className="text-gray-700 dark:text-gray-300 hover:text-emerald-600" href="#why">Config Reference</a>
              <a className="text-gray-700 dark:text-gray-300 hover:text-emerald-600" href="#resources">Plugin</a>
              <a className="text-gray-700 dark:text-gray-300 hover:text-emerald-600" href="#overview">Theme</a>
              <a className="text-gray-700 dark:text-gray-300 hover:text-emerald-600" href="#checklist">Learn More</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Input placeholder="搜索文档..." className="w-[220px]" />
            <Tag color="green" className="rounded-full">v1.x</Tag>
            <Button type="link" onClick={() => navigate('/front/route')}>返回路线图</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-6">

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-3">
            <div className="sticky top-20 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Guide</div>
              <ul className="space-y-0.5">
                {sections.map(s => (
                  <li key={s.id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        active === s.id
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => scrollTo(s.id)}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-4 mb-2">Advanced</div>
              <ul className="space-y-0.5">
                {['checklist', 'resources'].map(sid => {
                  const label = sid === 'checklist' ? '学习清单' : '推荐资源';
                  return (
                    <li key={sid}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          active === sid
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => scrollTo(sid)}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <main className="col-span-12 md:col-span-9">
            <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{doc.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">{doc.summary}</p>

              <section id="overview" style={{ scrollMarginTop: '16px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={16} className="text-blue-600 dark:text-blue-300" />
                      <span className="font-semibold text-blue-700 dark:text-blue-200">目标</span>
                    </div>
                    <span className="text-sm text-blue-700/90 dark:text-blue-200">{doc.summary}</span>
                  </div>
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ListChecks size={16} className="text-amber-600 dark:text-amber-300" />
                      <span className="font-semibold text-amber-700 dark:text-amber-200">建议</span>
                    </div>
                    <span className="text-sm text-amber-700/90 dark:text-amber-200">结合路线按阶段实践与复盘。</span>
                  </div>
                </div>
              </section>

              <section id="why" style={{ scrollMarginTop: '16px' }} className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">为什么学</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {doc.why.map((w) => (
                    <li key={w} className="text-gray-700 dark:text-gray-300">{w}</li>
                  ))}
                </ul>
              </section>

              {doc.core.map((group, idx) => (
                <section id={`core-${idx}`} key={group.title} style={{ scrollMarginTop: '16px' }} className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{group.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.points.map(p => (
                      <Tag key={p} color="blue" className="rounded-full">{p}</Tag>
                    ))}
                  </div>
                </section>
              ))}

              <section id="checklist" style={{ scrollMarginTop: '16px' }} className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">学习清单</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {doc.checklist.map(c => (
                    <li key={c} className="text-gray-700 dark:text-gray-300">{c}</li>
                  ))}
                </ul>
              </section>

              <section id="resources" style={{ scrollMarginTop: '16px' }}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">推荐资源</h2>
                <div className="space-y-2">
                  {doc.resources.map(r => (
                    <a
                      key={r.url}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <LinkIcon size={16} className="text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">{r.title}</span>
                    </a>
                  ))}
                </div>
              </section>
              {doc.content && (
                <section style={{ scrollMarginTop: '16px' }} className="mt-8">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {doc.content}
                    </ReactMarkdown>
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDocPage;
