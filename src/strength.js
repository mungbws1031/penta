// 신강·신약 판정(지장간 가중) + 용신(用神) 도출 — 억부법(抑扶法)
import { GAN_ELEMENT as GAN_EL, ZHI_HIDDEN, SHENG, KE } from './ganzhi.js';

const POS_WEIGHT = [1.0, 0.35, 0.2]; // 정기 / 중기 / 여기

const genOf = d => Object.keys(SHENG).find(k => SHENG[k] === d); // 인성(생아)
const keOf  = d => Object.keys(KE).find(k => KE[k] === d);       // 관성(극아)

export const TENGOD_GROUP = {
  비견:'비겁', 겁재:'비겁', 식신:'식상', 상관:'식상',
  편재:'재성', 정재:'재성', 편관:'관성', 정관:'관성', 편인:'인성', 정인:'인성',
};

// 조후(調候) — 월지(계절)별 기후 보정 필요 오행
const JOHU = {
  '寅':{ season:'초봄(寅月)', need:null, note:'추위가 덜 가셔 온기가 반갑지만, 기후는 대체로 온화해 억부가 우선이다.' },
  '卯':{ season:'한봄(卯月)', need:null, note:'기후가 온화해 조후보다 강약(억부) 조절이 우선이다.' },
  '辰':{ season:'늦봄(辰月)', need:null, note:'기후가 안정돼 억부가 용신을 주도한다.' },
  '巳':{ season:'초여름(巳月)', need:'수', urgent:false, note:'열기가 오르기 시작해 물(水)이 반가워진다.' },
  '午':{ season:'한여름(午月)', need:'수', urgent:true,  note:'불볕더위 — 물(水)이 가장 시급한 조후용신이다.' },
  '未':{ season:'늦여름(未月)', need:'수', urgent:true,  note:'무덥고 건조해 물(水)로 식히고 적셔야 한다.' },
  '申':{ season:'초가을(申月)', need:null, note:'기후가 안정돼 억부가 용신을 주도한다.' },
  '酉':{ season:'한가을(酉月)', need:null, note:'기후가 안정돼 억부가 용신을 주도한다.' },
  '戌':{ season:'늦가을(戌月)', need:'수', urgent:false, note:'건조해지는 때라 물(水)이 윤기를 더한다.' },
  '亥':{ season:'초겨울(亥月)', need:'화', urgent:false, note:'추위가 시작돼 온기(火)가 귀해진다.' },
  '子':{ season:'한겨울(子月)', need:'화', urgent:true,  note:'엄동설한 — 불(火)이 가장 시급한 조후용신이다.' },
  '丑':{ season:'늦겨울(丑月)', need:'화', urgent:true,  note:'얼어붙은 땅 — 따뜻한 불(火)이 절실하다.' },
};

// 일간 오행 기준으로 다른 오행이 아군(돕는)인지 적군(빼는)인지
function relationToDay(dayEl, el) {
  if (el === dayEl) return '비겁';
  if (el === genOf(dayEl)) return '인성';
  if (el === SHENG[dayEl]) return '식상';
  if (el === KE[dayEl]) return '재성';
  return '관성'; // keOf(dayEl)
}

