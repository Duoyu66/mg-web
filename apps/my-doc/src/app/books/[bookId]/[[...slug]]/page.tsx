import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUserRoleFromCookie } from "@/lib/auth";
import { getDirectoryRule, isRoleAllowed } from "@/lib/permissions";
import { loadDocBySegments, getAdjacentDocs } from "@/lib/docs";
import { getBookById, getBookDocumentTree } from "@/lib/books";
import { DocLayout } from "@/components/DocLayout";
import { extractHeadings } from "@/app/docs/[[...slug]]/page";

type PageProps = {
  params: Promise<{
    bookId: string;
    slug?: string[];
  }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function findFirstAccessibleDocInBook(
  book: ReturnType<typeof getBookById>,
  role: ReturnType<typeof getCurrentUserRoleFromCookie>
): string[] | null {
  if (!book) return null;
  
  for (const doc of book.documents) {
    // doc.pathSegments 已经是完整的路径，如 [frontend, basic, html-css]
    const topLevelDir = doc.pathSegments[0];
    const dirRule = getDirectoryRule(topLevelDir);
    const loadedDoc = loadDocBySegments(doc.pathSegments);
    if (loadedDoc) {
      const pageRoles = loadedDoc.frontmatter.roles;
      const allowed = isRoleAllowed(role, dirRule, pageRoles);
      if (allowed) {
        return doc.pathSegments;
      }
    }
  }
  return null;
}

export default async function BookDocPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { bookId } = resolvedParams;
  const slugSegments = resolvedParams.slug || [];
  
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? null;
  const role = getCurrentUserRoleFromCookie(cookieHeader);
  
  // 获取书籍信息
  const book = getBookById(bookId);
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">书籍不存在</p>
      </div>
    );
  }

  // 获取文档树（只包含当前书籍的文档）
  const bookTree = getBookDocumentTree(bookId);
  if (!bookTree) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">书籍文档树不存在</p>
      </div>
    );
  }

  // 如果没有指定文档，找到第一个可访问的文档并重定向
  if (slugSegments.length === 0) {
    const defaultDoc = findFirstAccessibleDocInBook(book, role);
    if (!defaultDoc) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">没有可访问的文档</p>
        </div>
      );
    }
    // 重定向到第一个文档
    // 如果 bookId 是 frontend-basic，defaultDoc 应该是 [frontend, basic, ...]
    // 需要去掉前两个元素（category 和 subCategory），只保留文档路径
    let redirectSegments: string[];
    if (bookId.includes('-')) {
      // 新格式：去掉 category 和 subCategory
      redirectSegments = defaultDoc.slice(2);
    } else {
      // 旧格式：去掉 category
      redirectSegments = defaultDoc.slice(1);
    }
    const redirectPath = `/books/${bookId}/${redirectSegments.join("/")}`;
    redirect(redirectPath);
  }

  // 构建完整的路径 segments
  // 如果 bookId 是 frontend-basic 格式，需要转换为 frontend/basic
  let targetSegments: string[];
  if (bookId.includes('-')) {
    const [category, subCategory] = bookId.split('-');
    targetSegments = [category, subCategory, ...slugSegments];
  } else {
    targetSegments = [bookId, ...slugSegments];
  }

  // 验证文档是否属于当前书籍
  const topLevelDir = targetSegments[0];
  const dirRule = getDirectoryRule(topLevelDir);
  const doc = loadDocBySegments(targetSegments);
  
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
  
  // 获取相邻文档（只在该书籍内）
  const bookDocs = book.documents;
  const { prev, next } = getAdjacentDocs(targetSegments, bookDocs);
  
  // 获取模块标题
  const moduleTitle = book.title;

  return (
    <DocLayout
      initialModuleTree={[bookTree]}
      initialSegments={targetSegments}
      userRole={role}
      docContent={doc.content}
      headings={headings}
      prev={prev}
      next={next}
      moduleTitle={moduleTitle}
    />
  );
}
