/** Escapes a value for CSV: wraps in quotes and doubles any embedded quotes. */
const cell = (value: string | number): string =>
  typeof value === 'number' ? String(value) : `"${value.replace(/"/g, '""')}"`;

export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]): void {
  const content = [header.map(cell).join(','), ...rows.map((r) => r.map(cell).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
