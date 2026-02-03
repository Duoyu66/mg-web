export type AdminPermissionKey = string;

export interface AdminRole {
  id: string;
  name: string;
  description?: string;
  permissions: AdminPermissionKey[];
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  roleId: string;
  status: 'active' | 'disabled';
  lastLogin: string;
}

type PermissionTreeNode = {
  key: string;
  title: string;
  children?: PermissionTreeNode[];
  disableCheckbox?: boolean;
};

const STORAGE_KEYS = {
  roles: 'mg_admin_roles_v1',
  users: 'mg_admin_users_v1',
  currentUserId: 'mg_admin_current_user_id_v1',
} as const;

const ADMIN_PERMISSION_TREE: PermissionTreeNode[] = [
  {
    key: 'group:admin',
    title: '后台管理',
    disableCheckbox: true,
    children: [
      { key: '/front/admin', title: '控制台' },
      { key: '/front/admin/company', title: '面试公司管理' },
      { key: '/front/admin/question', title: '题库管理' },
      { key: '/front/admin/article', title: '文章管理' },
      { key: '/front/admin/member', title: '会员管理' },
      { key: '/front/admin/revenue', title: '收入分析' },
      { key: '/front/admin/order', title: '订单管理' },
      { key: '/front/admin/bill', title: '账单管理' },
      { key: '/front/admin/user', title: '用户管理' },
      {
        key: 'group:system',
        title: '系统管理',
        disableCheckbox: true,
        children: [
          { key: '/front/admin/system/roles', title: '角色管理' },
          { key: '/front/admin/system/user-roles', title: '用户角色分配' },
        ],
      },
      { key: '/front/admin/creator', title: '创作中心' },
    ],
  },
];

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function getAdminPermissionTree(): PermissionTreeNode[] {
  return ADMIN_PERMISSION_TREE;
}

export function listAdminPermissionKeys(): AdminPermissionKey[] {
  const keys: AdminPermissionKey[] = [];
  const walk = (nodes: PermissionTreeNode[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        walk(node.children);
        return;
      }
      if (node.key.startsWith('/')) keys.push(node.key);
    });
  };
  walk(ADMIN_PERMISSION_TREE);
  return keys;
}

function getDefaultRoles(): AdminRole[] {
  const all = listAdminPermissionKeys();
  return [
    {
      id: 'role_super_admin',
      name: '超级管理员',
      description: '拥有所有权限',
      permissions: all,
    },
    {
      id: 'role_editor',
      name: '运营编辑',
      description: '可管理题库与文章',
      permissions: ['/front/admin', '/front/admin/question', '/front/admin/article'],
    },
    {
      id: 'role_support',
      name: '客服',
      description: '可管理用户与公司',
      permissions: ['/front/admin', '/front/admin/user', '/front/admin/company'],
    },
  ];
}

function getDefaultUsers(): AdminUser[] {
  return [
    {
      id: 'user_admin',
      username: 'admin',
      name: '管理员',
      roleId: 'role_super_admin',
      status: 'active',
      lastLogin: '2023-10-27 10:00:00',
    },
    {
      id: 'user_zhangsan',
      username: 'zhangsan',
      name: '张三',
      roleId: 'role_editor',
      status: 'active',
      lastLogin: '2023-10-26 15:30:00',
    },
    {
      id: 'user_lisi',
      username: 'lisi',
      name: '李四',
      roleId: 'role_support',
      status: 'disabled',
      lastLogin: '2023-10-20 09:15:00',
    },
  ];
}

function ensureInitialized() {
  if (!isBrowser()) return;

  const roles = safeParseJson<AdminRole[]>(window.localStorage.getItem(STORAGE_KEYS.roles));
  if (!roles || roles.length === 0) {
    window.localStorage.setItem(STORAGE_KEYS.roles, JSON.stringify(getDefaultRoles()));
  }

  const users = safeParseJson<AdminUser[]>(window.localStorage.getItem(STORAGE_KEYS.users));
  if (!users || users.length === 0) {
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(getDefaultUsers()));
  }

  const currentUserId = window.localStorage.getItem(STORAGE_KEYS.currentUserId);
  if (!currentUserId) {
    window.localStorage.setItem(STORAGE_KEYS.currentUserId, 'user_admin');
  }
}

export function getAdminRoles(): AdminRole[] {
  ensureInitialized();
  if (!isBrowser()) return getDefaultRoles();
  const stored = safeParseJson<AdminRole[]>(window.localStorage.getItem(STORAGE_KEYS.roles)) ?? getDefaultRoles();
  const allKeys = listAdminPermissionKeys();
  let updated = false;
  const next = stored.map(r => {
    if (r.id === 'role_super_admin') {
      // 超级管理员自动拥有最新的全部权限
      const hasAll = allKeys.every(k => r.permissions.includes(k));
      if (!hasAll || r.permissions.length !== allKeys.length) {
        updated = true;
        return { ...r, permissions: allKeys };
      }
    }
    return r;
  });
  if (updated && isBrowser()) {
    window.localStorage.setItem(STORAGE_KEYS.roles, JSON.stringify(next));
  }
  return next;
}

export function saveAdminRoles(roles: AdminRole[]) {
  ensureInitialized();
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.roles, JSON.stringify(roles));
}

export function getAdminUsers(): AdminUser[] {
  ensureInitialized();
  if (!isBrowser()) return getDefaultUsers();
  return safeParseJson<AdminUser[]>(window.localStorage.getItem(STORAGE_KEYS.users)) ?? getDefaultUsers();
}

export function saveAdminUsers(users: AdminUser[]) {
  ensureInitialized();
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export function getCurrentAdminUserId(): string {
  ensureInitialized();
  if (!isBrowser()) return 'user_admin';
  return window.localStorage.getItem(STORAGE_KEYS.currentUserId) ?? 'user_admin';
}

export function setCurrentAdminUserId(userId: string) {
  ensureInitialized();
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.currentUserId, userId);
}

export function getAdminRoleById(roleId: string): AdminRole | undefined {
  return getAdminRoles().find((r) => r.id === roleId);
}

export function getCurrentAdminUser(): AdminUser | undefined {
  const userId = getCurrentAdminUserId();
  return getAdminUsers().find((u) => u.id === userId);
}

export function canAccessAdminPath(pathname: string, role: AdminRole | undefined): boolean {
  if (!pathname.startsWith('/front/admin')) return true;
  if (pathname === '/front/admin/system') return false;
  if (!role) return false;
  if (role.permissions.includes(pathname)) return true;
  return false;
}

