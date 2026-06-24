// C-1: MBTI 글자 직결. A5는 기권(MBTI 비측정 차원).
export function mbtiSignals(type, { weak = false } = {}) {
  const t = String(type).trim().toUpperCase();
  const m = +(weak ? 0.5 : 1);
  const ax = (a, b, ch) => (ch === a ? m : ch === b ? -m : 0);
  return {
    A1: ax('E', 'I', t[0]),
    A2: ax('N', 'S', t[1]),
    A3: ax('T', 'F', t[2]),
    A4: ax('J', 'P', t[3]),
    A5: 0,
  };
}
