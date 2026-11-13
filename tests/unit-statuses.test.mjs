import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  normalizeUnitStatus,
  getUnitStatus,
  getStatusMeta,
  countByStatus,
} from '../src/unitStatus.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

function loadJson(relPath) {
  return JSON.parse(readFileSync(resolve(rootDir, relPath), 'utf8'));
}

describe('normalizeUnitStatus', () => {
  it('normalizes canonical and Vertex status strings case-insensitively', () => {
    assert.equal(normalizeUnitStatus('disponible'), 'disponible');
    assert.equal(normalizeUnitStatus('available'), 'disponible');
    assert.equal(normalizeUnitStatus('  VENDU  '), 'vendu');
    assert.equal(normalizeUnitStatus('sold'), 'vendu');
    assert.equal(normalizeUnitStatus('OPTION'), 'option');
    assert.equal(normalizeUnitStatus('optionné'), 'option');
  });

  it('falls back safely to disponible on empty or unknown values', () => {
    assert.equal(normalizeUnitStatus(undefined), 'disponible');
    assert.equal(normalizeUnitStatus(null), 'disponible');
    assert.equal(normalizeUnitStatus(''), 'disponible');
    assert.equal(normalizeUnitStatus('unknown-state'), 'disponible');
  });
});

describe('getUnitStatus', () => {
  it('returns normalized status from map and defaults missing entries to disponible', () => {
    const map = { 'APP 2': 'VENDU', 'APP 180': 'option', 'MAGASIN 1': 'disponible' };
    assert.equal(getUnitStatus('APP 2', map), 'vendu');
    assert.equal(getUnitStatus('APP 180', map), 'option');
    assert.equal(getUnitStatus('MAGASIN 1', map), 'disponible');
    assert.equal(getUnitStatus('APP 999', map), 'disponible');
    assert.equal(getUnitStatus('APP 1', null), 'disponible');
  });
});

describe('getStatusMeta', () => {
  it('returns French display labels, badge classes, and modal CTA visibility per status', () => {
    const dispo = getStatusMeta('disponible');
    assert.equal(dispo.key, 'disponible');
    assert.equal(dispo.label, 'Disponible');
    assert.equal(dispo.pillClass, 'is-disponible');
    assert.equal(dispo.allowInquiry, true);
    assert.match(dispo.modalWaText, /Réserver ce lot/i);

    const vendu = getStatusMeta('vendu');
    assert.equal(vendu.key, 'vendu');
    assert.equal(vendu.label, 'Vendu');
    assert.equal(vendu.pillClass, 'is-vendu');
    assert.equal(vendu.allowInquiry, false);
    assert.equal(vendu.modalWaText, null);

    const option = getStatusMeta('option');
    assert.equal(option.key, 'option');
    assert.equal(option.label, 'Optionné');
    assert.equal(option.pillClass, 'is-option');
    assert.equal(option.allowInquiry, true);
    assert.match(option.modalWaText, /libère/i);
  });
});

describe('countByStatus', () => {
  it('aggregates all, disponible, vendu, and option totals', () => {
    const sample = [
      { status: 'disponible' },
      { status: 'vendu' },
      { status: 'vendu' },
      { status: 'option' },
      {},
    ];
    assert.deepEqual(countByStatus(sample), {
      all: 5,
      disponible: 2,
      vendu: 2,
      option: 1,
    });
  });
});

describe('unit-statuses.json parity with residences-data.json and Vertex 3D', () => {
  it('covers all 234 units exactly once with valid status strings', () => {
    const residences = loadJson('src/data/residences-data.json');
    const statuses = loadJson('src/data/unit-statuses.json');

    const unitIds = residences.map((u) => u.id);
    const statusKeys = Object.keys(statuses);

    assert.equal(residences.length, 234);
    assert.equal(statusKeys.length, 234);
    assert.deepEqual([...statusKeys].sort(), [...unitIds].sort());

    for (const [id, raw] of Object.entries(statuses)) {
      assert.ok(
        ['disponible', 'vendu', 'option'].includes(raw),
        `Invalid status "${raw}" for unit ${id}`
      );
    }
  });

  it('matches Vertex 3D commercial counts (162 vendu, 68 disponible incl. 4 magasins, 4 option)', () => {
    const residences = loadJson('src/data/residences-data.json');
    const statuses = loadJson('src/data/unit-statuses.json');

    const enriched = residences.map((u) => ({
      id: u.id,
      isMagasin: Boolean(u.isMagasin),
      status: getUnitStatus(u.id, statuses),
    }));

    assert.deepEqual(countByStatus(enriched), {
      all: 234,
      disponible: 68,
      vendu: 162,
      option: 4,
    });

    const optionIds = enriched.filter((u) => u.status === 'option').map((u) => u.id);
    assert.deepEqual(optionIds, ['APP 180', 'APP 182', 'APP 185', 'APP 221']);

    const magasinStatuses = enriched.filter((u) => u.isMagasin).map((u) => u.status);
    assert.deepEqual(magasinStatuses, ['disponible', 'disponible', 'disponible', 'disponible']);

    assert.equal(statuses['APP 1'], 'disponible');
    assert.equal(statuses['APP 2'], 'vendu');
    assert.equal(statuses['APP 3'], 'disponible');
  });
});
