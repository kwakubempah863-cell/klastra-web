export type UserRole = 'platform_admin' | 'admin' | 'teacher' | 'parent' | 'student' | null;

export function roleRedirectPath(role: UserRole): string {
  if (role === 'platform_admin') return '/super-admin';
  if (role === 'admin') return '/school-admin';
  return '/';
}
