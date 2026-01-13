import { useState } from 'react';
import { Avatar, Tooltip } from 'antd';
import { Trophy, Flame, Target, Zap, Medal, Crown } from 'lucide-react';

// Mock Data Generation
const names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Quinn", "Avery", "Skyler", "Dakota", "Reese", "Rowan", "Hayden", "Emerson", "Finley", "River", "Sage", "Phoenix", "Eden"];
const avatars = names.map((_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 123}`);

const generateData = (count: number) => Array.from({ length: count }).map((_, i) => ({
  id: i + 1,
  name: names[i % names.length] + (i > 19 ? ` ${i}` : ''),
  avatar: avatars[i % avatars.length],
  score: Math.floor(Math.random() * 5000) + 1000 - i * 50,
  solved: Math.floor(Math.random() * 500) + 50,
  streak: Math.floor(Math.random() * 100) + 1,
  badges: Math.random() > 0.5 ? ['🚀', '🔥'] : ['🌟']
})).sort((a, b) => b.score - a.score).map((user, index) => ({ ...user, rank: index + 1 }));

const weeklyData = generateData(20);
const monthlyData = generateData(20);
const totalData = generateData(20);

const RankPage = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [data, setData] = useState(weeklyData);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'weekly') setData(weeklyData);
    if (key === 'monthly') setData(monthlyData);
    if (key === 'total') setData(totalData);
  };

  const topThree = data.slice(0, 3);
  const restList = data.slice(3);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 pt-20 pb-10 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
            <Trophy className="text-yellow-600 dark:text-yellow-400" size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-3 tracking-tight">
            学习贡献排行榜
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            每一分努力都值得被看见。与优秀的伙伴一起，挑战自我，突破极限。
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 inline-flex">
            {[
              { id: 'weekly', label: '本周榜单' },
              { id: 'monthly', label: '本月榜单' },
              { id: 'total', label: '总榜单' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 transform scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Podium Section (Top 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end max-w-3xl mx-auto px-4">
          {/* 2nd Place */}
          <div className="order-2 md:order-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
             <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                <Avatar size={96} src={topThree[1].avatar} className="border-4 border-gray-300 dark:border-gray-600 shadow-xl z-10 relative" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-b from-gray-300 to-gray-400 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1 min-w-[32px] justify-center">
                    2
                </div>
             </div>
             <div className="mt-6 text-center">
                 <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{topThree[1].name}</h3>
                 <div className="text-primary-500 font-bold bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full text-sm inline-block">
                    {topThree[1].score} 分
                 </div>
             </div>
             <div className="h-24 w-full bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-800 rounded-t-2xl mt-4 mx-4 border-b-4 border-gray-300 dark:border-gray-600 opacity-50"></div>
          </div>

          {/* 1st Place */}
          <div className="order-1 md:order-2 flex flex-col items-center -mt-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="relative group cursor-pointer">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce drop-shadow-lg">
                    <Crown size={40} fill="currentColor" strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <Avatar size={128} src={topThree[0].avatar} className="border-[6px] border-yellow-400 shadow-2xl z-10 relative ring-4 ring-yellow-400/20" />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-b from-yellow-400 to-yellow-500 text-white text-base font-black px-4 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1 min-w-[40px] justify-center">
                    1
                </div>
             </div>
             <div className="mt-8 text-center">
                 <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{topThree[0].name}</h3>
                 <div className="text-yellow-600 dark:text-yellow-400 font-bold bg-yellow-50 dark:bg-yellow-900/20 px-4 py-1.5 rounded-full text-base inline-block">
                    {topThree[0].score} 分
                 </div>
             </div>
             <div className="h-32 w-full bg-gradient-to-t from-yellow-50 to-transparent dark:from-yellow-900/20 rounded-t-2xl mt-4 mx-4 border-b-4 border-yellow-400 opacity-60"></div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
             <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                <Avatar size={96} src={topThree[2].avatar} className="border-4 border-orange-300 dark:border-orange-700 shadow-xl z-10 relative" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-b from-orange-300 to-orange-400 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1 min-w-[32px] justify-center">
                    3
                </div>
             </div>
             <div className="mt-6 text-center">
                 <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{topThree[2].name}</h3>
                 <div className="text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full text-sm inline-block">
                    {topThree[2].score} 分
                 </div>
             </div>
             <div className="h-20 w-full bg-gradient-to-t from-orange-50 to-transparent dark:from-orange-900/20 rounded-t-2xl mt-4 mx-4 border-b-4 border-orange-300 dark:border-orange-700 opacity-50"></div>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-1 text-center">排名</div>
                <div className="col-span-5 pl-2">用户</div>
                <div className="col-span-2 text-center hidden md:block">刷题数</div>
                <div className="col-span-2 text-center hidden md:block">连续坚持</div>
                <div className="col-span-4 md:col-span-2 text-right pr-4">积分</div>
            </div>

            {/* List Items */}
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {restList.map((user, index) => (
                    <div 
                        key={user.id} 
                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 group cursor-default"
                    >
                        <div className="col-span-1 text-center font-bold text-gray-400 group-hover:text-primary-500 transition-colors">
                            {user.rank}
                        </div>
                        <div className="col-span-5 flex items-center gap-4 pl-2">
                            <Avatar src={user.avatar} size={40} className="border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform" />
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">{user.name}</span>
                                <div className="flex gap-1 mt-0.5">
                                    {user.badges.map((badge, i) => <span key={i} className="text-[10px]">{badge}</span>)}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 text-sm font-medium hidden md:flex items-center justify-center gap-1.5">
                            <Target size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors" /> 
                            {user.solved}
                        </div>
                        <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 text-sm font-medium hidden md:flex items-center justify-center gap-1.5">
                            <Flame size={14} className="text-gray-300 group-hover:text-orange-400 transition-colors" /> 
                            {user.streak} 天
                        </div>
                        <div className="col-span-4 md:col-span-2 text-right pr-4">
                            <span className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                                {user.score}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Pagination / Load More */}
            <div className="p-4 text-center border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30">
                <button className="text-sm text-gray-500 hover:text-primary-500 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    查看更多排名
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RankPage;
