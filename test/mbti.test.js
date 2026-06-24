import { describe, it, expect } from 'vitest';
import { mbtiSignals } from '../src/mbti.js';

describe('mbtiSignals', () => {
  it('ENTJ → A1+ A2+ A3+ A4+ (16택1은 ±1), A5는 항상 0', () => {
    expect(mbtiSignals('ENTJ')).toEqual({ A1:1, A2:1, A3:1, A4:1, A5:0 });
  });
  it('ISFP → A1- A2- A3- A4-', () => {
    expect(mbtiSignals('ISFP')).toEqual({ A1:-1, A2:-1, A3:-1, A4:-1, A5:0 });
  });
  it('소문자/공백 허용', () => {
    expect(mbtiSignals(' entj ')).toEqual({ A1:1, A2:1, A3:1, A4:1, A5:0 });
  });
  it('weak=true 면 ±0.5 (간이 12문항 약신호)', () => {
    expect(mbtiSignals('ENTJ', { weak: true })).toEqual({ A1:0.5, A2:0.5, A3:0.5, A4:0.5, A5:0 });
  });
});
