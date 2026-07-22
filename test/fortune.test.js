import { describe, it, expect } from 'vitest';
import { tenGod, natalFortune, lifeTimeline, analyzeFortune } from '../src/fortune.js';

const zero = { 비견:0,겁재:0,식신:0,상관:0,편재:0,정재:0,편관:0,정관:0,편인:0,정인:0 };

describe('tenGod', () => {
  it('일간 기준 십성 판정', () => {
    expect(tenGod('甲', '甲')).toBe('비견'); // 같은 목 같은 양
    expect(tenGod('甲', '乙')).toBe('겁재'); // 같은 목 음양 다름
    expect(tenGod('甲', '丙')).toBe('식신'); // 목생화 같은 양
    expect(tenGod('甲', '戊')).toBe('편재'); // 목극토 같은 양
    expect(tenGod('甲', '庚')).toBe('편관'); // 금극목 같은 양
  });
});

describe('natalFortune', () => {
  it('정재 많으면 재물운↑', () => {
    const a = natalFortune({ ...zero, 정재: 3 });
    const b = natalFortune({ ...zero });
    expect(a.재물).toBeGreaterThan(b.재물);
  });
  it('네 가지 운 모두 18~96 범위', () => {
    const f = natalFortune({ ...zero, 정관: 2, 편관: 2, 정재: 2 });
    Object.values(f).forEach(v => { expect(v).toBeGreaterThanOrEqual(18); expect(v).toBeLessThanOrEqual(96); });
  });
});

describe('lifeTimeline', () => {
  it('대운 구간 + 고비/전성기 반환', () => {
    const t = lifeTimeline({ year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' });
    expect(t.periods.length).toBeGreaterThan(1);
    t.periods.forEach(p => {
      expect(typeof p.startAge).toBe('number');
      expect(p.overall).toBeGreaterThanOrEqual(18);
    });
    expect(Array.isArray(t.lows)).toBe(true);
  });
});

describe('analyzeFortune', () => {
  it('natal + timeline 동반', () => {
    const f = analyzeFortune({ ...zero, 정재: 1 }, { year:1992, month:11, day:3, hour:14, calendar:'solar', gender:'female' });
    expect(f.natal).toHaveProperty('재물');
    expect(f.timeline).toHaveProperty('periods');
  });
});

describe('lifeTimeline — 지지(地支) 보강', () => {
  const birth = { year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' };

  it('zhi는 항상 ganZhi의 두번째 글자와 같다', () => {
    const t = lifeTimeline(birth);
    t.periods.forEach(p => {
      expect(p.zhi).toBe(p.ganZhi.charAt(1));
    });
  });

  it('원국(1990-05-15 10시, 男)과의 실제 충·육합이 걸리는 대운을 정확히 잡아낸다', () => {
    // 원국: 년지 午, 월지 巳, 일지 辰, 시지 巳 (庚辰 일주)
    const t = lifeTimeline(birth);

    const at48 = t.periods.find(p => p.startAge === 48);
    expect(at48.ganZhi).toBe('丙戌');
    expect(at48.stage).toBe('쇠');
    expect(at48.natalRelations).toContainEqual({ type: '충', pos: '일', zhi: '辰' });

    const at18 = t.periods.find(p => p.startAge === 18);
    expect(at18.ganZhi).toBe('癸未');
    expect(at18.stage).toBe('관대');
    expect(at18.natalRelations).toContainEqual({ type: '육합', pos: '년', zhi: '午', el: '화' });
  });
});
