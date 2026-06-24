import { describe, it, expect } from 'vitest';
import { sunSign, zodiacSignals } from '../src/zodiac.js';

describe('sunSign', () => {
  it('양력 월/일 → 태양궁', () => {
    expect(sunSign(3, 25)).toBe('양자리');
    expect(sunSign(7, 10)).toBe('게자리');
    expect(sunSign(1, 15)).toBe('염소자리');
  });
});

describe('zodiacSignals', () => {
  it('양자리(불·양·활동궁): A1+ A2+ A4활동(+0.25) A5활동(+0.5)', () => {
    expect(zodiacSignals('양자리')).toEqual({ A1:0.5, A2:0.5, A3:0, A4:0.25, A5:0.5 });
  });
  it('천칭자리(공기·양·활동궁): A1+ A2+ A3사고+ A4활동 A5활동', () => {
    expect(zodiacSignals('천칭자리')).toEqual({ A1:0.5, A2:0.5, A3:0.5, A4:0.25, A5:0.5 });
  });
  it('황소자리(흙·음·고정궁): A1- A2현실- A3:0 A4고정+ A5:0', () => {
    expect(zodiacSignals('황소자리')).toEqual({ A1:-0.5, A2:-0.5, A3:0, A4:0.5, A5:0 });
  });
});
