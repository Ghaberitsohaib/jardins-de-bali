const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

/**
 * Resolve a root-relative public asset path against Vite's configured BASE_URL
 * so runtime assets load cleanly both at `/` and under subpaths (e.g. GitHub Pages).
 */
export function assetUrl(path) {
  if (!path || typeof path !== 'string') return path;
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (BASE_URL !== '/' && path.startsWith(BASE_URL)) return path;
  return `${BASE_URL}${path.slice(1)}`;
}

