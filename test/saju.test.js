import { describe, it, expect } from 'vitest';
import { clustersToSignals, tallyTenGods, sajuSignals } from '../src/saju.js';

const zero = { 비견:0,겁재:0,식신:0,상관:0,편재:0,정재:0,편관:0,정관:0,편인:0,정인:0 };

describe('clustersToSignals (C-2 규칙)', () => {
  it('식상/비겁 우세 → A1 외향+, 인성 우세 → A1 내향-', () => {
    expect(clustersToSignals({ ...zero, 식신:2, 상관:1 }).A1).toBe(1);
    expect(clustersToSignals({ ...zero, 정인:2, 편인:1 }).A1).toBe(-1);
  });
  it('diff==1 → +0.5, diff==-1 → -0.5, diff==0 → 0', () => {
    expect(clustersToSignals({ ...zero, 식신:1 }).A1).toBe(0.5);
    expect(clustersToSignals({ ...zero, 정인:1 }).A1).toBe(-0.5);
    expect(clustersToSignals({ ...zero, 식신:1, 정인:1 }).A1).toBe(0);
  });
  it('관성/재성 우세 → A3 사고+', () => {
    expect(clustersToSignals({ ...zero, 정관:1, 편관:1, 정재:1 }).A3).toBe(1);
  });
  it('비겁/편관 → A5 주도+, 인성 → A5 수용-', () => {
    expect(clustersToSignals({ ...zero, 비견:1, 겁재:1, 편관:1 }).A5).toBe(1);
    expect(clustersToSignals({ ...zero, 정인:2 }).A5).toBe(-1);
  });
});

describe('tallyTenGods (만세력)', () => {
  const birth = { year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' };
  it('십성 10종 카운트 + timeUnknown=false 반환', () => {
    const { counts, timeUnknown } = tallyTenGods(birth);
    const total = Object.values(counts).reduce((a,b)=>a+b,0);
    expect(total).toBeGreaterThan(0);
    expect(timeUnknown).toBe(false);
  });
  it('hour 없으면 timeUnknown=true, 시주 십성 미포함', () => {
    const noTime = { ...birth, hour: null };
    const full = tallyTenGods(birth);
    const partial = tallyTenGods(noTime);
    expect(partial.timeUnknown).toBe(true);
    const sum = c => Object.values(c).reduce((a,b)=>a+b,0);
    expect(sum(partial.counts)).toBeLessThan(sum(full.counts));
  });
});

describe('sajuSignals', () => {
  it('신호 객체 + timeUnknown 동반', () => {
    const r = sajuSignals({ year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' });
    expect(Object.keys(r.signals)).toEqual(['A1','A2','A3','A4','A5']);
    expect(typeof r.timeUnknown).toBe('boolean');
  });
});
