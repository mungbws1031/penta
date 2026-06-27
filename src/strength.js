// 신강·신약 판정(지장간 가중) + 용신(用神) 도출 — 억부법(抑扶法)
const GAN_EL = {
  '甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토',
  '庚':'금','辛':'금','壬':'수','癸':'수',
};
// 지장간(藏干) — [정기, 중기, 여기] 순. 월률분야 간략판.
const ZHI_HIDDEN = {
  '子':['癸'], '丑':['己','癸','辛'], '寅':['甲','丙','戊'], '卯':['乙'],
  '辰':['戊','乙','癸'], '巳':['丙','庚','戊'], '午':['丁','己'], '未':['己','丁','乙'],
  '申':['庚','壬','戊'], '酉':['辛'], '戌':['戊','辛','丁'], '亥':['壬','甲'],
};
const POS_WEIGHT = [1.0, 0.35, 0.2]; // 정기 / 중기 / 여기

const SHENG = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };
const KE    = { 목:'토', 토:'수', 수:'화', 화:'금', 금:'목' };
const genOf = d => Object.keys(SHENG).find(k => SHENG[k] === d); // 인성(생아)
const keOf  = d => Object.keys(KE).find(k => KE[k] === d);       // 관성(극아)

export const TENGOD_GROUP = {
  비견:'비겁', 겁재:'비겁', 식신:'식상', 상관:'식상',
  편재:'재성', 정재:'재성', 편관:'관성', 정관:'관성', 편인:'인성', 정인:'인성',
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

  let yongGroups = [], yongEls = [], giGroups = [], giEls = [], primaryYong = null;
  if (isStrong) {
    yongGroups = ['식상', '재성', '관성']; yongEls = [sikEl, jaeEl, gwanEl];
    giGroups = ['비겁', '인성'];            giEls = [biEl, inEl];
    primaryYong = jaeEl;
  } else if (isWeak) {
    yongGroups = ['비겁', '인성']; yongEls = [biEl, inEl];
    giGroups = ['식상', '재성', '관성']; giEls = [sikEl, jaeEl, gwanEl];
    primaryYong = inEl;
  } else {
    // 중화 — 가장 약한 오행 보충
    const sorted = Object.entries(elScore).sort((a, b) => a[1] - b[1]);
    primaryYong = sorted[0]?.[0] || dayEl;
    yongEls = [primaryYong];
  }

  return {
    dayEl, level, deukRyeong, strongPct,
    support: Math.round(supportW * 10) / 10, drain: Math.round(drainW * 10) / 10,
    biEl, inEl, sikEl, jaeEl, gwanEl,
    isStrong, isWeak, balanced,
    yongGroups, yongEls, giGroups, giEls, primaryYong,
  };
}
