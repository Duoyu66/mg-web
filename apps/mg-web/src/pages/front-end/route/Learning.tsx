import React from 'react';

const learningData = [
  {
    avatar: 'https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg',
    name: '牛客66131...',
    time: '13分钟前',
  },
  {
    avatar: 'https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg',
    name: '创客营',
    time: '44分钟前',
  },
  {
    avatar: 'https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg',  
    name: '牛客22221...',
    time: '3小时前',
  },
  {
    avatar: 'https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg',
    name: '哎艾远',
    time: '18小时前',
  },
  {
    avatar: 'https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg',  
    name: 'FuTCodKing',
    time: '18小时前',
  },
  {
    avatar: 'https://img.nowcoder.com/images/20221103/999_1667486524049/61715359842F4126A324F25A2541359B?x-oss-process=image/resize,m_mfit,h_100,w_100',
    name: '汪民硕',
    time: '1天前',
  },
  {
    avatar: 'https://static.nowcoder.com/images/stick/1003.png',
    name: 'XJLM',
    time: '1天前',
  },
  {
    avatar: 'https://static.nowcoder.com/images/stick/1004.png',
    name: '已被标记为...',
    time: '1天前',
  },
  {
    avatar: 'https://img.nowcoder.com/images/20221103/999_1667486524049/61715359842F4126A324F25A2541359B?x-oss-process=image/resize,m_mfit,h_100,w_100',
    name: '阿珂123456',
    time: '2天前',
  },
  {
    avatar: 'https://static.nowcoder.com/images/stick/1005.png',
    name: '袜子20190...',
    time: '3天前',
  },
];

const Learning: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-4">
        <span className="inline-block w-2 h-2 bg-orange-500 mr-2"></span>
        最近正在学
      </h2>
      <div className="grid grid-cols-5 gap-x-8 gap-y-6">
        {learningData.map((item, index) => (
          <div key={index} className="flex items-center">
            <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learning;
