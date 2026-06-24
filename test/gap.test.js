import { describe, it, expect } from 'vitest';
import { analyzeGap } from '../src/gap.js';

describe('analyzeGap', () => {
  const counts = [
    { name:'논리', count:3, systems:['사주','MBTI','별자리'] },
    { name:'분석', count:2, systems:['사주','MBTI'] },
    { name:'음악', count:0, systems:[] },
    { name:'창의', count:1, systems:['MBTI'] },
  ];
  it('자가선택∩시스템추론 → confirmed', () => {
    const r = analyzeGap(['논리'], counts);
    expect(r.confirmed).toContain('논리');
  });
  it('시스템추론(≥2)이지만 자가선택 안 함 → hidden', () => {
    const r = analyzeGap(['음악'], counts);
    expect(r.hidden).toContain('분석');
  });
  it('자가선택했지만 시스템 0~1 → nurtured', () => {
    const r = analyzeGap(['음악','창의'], counts);
    expect(r.nurtured.sort()).toEqual(['음악','창의']);
  });
});
