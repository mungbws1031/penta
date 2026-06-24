import { describe, it, expect } from 'vitest';
import { analyzeCompat } from '../src/compat.js';

const personA = { birth: { year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' }, mbti:'ENTJ', blood:'O' };
const personB = { birth: { year:1992, month:11, day:3, hour:14, calendar:'solar', gender:'female' }, mbti:'INFP', blood:'A' };

describe('analyzeCompat', () => {
  it('종합 % + 4개 시스템 + 합/충 포인트 반환', () => {
    const r = analyzeCompat(personA, personB);
    expect(r.totalPercent).toBeGreaterThanOrEqual(0);
    expect(r.totalPercent).toBeLessThanOrEqual(100);
    expect(r.systems.map(s => s.name)).toEqual(['사주','MBTI','별자리','혈액형']);
    r.systems.forEach(s => {
      expect(['합','충','중립']).toContain(s.verdict);
      expect(typeof s.note).toBe('string');
    });
    expect(Array.isArray(r.goodPoints)).toBe(true);
    expect(Array.isArray(r.frictionPoints)).toBe(true);
  });

  it('잘못된 MBTI/혈액형이어도 NaN 없이 동작', () => {
    const r = analyzeCompat(
      { ...personA, mbti:'??', blood:'?' },
      { ...personB, mbti:'????', blood:'X' },
    );
    expect(Number.isFinite(r.totalPercent)).toBe(true);
  });

  it('별자리 원소 조화(불·공기)는 합, 긴장(불·물)은 충', () => {
    // 사자(불) vs 천칭(공기) → 조화 / 사자(불) vs 게(물) → 긴장
    const fire = { birth:{year:1990,month:8,day:5,hour:10,calendar:'solar',gender:'male'}, mbti:'ENTJ', blood:'O' };
    const air  = { birth:{year:1990,month:10,day:5,hour:10,calendar:'solar',gender:'female'}, mbti:'ENTJ', blood:'O' };
    const water= { birth:{year:1990,month:7,day:5,hour:10,calendar:'solar',gender:'female'}, mbti:'ENTJ', blood:'O' };
    const harmony = analyzeCompat(fire, air).systems.find(s => s.name==='별자리');
    const tension = analyzeCompat(fire, water).systems.find(s => s.name==='별자리');
    expect(harmony.verdict).toBe('합');
    expect(tension.verdict).toBe('충');
  });
});
