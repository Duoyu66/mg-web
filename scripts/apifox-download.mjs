import { writeFile, mkdir } from "fs/promises";

const token = process.env.APIFOX_TOKEN || 'APS-haRIykeACFQx2pp09snFApKM6E27EPEa';
const projectId = process.env.APIFOX_PROJECT_ID || '7451461';
const host = process.env.APIFOX_HOST || "https://api.apifox.cn";
const customUrl = process.env.APIFOX_OPENAPI_URL; // 若已在 Apifox 后台生成开放的 OpenAPI 链接，可直接配置
const outputDir = "apifox";
const outputFile = `${outputDir}/openapi.json`;

async function main() {
  const url =
    customUrl ||
    `${host}/api/v1/projects/${projectId}/openapi?scope=project&lang=zh-CN`;

  if (!token && !customUrl) {
    console.error(
      "[apifox-download] Missing env: APIFOX_TOKEN (or provide APIFOX_OPENAPI_URL)"
    );
    process.exit(1);
  }

  console.log(`[apifox-download] fetching openapi from ${url}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // 部分环境要求 Bearer 前缀，保守兼容两种写法
      Authorization: token ? `Bearer ${token}` : undefined,
      "X-Apifox-Token": token,
    },
  });

  const raw = await res.text();

  if (!res.ok) {
    console.error(
      `[apifox-download] request failed: ${res.status} ${res.statusText} - ${raw}`
    );
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    const debugFile = `${outputDir}/openapi.debug.txt`;
    await mkdir(outputDir, { recursive: true });
    await writeFile(debugFile, raw ?? "", "utf8");
    console.error(
      `[apifox-download] parse failed, raw saved to ${debugFile}; error: ${err}`
    );
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

