import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const openApiPath = join(rootDir, "apifox", "openapi.json");
const outputDir = join(rootDir, "src", "api", "hooks");

// 将路径转换为驼峰命名
function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

// 将路径转换为 PascalCase
function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// 生成 hook 名称
function generateHookName(method, path, operationId) {
  if (operationId) {
    // 如果有关联ID，使用它
    const camelCase = toCamelCase(operationId);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }
  
  // 否则从路径和方法生成
  const pathParts = path.split("/").filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || "item";
  const methodPrefix = method === "get" ? "useGet" : method === "post" ? "usePost" : method === "put" ? "usePut" : method === "delete" ? "useDelete" : "use";
  return methodPrefix + toPascalCase(lastPart);
}

// 判断是否为查询操作（GET）还是变更操作（POST/PUT/DELETE）
function isQueryMethod(method) {
  return method.toLowerCase() === "get";
}

// 生成参数类型
function generateParamsType(parameters, requestBody) {
  const params = [];
  
  if (parameters && parameters.length > 0) {
    const pathParams = parameters.filter(p => p.in === "path");
    const queryParams = parameters.filter(p => p.in === "query");
    const headerParams = parameters.filter(p => p.in === "header");
    
    if (pathParams.length > 0) {
      params.push(`path: { ${pathParams.map(p => `${p.name}${p.required ? "" : "?"}: ${getTypeScriptType(p.schema || p)}`).join("; ")} }`);
    }
    
    if (queryParams.length > 0) {
      params.push(`query${queryParams.some(p => p.required) ? "" : "?"}: { ${queryParams.map(p => `${p.name}${p.required ? "" : "?"}: ${getTypeScriptType(p.schema || p)}`).join("; ")} }`);
    }
    
    if (headerParams.length > 0) {
      params.push(`headers${headerParams.some(p => p.required) ? "" : "?"}: { ${headerParams.map(p => `${p.name}${p.required ? "" : "?"}: ${getTypeScriptType(p.schema || p)}`).join("; ")} }`);
    }
  }
  
  if (requestBody) {
    params.push(`data${requestBody.required ? "" : "?"}: ${getRequestBodyType(requestBody)}`);
  }
  
  return params.length > 0 ? `{ ${params.join("; ")} }` : "any";
}

// 获取 TypeScript 类型
function getTypeScriptType(schema) {
  if (!schema) return "any";
  
  if (schema.type === "string") return "string";
  if (schema.type === "number" || schema.type === "integer") return "number";
  if (schema.type === "boolean") return "boolean";
  if (schema.type === "array") {
    const itemsType = getTypeScriptType(schema.items);
    return `${itemsType}[]`;
  }
  if (schema.type === "object" || schema.properties) {
    if (schema.properties) {
      const props = Object.entries(schema.properties)
        .map(([key, value]) => `${key}?: ${getTypeScriptType(value)}`)
        .join("; ");
      return `{ ${props} }`;
    }
    return "Record<string, any>";
  }
  
  return "any";
}

// 获取请求体类型
function getRequestBodyType(requestBody) {
  if (!requestBody || !requestBody.content) return "any";
  
  const content = requestBody.content;
  const jsonContent = content["application/json"] || content["application/x-www-form-urlencoded"];
  
  if (jsonContent && jsonContent.schema) {
    return getTypeScriptType(jsonContent.schema);
  }
  
  return "any";
}

