import { describe, it, expect } from 'vitest';
import { bloodSignals } from '../src/bloodtype.js';

describe('bloodSignals', () => {
  it('A: 계획+ 내향- 감정-', () => {
    expect(bloodSignals('A')).toEqual({ A1:-0.5, A2:0, A3:-0.5, A4:0.5, A5:0 });
  });
  it('B: 외향+ 유연- 주도+', () => {
    expect(bloodSignals('B')).toEqual({ A1:0.5, A2:0, A3:0, A4:-0.5, A5:0.5 });
  });
  it('O: 외향+ 주도+', () => {
    expect(bloodSignals('O')).toEqual({ A1:0.5, A2:0, A3:0, A4:0, A5:0.5 });
  });
  it('AB: 직관+ 사고+', () => {
    expect(bloodSignals('AB')).toEqual({ A1:0, A2:0.5, A3:0.5, A4:0, A5:0 });
  });
});
