// C-1: MBTI 글자 직결. A5는 기권(MBTI 비측정 차원).
const VALID_MBTI = /^[EI][NS][TF][JP]$/;

export function mbtiSignals(type, { weak = false } = {}) {
  const t = String(type).trim().toUpperCase();
  // 형식에 안 맞는 입력은 전 축 기권(0) — 잘못된 글자가 가짜 투표를 만들지 않도록.
  if (!VALID_MBTI.test(t)) return { A1: 0, A2: 0, A3: 0, A4: 0, A5: 0 };
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
