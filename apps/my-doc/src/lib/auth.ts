export type UserRole = "guest" | "basic" | "vip" | "admin";

export function getCurrentUserRoleFromCookie(cookieHeader: string | null): UserRole {
  if (!cookieHeader) return "guest";
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawKey, rawValue] = part.split("=");
    if (!rawKey || !rawValue) continue;
    const key = rawKey.trim();
    const value = decodeURIComponent(rawValue.trim());
    if (key === "doc-role") {
      if (value === "basic" || value === "vip" || value === "admin") {
        return value;
      }
    }
  }
  return "guest";
}

