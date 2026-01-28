import { headers } from "next/headers";
import { getCurrentUserRoleFromCookie } from "@/lib/auth";
import { getDirectoryRule, isRoleAllowed } from "@/lib/permissions";
import { getDocsTree, loadDocBySegments, getAllDocs, getAdjacentDocs, getCurrentModuleTree, getModuleTitle } from "@/lib/docs";
import { DocLayout } from "@/components/DocLayout";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

type DocsTree = ReturnType<typeof getDocsTree>;

function findFirstDocInNodes(nodes: DocsTree[number]["children"]): string[] | null {
  for (const node of nodes) {
    if (node.type === "file") {
      return node.pathSegments;
    }
    if (node.type === "directory") {
      const nested = findFirstDocInNodes(node.children);
      if (nested) {
        return nested;
      }
    }
  }
  return null;
}

function findFirstAccessibleDoc(
  tree: DocsTree,
  role: ReturnType<typeof getCurrentUserRoleFromCookie>
): string[] | null {
  for (const dir of tree) {
    const result = findFirstDocInNodes(dir.children);
    if (result) {
      const topLevelDir = result[0];
      const dirRule = getDirectoryRule(topLevelDir);
      const doc = loadDocBySegments(result);
      if (doc) {
        const pageRoles = doc.frontmatter.roles;
        const allowed = isRoleAllowed(role, dirRule, pageRoles);
        if (allowed) {
          return result;
        }
      }
    }
  }
  return null;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 从 markdown 内容中提取标题
// 使用与 rehype-slug 相同的 ID 生成逻辑
// 注意：content 已经通过 gray-matter 处理，不包含 frontmatter
type Heading = { level: number; text: string; id: string };

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split('\n');

  let inCodeBlock = false;
  const slugCount = new Map<string, number>();

  for (const line of lines) {
    // 1️⃣ 跳过 fenced code block
    if (/^```/.test(line.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // 2️⃣ 匹配标题
    const match = line.match(/^\s*(#{1,6})\s+(.+?)\s*$/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].trim();
    if (!text) continue;

    // 3️⃣ 生成 slug（贴近 rehype-slug）
    // rehype-slug 的逻辑：保留中文字符、字母、数字、连字符和空格，然后转换为小写，将空格替换为连字符
    let slug = text
      .trim()
      // 保留中文字符、字母、数字、连字符和空格
      .replace(/[^\u4e00-\u9fa5\w\s-]/g, "") // 移除特殊字符，保留中文、字母数字、空格和连字符
      .toLowerCase() // 将英文转换为小写（不影响中文）
      .replace(/\s+/g, "-") // 将空格替换为连字符
      .replace(/-+/g, "-") // 将多个连字符替换为单个
      .replace(/^-+|-+$/g, ""); // 移除开头和结尾的连字符

    if (!slug) continue;

    // 4️⃣ 处理重复 ID（rehype-slug 行为）
    const count = slugCount.get(slug) ?? 0;
    slugCount.set(slug, count + 1);
    if (count > 0) {
      slug = `${slug}-${count}`;
    }

    headings.push({ level, text, id: slug });
  }

  return headings;
}

export default async function DocPage({ params }: PageProps) {
  const resolvedParams = await params;
  const fullTree = getDocsTree();
  const allDocs = getAllDocs();
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? null;
  const role = getCurrentUserRoleFromCookie(cookieHeader);
  
  // 如果没有指定 slug，找到用户有权限访问的第一个文档
  let slugSegments: string[];
  if (resolvedParams.slug && resolvedParams.slug.length > 0) {
    slugSegments = resolvedParams.slug;
  } else {
    const defaultDoc = findFirstAccessibleDoc(fullTree, role);
    if (!defaultDoc) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">没有可访问的文档</p>
        </div>
      );
    }
    slugSegments = defaultDoc;
  }
  
  // 获取当前模块的目录树（固定使用初始路径的模块树）
  const initialModuleTree = getCurrentModuleTree(slugSegments, fullTree) || fullTree;
  
  const topLevelDir = slugSegments[0];
  const dirRule = getDirectoryRule(topLevelDir);
  const doc = loadDocBySegments(slugSegments);
  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">文档不存在</p>
      </div>
    );
  }
  const pageRoles = doc.frontmatter.roles;
  const allowed = isRoleAllowed(role, dirRule, pageRoles);
  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">没有权限访问当前文档</p>
      </div>
    );
  }
  
  const headings = extractHeadings(doc.content);
  
  // 调试日志
  const docPath = slugSegments.join("/");
  console.log(`[DocPage] Document: ${docPath}`);
  console.log(`[DocPage] Content length: ${doc.content.length}`);
  console.log(`[DocPage] Content preview (first 500 chars):`, doc.content.substring(0, 500));
  console.log(`[DocPage] Content lines (first 10):`, doc.content.split("\n").slice(0, 10));
  console.log(`[DocPage] Headings count: ${headings.length}`);
  console.log(`[DocPage] Headings:`, JSON.stringify(headings, null, 2));
  
  const { prev, next } = getAdjacentDocs(slugSegments, allDocs);
  const moduleTitle = getModuleTitle(slugSegments);
  
  return (
    <DocLayout
      initialModuleTree={initialModuleTree}
      initialSegments={slugSegments}
      userRole={role}
      docContent={doc.content}
      headings={headings}
      prev={prev}
      next={next}
      moduleTitle={moduleTitle}
    />
  );
}
