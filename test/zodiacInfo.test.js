import { describe, it, expect } from 'vitest';
import { zodiacDetail } from '../src/zodiacInfo.js';

describe('zodiacDetail', () => {
  it('원소/모드/양음 + 라벨 + 성향 설명 반환', () => {
    const d = zodiacDetail('양자리');
    expect(d.element).toBe('불');
    expect(d.modality).toBe('활동');
    expect(d.polarity).toBe('양');
    expect(d.elementLabel).toContain('불');
    expect(d.modalityLabel).toContain('활동궁');
    expect(typeof d.blurb).toBe('string');
    expect(d.blurb.length).toBeGreaterThan(5);
  });
  it('12궁 모두 blurb가 있다', () => {
    const signs = ['양자리','황소자리','쌍둥이자리','게자리','사자자리','처녀자리','천칭자리','전갈자리','사수자리','염소자리','물병자리','물고기자리'];
    signs.forEach(s => expect(zodiacDetail(s).blurb).toBeTruthy());
  });
  it('알 수 없는 궁 → null', () => {
    expect(zodiacDetail('없음')).toBe(null);
  });
});
