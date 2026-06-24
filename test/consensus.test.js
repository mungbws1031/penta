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

import { computeAxis } from '../src/consensus.js';

describe('computeAxis', () => {
  const W = { 사주:1.0, MBTI:1.0, 별자리:0.6, 혈액형:0.3 };
  const entry = (system, signal) => ({
    system, signal, weight: W[system], counted: system !== '혈액형',
  });

  it('3개 카운트 시스템이 같은 극 → ★★★, 충돌 없음', () => {
    const r = computeAxis([entry('사주',1), entry('MBTI',1), entry('별자리',0.5), entry('혈액형',0.5)]);
    expect(r.resultPole).toBe(1);
    expect(r.stars).toBe(3);
    expect(r.conflict).toBe(false);
    expect(r.contributingSystems.sort()).toEqual(['MBTI','별자리','사주']);
  });

  it('혈액형은 카운트 투표 안 함 (별점에 미포함)', () => {
    const r = computeAxis([entry('MBTI',1), entry('혈액형',1)]);
    expect(r.stars).toBe(1);
    expect(r.contributingSystems).toEqual(['MBTI']);
  });

  it('양극 분할 + 소수극 질량 35%↑ → 충돌', () => {
    const r = computeAxis([entry('사주',1), entry('MBTI',-1), entry('별자리',0.5)]);
    expect(r.conflict).toBe(true);
  });

  it('가중 lean이 ±EPSILON 이내 → balanced(0)', () => {
    const r = computeAxis([entry('사주',0.5), entry('MBTI',-0.5)]);
    expect(r.resultPole).toBe(0);
  });

  it('balanced 축은 합의 없음 → stars 0, 기여 시스템 비움', () => {
    const r = computeAxis([entry('사주',0.5), entry('MBTI',-0.5)]);
    expect(r.stars).toBe(0);
    expect(r.contributingSystems).toEqual([]);
  });

  it('balanced 축에서도 양극 분할이면 충돌 성립(spec B-4)', () => {
    const r = computeAxis([entry('사주',0.5), entry('MBTI',-0.5)]);
    expect(r.resultPole).toBe(0);
    expect(r.conflict).toBe(true);
  });
});
