# Apifox 代码生成工具

本项目提供了从 Apifox 自动生成 TypeScript 类型和 React Query Hooks 的工具。

## 前置准备

1. **配置 Apifox Token 和 Project ID**

   在项目根目录创建 `.env` 文件（或设置环境变量）：

   ```bash
   APIFOX_TOKEN=your_apifox_token
   APIFOX_PROJECT_ID=your_project_id
   ```

   或者，如果你已经在 Apifox 后台生成了开放的 OpenAPI 链接，可以直接配置：

   ```bash
   APIFOX_OPENAPI_URL=https://your-openapi-url
   ```

2. **下载 OpenAPI 规范**

   ```bash
   npm run apifox:download
   ```

   这会将 OpenAPI 规范下载到 `apifox/openapi.json`。

## 生成代码

### 1. 生成 TypeScript 类型

```bash
npm run apifox:types
```

这会生成 `src/api/types.ts`，包含所有 API 的 TypeScript 类型定义。

### 2. 生成 React Query Hooks

```bash
npm run apifox:hooks
```

这会根据 OpenAPI 规范生成对应的 React Query Hooks，保存在 `src/api/hooks/` 目录下。

### 3. 一键生成所有代码

```bash
npm run apifox:all
```

这会依次执行：
1. 下载 OpenAPI 规范
2. 生成 TypeScript 类型
3. 生成 React Query Hooks

## 生成的 Hooks 使用示例

### GET 请求（使用 useQuery）

```typescript
import { useGetUserInfo } from '@/api/hooks';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useGetUserInfo({
    path: { userId }
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return <div>{data?.name}</div>;
}
```

### POST/PUT/DELETE 请求（使用 useMutation）

```typescript
import { useCreateUser } from '@/api/hooks';

function CreateUserForm() {
  const createUser = useCreateUser();

  const handleSubmit = async (formData: any) => {
    try {
      const result = await createUser.mutateAsync({
        data: formData
      });
      console.log('创建成功:', result);
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
    </form>
  );
}
```

## 生成的 Hook 命名规则

- GET 请求：`useGet{PathName}`（例如：`useGetUserInfo`）
- POST 请求：`usePost{PathName}`（例如：`usePostCreateUser`）
- PUT 请求：`usePut{PathName}`（例如：`usePutUpdateUser`）
- DELETE 请求：`useDelete{PathName}`（例如：`useDeleteUser`）

如果 OpenAPI 规范中定义了 `operationId`，则优先使用 `operationId` 生成 hook 名称。

## 参数类型

生成的 hooks 会根据 OpenAPI 规范自动生成参数类型：

- **路径参数**：`params.path.{paramName}`
- **查询参数**：`params.query.{paramName}`
- **请求头**：`params.headers.{headerName}`
- **请求体**：`params.data`

例如：

```typescript
type UseGetUserInfoParams = {
  path: { userId: string };
  query?: { include?: string };
};

const { data } = useGetUserInfo({
  path: { userId: "123" },
  query: { include: "profile" }
});
```

## 注意事项

1. 确保在运行生成脚本前，已经成功下载了 OpenAPI 规范文件（`apifox/openapi.json`）
2. 生成的 hooks 使用项目中的 `requestClient`（`@/utils/requestClient`）
3. 所有生成的 hooks 都会自动导出到 `src/api/hooks/index.ts`
4. 如果 API 规范更新，需要重新运行生成脚本

