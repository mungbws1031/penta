// 신강·신약 판정 + 용신(用神) 도출 — 억부법(抑扶法) 기준 간략 추정
const SHENG = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };
const KE    = { 목:'토', 토:'수', 수:'화', 화:'금', 금:'목' };
const genOf = d => Object.keys(SHENG).find(k => SHENG[k] === d); // 나를 생하는 오행(인성)
const keOf  = d => Object.keys(KE).find(k => KE[k] === d);       // 나를 극하는 오행(관성)

// 십신 → 그룹 (운세 연동용)
export const TENGOD_GROUP = {
  비견:'비겁', 겁재:'비겁', 식신:'식상', 상관:'식상',
  편재:'재성', 정재:'재성', 편관:'관성', 정관:'관성', 편인:'인성', 정인:'인성',
};

export function analyzeStrength(sajuDetail) {
  const dayEl = sajuDetail?.pillars?.day?.ganEl;
  const oh = sajuDetail?.ohaeng;
  const monthEl = sajuDetail?.pillars?.month?.zhiEl;
  if (!dayEl || !oh) return null;

  const biEl = dayEl;           // 비겁
  const inEl = genOf(dayEl);    // 인성(생아)
  const sikEl = SHENG[dayEl];   // 식상(아생)
  const jaeEl = KE[dayEl];      // 재성(아극)
  const gwanEl = keOf(dayEl);   // 관성(극아)

  const support = (oh[biEl] || 0) + (oh[inEl] || 0);                       // 아군
  const drain   = (oh[sikEl] || 0) + (oh[jaeEl] || 0) + (oh[gwanEl] || 0); // 적군

  // 월령(月令)은 사주에서 가장 비중이 큰 자리 — 가중치 부여
  let score = support - drain;
  let deukRyeong = null;
  if (monthEl === biEl || monthEl === inEl) { score += 2; deukRyeong = true; }
  else if (monthEl === sikEl || monthEl === jaeEl || monthEl === gwanEl) { score -= 2; deukRyeong = false; }

  let level;
  if (score >= 3) level = '태강';
  else if (score >= 1) level = '신강';
  else if (score <= -3) level = '태약';
  else if (score <= -1) level = '신약';
  else level = '중화';

  const isStrong = score >= 1;
  const isWeak = score <= -1;
  const balanced = !isStrong && !isWeak;

  let yongGroups = [], yongEls = [], giGroups = [], giEls = [], primaryYong = null;
  if (isStrong) {
    // 강하니 덜어낸다 — 재관식이 용신
    yongGroups = ['식상', '재성', '관성']; yongEls = [sikEl, jaeEl, gwanEl];
    giGroups = ['비겁', '인성'];            giEls = [biEl, inEl];
    primaryYong = jaeEl; // 대표: 재성(내가 다스리는 재물)
  } else if (isWeak) {
    // 약하니 보탠다 — 인비가 용신
    yongGroups = ['비겁', '인성']; yongEls = [biEl, inEl];
    giGroups = ['식상', '재성', '관성']; giEls = [sikEl, jaeEl, gwanEl];
    primaryYong = inEl; // 대표: 인성(나를 살리는 생조)
  } else {
    // 중화 — 가장 비어 있는 오행 보충
    const sorted = Object.entries(oh).sort((a, b) => a[1] - b[1]);
    primaryYong = sorted[0]?.[0] || dayEl;
    yongEls = [primaryYong];
  }

  return {
    dayEl, score, level, deukRyeong, support, drain,
    biEl, inEl, sikEl, jaeEl, gwanEl,
    isStrong, isWeak, balanced,
    yongGroups, yongEls, giGroups, giEls, primaryYong,
  };
}
