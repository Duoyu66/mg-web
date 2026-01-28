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
    // 处理 roles 可能是数组、字符串或其他格式的情况
    let requiresVip = false;
    if (fm.roles) {
      if (Array.isArray(fm.roles)) {
        requiresVip = fm.roles.includes("vip") || fm.roles.includes("admin");
      } else if (typeof fm.roles === "string") {
        // 如果 roles 是字符串，尝试解析（可能是 JSON 字符串或 YAML 解析问题）
        try {
          const parsedRoles = JSON.parse(fm.roles);
          if (Array.isArray(parsedRoles)) {
            requiresVip = parsedRoles.includes("vip") || parsedRoles.includes("admin");
          } else if (parsedRoles === "vip" || parsedRoles === "admin") {
            requiresVip = true;
          }
        } catch {
          // 如果不是 JSON，检查是否直接是 "vip" 或 "admin"
          requiresVip = fm.roles === "vip" || fm.roles === "admin";
        }
      }
    }
    
    // 调试日志（仅在开发环境）
    if (process.env.NODE_ENV === "development" && baseName === "js") {
      console.log(`[docs.ts] File: ${baseName}, roles:`, fm.roles, "type:", typeof fm.roles, "requiresVip:", requiresVip);
    }
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
  // 处理 roles 字段，可能是数组、字符串或其他格式
  if (data.roles) {
    let rolesArray: UserRole[] = [];
    
    if (Array.isArray(data.roles)) {
      // 如果已经是数组，直接使用
      rolesArray = data.roles.filter(
        (value): value is UserRole => 
          value === "guest" || value === "basic" || value === "vip" || value === "admin"
      );
    } else if (typeof data.roles === "string") {
      // 如果是字符串，尝试解析（可能是 JSON 字符串或 YAML 解析问题）
      try {
        const parsed = JSON.parse(data.roles);
        if (Array.isArray(parsed)) {
          rolesArray = parsed.filter(
            (value): value is UserRole => 
              value === "guest" || value === "basic" || value === "vip" || value === "admin"
          );
        } else if (parsed === "guest" || parsed === "basic" || parsed === "vip" || parsed === "admin") {
          rolesArray = [parsed];
        }
      } catch {
        // 如果不是 JSON，检查是否直接是有效的角色字符串
        if (data.roles === "guest" || data.roles === "basic" || data.roles === "vip" || data.roles === "admin") {
          rolesArray = [data.roles];
        }
      }
    }
    
    if (rolesArray.length > 0) {
      frontmatter.roles = rolesArray;
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

// 读取模块目录下的 config.ts 文件并解析 title
export function getModuleTitle(segments: string[]): string | null {
  if (segments.length < 2) {
    return null;
  }
  
  const configPath = path.join(DOCS_ROOT, segments[0], segments[1], "config.ts");
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(configPath, "utf8");
    // 使用正则表达式提取 title 属性
    // 匹配 title: "值" 或 title: '值' 或 title: `值` 或 title: 值（中文等，直到逗号、换行或右大括号）
    const titleMatch = content.match(/title\s*:\s*(["'`])((?:(?!\1)[^\\]|\\.)*)\1|title\s*:\s*([^\s,}\n]+)/);
    if (titleMatch) {
      // 如果有引号，返回引号内的值（去除引号）
      if (titleMatch[2]) {
        return titleMatch[2].replace(/\\(.)/g, "$1"); // 处理转义字符
      }
      // 如果没有引号，返回原始值（去除可能的尾随空格）
      if (titleMatch[3]) {
        return titleMatch[3].trim();
      }
    }
  } catch {
    // 忽略读取错误
  }
  
  return null;
}

// 根据当前路径获取当前模块的目录树
export function getCurrentModuleTree(
  currentSegments: string[],
  fullTree: DirectoryNode[]
): DirectoryNode[] | null {
  if (currentSegments.length < 2) {
    // 如果路径少于2段，返回顶层目录
    return fullTree;
  }
  
  const topLevelDir = currentSegments[0];
  const secondLevelDir = currentSegments[1];
  
  // 找到顶层目录
  const topLevelNode = fullTree.find((node) => node.name === topLevelDir);
  if (!topLevelNode) {
    return null;
  }
  
  // 找到第二层目录（当前模块）
  const moduleNode = topLevelNode.children.find(
    (child) => child.type === "directory" && child.name === secondLevelDir
  ) as DirectoryNode | undefined;
  
  if (!moduleNode) {
    return null;
  }
  
  // 返回只包含当前模块的目录树
  return [
    {
      type: "directory",
      name: moduleNode.name,
      children: moduleNode.children,
    },
  ];
}
