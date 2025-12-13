import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// 尝试从 .env 文件读取配置
async function loadEnvFile() {
  const envPath = join(rootDir, ".env");
  if (existsSync(envPath)) {
    try {
      const envContent = await readFile(envPath, "utf-8");
      const envVars = {};
      envContent.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const [key, ...valueParts] = trimmed.split("=");
          if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join("=").trim();
          }
        }
      });
      // 将 .env 中的变量设置到 process.env（如果不存在）
      Object.entries(envVars).forEach(([key, value]) => {
        if (!process.env[key]) {
          process.env[key] = value;
        }
      });
    } catch (error) {
      console.warn(`[apifox-download] Warning: Could not read .env file: ${error.message}`);
    }
  }
}

const outputDir = "apifox";
const outputFile = `${outputDir}/openapi.json`;

async function main() {
  // 加载 .env 文件
  await loadEnvFile();

  const token = process.env.APIFOX_TOKEN || "";
  const projectId = process.env.APIFOX_PROJECT_ID || "";
  const host = process.env.APIFOX_HOST || "https://api.apifox.cn";
  const customUrl = process.env.APIFOX_OPENAPI_URL; // 若已在 Apifox 后台生成开放的 OpenAPI 链接，可直接配置
  
  // 验证 customUrl 是否是完整的 OpenAPI URL
  // 支持多种格式：/openapi, /export-openapi, /api/v1/projects, /v1/projects
  if (customUrl) {
    const isValidUrl = 
      customUrl.includes('/openapi') || 
      customUrl.includes('/export-openapi') ||
      customUrl.includes('/api/v1/projects') ||
      customUrl.includes('/v1/projects');
    
    if (!isValidUrl) {
      console.error(`[apifox-download] Error: APIFOX_OPENAPI_URL 格式不正确`);
      console.error(`当前值: ${customUrl}`);
      console.error(`\n正确的 OpenAPI URL 应该包含以下路径之一：`);
      console.error(`- /openapi`);
      console.error(`- /export-openapi`);
      console.error(`- /api/v1/projects/.../openapi`);
      console.error(`- /v1/projects/.../export-openapi`);
      console.error(`\n请从 Apifox 后台获取完整的 OpenAPI 链接：`);
      console.error(`项目设置 -> 开放 OpenAPI -> 复制链接`);
      process.exit(1);
    }
  }
  
  // 构建 URL
  let url;
  if (customUrl) {
    url = customUrl;
    
    // 检查 URL 格式，如果是 export-openapi 端点，尝试转换为标准的 openapi 端点
    if (url.includes('/export-openapi')) {
      console.warn(`[apifox-download] Warning: /export-openapi endpoint may not work. Trying to convert to standard /openapi endpoint...`);
      
      // 尝试转换为标准的 openapi 端点
      if (url.includes('/v1/projects/')) {
        // 提取 projectId
        const projectIdMatch = url.match(/\/v1\/projects\/(\d+)/);
        if (projectIdMatch && projectIdMatch[1]) {
          const extractedProjectId = projectIdMatch[1];
          // 使用标准的 openapi 端点格式
          url = `https://api.apifox.cn/api/v1/projects/${extractedProjectId}/openapi?scope=project&lang=zh-CN`;
          console.log(`[apifox-download] Converted to standard endpoint: ${url}`);
          
          // 如果使用标准端点，需要添加认证头
          if (token) {
            console.log(`[apifox-download] Will use token in headers for standard endpoint`);
          }
        }
      }
    }
  } else {
    url = `${host}/api/v1/projects/${projectId}/openapi?scope=project&lang=zh-CN`;
  }

  if (!customUrl && (!token || !projectId)) {
    const envExamplePath = join(rootDir, ".env.example");
    const envPath = join(rootDir, ".env");
    const hasEnvExample = existsSync(envExamplePath);
    const hasEnv = existsSync(envPath);
    
    console.error(
      "[apifox-download] Missing env: set APIFOX_OPENAPI_URL, or both APIFOX_TOKEN and APIFOX_PROJECT_ID"
    );
    console.error("\n" + "=".repeat(60));
    console.error("配置说明：");
    console.error("=".repeat(60));
    
    if (!hasEnv) {
      console.error("\n❌ 未找到 .env 文件");
      if (hasEnvExample) {
        console.error("\n✅ 已找到 .env.example 文件，请按以下步骤操作：");
        console.error("\n1. 复制 .env.example 为 .env：");
        console.error("   copy .env.example .env");
        console.error("\n2. 编辑 .env 文件，填入你的配置：");
        console.error("   - 方式1（推荐）：设置 APIFOX_OPENAPI_URL");
        console.error("     在 Apifox 后台：项目设置 -> 开放 OpenAPI -> 复制链接");
        console.error("   - 方式2：设置 APIFOX_TOKEN 和 APIFOX_PROJECT_ID");
      } else {
        console.error("\n请创建 .env 文件并添加以下配置之一：");
        console.error("\n方式1（推荐）：");
        console.error("  APIFOX_OPENAPI_URL=https://your-openapi-url");
        console.error("\n方式2：");
        console.error("  APIFOX_TOKEN=your_token");
        console.error("  APIFOX_PROJECT_ID=your_project_id");
      }
    } else {
      console.error("\n⚠️  找到 .env 文件，但配置不完整");
      console.error("请检查 .env 文件中的配置是否正确");
    }
    
    console.error("\n或者，在 PowerShell 中临时设置环境变量：");
    console.error("  $env:APIFOX_OPENAPI_URL='your-url'");
    console.error("  pnpm run apifox:download");
    console.error("\n" + "=".repeat(60));
    process.exit(1);
  }

  console.log(`[apifox-download] fetching openapi from ${url}`);

  const headers = {
    Accept: "application/json, */*",
  };

  // 如果 URL 包含 /openapi 端点（标准 API 端点），需要添加认证头
  // 如果 URL 是公开的 OpenAPI URL（通常包含 token 参数），不需要认证头
  const isStandardEndpoint = url.includes('/api/v1/projects/') && url.includes('/openapi');
  const isPublicUrl = url.includes('token=') || url.includes('apikey=');
  
  if (isStandardEndpoint && !isPublicUrl && token) {
    // Apifox API 使用 X-Apifox-Token 头
    headers["X-Apifox-Token"] = token;
    // 也尝试 Authorization 头（某些环境可能需要）
    headers["Authorization"] = `Bearer ${token}`;
    headers["Content-Type"] = "application/json";
  } else if (!customUrl && token) {
    // 使用 Token + Project ID 方式
    headers["X-Apifox-Token"] = token;
    headers["Authorization"] = `Bearer ${token}`;
    headers["Content-Type"] = "application/json";
  }

  console.log(`[apifox-download] Request headers:`, JSON.stringify(headers, null, 2));

  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: headers,
  });

  const raw = await res.text();
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    console.error(
      `[apifox-download] request failed: ${res.status} ${res.statusText}`
    );
    if (raw) {
      console.error(`Response body: ${raw}`);
    }
    process.exit(1);
  }

  // 检查响应是否为空
  if (!raw || raw.trim().length === 0) {
    console.error(
      `[apifox-download] Error: API returned empty response (status ${res.status})`
    );
    console.error("\n可能的原因：");
    console.error("1. Token 无效或已过期");
    console.error("2. Project ID 不正确");
    console.error("3. 项目权限不足");
    console.error("\n建议：");
    console.error("- 检查 Apifox 后台中的 Token 和 Project ID 是否正确");
    console.error("- 尝试使用 OpenAPI URL 方式（项目设置 -> 开放 OpenAPI）");
    process.exit(1);
  }

  let data;
  try {
    // 如果 content-type 为空但内容看起来像 JSON，尝试解析
    if (!contentType.includes("application/json") && !contentType.includes("text/json")) {
      // 检查内容是否以 { 或 [ 开头，可能是 JSON
      const trimmed = raw.trim();
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        console.warn(`[apifox-download] Warning: Content-Type is "${contentType}", but content looks like JSON. Attempting to parse...`);
      } else {
        throw new Error(`unexpected content-type: "${contentType}". Expected JSON but got empty or non-JSON response.`);
      }
    }
    data = JSON.parse(raw);
  } catch (err) {
    const debugFile = `${outputDir}/openapi.debug.txt`;
    await mkdir(outputDir, { recursive: true });
    const debugPayload = [
      `status: ${res.status} ${res.statusText}`,
      `content-type: ${contentType}`,
      `content-length: ${res.headers.get("content-length") || "unknown"}`,
      `headers: ${JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2)}`,
      "",
      `Response body (first 1000 chars):`,
      raw ? raw.substring(0, 1000) : "(empty)"
    ].join("\n");
    await writeFile(debugFile, debugPayload, "utf8");
    console.error(
      `[apifox-download] parse failed, raw saved to ${debugFile}; error: ${err.message}`
    );
    console.error("\n请检查 debug 文件以获取更多信息");
    process.exit(1);
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, JSON.stringify(data, null, 2), "utf8");
  console.log(`[apifox-download] saved to ${outputFile}`);
}

main().catch((err) => {
  console.error("[apifox-download] error", err);
  process.exit(1);
});

