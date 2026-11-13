import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as web3forms from '../src/web3forms.js';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML_ENTRIES = [
  'index.html',
  'residences.html',
  'ventes.html',
  'business.html',
  'contact.html',
  'about-the-investor.html',
  'maquette3d.html',
];

test('web3forms exports honeypot helpers and detects bot submissions', () => {
  assert.equal(typeof web3forms.ensureHoneypotField, 'function');
  assert.equal(typeof web3forms.isHoneypotTriggered, 'function');

  const cleanForm = { querySelector: () => ({ checked: false, value: '' }) };
  const botCheckedForm = { querySelector: () => ({ checked: true, value: 'on' }) };
  const botTextFilledForm = { querySelector: () => ({ checked: false, value: 'http://spam.example' }) };

  assert.equal(web3forms.isHoneypotTriggered(cleanForm, {}), false);
  assert.equal(web3forms.isHoneypotTriggered(null, { botcheck: true }), true);
  assert.equal(web3forms.isHoneypotTriggered(botCheckedForm, {}), true);
  assert.equal(web3forms.isHoneypotTriggered(botTextFilledForm, {}), true);
});

test('submitToWeb3Forms sends clean submissions and drops honeypot bots without calling fetch', async () => {
  const calls = [];
  const mockFetch = async (url, init) => {
    calls.push({ url, init });
    return {
      ok: true,
      json: async () => ({ success: true }),
    };
  };

  const botForm = { querySelector: () => ({ checked: true, value: 'on' }) };
  const botRes = await web3forms.submitToWeb3Forms(
    { nom_complet: 'Spam Bot', email: 'bot@example.com' },
    { form: botForm, fetchImpl: mockFetch }
  );
  assert.equal(botRes, true);
  assert.equal(calls.length, 0);

  const cleanForm = { querySelector: () => ({ checked: false, value: '' }) };
  const cleanRes = await web3forms.submitToWeb3Forms(
    { nom_complet: 'Client Réel', email: 'client@example.com', botcheck: false },
    { form: cleanForm, fetchImpl: mockFetch }
  );
  assert.equal(cleanRes, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.web3forms.com/submit');
  const sentBody = JSON.parse(calls[0].init.body);
  assert.equal(sentBody.nom_complet, 'Client Réel');
  assert.equal(sentBody.botcheck, undefined);
});

test('public/_headers defines Cloudflare Pages security headers and strict CSP', () => {
  const headersPath = path.join(ROOT_DIR, 'public', '_headers');
  assert.equal(fs.existsSync(headersPath), true, 'public/_headers must exist');

  const raw = fs.readFileSync(headersPath, 'utf8');
  assert.match(raw, /^\/\*\r?$/m);
  assert.match(raw, /^\s+X-Content-Type-Options:\s*nosniff\r?$/m);
  assert.match(raw, /^\s+X-Frame-Options:\s*SAMEORIGIN\r?$/m);
  assert.match(raw, /^\s+Referrer-Policy:\s*strict-origin-when-cross-origin\r?$/m);
  assert.match(raw, /^\s+Strict-Transport-Security:\s*max-age=31536000; includeSubDomains\r?$/m);
  assert.match(raw, /^\s+Permissions-Policy:\s*.*camera=\(\).*microphone=\(\).*geolocation=\(\)/m);
  assert.match(raw, /^\s+Cross-Origin-Opener-Policy:\s*same-origin-allow-popups\r?$/m);

  const cspLine = raw.match(/^\s+Content-Security-Policy:\s*(.+)$/m)?.[1];
  assert.ok(cspLine, 'Content-Security-Policy header must be configured');

  const scriptSrc = cspLine.match(/script-src\s+([^;]+)/)?.[1] || '';
  assert.match(scriptSrc, /'self'/);
  assert.doesNotMatch(scriptSrc, /'unsafe-inline'|'unsafe-eval'/);

  assert.match(cspLine, /object-src\s+'none'/);
  assert.match(cspLine, /base-uri\s+'self'/);
  assert.match(cspLine, /form-action\s+'self'/);
  assert.match(cspLine, /frame-ancestors\s+'self'/);
  assert.match(cspLine, /img-src\s+[^;]*blob:/);
  assert.match(cspLine, /connect-src\s+[^;]*https:\/\/api\.web3forms\.com/);
  assert.match(cspLine, /frame-src\s+[^;]*https:\/\/www\.vertex-france\.com/);
  assert.match(cspLine, /frame-src\s+[^;]*https:\/\/tour\.panoee\.net/);
});

test('HTML entry pages contain no inline executable scripts, inline event handlers, unsafe blank links, or unverified CDN styles', () => {
  for (const rel of HTML_ENTRIES) {
    const html = fs.readFileSync(path.join(ROOT_DIR, rel), 'utf8');

    const scriptTags = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
    for (const [, attrs, body] of scriptTags) {
      const hasSrc = /\bsrc\s*=/.test(attrs);
      const isLdJson = /\btype\s*=\s*["']application\/ld\+json["']/i.test(attrs);
      if (!hasSrc && !isLdJson) {
        assert.equal(body.trim(), '', `${rel} contains an inline executable <script>`);
      }
    }

    assert.doesNotMatch(
      html,
      /\son(click|submit|load|error|change|input)\s*=/i,
      `${rel} must not use inline event handler attributes`
    );

    const anchorTags = [...html.matchAll(/<a\b[^>]*>/gi)].map((m) => m[0]);
    for (const tag of anchorTags) {
      if (/\btarget\s*=\s*["']_blank["']/i.test(tag)) {
        assert.match(tag, /\brel\s*=\s*["'][^"']*\bnoopener\b[^"']*["']/i, `${rel} link with target=_blank missing noopener: ${tag}`);
      }
    }

    const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
    for (const tag of linkTags) {
      if (/cdnjs\.cloudflare\.com/i.test(tag) && /\brel\s*=\s*["']stylesheet["']/i.test(tag)) {
        assert.match(tag, /\bintegrity\s*=\s*["']sha512-[A-Za-z0-9+/=]+["']/, `${rel} CDN stylesheet missing sha512 integrity`);
        assert.match(tag, /\bcrossorigin\s*=\s*["']anonymous["']/, `${rel} CDN stylesheet missing crossorigin=anonymous`);
      }
    }
  }

  const maquetteHtml = fs.readFileSync(path.join(ROOT_DIR, 'maquette3d.html'), 'utf8');
  const iframeTag = maquetteHtml.match(/<iframe\b[^>]*id="vertexIframe"[^>]*>/i)?.[0] || '';
  assert.match(iframeTag, /\breferrerpolicy\s*=\s*["']strict-origin-when-cross-origin["']/i);
});
