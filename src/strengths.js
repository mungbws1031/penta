import { TRAITS_LOOKUP } from './zodiac.js';

const has = (c, ...keys) => keys.some(k => (c[k] || 0) > 0);
const mb = (t, ...letters) => letters.every(l => String(t).toUpperCase().includes(l));
const mbAny = (t, ...letters) => letters.some(l => String(t).toUpperCase().includes(l));

// 각 강점: [이름, saju술어, mbti술어, zodiac술어]
const STRENGTHS = [
  ['논리',     c => has(c,'정관','편관'),       t => mbAny(t,'T') ,                z => z.element==='공기' || z.sign==='처녀자리'],
  ['언어',     c => has(c,'식신','상관'),       t => mb(t,'N','F') || mbAny(t,'E'),z => ['쌍둥이자리','사수자리'].includes(z.sign)],
  ['공간',     c => has(c,'편인'),             t => mb(t,'S','P'),                z => z.element==='흙'],
  ['신체',     c => has(c,'비견','겁재'),       t => mb(t,'S','P'),                z => z.element==='불' || z.modality==='활동'],
  ['음악',     c => has(c,'식신','상관'),       t => mbAny(t,'F'),                z => z.element==='물' || ['황소자리','천칭자리'].includes(z.sign)],
  ['대인',     c => has(c,'식신','상관','정재','편재'), t => mb(t,'E','F'),       z => z.element==='공기' || z.modality==='활동'],
  ['자기성찰', c => has(c,'정인','편인'),       t => mb(t,'I','N'),                z => z.element==='물' || z.sign==='물고기자리'],
  ['자연',     c => has(c,'정인','편인','정관'), t => mb(t,'S','P'),               z => z.element==='흙'],
  ['창의',     c => has(c,'상관','편인'),       t => mb(t,'N','P'),                z => z.element==='불' || z.element==='물'],
  ['실행력',   c => has(c,'비견','겁재','편관'), t => mbAny(t,'J') && mbAny(t,'T','E'), z => z.modality==='활동' || z.element==='불'],
  ['직관',     c => has(c,'편인','편관'),       t => mb(t,'N','F'),                z => z.element==='물' || z.element==='불'],
  ['분석',     c => has(c,'정관','정인'),       t => mb(t,'T','J'),                z => z.element==='흙' || z.element==='공기'],
];

export function strengthCounts({ sajuCounts, mbti, sign }) {
  const z = { sign, ...TRAITS_LOOKUP[sign] };
  return STRENGTHS.map(([name, sajuFn, mbtiFn, zFn]) => {
    const systems = [];
    if (sajuFn(sajuCounts)) systems.push('사주');
    if (mbtiFn(mbti)) systems.push('MBTI');
    if (zFn(z)) systems.push('별자리');
    return { name, count: systems.length, systems };
  });
}
