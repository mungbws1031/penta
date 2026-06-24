// selected: 자가선택 강점 이름[] (top3), counts: strengthCounts() 결과
export function analyzeGap(selected, counts) {
  const sel = new Set(selected);
  const inferred = new Set(counts.filter(c => c.count >= 2).map(c => c.name));
  const confirmed = [...sel].filter(n => inferred.has(n));
  const hidden = [...inferred].filter(n => !sel.has(n));
  const nurtured = [...sel].filter(n => !inferred.has(n));
  return { confirmed, hidden, nurtured };
}
