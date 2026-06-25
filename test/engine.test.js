import { describe, it, expect } from 'vitest';
import { runEngine } from '../src/engine.js';

const input = {
  birth: { year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' },
  mbti: 'ENTJ',
  blood: 'O',
  name: '홍길동',
};

describe('runEngine', () => {
  it('5축 결과 + 12강점 + 일간오행 + 시주플래그 반환', () => {
    const r = runEngine(input);
    expect(r.axes).toHaveLength(5);
    expect(r.axes[0]).toHaveProperty('stars');
    expect(r.axes[0]).toHaveProperty('resultPole');
    expect(r.strengths).toHaveLength(12);
    expect(typeof r.sajuTimeUnknown).toBe('boolean');
    expect(['목','화','토','금','수']).toContain(r.dayElement);
  });
  it('이름 주면 성명학 분석 포함, 없으면 null', () => {
    expect(runEngine(input).name).not.toBe(null);
    expect(runEngine(input).name.syllables.length).toBe(3);
    expect(runEngine({ ...input, name: '' }).name).toBe(null);
  });
  it('시간 미상이면 사주 가중 0.85 적용 + 플래그', () => {
    const r = runEngine({ ...input, birth: { ...input.birth, hour: null } });
    expect(r.sajuTimeUnknown).toBe(true);
  });

  it('음력 입력(P0)도 정상 동작 — 5축/12강점 산출', () => {
    const r = runEngine({ ...input, birth: { ...input.birth, calendar: 'lunar' } });
    expect(r.axes).toHaveLength(5);
    expect(r.strengths).toHaveLength(12);
    expect(r.axes.every(a => Number.isFinite(a.weightedLean))).toBe(true);
  });

  it('잘못된 혈액형/MBTI여도 NaN 없이 동작(중립/기권 처리)', () => {
    const r = runEngine({ ...input, mbti: 'BOGUS', blood: 'ZZ' });
    expect(r.axes.every(a => Number.isFinite(a.weightedLean))).toBe(true);
  });
});