// 生成单个 hook 文件
function generateHookFile(method, path, operation) {
  const hookName = generateHookName(method, path, operation.operationId);
  const isQuery = isQueryMethod(method);
  
  // 处理参数
  const pathParams = operation.parameters?.filter(p => p.in === "path") || [];
  const queryParams = operation.parameters?.filter(p => p.in === "query") || [];
  const headerParams = operation.parameters?.filter(p => p.in === "header") || [];
  const hasData = !!operation.requestBody;
  
  const hasPathParams = pathParams.length > 0;
  const hasQueryParams = queryParams.length > 0;
  const hasHeaders = headerParams.length > 0;
  const hasAnyParams = hasPathParams || hasQueryParams || hasHeaders || hasData;
  
  // 生成参数类型
  let paramsType = "any";
  if (hasAnyParams) {
    const params = [];
    if (hasPathParams) {
      params.push(`path: { ${pathParams.map(p => `${p.name}${p.required ? "" : "?"}: ${getTypeScriptType(p.schema || p)}`).join("; ")} }`);
    }
    if (hasQueryParams) {
      params.push(`query${queryParams.some(p => p.required) ? "" : "?"}: { ${queryParams.map(p => `${p.name}${p.required ? "" : "?"}: ${getTypeScriptType(p.schema || p)}`).join("; ")} }`);
    }
    if (hasHeaders) {
      params.push(`headers${headerParams.some(p => p.required) ? "" : "?"}: { ${headerParams.map(p => `${p.name}${p.required ? "" : "?"}: ${getTypeScriptType(p.schema || p)}`).join("; ")} }`);
    }
    if (hasData) {
      params.push(`data${operation.requestBody.required ? "" : "?"}: ${getRequestBodyType(operation.requestBody)}`);
    }
    paramsType = `{ ${params.join("; ")} }`;
  }
  
  // 生成请求代码
  let requestBodyCode = "";
  if (hasAnyParams) {
    // 构建 URL（处理路径参数）
    let urlCode = `'${path}'`;
    if (hasPathParams) {
      urlCode = `'${path}'.replace(/\\{[^}]+\\}/g, (match) => {
            const key = match.slice(1, -1);
            return params.path[key];
        })`;
    }
    
    // 构建请求配置
    requestBodyCode = `const config: any = {
            url: ${urlCode},
            method: '${method.toLowerCase()}',
            headers: { 'content-type': 'application/json' },
        };
        
        ${hasQueryParams ? `if (params.query) {
            config.params = params.query;
        }` : ""}
        ${hasHeaders ? `if (params.headers) {
            config.headers = { ...config.headers, ...params.headers };
        }` : ""}
        ${hasData ? `if (params.data) {
            config.data = params.data;
        }` : ""}
        
        return requestClient.request(config);`;
  } else {
    requestBodyCode = `requestClient.request({
            url: '${path}',
            method: '${method.toLowerCase()}',
            headers: { 'content-type': 'application/json' },
        })`;
  }
  
  // 生成 hook 代码
  const hookCode = `import { ${isQuery ? "useQuery" : "useMutation"} } from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

${hasAnyParams ? `type ${hookName}Params = ${paramsType};` : ""}

export const ${hookName} = (${hasAnyParams ? (isQuery ? `params: ${hookName}Params` : `params?: ${hookName}Params`) : ""}) => {
    ${isQuery ? `const { data, isLoading, ...rest } = useQuery({
        queryKey: ['${path}', ${hasAnyParams ? "params" : ""}],
        queryFn: () => {
            ${requestBodyCode}
        }
    });
    return { data, isLoading, ...rest };` : `return useMutation({
        mutationKey: ['${path}'],
        mutationFn: (payload${hasAnyParams ? `: ${hookName}Params` : ": any"}) => {
            ${hasAnyParams ? "const params = payload;" : ""}
            ${requestBodyCode}
        }
    });`}
}`;

  return {
    fileName: `${hookName}.ts`,
    content: hookCode,
  };
}

// 主函数
async function main() {
  try {
    // 读取 OpenAPI 文件
    console.log(`[apifox-generate-hooks] Reading OpenAPI spec from ${openApiPath}`);
    const openApiContent = await readFile(openApiPath, "utf-8");
    const openApi = JSON.parse(openApiContent);

    if (!openApi.paths) {
      console.error("[apifox-generate-hooks] No paths found in OpenAPI spec");
      process.exit(1);
    }

    // 创建输出目录
    await mkdir(outputDir, { recursive: true });

    // 生成 hooks
    const hooks = [];
    for (const [path, pathItem] of Object.entries(openApi.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (["get", "post", "put", "delete", "patch"].includes(method.toLowerCase()) && operation) {
          const hook = generateHookFile(method, path, operation);
          hooks.push(hook);
        }
      }
    }

    // 写入文件
    console.log(`[apifox-generate-hooks] Generating ${hooks.length} hooks...`);
    for (const hook of hooks) {
      const filePath = join(outputDir, hook.fileName);
      await writeFile(filePath, hook.content, "utf-8");
      console.log(`[apifox-generate-hooks] Generated ${hook.fileName}`);
    }

    // 生成 index.ts 导出文件
    const indexContent = hooks
      .map((hook) => {
        const hookName = hook.fileName.replace(".ts", "");
        return `export { ${hookName} } from './${hookName}';`;
      })
      .join("\n");

    await writeFile(join(outputDir, "index.ts"), indexContent, "utf-8");
    console.log(`[apifox-generate-hooks] Generated index.ts`);

    console.log(`[apifox-generate-hooks] Successfully generated ${hooks.length} hooks in ${outputDir}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(
        `[apifox-generate-hooks] OpenAPI file not found at ${openApiPath}. Please run 'npm run apifox:download' first.`
      );
    } else {
      console.error("[apifox-generate-hooks] Error:", error);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[apifox-generate-hooks] Fatal error:", err);
  process.exit(1);
});