export function analyzeStrength(sajuDetail) {
  const p = sajuDetail?.pillars;
  const dayEl = p?.day?.ganEl;
  if (!p || !dayEl) return null;

  // 오행별 가중 점수 집계 (일간 자신은 주체이므로 제외)
  const elScore = { 목:0, 화:0, 토:0, 금:0, 수:0 };
  const addEl = (el, w) => { if (el && elScore[el] !== undefined) elScore[el] += w; };

  // 천간(일간 제외): 년간·월간·시간 — 노출천간 가중 1.0
  [p.year?.gan, p.month?.gan, p.time?.gan].forEach(g => { if (g) addEl(GAN_EL[g], 1.0); });

  // 지지: 지장간 분배 × 자리 가중(월지 최대, 일지 다음)
  const branchWeight = { year: 1.0, month: 2.6, day: 1.3, time: 1.0 };
  [['year', p.year], ['month', p.month], ['day', p.day], ['time', p.time]].forEach(([k, pil]) => {
    if (!pil?.zhi) return;
    const hid = ZHI_HIDDEN[pil.zhi] || [];
    hid.forEach((g, i) => addEl(GAN_EL[g], (POS_WEIGHT[i] ?? 0.2) * branchWeight[k]));
  });

  // 아군(비겁+인성) vs 적군(식상+재성+관성)
  let supportW = 0, drainW = 0;
  Object.entries(elScore).forEach(([el, w]) => {
    const rel = relationToDay(dayEl, el);
    if (rel === '비겁' || rel === '인성') supportW += w;
    else drainW += w;
  });
  const total = supportW + drainW || 1;
  const strongPct = Math.round(supportW / total * 100);

  // 월령(月令) 득령 여부 — 월지 정기로 판정
  const monthMainGan = (ZHI_HIDDEN[p.month?.zhi] || [])[0];
  const monthMainEl = monthMainGan ? GAN_EL[monthMainGan] : null;
  let deukRyeong = null;
  if (monthMainEl) {
    const rel = relationToDay(dayEl, monthMainEl);
    deukRyeong = (rel === '비겁' || rel === '인성');
  }

  let level;
  if (strongPct >= 66) level = '태강';
  else if (strongPct >= 55) level = '신강';
  else if (strongPct >= 46) level = '중화';
  else if (strongPct >= 35) level = '신약';
  else level = '태약';

  const isStrong = strongPct >= 55;
  const isWeak = strongPct <= 45;
  const balanced = !isStrong && !isWeak;

  const biEl = dayEl, inEl = genOf(dayEl), sikEl = SHENG[dayEl], jaeEl = KE[dayEl], gwanEl = keOf(dayEl);
  // 오행별 가중을 십신 그룹 세력으로 환산 (억부 원인 판별용)
  const gW = {
    비겁: elScore[biEl] || 0, 인성: elScore[inEl] || 0,
    식상: elScore[sikEl] || 0, 재성: elScore[jaeEl] || 0, 관성: elScore[gwanEl] || 0,
  };

  let yongGroups = [], giGroups = [], giEls = [];
  let eokbuGroup = null, eokbuEl = null, eokbuReason = '';

  if (isStrong) {
    yongGroups = ['식상', '재성', '관성']; giGroups = ['비겁', '인성']; giEls = [biEl, inEl];
    // 강해진 원인: 인성과다 → 재성(재극인) / 비겁과다 → 식상(설기)
    if (gW.인성 >= gW.비겁) { eokbuGroup = '재성'; eokbuEl = jaeEl; eokbuReason = '인성이 과해 강해진 구조라, 그 인성을 눌러주는 재성(財星)이 약이 된다'; }
    else { eokbuGroup = '식상'; eokbuEl = sikEl; eokbuReason = '비겁이 과해 강해진 구조라, 그 힘을 자연스레 흘려보내는 식상(食傷)이 약이 된다'; }
  } else if (isWeak) {
    yongGroups = ['비겁', '인성']; giGroups = ['식상', '재성', '관성']; giEls = [sikEl, jaeEl, gwanEl];
    // 약해진 원인: 재성과다 → 비겁 / 관살·식상과다 → 인성
    if (gW.재성 >= gW.관성 && gW.재성 >= gW.식상) { eokbuGroup = '비겁'; eokbuEl = biEl; eokbuReason = '재성이 과해 약해진 구조라, 힘을 보태주는 비겁(比劫)이 약이 된다'; }
    else { eokbuGroup = '인성'; eokbuEl = inEl; eokbuReason = (gW.관성 >= gW.식상 ? '관살이 강해 눌린 구조라, 그 기운을 나에게로 돌려주는 인성(印星)이 약이 된다' : '식상이 과해 빠진 구조라, 그것을 제어하며 나를 살리는 인성(印星)이 약이 된다'); }
  } else {
    // 중화 — 가장 약한 오행 보충
    const sorted = Object.entries(elScore).sort((a, b) => a[1] - b[1]);
    eokbuEl = sorted[0]?.[0] || dayEl;
    eokbuReason = '균형이 좋아 특정 기운에 매이지 않으니, 가장 비어 있는 오행을 보충하면 흐름이 매끄러워진다';
  }

  // 조후(調候) — 계절 기후 보정
  const monthZhi = p.month?.zhi;
  const jh = JOHU[monthZhi] || null;
  const johuEl = jh?.need || null;
  const johuUrgent = !!jh?.urgent;

  // 종합 — 억부 × 조후
  let primaryYong = eokbuEl, primaryBasis = balanced ? '중화 보충' : '억부(抑扶)';
  if (johuEl) {
    if (johuEl === eokbuEl) primaryBasis = '억부·조후 일치';
    else if (johuUrgent) { primaryYong = johuEl; primaryBasis = '조후(調候) 우선'; }
  }
  const yongEls = [...new Set([primaryYong, eokbuEl, johuEl].filter(Boolean))];

  return {
    dayEl, level, deukRyeong, strongPct,
    support: Math.round(supportW * 10) / 10, drain: Math.round(drainW * 10) / 10,
    biEl, inEl, sikEl, jaeEl, gwanEl,
    isStrong, isWeak, balanced,
    yongGroups, yongEls, giGroups, giEls,
    eokbuGroup, eokbuEl, eokbuReason,
    johuEl, johuUrgent, johuSeason: jh?.season || null, johuNote: jh?.note || null,
    primaryYong, primaryBasis,
  };
}
