import { TENGOD_GROUP } from './strength.js';

// 격국별 길운(성격)·흉운(파격) 십신 — gyeokguk.key 기준
export const GYEOK_LUCK = {
  정관: { good: ['정재', '편재', '정인', '편인'], bad: ['상관'] },        // 재생관·관인상생 / 상관견관
  편관: { good: ['식신', '정인', '편인'], bad: ['편재', '정재'] },        // 식신제살·살인상생 / 재생살
  정재: { good: ['식신', '상관', '정관'], bad: ['비견', '겁재'] },        // 식상생재·재생관 / 군겁쟁재
  편재: { good: ['식신', '상관', '정관', '편관'], bad: ['비견', '겁재'] },
  식신: { good: ['정재', '편재'], bad: ['편인'] },                        // 식신생재 / 효신탈식
  상관: { good: ['정재', '편재', '정인'], bad: ['정관'] },                // 상관생재·상관패인 / 상관견관
  정인: { good: ['정관', '편관'], bad: ['정재', '편재'] },                // 관인상생 / 재극인
  편인: { good: ['정재', '편재'], bad: ['식신'] },                        // 재제편인 / 효신탈식
  건록: { good: ['정재', '편재', '정관', '편관', '식신', '상관'], bad: ['비견', '겁재'] },
  양인: { good: ['편관', '정관', '식신', '상관'], bad: ['비견', '겁재'] }, // 양인가살
};

// 운(대운·세운·월운)의 십신을 이 사주의 용신·격국 기준으로 길흉 평가
// ctx: { strength, gyeokguk }
export function scoreLuck(tenGod, base, ctx, daily = false) {
  let score = base;
  const tags = [];
  const grp = TENGOD_GROUP[tenGod];
  const s = ctx?.strength, g = ctx?.gyeokguk;

  if (s?.yongGroups?.length) {
    if (s.yongGroups.includes(grp)) { score += 13; tags.push('용신'); }
    else if (s.giGroups.includes(grp)) { score -= 11; tags.push('기신'); }
  }
  if (g && GYEOK_LUCK[g.key]) {
    const gl = GYEOK_LUCK[g.key];
    if (gl.good.includes(tenGod)) { score += 7; tags.push('성격'); }
    else if (gl.bad.includes(tenGod)) { score -= 10; tags.push('파격'); }
  }
  score = Math.max(20, Math.min(95, Math.round(score)));

  // 표시용 노트 — 용신/기신(억부·조후) 우선, 그다음 격국 성격/파격
  let note = null, noteKind = null;
  if (tags.includes('용신')) {
    noteKind = 'good';
    note = daily ? '🟢 용신(用神)이 드는 날 — 평소보다 일이 순하게 풀린다.'
                 : '🟢 용신운(用神運) — 보약 같은 기운이 드는 길한 해다. 적극적으로 움직일 것.';
  } else if (tags.includes('기신')) {
    noteKind = 'bad';
    note = daily ? '🔴 기신(忌神) 기운이 강한 날 — 무리한 결정은 미루는 게 낫다.'
                 : '🔴 기신운(忌神運) — 넘치는 기운이 더해지는 해다. 욕심을 줄이고 지키는 데 집중할 것.';
  } else if (tags.includes('성격')) {
    noteKind = 'good';
    note = daily ? '🟢 격을 살리는 기운이 드는 날.'
                 : '🟢 성격운(成格運) — 격국을 살려 그릇이 제대로 발현되는 길운이다.';
  } else if (tags.includes('파격')) {
    noteKind = 'bad';
    note = daily ? '🔴 격을 흔드는 기운 — 핵심 결정은 신중히.'
                 : '🔴 파격운(破格運) — 사주의 격이 흔들리기 쉬운 해다. 무리수를 경계할 것.';
  }
  return { score, tags, note, noteKind };
}
