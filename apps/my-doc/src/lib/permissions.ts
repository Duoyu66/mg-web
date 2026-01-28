import type { UserRole } from "./auth";

export type PermissionRule = {
  requiredRoles: UserRole[];
};

const directoryRules: Record<string, PermissionRule> = {
  frontend: {
    requiredRoles: ["guest", "basic", "vip", "admin"],
  },
  backend: {
    requiredRoles: ["guest", "basic", "vip", "admin"],
  },
  secretManual: {
    requiredRoles: ["admin"],
  },
};

export function getDirectoryRule(dir: string): PermissionRule | null {
  return directoryRules[dir] ?? null;
}

export function isRoleAllowed(role: UserRole, rule: PermissionRule | null, pageRoles?: UserRole[]): boolean {
  if (pageRoles && pageRoles.length > 0) {
    return pageRoles.includes(role);
  }
  if (!rule) return true;
  return rule.requiredRoles.includes(role);
}

