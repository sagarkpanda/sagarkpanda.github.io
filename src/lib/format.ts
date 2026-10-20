export function displayDate(value?: string | Date): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
}
