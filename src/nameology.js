// 성명학 — 한글 이름 초성의 소리오행(發音五行) 기반 (재미용, 한자 수리 미포함).
// ㄱㅋ=목, ㄴㄷㄹㅌ=화, ㅇㅎ=토, ㅅㅈㅊ=금, ㅁㅂㅍ=수

import { SHENG, KE } from './ganzhi.js';

const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const CHO_ELEMENT = {
  ㄱ:'목', ㅋ:'목', ㄲ:'목',
  ㄴ:'화', ㄷ:'화', ㄹ:'화', ㅌ:'화', ㄸ:'화',
  ㅇ:'토', ㅎ:'토',
  ㅅ:'금', ㅈ:'금', ㅊ:'금', ㅆ:'금', ㅉ:'금',
  ㅁ:'수', ㅂ:'수', ㅍ:'수', ㅃ:'수',
};

export function choseongOf(ch) {
  const code = ch.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return null; // 완성형 한글 음절 아님
  return CHO[Math.floor(code / 588)];
}

function relation(a, b) {
  if (a === b) return { relation: '비화', verdict: '안정', note: `같은 ${a} 기운이 모여 한 방향으로 단단하다` };
  if (SHENG[a] === b || SHENG[b] === a) return { relation: '상생', verdict: '길', note: `${a}·${b}가 서로 북돋우는 흐름` };
  return { relation: '상극', verdict: '주의', note: `${a}·${b}가 부딪히는 긴장` };
}

function sajuRelation(elements, dayElement) {
  if (!dayElement) return null;
  const supports = [...new Set(elements.filter(e => SHENG[e] === dayElement))];
  const controls = [...new Set(elements.filter(e => KE[e] === dayElement))];
  const same = elements.filter(e => e === dayElement);
  if (supports.length) return { dayElement, verdict: '길', note: `이름의 ${supports.join('·')} 기운이 일간 ${dayElement}을(를) 생(生)하여 북돋운다` };
  if (same.length) return { dayElement, verdict: '강화', note: `이름에 일간과 같은 ${dayElement} 기운이 있어 본바탕을 더 단단히 한다` };
  if (controls.length) return { dayElement, verdict: '주의', note: `이름의 ${controls.join('·')} 기운이 일간 ${dayElement}을(를) 극(剋)해 다소 긴장을 준다` };
  return { dayElement, verdict: '평이', note: `이름과 일간이 직접 생극 없이 무난하다` };
}

// name: 한글 이름 문자열, dayElement: 사주 일간 오행(옵션)
export function analyzeName(name, dayElement) {
  const syllables = [];
  for (const ch of String(name)) {
    const cho = choseongOf(ch);
    if (cho) syllables.push({ char: ch, choseong: cho, element: CHO_ELEMENT[cho] });
  }
  if (!syllables.length) return null;

  const elements = syllables.map(s => s.element);
  const flow = [];
  for (let i = 1; i < elements.length; i++) {
    flow.push({ from: elements[i - 1], to: elements[i], ...relation(elements[i - 1], elements[i]) });
  }
  const saju = sajuRelation(elements, dayElement);

  let score = 55;
  flow.forEach(f => { score += f.relation === '상생' ? 12 : f.relation === '상극' ? -8 : 4; });
  if (saju) score += saju.verdict === '길' ? 15 : saju.verdict === '강화' ? 8 : saju.verdict === '주의' ? -8 : 0;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return { raw: String(name), syllables, elements, flow, sajuRelation: saju, score };
}
