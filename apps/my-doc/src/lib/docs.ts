import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { UserRole } from "./auth";

export type DocFrontmatter = {
  title?: string;
  sidebar_label?: string;
  roles?: UserRole[];
};

export type DocNode = {
  type: "file";
  id: string;
  title: string;
  pathSegments: string[];
  requiresVip?: boolean;
};

export type DirectoryNode = {
  type: "directory";
  name: string;
  children: Array<DirectoryNode | DocNode>;
};

export type LoadedDoc = {
  frontmatter: DocFrontmatter;
  content: string;
};

const DOCS_ROOT = path.join(process.cwd(), "docs");

export function getDocsTree(): DirectoryNode[] {
  const entries = fs.readdirSync(DOCS_ROOT, { withFileTypes: true });
  const tree: DirectoryNode[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dirName = entry.name;
    const dirPath = path.join(DOCS_ROOT, dirName);
    const children = readDirectory(dirPath, [dirName]);
    tree.push({
      type: "directory",
      name: dirName,
      children,
    });
  }
  return tree;
}

function readDirectory(dirPath: string, segments: string[]): Array<DirectoryNode | DocNode> {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const result: Array<DirectoryNode | DocNode> = [];
  for (const entry of entries) {
    const name = entry.name;
    if (name.startsWith(".")) continue;
    const fullPath = path.join(dirPath, name);
    if (entry.isDirectory()) {
      const childSegments = segments.concat(name);
      const children = readDirectory(fullPath, childSegments);
      result.push({
        type: "directory",
        name,
        children,
      });
      continue;
    }
    if (!name.endsWith(".md")) continue;
    const baseName = name.replace(/\.md$/, "");
    const id = segments.concat(baseName).join("/");
    const fileContent = fs.readFileSync(fullPath, "utf8");
    const parsed = matter(fileContent);
    const fm = parsed.data as DocFrontmatter;
    const title = fm.sidebar_label || fm.title || baseName;
    // 检查是否需要 VIP：如果 roles 中包含 "vip" 或 "admin"，则需要 VIP
    const requiresVip = Array.isArray(fm.roles) && (fm.roles.includes("vip") || fm.roles.includes("admin"));
    result.push({
      type: "file",
      id,
      title,
      pathSegments: segments.concat(baseName),
      requiresVip: requiresVip || false,
    });
  }
  return result;
}

export function loadDocBySegments(segments: string[]): LoadedDoc | null {
  if (segments.length < 2) return null;
  const fsPath = path.join(DOCS_ROOT, ...segments) + ".md";
  if (!fs.existsSync(fsPath)) {
    return null;
  }
  const fileContent = fs.readFileSync(fsPath, "utf8");
  const parsed = matter(fileContent);
  const data = parsed.data as DocFrontmatter;
  const frontmatter: DocFrontmatter = {};
  if (typeof data.title === "string") {
    frontmatter.title = data.title;
  }
  if (typeof data.sidebar_label === "string") {
    frontmatter.sidebar_label = data.sidebar_label;
  }
  if (Array.isArray(data.roles)) {
    const roles: UserRole[] = [];
    for (const value of data.roles) {
      if (value === "guest" || value === "basic" || value === "vip" || value === "admin") {
        roles.push(value);
      }
    }
    if (roles.length > 0) {
      frontmatter.roles = roles;
    }
  }
  return {
    frontmatter,
    content: parsed.content,
  };
}

// 获取所有文档的扁平列表（按顺序）
function getAllDocsFlat(nodes: Array<DirectoryNode | DocNode>): DocNode[] {
  const result: DocNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") {
      result.push(node);
    } else if (node.type === "directory") {
      result.push(...getAllDocsFlat(node.children));
    }
  }
  return result;
}

export function getAllDocs(): DocNode[] {
  const tree = getDocsTree();
  const allDocs: DocNode[] = [];
  for (const dir of tree) {
    allDocs.push(...getAllDocsFlat(dir.children));
  }
  return allDocs;
}

export function getAdjacentDocs(
  currentSegments: string[],
  allDocs: DocNode[]
): { prev: DocNode | null; next: DocNode | null } {
  const currentId = currentSegments.join("/");
  const currentIndex = allDocs.findIndex(
    (doc) => doc.pathSegments.join("/") === currentId
  );
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: currentIndex > 0 ? allDocs[currentIndex - 1] : null,
    next: currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null,
  };
}
