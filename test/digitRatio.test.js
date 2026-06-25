import { describe, it, expect } from 'vitest';
import { analyzeDigitRatio } from '../src/digitRatio.js';

describe('analyzeDigitRatio', () => {
  it('약지가 길면 낮은 2D:4D · 테스토스테론 높은 편', () => {
    const r = analyzeDigitRatio('ring');
    expect(r.category).toContain('낮은 2D:4D');
    expect(r.testosterone).toBe('높은 편');
    expect(r.traits.length).toBeGreaterThan(0);
  });
  it('검지가 길면 높은 2D:4D · 테스토스테론 낮은 편', () => {
    const r = analyzeDigitRatio('index');
    expect(r.category).toContain('높은 2D:4D');
    expect(r.testosterone).toBe('낮은 편');
  });
  it('비슷하면 중간', () => {
    expect(analyzeDigitRatio('similar').testosterone).toBe('중간');
  });
  it('미선택/잘못된 값이면 null', () => {
    expect(analyzeDigitRatio('')).toBe(null);
    expect(analyzeDigitRatio(undefined)).toBe(null);
  });
});
