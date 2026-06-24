import { describe, it, expect } from 'vitest';
import { runEngine } from '../src/engine.js';

const input = {
  birth: { year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' },
  mbti: 'ENTJ',
  blood: 'O',
  selectedStrengths: ['논리','실행력','분석'],
};

describe('runEngine', () => {
  it('5축 결과 + 12강점 + 갭 + 시주플래그 반환', () => {
    const r = runEngine(input);
    expect(r.axes).toHaveLength(5);
    expect(r.axes[0]).toHaveProperty('stars');
    expect(r.axes[0]).toHaveProperty('resultPole');
    expect(r.strengths).toHaveLength(12);
    expect(r.gap).toHaveProperty('confirmed');
    expect(typeof r.sajuTimeUnknown).toBe('boolean');
  });
  it('시간 미상이면 사주 가중 0.85 적용 + 플래그', () => {
    const r = runEngine({ ...input, birth: { ...input.birth, hour: null } });
    expect(r.sajuTimeUnknown).toBe(true);
  });
});
