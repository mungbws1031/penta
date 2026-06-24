import { EPSILON, CONFLICT_RATIO } from './axes.js';

// entries: AxisEntry[] = [{ system, signal, weight, counted }]
export function computeAxis(entries) {
  const weightedLean = entries.reduce((a, e) => a + e.weight * e.signal, 0);
  const resultPole = Math.abs(weightedLean) <= EPSILON ? 0 : Math.sign(weightedLean);

  const counted = entries.filter(e => e.counted && Math.abs(e.signal) >= 0.5);
  const plus = counted.filter(e => e.signal > 0);
  const minus = counted.filter(e => e.signal < 0);

  let contributing, dissenting;
  if (resultPole > 0) { contributing = plus; dissenting = minus; }
  else if (resultPole < 0) { contributing = minus; dissenting = plus; }
  else {
    [contributing, dissenting] = plus.length >= minus.length ? [plus, minus] : [minus, plus];
  }

  let conflict = false;
  if (plus.length >= 1 && minus.length >= 1) {
    const massAll = entries.reduce((a, e) => a + Math.abs(e.weight * e.signal), 0);
    const minoritySide = contributing.length >= dissenting.length ? dissenting : contributing;
    const minMass = minoritySide.reduce((a, e) => a + Math.abs(e.weight * e.signal), 0);
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
