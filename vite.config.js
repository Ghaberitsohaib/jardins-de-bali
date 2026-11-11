import { defineConfig } from 'vite';
import { resolve } from 'path';

function normalizeBase(rawBase) {
  if (!rawBase || rawBase === '/') return '/';
  const withLeading = rawBase.startsWith('/') ? rawBase : `/${rawBase}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function subpathAssetPrefix(base) {
  if (base === '/') return null;
  const baseNoLeading = base.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const attrRe = new RegExp(
    `\\b(href|src|poster|content|data-[a-z0-9-]+)=(["'])\\/(?!\\/)(?!${baseNoLeading})([^"']*)\\2`,
    'gi'
  );
  const cssUrlRe = new RegExp(
    `url\\(\\s*(['"]?)\\/(?!\\/)(?!${baseNoLeading})([^)'"\\s]+)\\1\\s*\\)`,
    'g'
  );
  const rewriteCssUrls = (css) => css.replace(cssUrlRe, (_, q, rest) => `url(${q}${base}${rest}${q})`);

  return {
    name: 'subpath-asset-prefix',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return rewriteCssUrls(
          html.replace(attrRe, (_, attr, q, rest) => `${attr}=${q}${base}${rest}${q}`)
        );
      },
    },
    generateBundle(_, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type === 'asset' && item.fileName.endsWith('.css')) {
          const src = typeof item.source === 'string' ? item.source : Buffer.from(item.source).toString('utf8');
          item.source = rewriteCssUrls(src);
        }
      }
    },
  };
}

const base = normalizeBase(process.env.VITE_BASE);

export default defineConfig({
  base,
  plugins: [subpathAssetPrefix(base)].filter(Boolean),
  server: {
    host: true, // Expose to local network (Wi-Fi / LAN)
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        residences: resolve(__dirname, 'residences.html'),
        business: resolve(__dirname, 'business.html'),
        ventes: resolve(__dirname, 'ventes.html'),
        maquette: resolve(__dirname, 'maquette3d.html'),
        contact: resolve(__dirname, 'contact.html'),
        about: resolve(__dirname, 'about-the-investor.html'),
      },
    },
  },
});
