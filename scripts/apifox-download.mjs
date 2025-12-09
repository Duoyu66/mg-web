import { writeFile, mkdir } from "fs/promises";

const token = process.env.APIFOX_TOKEN || "";
const projectId = process.env.APIFOX_PROJECT_ID || "";
const host = process.env.APIFOX_HOST || "https://api.apifox.cn";
const customUrl = process.env.APIFOX_OPENAPI_URL; // 若已在 Apifox 后台生成开放的 OpenAPI 链接，可直接配置
const outputDir = "apifox";
const outputFile = `${outputDir}/openapi.json`;

async function main() {
  const url =
    customUrl ||
    `${host}/api/v1/projects/${projectId}/openapi?scope=project&lang=zh-CN`;

  if (!customUrl && (!token || !projectId)) {
    console.error(
      "[apifox-download] Missing env: set APIFOX_OPENAPI_URL, or both APIFOX_TOKEN and APIFOX_PROJECT_ID"
    );
    process.exit(1);
  }

  console.log(`[apifox-download] fetching openapi from ${url}`);

  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      Accept: "application/json, */*",
      "Content-Type": "application/json",
      // 部分环境要求 Bearer 前缀，保守兼容两种写法
      Authorization: token ? `Bearer ${token}` : undefined,
      ...(token ? { "X-Apifox-Token": token } : {}),
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
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      throw new Error(`unexpected content-type: ${ct}`);
    }
    data = JSON.parse(raw);
  } catch (err) {
    const debugFile = `${outputDir}/openapi.debug.txt`;
    await mkdir(outputDir, { recursive: true });
    const debugPayload = [
      `status: ${res.status} ${res.statusText}`,
      `headers: ${JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2)}`,
      "",
      raw ?? ""
    ].join("\n");
    await writeFile(debugFile, debugPayload, "utf8");
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

