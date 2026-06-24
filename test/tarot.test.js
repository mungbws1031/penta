import { describe, it, expect } from 'vitest';
import { MAJOR_ARCANA, POSITIONS, shuffle, drawThree, readingText } from '../src/tarot.js';

describe('덱', () => {
  it('메이저 아르카나 22장, 각 카드 필드 완비', () => {
    expect(MAJOR_ARCANA).toHaveLength(22);
    MAJOR_ARCANA.forEach(c => {
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('emoji');
      expect(c.upright.length).toBeGreaterThan(2);
      expect(c.reversed.length).toBeGreaterThan(2);
    });
  });
});

describe('shuffle', () => {
  it('원본을 변형하지 않고 같은 22장을 반환', () => {
    const before = [...MAJOR_ARCANA];
    const out = shuffle(MAJOR_ARCANA, () => 0.42);
    expect(out).toHaveLength(22);
    expect(MAJOR_ARCANA).toEqual(before); // 비파괴
    expect(new Set(out.map(c => c.id)).size).toBe(22); // 중복 없음
  });
});

describe('drawThree', () => {
  it('과거/현재/미래 3장, 서로 다른 카드, reversed 불리언', () => {
    let n = 0;
    const seq = [0.1, 0.2, 0.3, 0.4, 0.9, 0.1, 0.8]; // 결정적 시퀀스
    const rand = () => seq[(n++) % seq.length];
    const spread = drawThree(rand);
    expect(spread.map(s => s.position)).toEqual(POSITIONS);
    expect(new Set(spread.map(s => s.card.id)).size).toBe(3);
    spread.forEach(s => expect(typeof s.reversed).toBe('boolean'));
  });
});

describe('readingText', () => {
  it('정/역방향에 따라 다른 의미를 포함', () => {
    const card = MAJOR_ARCANA[19]; // 태양
    expect(readingText({ position:'현재', card, reversed:false })).toContain('정방향');
    expect(readingText({ position:'현재', card, reversed:true })).toContain('역방향');
  });
});
