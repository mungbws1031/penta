import { describe, it, expect } from 'vitest';
import { vote, AXES, EPSILON, CONFLICT_RATIO } from '../src/axes.js';

describe('vote', () => {
  it('|신호|>=0.5 면 부호대로 한 표', () => {
    expect(vote(1)).toBe(1);
    expect(vote(0.5)).toBe(1);
    expect(vote(-0.5)).toBe(-1);
    expect(vote(-1)).toBe(-1);
  });
  it('|신호|<0.5 면 기권(0)', () => {
    expect(vote(0)).toBe(0);
    expect(vote(0.25)).toBe(0);
  });
});

describe('AXES 메타', () => {
  it('5축이 정의되어 있다', () => {
    expect(AXES.map(a => a.id)).toEqual(['A1','A2','A3','A4','A5']);
    expect(AXES[0]).toMatchObject({ id:'A1', plus:'외향', minus:'내향' });
    expect(EPSILON).toBe(0.25);
    expect(CONFLICT_RATIO).toBe(0.35);
  });
});
