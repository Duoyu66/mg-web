---
id: react-query
title: React Query
slug: /frontend/advanced/react-query
---

# React Query 详解

## 一、什么是 React Query？

React Query 是一个用于管理服务器状态的 React 库，它解决了以下问题：

- **数据缓存**：自动缓存 API 响应
- **后台同步**：自动在后台刷新过期数据
- **乐观更新**：在更新请求发送前先更新 UI
- **错误重试**：自动重试失败的请求
- **分页/无限加载**：内置支持

## 二、核心概念

### 1. Query（查询）

用于从服务器获取数据。

```javascript
import { useQuery } from '@tanstack/react-query';

const fetchUsers = async () => {
  const response = await fetch('/api/users');
  return response.json();
};

function Users() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}
```

### 2. Mutation（变更）

用于创建、更新、删除数据。

```javascript
import { useMutation } from '@tanstack/react-query';

const addUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return response.json();
};

function AddUserForm() {
  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      // 处理成功
    },
  });
}
```

## 三、主要功能详解

### 1. Query Keys（查询键）

- 用于唯一标识查询
- 可以是字符串或数组
- 支持嵌套和依赖关系

```javascript
// 基本用法
useQuery({ queryKey: ['todos'], queryFn: fetchTodos })

// 带参数的查询
useQuery({ queryKey: ['todo', id], queryFn: () => fetchTodo(id) })

// 复杂键
useQuery({ queryKey: ['todos', { status, page }], queryFn: fetchTodos })
```

### 2. Query States（查询状态）

```javascript
const {
  data,          // 查询数据
  error,         // 错误对象
  status,        // 'loading' | 'error' | 'success'
  isLoading,     // 是否正在加载（无缓存）
  isError,       // 是否出错
  isSuccess,     // 是否成功
  isFetching,    // 是否在获取（包括后台刷新）
  refetch,       // 手动重新获取
} = useQuery({...})
```

### 3. Query Options（查询选项）

```javascript
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  
  // 缓存配置
  staleTime: 5 * 60 * 1000, // 5分钟内数据不过期
  cacheTime: 10 * 60 * 1000, // 10分钟后从缓存移除
  
  // 重试配置
  retry: 3, // 失败时重试3次
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  
  // 其他选项
  enabled: !!userId, // 条件查询
  refetchOnWindowFocus: true, // 窗口聚焦时刷新
  refetchOnMount: true, // 组件挂载时刷新
  refetchOnReconnect: true, // 网络重连时刷新
})
```

### 4. Mutations（数据变更）

```javascript
const mutation = useMutation({
  mutationFn: addTodo,
  
  // 生命周期回调
  onMutate: async (newTodo) => {
    // 乐观更新前
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);
    
    // 乐观更新
    queryClient.setQueryData(['todos'], old => [...old, newTodo]);
    return { previousTodos };
  },
  
  onError: (err, newTodo, context) => {
    // 出错时回滚
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  
  onSettled: () => {
    // 完成后刷新数据
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

### 5. Query Invalidation（查询失效）

```javascript
import { useQueryClient } from '@tanstack/react-query';

function AddTodo() {
  const queryClient = useQueryClient();
  
  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      // 方式1：使特定查询失效
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      
      // 方式2：精确失效
      queryClient.invalidateQueries({ 
        queryKey: ['todos'],
        predicate: query => query.data?.type === 'active'
      });
    }
  });
}
```

## 四、高级特性

### 1. 依赖查询（Dependent Queries）

```javascript
// 第二个查询依赖第一个查询的结果
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  enabled: !!userId,
});

const { data: projects } = useQuery({
  queryKey: ['projects', user?.teamId],
  queryFn: fetchProjects,
  enabled: !!user?.teamId, // 只有用户存在时才执行
});
```

### 2. 无限查询（Infinite Queries）

```javascript
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchProjects = async ({ pageParam = 0 }) => {
  const res = await fetch(`/api/projects?cursor=${pageParam}`);
  return res.json();
};

function Projects() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
```

### 3. 预获取（Prefetching）

```javascript
const queryClient = useQueryClient();

// 鼠标悬停时预获取
const onHover = () => {
  queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
};
```

### 4. 请求取消（Query Cancellation）

```javascript
const query = useQuery({
  queryKey: ['todos'],
  queryFn: async ({ signal }) => {
    const resp = await fetch('/todos', { signal });
    return resp.json();
  },
});
```

## 五、配置 Query Client

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1分钟
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

## 六、开发工具

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 七、最佳实践

### 1. 自定义 Hooks

```javascript
export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
}
```

### 2. 错误边界

```javascript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<ErrorComponent />}>
  <ComponentWithQuery />
</ErrorBoundary>
```

### 3. Suspense 模式

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

<Suspense fallback={<Loading />}>
  <ComponentWithQuery />
</Suspense>
```

## 八、与状态管理库对比

| 特性 | React Query | Redux | SWR |
|------|------------|-------|-----|
| 服务器状态管理 | ✅ 优秀 | ⚠️ 需要中间件 | ✅ 优秀 |
| 客户端状态管理 | ❌ 不推荐 | ✅ 优秀 | ❌ 不推荐 |
| 自动缓存 | ✅ | ❌ | ✅ |
| 后台刷新 | ✅ | ❌ | ⚠️ 有限 |
| 乐观更新 | ✅ | ⚠️ 手动实现 | ⚠️ 手动实现 |

## 总结

React Query 是现代 React 应用管理服务器状态的推荐方案，它通过自动处理缓存、同步、更新等复杂逻辑，让开发者能更专注于业务逻辑。对于主要与服务器交互的应用，结合使用 React Query（服务器状态）和 Zustand/Context（客户端状态）是一个优秀的选择。
