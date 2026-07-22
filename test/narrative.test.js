import { describe, it, expect } from 'vitest';
import { MBTI_DEEP, mbtiNarrative, BLOOD_DEEP, bloodNarrative } from '../src/narrative.js';

const E=['E','I'], N=['N','S'], T=['T','F'], J=['J','P'];
const ALL16 = E.flatMap(e=>N.flatMap(n=>T.flatMap(t=>J.map(j=>e+n+t+j))));

describe('MBTI_DEEP', () => {
  it('16유형 전부 존재하고 5개 필드 모두 채워짐', () => {
    expect(Object.keys(MBTI_DEEP).sort()).toEqual(ALL16.sort());
    ALL16.forEach(k => {
      ['catch','vibe','strength','shadow','match'].forEach(f => {
        expect(typeof MBTI_DEEP[k][f]).toBe('string');
        expect(MBTI_DEEP[k][f].length).toBeGreaterThan(10);
      });
    });
  });
  it('mbtiNarrative가 유효한 MBTI일 때만 결과를 반환', () => {
    expect(mbtiNarrative('ENTJ')).toContain('이런 사람이에요');
    expect(mbtiNarrative('entj')).toContain('이런 사람이에요');
    expect(mbtiNarrative('')).toBe('');
    expect(mbtiNarrative('BOGUS')).toBe('');
    expect(mbtiNarrative('ENTX')).toBe('');
  });
});

describe('BLOOD_DEEP', () => {
  it('4유형 전부 존재하고 4개 필드 모두 채워짐', () => {
    expect(Object.keys(BLOOD_DEEP).sort()).toEqual(['A','AB','B','O'].sort());
    ['A','B','O','AB'].forEach(k => {
      ['catch','traits','strength','shadow'].forEach(f => {
        expect(typeof BLOOD_DEEP[k][f]).toBe('string');
        expect(BLOOD_DEEP[k][f].length).toBeGreaterThan(5);
      });
    });
  });
  it('bloodNarrative가 재미용 고지를 포함', () => {
    expect(bloodNarrative('O')).toMatch(/재미|근거/);
  });
  it('bloodNarrative가 유효한 혈액형일 때만 결과를 반환', () => {
    expect(bloodNarrative('a')).toContain('특징');
    expect(bloodNarrative('AB')).toContain('특징');
    expect(bloodNarrative('')).toBe('');
    expect(bloodNarrative('ZZ')).toBe('');
  });
});
