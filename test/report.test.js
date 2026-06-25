import { describe, it, expect } from 'vitest';
import { renderReport } from '../src/report.js';
import { runEngine } from '../src/engine.js';
import { drawThree } from '../src/tarot.js';

const result = runEngine({
  birth: { year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' },
  mbti: 'ENTJ', blood: 'O', selectedStrengths: ['논리','실행력','분석'],
});

describe('renderReport', () => {
  it('★ 배지와 축 라벨을 포함한다', () => {
    const html = renderReport(result);
    expect(html).toContain('에너지');
    expect(html).toMatch(/[★☆]/);
  });
  it('재미용 고지를 항상 포함', () => {
    expect(renderReport(result)).toContain('재미용');
  });
  it('시주 미상이면 고지 노출', () => {
    const r = runEngine({ birth:{ year:1990,month:5,day:15,hour:null,calendar:'solar',gender:'male' }, mbti:'ENTJ', blood:'O', selectedStrengths:['논리'] });
    expect(renderReport(r)).toContain('시주');
  });
  it('별자리 상세 섹션을 포함한다', () => {
    const html = renderReport(result);
    expect(html).toContain('별자리');
    expect(html).toContain('zodiac-card');
  });
  it('spread 전달 시 타로 시간축 섹션 포함, 없으면 미포함', () => {
    const spread = drawThree(() => 0.3);
    const withTarot = renderReport(result, spread);
    expect(withTarot).toContain('타로 시간축');
    expect(withTarot).toContain('과거');
    expect(renderReport(result)).not.toContain('타로 시간축');
  });
});
