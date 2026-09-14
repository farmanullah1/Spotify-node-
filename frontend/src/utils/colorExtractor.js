// Curated Spotify-style deep gradient color pairs
const GRADIENT_PALETTES = [
  { primary: '#1e3a8a', secondary: '#0f172a', accent: '#3b82f6' }, // Deep Blue
  { primary: '#4c1d95', secondary: '#1e1b4b', accent: '#8b5cf6' }, // Velvet Purple
  { primary: '#064e3b', secondary: '#022c22', accent: '#10b981' }, // Emerald Green
  { primary: '#831843', secondary: '#4c0519', accent: '#ec4899' }, // Berry Crimson
  { primary: '#78350f', secondary: '#451a03', accent: '#f59e0b' }, // Sunset Amber
  { primary: '#134e4a', secondary: '#042f2e', accent: '#14b8a6' }, // Deep Teal
  { primary: '#1e293b', secondary: '#0f172a', accent: '#64748b' }, // Midnight Slate
  { primary: '#701a75', secondary: '#4a044e', accent: '#d946ef' }, // Neon Fuchsia
];

export function getDominantGradient(identifier = 'spotify') {
  let hash = 0;
  const str = String(identifier || 'spotify');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index];
}
