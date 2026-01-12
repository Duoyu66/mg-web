import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tag, Avatar, Divider, Breadcrumb, message, Result } from 'antd';
import { 
  ArrowLeftOutlined, 
  EyeOutlined, 
  LikeOutlined, 
  ShareAltOutlined,
  CalendarOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentSystem, { CommentData } from '../../../components/CommentSystem';
import { interviewExperiences } from './data';

// Mock Comment Data
const mockComments: CommentData[] = [
  // 置顶 + 精华
  {
    id: '1',
    userInfo: {
      id: 'u1',
      nickname: '前端大牛',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert',
      isVip: true
    },
    content:
      '这篇文章总结得非常到位！特别是关于性能优化的部分，建议大家仔细阅读。对于 React 18 的并发模式，其实还有很多细节可以深挖，比如 useTransition 和 useDeferredValue 的具体使用场景...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 128,
    isTop: true,
    isEssence: true,
    replies: [
      {
        id: '1-1',
        userInfo: {
          id: 'u2',
          nickname: '好学的萌新',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Learner'
        },
        content: '回复 @前端大牛：大牛说得对，我也觉得这部分很有启发。请问有没有推荐的进阶资料？',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        likes: 12,
        replies: [
          {
            id: '1-1-1',
            userInfo: {
              id: 'u3',
              nickname: '技术宅',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Techie'
            },
            content: '推荐 React 官方 Beta 文档与 Dan 的博客。',
            createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            likes: 9
          },
          {
            id: '1-1-2',
            userInfo: {
              id: 'u4',
              nickname: '潜水员',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diver'
            },
            content: '同求链接！',
            createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
            likes: 3,
            replies: [
              {
                id: '1-1-2-1',
                userInfo: {
                  id: 'u11',
                  nickname: 'Angular大叔',
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Angular'
                },
                content: '你们不要吵，jQuery 一把梭就完事。',
                createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
                likes: 21,
                replies: [
                  {
                    id: '1-1-2-1-1',
                    userInfo: {
                      id: 'u12',
                      nickname: 'Rust新贵',
                      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rust'
                    },
                    content: 'WebAssembly 才是未来，Rust YYDS！',
                    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                    likes: 12
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // 精华
  {
    id: '2',
    userInfo: {
      id: 'u3',
      nickname: '面试官老王',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Interviewer',
      isVip: true
    },
    content:
      '作为面试官，我经常问这些问题。候选人如果能回答出文章里的 80%，基本就是 P6+ 的水平了。大家加油！',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likes: 89,
    isEssence: true
  },
  // 普通
  {
    id: '3',
    userInfo: {
      id: 'u4',
      nickname: '路人甲',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User1'
    },
    content: 'Mark 一下，准备下周面试用。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 5
  },
  {
    id: '4',
    userInfo: {
      id: 'u5',
      nickname: 'React爱好者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ReactFan'
    },
    content:
      '楼主写的很详细，不过 hooks 的闭包陷阱那块感觉可以再展开讲讲。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    likes: 23
  },
  {
    id: '5',
    userInfo: {
      id: 'u6',
      nickname: 'Offer收割机',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Offer'
    },
    content: '已拿 Offer，特来还愿！这篇面经帮了大忙！',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likes: 256
  },
  // —— 场景：用户A回复用户B、用户D回复用户B（B为顶级评论） — —
  {
    id: '6',
    userInfo: {
      id: 'ub',
      nickname: '用户B',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserB'
    },
    content:
      '我认为这题的最优解应该是二分配合贪心，时间复杂度更稳。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    likes: 34,
    replies: [
      {
        id: '6-1',
        userInfo: {
          id: 'ua',
          nickname: '用户A',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserA'
        },
        content:
          '回复 @用户B：我觉得你的复杂度分析还有优化空间，贪心的证明也可以更严谨。',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        likes: 8,
        replies: [
          {
            id: '6-1-1',
            userInfo: {
              id: 'ue',
              nickname: '用户E',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserE'
            },
            content: '回复 @用户A：常数项不可忽略，综合考虑更推荐 O(n log n)。',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.7).toISOString(),
            likes: 5,
            replies: [
              {
                id: '6-1-1-1',
                userInfo: {
                  id: 'ua',
                  nickname: '用户A',
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserA'
                },
                content: '回复 @用户E：同意，我更新下证明过程。',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.4).toISOString(),
                likes: 3
              }
            ]
          }
        ]
      },
      {
        id: '6-2',
        userInfo: {
          id: 'ud',
          nickname: '用户D',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserD'
        },
        content:
          '回复 @用户B：赞同，但实现要注意边界条件，尤其是数组有重复元素的情况。',
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        likes: 5,
        replies: [
          {
            id: '6-2-1',
            userInfo: {
              id: 'ub',
              nickname: '用户B',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserB'
            },
            content: '回复 @用户D：好的，我加上边界测试用例。',
            createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
            likes: 4
          }
        ]
      }
    ]
  },
  // —— 场景：用户B回复用户C（C为顶级评论）——
  {
    id: '7',
    userInfo: {
      id: 'uc',
      nickname: '用户C',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserC'
    },
    content:
      '其实可以用并查集简化处理，不过要注意路径压缩的影响。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    likes: 47,
    replies: [
      {
        id: '7-1',
        userInfo: {
          id: 'ub',
          nickname: '用户B',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserB'
        },
        content:
          '回复 @用户C：你的方法不错，但在这个场景并查集不如二分+贪心高效。',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        likes: 12,
        replies: [
          {
            id: '7-1-1',
            userInfo: {
              id: 'uc',
              nickname: '用户C',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserC'
            },
            content: '回复 @用户B：我补充了路径压缩的分析，复杂度更稳。',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24.5).toISOString(),
            likes: 4,
            replies: [
              {
                id: '7-1-1-1',
                userInfo: {
                  id: 'ub',
                  nickname: '用户B',
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserB'
                },
                content: '回复 @用户C：OK，赞一个。',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                likes: 3
              }
            ]
          }
        ]
      }
    ]
  },
  // 额外增加更多数据，覆盖更多阅读/折叠场景
  {
    id: '8',
    userInfo: {
      id: 'ue',
      nickname: '数据工程师E',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserE',
      isVip: true
    },
    content:
      '从数据工程的角度，批处理与流式处理的权衡在系统设计中很关键。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    likes: 19
  },
  {
    id: '9',
    userInfo: {
      id: 'uf',
      nickname: '算法爱好者F',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserF'
    },
    content:
      '如果是图相关问题，建议考虑 Tarjan 或者 Kosaraju，复杂度更好控。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    likes: 31,
    replies: [
      {
        id: '9-1',
        userInfo: {
          id: 'ug',
          nickname: '架构师G',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserG'
        },
        content: '回复 @算法爱好者F：在工程实践中还要考虑内存占用与并发安全。',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
        likes: 7
      }
    ]
  },
  {
    id: '10',
    userInfo: {
      id: 'uh',
      nickname: '后端同学H',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserH'
    },
    content:
      '补充一下，如果是服务端实现，建议把重试策略、幂等保证写清楚。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    likes: 22
  }
];

const currentUser = {
  id: 'me',
  nickname: '木瓜一块八',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  isVip: true
};

const CompanyInterviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const data = useMemo(() => {
    return interviewExperiences.find(item => item.id === id);
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Result
          status="404"
          title="面经未找到"
          subTitle="抱歉，您访问的面经不存在或已被删除。"
          extra={<Button type="primary" onClick={() => navigate('/front/companyInterview')}>返回列表</Button>}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/front/companyInterview')}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              返回
            </Button>
            <Breadcrumb
              items={[
                { title: <span className="cursor-pointer" onClick={() => navigate('/front/home')}><HomeOutlined /> 首页</span> },
                { title: <span className="cursor-pointer" onClick={() => navigate('/front/companyInterview')}>名企面经</span> },
                { title: '面经详情' },
              ]}
              className="hidden sm:flex"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button icon={<LikeOutlined />} onClick={() => message.success('点赞成功！')}>点赞</Button>
            <Button type="primary" icon={<ShareAltOutlined />} onClick={() => message.success('链接已复制')}>分享</Button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-6 mt-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              {/* Article Header */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag color={data.difficulty === '简单' ? 'green' : data.difficulty === '中等' ? 'orange' : 'red'}>
                    {data.difficulty}
                  </Tag>
                  {data.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                  {data.title}
                </h1>
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-700 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar src={data.avatar} size="small" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{data.author}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <CalendarOutlined /> {data.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <EyeOutlined /> {data.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <LikeOutlined /> {data.likes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Comment System */}
            <div className="mt-8">
              <CommentSystem 
                comments={mockComments}
                currentUser={currentUser}
                repliesPageSize={10}
                onSubmit={(content) => {
                  console.log('New comment:', content);
                }}
                onLike={(id) => {
                  console.log('Like comment:', id);
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 sticky top-24 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md"
                  style={{ backgroundColor: data.color }}
                >
                  {data.logo}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 m-0">{data.companyName}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm m-0">{data.position}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">级别</span>
                  <span className="font-medium dark:text-gray-200">{data.level}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">难度</span>
                  <span className={`font-medium ${
                    data.difficulty === '简单' ? 'text-green-500' : 
                    data.difficulty === '中等' ? 'text-orange-500' : 'text-red-500'
                  }`}>{data.difficulty}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">发布时间</span>
                  <span className="font-medium dark:text-gray-200">{data.date}</span>
                </div>
              </div>

              <div className="mt-8">
                <Button type="primary" block size="large" onClick={() => message.info('收藏功能开发中')}>
                  收藏面经
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyInterviewDetail;
