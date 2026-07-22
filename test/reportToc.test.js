// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { runEngine } from '../src/engine.js';
import { renderReport } from '../src/report.js';
import { bindReportToc } from '../src/reportToc.js';

describe('bindReportToc', () => {
  it('TOC 클릭 시 해당 그룹의 details가 열리고 스크롤 호출', () => {
    const result = runEngine({ birth:{year:1990,month:5,day:15,hour:10,calendar:'solar',gender:'male'}, mbti:'ENTJ', blood:'O' });
    document.body.innerHTML = renderReport(result);
    bindReportToc(document.body);
    const zodiacCard = document.querySelector('.card[data-group="personality"]');
    expect(zodiacCard.open).toBe(false);
    zodiacCard.scrollIntoView = () => {}; // jsdom엔 실제 스크롤이 없으므로 존재만 확인
    document.querySelectorAll('.toc-chip').forEach(b => { b.scrollIntoView = () => {}; });
    document.querySelectorAll('[data-group]').forEach(el => { el.scrollIntoView = () => {}; });
    const chip = document.querySelector('.toc-chip[data-group="personality"]');
    chip.click();
    expect(document.getElementById(zodiacCard.id).open).toBe(true);
  });
});
