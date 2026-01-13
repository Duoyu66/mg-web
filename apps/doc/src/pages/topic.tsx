import React, { useMemo } from 'react';
import Layout from '@theme/Layout';

type TopicEntry = { id: string; title: string; content: JSX.Element };

const tracksMap: Record<
  string,
  { title: string; topics: TopicEntry[] }
> = {
  frontend: {
    title: '前端开发',
    topics: [
      {
        id: 'html-css',
        title: 'HTML & CSS',
        content: (
          <div>
            <h1>HTML & CSS</h1>
            <p>掌握语义化结构、布局与响应式，能独立还原常见页面。</p>
            <h2>核心知识</h2>
            <ul>
              <li>语义化标签与可访问性</li>
              <li>Flex/Grid 布局与响应式</li>
              <li>层叠与优先级、BFC</li>
            </ul>
          </div>
        )
      },
      {
        id: 'js',
        title: 'JavaScript',
        content: (
          <div>
            <h1>JavaScript</h1>
            <p>掌握语言机制、异步模型与工程化写法，能写出可维护业务逻辑。</p>
            <h2>语言机制</h2>
            <ul>
              <li>作用域、闭包与原型链</li>
              <li>事件循环与 Promise/async-await</li>
              <li>模块化与调试技巧</li>
            </ul>
          </div>
        )
      },
      {
        id: 'ts',
        title: 'TypeScript',
        content: (
          <div>
            <h1>TypeScript</h1>
            <p>用类型系统约束边界，提升可维护性与协作效率。</p>
            <h2>关键能力</h2>
            <ul>
              <li>泛型、联合与交叉类型</li>
              <li>类型收窄与条件类型</li>
              <li>声明文件与第三方库类型</li>
            </ul>
          </div>
        )
      },
      {
        id: 'react',
        title: 'React',
        content: (
          <div>
            <h1>React</h1>
            <p>掌握组件化、Hooks 与性能优化，能独立实现中型页面与状态流。</p>
            <h2>实践方向</h2>
            <ul>
              <li>组件与 JSX、受控/非受控</li>
              <li>状态管理与数据请求</li>
              <li>性能优化与渲染机制</li>
            </ul>
          </div>
        )
      },
      {
        id: 'vue',
        title: 'Vue.js',
        content: (
          <div>
            <h1>Vue.js</h1>
            <p>掌握响应式原理与组件通信，能独立实现常见业务页面。</p>
            <h2>组合式实践</h2>
            <ul>
              <li>模板语法与响应式</li>
              <li>组件通信与状态管理</li>
              <li>性能优化与路由</li>
            </ul>
          </div>
        )
      },
      {
        id: 'state-management',
        title: '状态管理',
        content: (
          <div>
            <h1>状态管理</h1>
            <p>建立清晰数据流与边界，避免状态失控，提升可维护性。</p>
            <h2>工具与模型</h2>
            <ul>
              <li>单向数据流与副作用管理</li>
              <li>Redux/RTK、Zustand、Pinia</li>
              <li>异步请求与缓存策略</li>
            </ul>
          </div>
        )
      },
      {
        id: 'build-tools',
        title: '构建工具',
        content: (
          <div>
            <h1>构建工具</h1>
            <p>理解模块、打包、开发服务器与性能优化，排查构建问题。</p>
            <h2>常见方案</h2>
            <ul>
              <li>Webpack、Vite、Rollup</li>
              <li>代码分割与缓存压缩</li>
              <li>构建分析与体积优化</li>
            </ul>
          </div>
        )
      },
      {
        id: 'nextjs',
        title: 'Next.js',
        content: (
          <div>
            <h1>Next.js</h1>
            <p>掌握 SSR/SSG 与路由/数据获取，构建完整产品级应用。</p>
            <h2>工程化能力</h2>
            <ul>
              <li>CSR/SSR/SSG 渲染模式</li>
              <li>数据获取与增量静态生成</li>
              <li>部署与缓存策略</li>
            </ul>
          </div>
        )
      }
    ]
  },
  backend: {
    title: '后端开发',
    topics: [
      {
        id: 'lang',
        title: '编程语言',
        content: (
          <div>
            <h1>编程语言</h1>
            <p>选定主语言并打牢基础，形成稳定的编码与调试能力。</p>
            <h2>基础与进阶</h2>
            <ul>
              <li>语法与标准库、数据结构与复杂度</li>
              <li>并发模型与性能分析</li>
              <li>工程化与规范、测试与 CI</li>
            </ul>
          </div>
        )
      },
      {
        id: 'db',
        title: '数据库',
        content: (
          <div>
            <h1>数据库</h1>
            <p>理解索引与事务，能设计可扩展的数据模型，保障性能与稳定。</p>
            <h2>关键能力</h2>
            <ul>
              <li>表设计与范式、执行计划与慢查询</li>
              <li>事务隔离与锁、备份与恢复</li>
              <li>读写分离与分库分表</li>
            </ul>
          </div>
        )
      },
      {
        id: 'api',
        title: 'API 设计',
        content: (
          <div>
            <h1>API 设计</h1>
            <p>掌握 REST 与错误模型，定义清晰、可演进的接口。</p>
            <h2>设计与工程化</h2>
            <ul>
              <li>资源建模与幂等、分页</li>
              <li>统一错误码、Mock 与文档</li>
              <li>OpenAPI/SDK 生成与版本管理</li>
            </ul>
          </div>
        )
      },
      {
        id: 'auth',
        title: '认证与授权',
        content: (
          <div>
            <h1>认证与授权</h1>
            <p>理解身份认证与权限控制，实现安全、可扩展的登录体系。</p>
            <h2>实践要点</h2>
            <ul>
              <li>Session/Cookie 与 JWT</li>
              <li>刷新 Token 与吊销策略</li>
              <li>RBAC/ABAC 权限模型</li>
            </ul>
          </div>
        )
      },
      {
        id: 'cache',
        title: '缓存',
        content: (
          <div>
            <h1>缓存</h1>
            <p>通过缓存提升性能，并处理一致性与失效策略带来的复杂度。</p>
            <h2>策略与一致性</h2>
            <ul>
              <li>TTL、预热与淘汰、多级缓存</li>
              <li>缓存与 DB 一致性、延迟双删</li>
              <li>消息驱动更新与幂等</li>
            </ul>
          </div>
        )
      },
      {
        id: 'mq',
        title: '消息队列',
        content: (
          <div>
            <h1>消息队列</h1>
            <p>用异步化、削峰与解耦提升系统吞吐，并保障可靠投递。</p>
            <h2>模型与可靠性</h2>
            <ul>
              <li>发布订阅、消费者组、顺序与分区</li>
              <li>至少一次/至多一次、重试与死信</li>
              <li>幂等与去重、链路追踪与监控</li>
            </ul>
          </div>
        )
      },
      {
        id: 'microservices',
        title: '微服务架构',
        content: (
          <div>
            <h1>微服务架构</h1>
            <p>拆分服务与治理能力，控制复杂度并保障可观测与稳定性。</p>
            <h2>治理与可观测</h2>
            <ul>
              <li>注册发现、配置中心、限流熔断</li>
              <li>日志/指标/链路与告警</li>
              <li>灰度发布与回滚策略</li>
            </ul>
          </div>
        )
      },
      {
        id: 'devops',
        title: 'DevOps',
        content: (
          <div>
            <h1>DevOps</h1>
            <p>通过容器化与流水线提升交付效率，形成可重复、可回滚的发布体系。</p>
            <h2>容器与交付</h2>
            <ul>
              <li>Dockerfile、镜像分层与安全优化</li>
              <li>CI/CD 流水线与环境隔离</li>
              <li>灰度与回滚、发布策略</li>
            </ul>
          </div>
        )
      }
    ]
  }
};

