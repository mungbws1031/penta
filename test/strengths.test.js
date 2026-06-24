import { describe, it, expect } from 'vitest';
import { strengthCounts } from '../src/strengths.js';

const zero = { 비견:0,겁재:0,식신:0,상관:0,편재:0,정재:0,편관:0,정관:0,편인:0,정인:0 };

describe('strengthCounts', () => {
  it('각 강점에 count(0~3)와 systems[] 반환', () => {
    const res = strengthCounts({
      sajuCounts: { ...zero, 정관:1, 편관:1 },
      mbti: 'INTJ',
      sign: '처녀자리',
    });
    const 논리 = res.find(s => s.name === '논리');
    expect(논리.count).toBe(3);
    expect(논리.systems.sort()).toEqual(['MBTI','별자리','사주']);
  });

  it('지목 0이면 count 0', () => {
    const res = strengthCounts({ sajuCounts: { ...zero }, mbti: 'ESFJ', sign: '게자리' });
    expect(res.find(s => s.name === '공간').count).toBe(0);
  });

  it('12개 강점 모두 반환', () => {
    const res = strengthCounts({ sajuCounts: { ...zero }, mbti: 'INTJ', sign: '양자리' });
    expect(res).toHaveLength(12);
  });
});
