export const AXES = [
  { id: 'A1', label: '에너지', plus: '외향', minus: '내향' },
  { id: 'A2', label: '인식',   plus: '직관', minus: '현실' },
  { id: 'A3', label: '판단',   plus: '사고', minus: '감정' },
  { id: 'A4', label: '구조',   plus: '계획', minus: '유연' },
  { id: 'A5', label: '주도성', plus: '주도', minus: '수용' },
];
export const AXIS_IDS = AXES.map(a => a.id);

export const EPSILON = 0.25;        // 균형/유동 임계
export const CONFLICT_RATIO = 0.35; // 소수극 충돌 임계

export function vote(signal) {
  return Math.abs(signal) >= 0.5 ? Math.sign(signal) : 0;
}
