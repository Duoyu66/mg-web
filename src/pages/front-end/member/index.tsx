import React from 'react';
import { Card, Progress, Tag, Button, Tooltip, Timeline, Avatar } from 'antd';
import { CrownOutlined, GiftOutlined, ThunderboltOutlined, TrophyOutlined, ArrowRightOutlined } from '@ant-design/icons';

const MemberPage: React.FC = () => {
  const levelInfo = {
    currentLevel: 'Lv.3 进阶会员',
    nextLevel: 'Lv.4 核心会员',
    currentPoints: 1860,
    nextLevelPoints: 2500,
    rankPercent: 8
  };

  const tasks = [
    { title: '每日登录', desc: '每天首次登录 +5 积分', points: '+5', type: 'daily' },
    { title: '完成一题算法练习', desc: '任意算法题提交通过 +20 积分', points: '+20', type: 'task' },
    { title: '分享题解/文章', desc: '发布优质内容并通过审核 +50 积分', points: '+50', type: 'content' },
    { title: '连续打卡 7 天', desc: '保持连续登录 +100 积分', points: '+100', type: 'streak' },
  ];

  const benefits = [
    { title: '专属身份标识', desc: '评论区与排行榜展示会员徽章', icon: <CrownOutlined /> },
    { title: '题库加速', desc: '解锁更多优选题单与刷题路线', icon: <ThunderboltOutlined /> },
    { title: '积分商城', desc: '未来可兑换周边、课程优惠券等', icon: <GiftOutlined /> },
  ];

  const history = [
    { type: 'earn', title: '完成算法题「两数之和」', time: '今天 10:23', points: '+20' },
    { type: 'earn', title: '每日登录', time: '今天 09:02', points: '+5' },
    { type: 'earn', title: '分享文章「React Hooks 最佳实践」', time: '昨天 21:17', points: '+50' },
    { type: 'spend', title: '兑换「头像边框 · 蓝色霓虹」', time: '3 天前', points: '-80' },
  ];

  const progressPercent = Math.round(
    (levelInfo.currentPoints / levelInfo.nextLevelPoints) * 100
  );

  return (
    <div className="p-6 min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 顶部概览 */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左：当前等级 */}
          <Card className="flex-1 shadow-sm border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  size={56}
                  style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)' }}
                >
                  <TrophyOutlined />
                </Avatar>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">当前等级</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {levelInfo.currentLevel}
                  </div>
                  <Tag color="gold" className="mt-1">
                    排名前 {levelInfo.rankPercent}% 的活跃用户
                  </Tag>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-xs text-gray-400 mb-1">距离下一等级还需</div>
                <div className="text-2xl font-bold text-primary-500">
                  {levelInfo.nextLevelPoints - levelInfo.currentPoints}
                </div>
                <div className="text-xs text-gray-400 mt-1">积分即可升级至 {levelInfo.nextLevel}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>当前积分 {levelInfo.currentPoints}</span>
                <span>升级目标 {levelInfo.nextLevelPoints}</span>
              </div>
              <Progress
                percent={progressPercent}
                showInfo={false}
                strokeColor={{
                  from: '#6366f1',
                  to: '#22d3ee',
                }}
                trailColor="#e5e7eb"
              />
            </div>
          </Card>

          {/* 右：权益一览 */}
          <Card className="w-full md:w-80 shadow-sm border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                会员权益总览
              </div>
              <Tag color="blue">预览版</Tag>
            </div>
            <div className="space-y-3">
              {benefits.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-default transition-colors"
                >
                  <div className="mt-1 text-primary-500">{item.icon}</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 主体两列 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 可获取积分的任务 */}
          <Card className="lg:col-span-2 shadow-sm border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  今日可获取积分
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  通过完成以下行为获得积分，持续活跃可快速升级
                </div>
              </div>
              <Button type="link" icon={<ArrowRightOutlined />}>
                查看积分规则
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900/60 flex flex-col justify-between gap-3 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {task.title}
                    </div>
                    <Tag color="processing" className="text-xs">
                      {task.points}
                    </Tag>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {task.desc}
                  </div>
                  <div className="flex items-center justify-between">
                    <Tag
                      color={
                        task.type === 'daily'
                          ? 'blue'
                          : task.type === 'streak'
                          ? 'gold'
                          : 'purple'
                      }
                      className="text-[10px]"
                    >
                      {task.type === 'daily'
                        ? '每日任务'
                        : task.type === 'streak'
                        ? '连击奖励'
                        : '行为任务'}
                    </Tag>
                    <Tooltip title="即将支持数据打通～">
                      <Button size="small" type="primary" ghost>
                        去完成
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 积分变动时间轴 */}
          <Card className="shadow-sm border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                最近积分记录
              </div>
            </div>
            <Timeline
              items={history.map((item) => ({
                color: item.type === 'earn' ? 'green' : 'red',
                children: (
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.time}
                      </div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {item.title}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        item.type === 'earn'
                          ? 'text-emerald-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {item.points}
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberPage;

