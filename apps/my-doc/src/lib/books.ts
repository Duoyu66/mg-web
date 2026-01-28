import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { DirectoryNode, DocNode } from "./docs";
import { getDocsTree } from "./docs";

export type Book = {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  category: string; // frontend, backend 等
  documentCount: number;
  documents: DocNode[];
};

const DOCS_ROOT = path.join(process.cwd(), "docs");

// 从目录中读取 config.ts 文件获取书籍信息
function getBookConfig(categoryPath: string): { title?: string; description?: string; cover?: string } {
  const configPath = path.join(categoryPath, "config.ts");
  if (!fs.existsSync(configPath)) {
    return {};
  }

  try {
    const configContent = fs.readFileSync(configPath, "utf8");
    // 匹配 export const config = { ... } 格式
    const configMatch = configContent.match(/export\s+const\s+config\s*=\s*\{([^}]+)\}/s);
    if (!configMatch) {
      // 尝试匹配 export default { ... } 格式
      const defaultMatch = configContent.match(/export\s+default\s*\{([^}]+)\}/s);
      if (!defaultMatch) return {};
      const content = defaultMatch[1];
      
      const titleMatch = content.match(/title\s*:\s*(["'`])((?:(?!\1)[^\\]|\\.)*)\1|title\s*:\s*([^\s,}\n]+)/);
      const descriptionMatch = content.match(/description\s*:\s*(["'`])((?:(?!\1)[^\\]|\\.)*)\1|description\s*:\s*([^\s,}\n]+)/);
      const coverMatch = content.match(/cover\s*:\s*(["'`])((?:(?!\1)[^\\]|\\.)*)\1|cover\s*:\s*([^\s,}\n]+)/);

      return {
        title: titleMatch ? (titleMatch[2] || titleMatch[3])?.trim() : undefined,
        description: descriptionMatch ? (descriptionMatch[2] || descriptionMatch[3])?.trim() : undefined,
        cover: coverMatch ? (coverMatch[2] || coverMatch[3])?.trim() : undefined,
      };
    }
    
    const content = configMatch[1];
    const titleMatch = content.match(/title\s*:\s*(["'`])((?:(?!\1)[^\\]|\\.)*)\1|title\s*:\s*([^\s,}\n]+)/);
    const descriptionMatch = content.match(/description\s*:\s*(["'`])((?:(?!\1)[^\\]|\\.)*)\1|description\s*:\s*([^\s,}\n]+)/);
    const coverMatch = content.match(/cover\s*:\s*(["'`])((?:(?!\1)[^\\]|\\.)*)\1|cover\s*:\s*([^\s,}\n]+)/);

    return {
      title: titleMatch ? (titleMatch[2] || titleMatch[3])?.trim() : undefined,
      description: descriptionMatch ? (descriptionMatch[2] || descriptionMatch[3])?.trim() : undefined,
      cover: coverMatch ? (coverMatch[2] || coverMatch[3])?.trim() : undefined,
    };
  } catch {
    return {};
  }
}

// 获取目录下的所有文档
function getAllDocsFromDirectory(dirPath: string, segments: string[]): DocNode[] {
  const docs: DocNode[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const childSegments = segments.concat(entry.name);
      docs.push(...getAllDocsFromDirectory(fullPath, childSegments));
    } else if (entry.name.endsWith(".md")) {
      const baseName = entry.name.replace(/\.md$/, "");
      const fileSegments = segments.concat(baseName);
      const id = fileSegments.join("/");
      const fileContent = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(fileContent);
      const fm = parsed.data as { title?: string; sidebar_label?: string; roles?: string[] };
      const title = fm.sidebar_label || fm.title || baseName;
      
      docs.push({
        type: "file",
        id,
        title,
        pathSegments: fileSegments,
        requiresVip: Array.isArray(fm.roles) && (fm.roles.includes("vip") || fm.roles.includes("admin")),
      });
    }
  }

  return docs;
}

// 获取所有书籍
export function getAllBooks(): Book[] {
  const books: Book[] = [];
  const tree = getDocsTree();

  for (const categoryNode of tree) {
    const categoryPath = path.join(DOCS_ROOT, categoryNode.name);
    
    // 检查是否有子分类目录（basic, framework, advanced）
    const subCategories = ['basic', 'framework', 'advanced'];
    const entries = fs.readdirSync(categoryPath, { withFileTypes: true });
    const hasSubCategories = entries.some(
      entry => entry.isDirectory() && subCategories.includes(entry.name)
    );

    if (hasSubCategories) {
      // 如果有子分类，将每个子分类作为独立的书籍
      for (const entry of entries) {
        if (!entry.isDirectory() || !subCategories.includes(entry.name)) continue;
        
        const subCategoryPath = path.join(categoryPath, entry.name);
        const config = getBookConfig(subCategoryPath);
        
        // 获取该子分类下的所有文档
        const documents = getAllDocsFromDirectory(subCategoryPath, [categoryNode.name, entry.name]);

        // 生成书籍 ID：frontend-basic, backend-advanced 等
        const bookId = `${categoryNode.name}-${entry.name}`;
        
        books.push({
          id: bookId,
          title: config.title || `${categoryNode.name}-${entry.name}`,
          description: config.description,
          cover: config.cover,
          category: categoryNode.name,
          documentCount: documents.length,
          documents,
        });
      }
    } else {
      // 如果没有子分类，保持原来的逻辑
      const config = getBookConfig(categoryPath);
      
      // 获取该分类下的所有文档
      const documents = getAllDocsFromDirectory(categoryPath, [categoryNode.name]);

      books.push({
        id: categoryNode.name,
        title: config.title || categoryNode.name,
        description: config.description,
        cover: config.cover,
        category: categoryNode.name,
        documentCount: documents.length,
        documents,
      });
    }
  }

  return books;
}

// 根据书籍 ID 获取书籍
export function getBookById(bookId: string): Book | null {
  const books = getAllBooks();
  return books.find((book) => book.id === bookId) || null;
}

// 获取书籍的文档树（用于侧边栏）
export function getBookDocumentTree(bookId: string): DirectoryNode | null {
  const tree = getDocsTree();
  
  // 检查是否是新的格式（如 frontend-basic）
  if (bookId.includes('-')) {
    const [category, subCategory] = bookId.split('-');
    const categoryNode = tree.find((node) => node.name === category);
    if (!categoryNode) return null;
    
    // 在 categoryNode 的 children 中查找 subCategory
    const subCategoryNode = categoryNode.children.find(
      (child) => child.type === 'directory' && child.name === subCategory
    ) as DirectoryNode | undefined;
    
    return subCategoryNode || null;
  }
  
  // 旧格式（直接是 category 名称）
  const bookNode = tree.find((node) => node.name === bookId);
  return bookNode || null;
}
