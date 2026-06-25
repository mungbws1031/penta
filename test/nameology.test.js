import { describe, it, expect } from 'vitest';
import { choseongOf, analyzeName } from '../src/nameology.js';

describe('choseongOf', () => {
  it('한글 음절의 초성을 반환', () => {
    expect(choseongOf('홍')).toBe('ㅎ');
    expect(choseongOf('길')).toBe('ㄱ');
    expect(choseongOf('동')).toBe('ㄷ');
  });
  it('한글 음절이 아니면 null', () => {
    expect(choseongOf('A')).toBe(null);
    expect(choseongOf(' ')).toBe(null);
  });
});

describe('analyzeName', () => {
  it('각 글자의 소리오행 + 글자간 흐름 + 점수', () => {
    const r = analyzeName('홍길동');
    expect(r.syllables.map(s => s.element)).toEqual(['토', '목', '화']); // ㅎ=토, ㄱ=목, ㄷ=화
    expect(r.flow).toHaveLength(2);
    expect(r.flow[0].relation).toBe('상극'); // 토·목 = 상극(목극토)
    expect(r.flow[1].relation).toBe('상생'); // 목·화 = 상생(목생화)
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
  it('사주 일간과의 관계 판정', () => {
    // 이름에 화(火) 포함 + 일간 토(土) → 화생토 → 보완(길)
    const r = analyzeName('동', '토');
    expect(r.sajuRelation.verdict).toBe('길');
  });
  it('한글이 없으면 null', () => {
    expect(analyzeName('John')).toBe(null);
    expect(analyzeName('')).toBe(null);
  });
});
