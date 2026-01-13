
export interface DocSection {
  id: string;
  title: string;
  content?: string;
  children?: DocSection[];
}

export const DOCS_DATA: DocSection[] = [
  {
    id: 'intro',
    title: '平台介绍',
    content: `
# 木瓜编程平台介绍

欢迎来到木瓜编程！这是一个专注于程序员成长的在线学习平台。

## 平台愿景

我们致力于为开发者提供高质量的学习资源、真实的面试经验和高效的在线编程环境。

## 核心功能

- **题库系统**：海量算法题目，支持在线编写、运行和测试。
- **面试真题**：收录各大互联网公司的真实面试题目和面经。
- **学习路线**：清晰的技能成长路径，助你系统化学习。
- **在线编程**：功能强大的在线代码编辑器，支持多种语言。
    `
  },
  {
    id: 'quick-start',
    title: '快速开始',
    children: [
      {
        id: 'account',
        title: '账号注册',
        content: `
# 账号注册与登录

## 注册流程

1. 点击右上角的"登录"按钮。
2. 选择"立即注册"。
3. 填写用户名、邮箱和密码。
4. 完成邮箱验证。

## 登录方式

- **账号密码登录**：使用注册时的邮箱和密码。
- **第三方登录**：支持 GitHub、Gitee 快捷登录。
        `
      },
      {
        id: 'profile',
        title: '个人资料完善',
        content: `
# 完善个人资料

建议您在注册后尽快完善个人资料，这将有助于：

1. **求职推荐**：完善的简历信息能让招聘方更容易发现你。
2. **社区交流**：真实的头像和昵称能增加社区互动的信任感。
3. **学习记录**：准确记录您的学习轨迹和成就。
        `
      }
    ]
  },
  {
    id: 'features',
    title: '功能指南',
    children: [
      {
        id: 'question-bank',
        title: '刷题指南',
        content: `
# 刷题系统使用指南

## 寻找题目

您可以通过以下方式找到感兴趣的题目：

- **标签筛选**：按算法类型（如动态规划、树、图）筛选。
- **难度筛选**：按简单、中等、困难筛选。
- **搜索**：直接输入题目名称或关键字。

## 在线答题

1. 进入题目详情页。
2. 阅读题目描述和示例。
3. 在右侧编辑器中编写代码。
4. 点击"运行代码"进行测试。
5. 点击"提交"查看最终结果。

\`\`\`javascript
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}
\`\`\`
        `
      },
      {
        id: 'interview',
        title: '面试备战',
        content: `
# 面试备战指南

## 公司真题

我们整理了字节跳动、阿里巴巴、腾讯等大厂的历年面试真题。

## 面经分享

社区用户分享的真实面试经历，包含：

- 面试流程
- 考察重点
- 避坑指南

> 建议在面试前至少刷完目标公司近半年的高频题。
        `
      }
    ]
  },
  {
    id: 'api',
    title: '开发者 API',
    children: [
      {
        id: 'api-auth',
        title: '认证鉴权',
        content: `
# API 认证

所有 API 请求都需要在 Header 中携带 \`Authorization\` 字段。

\`\`\`http
GET /api/v1/user/profile HTTP/1.1
Host: api.mgcode.com
Authorization: Bearer <your_access_token>
\`\`\`

## 获取 Token

请在个人设置页面的"开发者选项"中生成 Access Token。
        `
      },
      {
        id: 'api-questions',
        title: '题目接口',
        content: `
# 题目接口

## 获取题目列表

\`GET /api/v1/questions\`

### 参数

| 参数名 | 类型 | 必选 | 描述 |
|:----|:----|:---|:---|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |
| difficulty | string | 否 | 难度：easy, medium, hard |

### 响应示例

\`\`\`json
{
  "code": 200,
  "data": {
    "total": 100,
    "list": [
      {
        "id": "1",
        "title": "两数之和",
        "difficulty": "easy"
      }
    ]
  }
}
\`\`\`
        `
      }
    ]
  }
];
