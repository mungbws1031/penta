import { describe, it, expect } from 'vitest';
import { renderRadarSVG } from '../src/radar.js';

const axes = [
  { id:'A1', label:'에너지', plus:'외향', minus:'내향', resultPole:1,  weightedLean:1.2 },
  { id:'A2', label:'인식',   plus:'직관', minus:'현실', resultPole:-1, weightedLean:-0.8 },
  { id:'A3', label:'판단',   plus:'사고', minus:'감정', resultPole:0,  weightedLean:0.1 },
  { id:'A4', label:'구조',   plus:'계획', minus:'유연', resultPole:1,  weightedLean:2.0 },
  { id:'A5', label:'주도성', plus:'주도', minus:'수용', resultPole:1,  weightedLean:0.5 },
];

describe('renderRadarSVG', () => {
  it('SVG 문자열을 반환한다', () => {
    const svg = renderRadarSVG(axes);
    expect(svg).toMatch(/^<svg[\s\S]*<\/svg>$/);
    expect(svg).toContain('<polygon');
  });
  it('결과 극 라벨을 스포크에 표기 (외향/현실 등)', () => {
    const svg = renderRadarSVG(axes);
    expect(svg).toContain('외향');  // A1 resultPole +
    expect(svg).toContain('현실');  // A2 resultPole -
    expect(svg).toContain('판단');  // A3 balanced → 축 라벨
  });
});
