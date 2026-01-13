import React, { useEffect } from 'react';

const MEMBER_DOCS = new Set<string>([
  '/docs/frontend/react',
  '/docs/frontend/react/',
]);

function useDocAccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';
    const allowAll = !!token;
    const clickHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const link = target.closest('a') as HTMLAnchorElement | null;
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      const path = url.pathname;
      if (!path.startsWith('/docs/')) return;
      if (allowAll) return;
      if (MEMBER_DOCS.has(path)) {
        e.preventDefault();
        alert('该文件是会员内容');
      }
    };
    document.addEventListener('click', clickHandler, true);
    return () => {
      document.removeEventListener('click', clickHandler, true);
    };
  }, []);
}

export default function Root({ children }: { children: React.ReactNode }) {
  useDocAccess();
  return <>{children}</>;
}
