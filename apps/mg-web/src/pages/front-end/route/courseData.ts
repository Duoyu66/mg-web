export interface Course {
  type: 'course' | 'video' | 'book';
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  articleCount: number;
  trials: { name: string; link: string }[];
}

export interface CourseSectionData {
  title: string;
  icon: string;
  courses: Course[];
  gradient: string;
  id: string;
}

export const courseData: CourseSectionData[] = [
  {
    id: 'java',
    title: 'Java方向',
    icon: 'https://static.nowcoder.com/fe/file/images/1654602592933_62A08B20885542A99F355A53A9F5A9A1',
    gradient: 'from-blue-400 to-blue-500',
    courses: [
      {
        type: 'course',
        icon: 'https://static.nowcoder.com/fe/file/images/1654602592933_62A08B20885542A99F355A53A9F5A9A1',
        title: '牛客精品-教程系列',
        subtitle: 'Java学习教程',
        description: '详细讲述了该岗位的校招求职过程,和各阶段下要做的准备',
        articleCount: 14,
        trials: [
          { name: '大纲', link: '#' },
          { name: '开篇词', link: '#' },
          { name: '求职规划', link: '#' },
        ],
      },
    ],
  },
  {
    id: 'cpp',
    title: 'C++方向',
    icon: 'C/C++',
    gradient: 'from-green-400 to-green-500',
    courses: [
      {
        type: 'course',
        icon: 'https://static.nowcoder.com/fe/file/oss/1668063570640XIBVS.png',
        title: 'C++工程师',
        subtitle: 'C++工程师岗位求职经验分享',
        description: '详细讲述了该岗位的校招求职过程,和各阶段下要做的准备',
        articleCount: 14,
        trials: [
          { name: '大纲', link: '#' },
          { name: '开篇词', link: '#' },
          { name: '求职规划', link: '#' },
        ],
      },
    ],
  },
  {
    id: 'hr',
    title: '人力资源岗',
    icon: 'HR',
    gradient: 'from-orange-400 to-orange-500',
    courses: [
      {
        type: 'course',
        icon: 'https://static.nowcoder.com/fe/file/oss/1668063570640XIBVS.png',
        title: '人力资源岗',
        subtitle: '人力资源岗求职经验分享',
        description: '详细讲述了该岗位的校招求职过程,和各阶段下要做的准备',
        articleCount: 10,
        trials: [
          { name: '我的秋招求职之旅', link: '#' },
          { name: '大纲', link: '#' },
          { name: '校招求职规划及进度ing', link: '#' },
        ],
      },
    ],
  },
];