function useQuery() {
  const search = typeof window !== 'undefined' ? window.location.search : '';
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function TopicPage() {
  const query = useQuery();
  const track = query.get('track') || 'frontend';
  const topicId = query.get('topic');
  const queryMember = query.get('member');
  const trackData = tracksMap[track] || tracksMap.frontend;
  const topics = trackData.topics;
  const active = topics.find(t => t.id === topicId) || topics[0];

  const makeHref = (t: string, id: string) => `?track=${encodeURIComponent(t)}&topic=${encodeURIComponent(id)}`;
  const isMember =
    (queryMember === '1' || queryMember === 'true') ||
    (typeof window !== 'undefined' &&
      ['isMember', 'mg_is_member', 'member'].some(k => {
        const v = window.localStorage.getItem(k);
        return v === '1' || v === 'true';
      }));

  return (
    <Layout title={trackData.title}>
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--3">
            <div className="margin-bottom--md">
              <h2>{trackData.title}</h2>
            </div>
            <nav>
              <ul className="menu__list">
                {topics.map(t => {
                  const isActive = t.id === active.id;
                  return (
                    <li key={t.id} className="menu__list-item">
                      <a
                        className={`menu__link ${isActive ? 'menu__link--active' : ''}`}
                        href={makeHref(track, t.id)}
                        onClick={isMember ? e => e.preventDefault() : undefined}
                        style={{ pointerEvents: isMember ? 'none' : undefined }}
                      >
                        {t.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          <div className="col col--9">
            <header className="margin-bottom--md">
              <h1>{active.title}</h1>
              <p>根据路线选择的主题呈现相应内容。</p>
            </header>
            <article className="markdown">{active.content}</article>
          </div>
        </div>
      </div>
    </Layout>
  );
}
