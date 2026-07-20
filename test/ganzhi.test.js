import { describe, it, expect } from 'vitest';
import {
  GAN_ELEMENT, ZHI_ELEMENT, ZHI_HIDDEN, GAN_KO, ZHI_KO, ZHI_ANIMAL,
  SHENG, KE, EL_KO, EL_HANJA, GANHAP, YUKHAP, SAMHAP_GROUPS, CHUNG_PAIRS,
} from '../src/ganzhi.js';

const ZHI_12 = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const GAN_10 = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const EL_5 = ['목','화','토','금','수'];

describe('ZHI_HIDDEN', () => {
  it('12지지 전부가 키로 존재한다', () => {
    expect(Object.keys(ZHI_HIDDEN).sort()).toEqual([...ZHI_12].sort());
  });

  it('각 지지의 지장간 배열이 비어있지 않다', () => {
    ZHI_12.forEach(z => {
      expect(Array.isArray(ZHI_HIDDEN[z])).toBe(true);
      expect(ZHI_HIDDEN[z].length).toBeGreaterThan(0);
    });
  });
});

describe('SHENG / KE', () => {
  it('SHENG이 5개 오행을 모두 키로 갖는다', () => {
    expect(Object.keys(SHENG).sort()).toEqual([...EL_5].sort());
  });

  it('KE가 5개 오행을 모두 키로 갖는다', () => {
    expect(Object.keys(KE).sort()).toEqual([...EL_5].sort());
  });

  it('SHENG(상생)이 목→화→토→금→수→목 순환을 이룬다', () => {
    let cur = '목';
    const visited = [cur];
    for (let i = 0; i < 5; i++) {
      cur = SHENG[cur];
      visited.push(cur);
    }
    expect(visited).toEqual(['목','화','토','금','수','목']);
  });

  it('KE(상극)가 5개 오행을 한 바퀴 순환하며 중복 없이 돈다', () => {
    let cur = '목';
    const visited = new Set([cur]);
    for (let i = 0; i < 4; i++) {
      cur = KE[cur];
      visited.add(cur);
    }
    expect(visited.size).toBe(5);
    // 목에서 시작해 4번 이동 후 다시 목으로 돌아온다
    expect(KE[cur]).toBe('목');
  });
});

describe('GANHAP', () => {
  it('정확히 5쌍(甲己/乙庚/丙辛/丁壬/戊癸)을 갖는다', () => {
    expect(Object.keys(GANHAP).sort()).toEqual(
      ['甲己','乙庚','丙辛','丁壬','戊癸'].sort()
    );
  });

  it('각 쌍이 오행 값을 갖는다', () => {
    Object.values(GANHAP).forEach(el => {
      expect(EL_5).toContain(el);
    });
  });
});

describe('YUKHAP', () => {
  it('6쌍의 육합을 갖는다', () => {
    expect(Object.keys(YUKHAP)).toHaveLength(6);
  });
});

describe('SAMHAP_GROUPS', () => {
  it('4개 그룹으로 구성된다', () => {
    expect(SAMHAP_GROUPS).toHaveLength(4);
  });

  it('각 그룹이 3개의 지지(m)로 구성되고 king이 그 안에 포함된다', () => {
    SAMHAP_GROUPS.forEach(g => {
      expect(g.m).toHaveLength(3);
      expect(g.m).toContain(g.king);
      expect(EL_5).toContain(g.el);
    });
  });
});

describe('CHUNG_PAIRS', () => {
  it('6쌍의 충(沖)을 갖는다', () => {
    expect(CHUNG_PAIRS).toHaveLength(6);
  });

  it('각 쌍이 지지 2개로 구성된다', () => {
    CHUNG_PAIRS.forEach(pair => {
      expect(pair).toHaveLength(2);
      pair.forEach(z => expect(ZHI_12).toContain(z));
    });
  });
});

describe('GAN_KO / ZHI_KO / ZHI_ANIMAL', () => {
  it('GAN_KO가 10개의 천간 키를 갖는다', () => {
    expect(Object.keys(GAN_KO).sort()).toEqual([...GAN_10].sort());
  });

  it('ZHI_KO가 12개의 지지 키를 갖는다', () => {
    expect(Object.keys(ZHI_KO).sort()).toEqual([...ZHI_12].sort());
  });

  it('ZHI_ANIMAL이 12개의 지지 키를 갖는다', () => {
    expect(Object.keys(ZHI_ANIMAL).sort()).toEqual([...ZHI_12].sort());
  });
});

describe('GAN_ELEMENT / ZHI_ELEMENT / EL_KO / EL_HANJA', () => {
  it('GAN_ELEMENT가 10개 천간 모두에 오행 값을 부여한다', () => {
    GAN_10.forEach(g => expect(EL_5).toContain(GAN_ELEMENT[g]));
  });

  it('ZHI_ELEMENT가 12개 지지 모두에 오행 값을 부여한다', () => {
    ZHI_12.forEach(z => expect(EL_5).toContain(ZHI_ELEMENT[z]));
  });

  it('EL_KO/EL_HANJA가 5개 오행 모두를 키로 갖는다', () => {
    expect(Object.keys(EL_KO).sort()).toEqual([...EL_5].sort());
    expect(Object.keys(EL_HANJA).sort()).toEqual([...EL_5].sort());
  });
});
