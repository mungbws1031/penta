import { describe, it, expect } from 'vitest';
import { renderReport } from '../src/report.js';
import { runEngine } from '../src/engine.js';
import { drawThree } from '../src/tarot.js';

const result = runEngine({
  birth: { year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' },
  mbti: 'ENTJ', blood: 'O', name: '홍길동',
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
    const r = runEngine({ birth:{ year:1990,month:5,day:15,hour:null,calendar:'solar',gender:'male' }, mbti:'ENTJ', blood:'O' });
    expect(renderReport(r)).toContain('시주');
  });
  it('이름 주면 성명학 섹션 포함, 없으면 미포함', () => {
    // 성명학 카드 헤딩으로 판별 (근거 노트 등 다른 곳의 '성명학' 단어와 구분)
    expect(renderReport(result)).toContain('<h3>성명학');
    const noName = runEngine({ birth:{ year:1990,month:5,day:15,hour:10,calendar:'solar',gender:'male' }, mbti:'ENTJ', blood:'O' });
    expect(renderReport(noName)).not.toContain('<h3>성명학');
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
  it('MBTI 카드는 유효한 MBTI일 때만 렌더', () => {
    const withMbti = runEngine({ birth:{year:1990,month:5,day:15,hour:10,calendar:'solar',gender:'male'}, mbti:'ENTJ', blood:'O' });
    expect(renderReport(withMbti)).toContain('MBTI 16유형');
    const noMbti = runEngine({ birth:{year:1990,month:5,day:15,hour:10,calendar:'solar',gender:'male'}, mbti:'', blood:'O' });
    expect(renderReport(noMbti)).not.toContain('MBTI 16유형');
  });
  it('혈액형 카드는 유효한 혈액형일 때만 렌더', () => {
    const withBlood = runEngine({ birth:{year:1990,month:5,day:15,hour:10,calendar:'solar',gender:'male'}, mbti:'ENTJ', blood:'O' });
    expect(renderReport(withBlood)).toContain('혈액형 성격 통설');
  });
});
