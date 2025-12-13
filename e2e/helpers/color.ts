/**
 * Normalize CSS color values to lowercase hex (#rrggbb).
 * Supports input formats: '#abc', '#aabbcc', 'rgb(r,g,b)', 'rgba(r,g,b,a)'
 */
export function normalizeColor(input: string | null | undefined): string | null {
  if (!input) return null;
  const s = input.trim().toLowerCase();
  // Already hex
  if (s.startsWith('#')) {
    if (s.length === 4) {
      // expand shorthand #rgb -> #rrggbb
      return '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
    }
    return s;
  }

  // rgb() or rgba()
  const rgbMatch = s.match(/rgba?\s*\(([^)]+)\)/);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(',').map((p) => p.trim());
    const r = parseInt(parts[0], 10);
    const g = parseInt(parts[1], 10);
    const b = parseInt(parts[2], 10);
    if ([r, g, b].some((v) => Number.isNaN(v))) return null;
    return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
  }

  return null;
}
