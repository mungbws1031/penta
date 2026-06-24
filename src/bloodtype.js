// C-4: 한국 통념, ±0.5 상한. 카운트 제외는 engine 의 counted=false 로 처리.
const TABLE = {
  A:  { A1:-0.5, A2:0,   A3:-0.5, A4:0.5,  A5:0 },
  B:  { A1:0.5,  A2:0,   A3:0,    A4:-0.5, A5:0.5 },
  O:  { A1:0.5,  A2:0,   A3:0,    A4:0,    A5:0.5 },
  AB: { A1:0,    A2:0.5, A3:0.5,  A4:0,    A5:0 },
};

const NEUTRAL = { A1:0, A2:0, A3:0, A4:0, A5:0 };

export function bloodSignals(type) {
  // 알 수 없는 혈액형은 중립(전 축 0)으로 — 가중 합산에 NaN 유입 방지.
  return { ...(TABLE[String(type).trim().toUpperCase()] ?? NEUTRAL) };
}
