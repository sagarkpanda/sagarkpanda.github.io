// Tag slugs match the original portfolio's case-insensitive tag URL rules.
export function normalizeTaxonomySlug(value: string): string {
  return value.trim().toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Categories and series use the original slugify rule where ampersands become "and".
export function normalizeCategorySlug(value: string): string {
  return value.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
