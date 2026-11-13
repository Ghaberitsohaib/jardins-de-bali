const STATUS_ALIASES = {
  disponible: 'disponible',
  available: 'disponible',
  libre: 'disponible',
  vendu: 'vendu',
  sold: 'vendu',
  option: 'option',
  optionne: 'option',
  'optionné': 'option',
  reserve: 'option',
  'réservé': 'option',
};

const STATUS_META = {
  disponible: {
    key: 'disponible',
    label: 'Disponible',
    pillText: 'Disponible',
    pillClass: 'is-disponible',
    modalWaText: 'Réserver ce lot via WhatsApp',
  },
  vendu: {
    key: 'vendu',
    label: 'Vendu',
    pillText: 'Vendu',
    pillClass: 'is-vendu',
    modalWaText: 'Demander un lot similaire disponible',
  },
  option: {
    key: 'option',
    label: 'Optionné',
    pillText: 'Optionné',
    pillClass: 'is-option',
    modalWaText: 'Être informé si ce lot se libère',
  },
};

/**
 * Normalize raw status labels (from Git JSON edits or Vertex exports)
 * into one of the three canonical availability keys.
 */
export function normalizeUnitStatus(rawStatus) {
  if (typeof rawStatus !== 'string') return 'disponible';
  const normalized = rawStatus.trim().toLowerCase();
  return STATUS_ALIASES[normalized] || 'disponible';
}

/**
 * Look up and normalize the availability status for a given unit ID.
 */
export function getUnitStatus(unitId, statusMap) {
  if (!statusMap || typeof statusMap !== 'object') return 'disponible';
  return normalizeUnitStatus(statusMap[unitId]);
}

/**
 * Return UI badge labels, CSS state class, and modal CTA wording for a status.
 */
export function getStatusMeta(status) {
  const key = normalizeUnitStatus(status);
  return STATUS_META[key];
}

/**
 * Compute aggregate counts by availability status for filter pills.
 */
export function countByStatus(units) {
  const counts = { all: 0, disponible: 0, vendu: 0, option: 0 };
  if (!Array.isArray(units)) return counts;

  counts.all = units.length;
  for (const unit of units) {
    const key = normalizeUnitStatus(unit && unit.status);
    counts[key] += 1;
  }
  return counts;
}
