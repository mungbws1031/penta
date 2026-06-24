import { EPSILON, CONFLICT_RATIO } from './axes.js';

// entries: AxisEntry[] = [{ system, signal, weight, counted }]
export function computeAxis(entries) {
  const weightedLean = entries.reduce((a, e) => a + e.weight * e.signal, 0);
  const resultPole = Math.abs(weightedLean) <= EPSILON ? 0 : Math.sign(weightedLean);

  const counted = entries.filter(e => e.counted && Math.abs(e.signal) >= 0.5);
  const plus = counted.filter(e => e.signal > 0);
  const minus = counted.filter(e => e.signal < 0);

  // 결과 극이 정해진 쪽이 기여, 반대가 이견. 균형(0)이면 합의 없음 → 기여 비움.
  let contributing = [], dissenting = [];
  if (resultPole > 0) { contributing = plus; dissenting = minus; }
  else if (resultPole < 0) { contributing = minus; dissenting = plus; }

  // 충돌(입체): 양극에 각 ≥1표 AND 소수극 가중질량 ≥ 전체의 CONFLICT_RATIO.
  // 결과극과 무관(spec B-4) → 균형 축에서도 성립 가능하므로 plus/minus 로 직접 판정.
  let conflict = false;
  if (plus.length >= 1 && minus.length >= 1) {
    const mass = group => group.reduce((a, e) => a + Math.abs(e.weight * e.signal), 0);
    const massAll = entries.reduce((a, e) => a + Math.abs(e.weight * e.signal), 0);
    const minMass = Math.min(mass(plus), mass(minus));
    conflict = massAll > 0 && minMass / massAll >= CONFLICT_RATIO;
  }

  return {
    resultPole,
    stars: contributing.length,
    conflict,
    contributingSystems: contributing.map(e => e.system),
    dissentingSystems: dissenting.map(e => e.system),
    weightedLean,
  };
}
