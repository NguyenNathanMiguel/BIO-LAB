export const LEVELS = [
  { name: "Mới học", min: 0 },
  { name: "Sinh viên", min: 50 },
  { name: "Thạc sỹ", min: 150 },
  { name: "Tiến sỹ", min: 300 },
  { name: "Giáo sư", min: 600 },
];

export const JOURNAL_POINTS = 10;
export const STAR_POINTS = 5;

export function computeLevel(journalCount, totalStars) {
  const score = journalCount * JOURNAL_POINTS + totalStars * STAR_POINTS;
  let index = 0;
  LEVELS.forEach((l, i) => { if (score >= l.min) index = i; });
  const next = LEVELS[index + 1] || null;
  const progress = next ? Math.round(((score - LEVELS[index].min) / (next.min - LEVELS[index].min)) * 100) : 100;
  return { ...LEVELS[index], index, score, next, progress };
}