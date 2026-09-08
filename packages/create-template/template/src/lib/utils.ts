export function withBasePath(value?: string | null) {
  const url = value?.trim() ?? '';
  if (!url || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return url;
  const basePath = (process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? '').replace(
    /\/$/,
    '',
  );
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${basePath}${path}`;
}

export function pageRoute(pageKey: string) {
  return pageKey === 'home' ? '/' : `/${pageKey}`;
}
