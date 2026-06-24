import { sajuDayElement } from './saju.js';
import { sunSign } from './zodiac.js';
import { TRAITS_LOOKUP } from './zodiac.js';

// ===== 사주 오행 상생상극 =====
const SHENG = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' }; // A 생 B
const KE = { 목:'토', 토:'수', 수:'화', 화:'금', 금:'목' };     // A 극 B

function elementRelation(a, b) {
  if (!a || !b) return { score: 60, verdict: '중립', note: '오행 정보 부족' };
  if (a === b) return { score: 72, verdict: '중립', note: `같은 오행(${a}) — 닮은 결, 편하지만 자극은 적음` };
  if (SHENG[a] === b || SHENG[b] === a) return { score: 88, verdict: '합', note: `오행 상생(${a}·${b}) — 서로 북돋움` };
  if (KE[a] === b || KE[b] === a) return { score: 42, verdict: '충', note: `오행 상극(${a}·${b}) — 긴장과 자극 공존` };
  return { score: 65, verdict: '중립', note: '무난한 오행 조합' };
}

// ===== MBTI 보완 =====
function mbtiCompat(a, b) {
  const valid = /^[EI][NS][TF][JP]$/;
  const A = String(a).toUpperCase(), B = String(b).toUpperCase();
  if (!valid.test(A) || !valid.test(B)) return { score: 60, verdict: '중립', note: 'MBTI 정보 부족' };
  const eiOpp = A[0] !== B[0];
  const nsSame = A[1] === B[1];
  const tfSame = A[2] === B[2];
  const jpOpp = A[3] !== B[3];
  let score = 50 + (eiOpp ? 12 : 6) + (nsSame ? 16 : 2) + (tfSame ? 10 : 4) + (jpOpp ? 12 : 6);
  score = Math.min(score, 100);
  const verdict = score >= 80 ? '합' : '중립';
  const note = nsSame ? '인식 방식이 비슷해 말이 통함' : '인식 차이로 새로움을 배움';
  return { score, verdict, note };
}

// ===== 별자리 원소 궁합 =====
const PAIR = (x, y) => (a, b) => (a === x && b === y) || (a === y && b === x);
const isHarmony = (a, b) => a === b || PAIR('불', '공기')(a, b) || PAIR('흙', '물')(a, b);
const isTension = (a, b) => PAIR('불', '물')(a, b) || PAIR('공기', '흙')(a, b);

function zodiacCompat(signA, signB) {
  const eA = TRAITS_LOOKUP[signA]?.element;
  const eB = TRAITS_LOOKUP[signB]?.element;
  if (!eA || !eB) return { score: 60, verdict: '중립', note: '별자리 정보 부족' };
  if (isHarmony(eA, eB)) return { score: 86, verdict: '합', note: `${eA}·${eB} 원소 조화` };
  if (isTension(eA, eB)) return { score: 45, verdict: '충', note: `${eA}·${eB} 원소 긴장` };
  return { score: 62, verdict: '중립', note: `${eA}·${eB} 무난` };
}

// ===== 혈액형 통념(저비중) =====
const BLOOD = {
  A:  { A: 60, B: 45, O: 75, AB: 65 },
  B:  { A: 45, B: 60, O: 70, AB: 72 },
  O:  { A: 75, B: 70, O: 65, AB: 60 },
  AB: { A: 65, B: 72, O: 60, AB: 62 },
};
function bloodCompat(a, b) {
  const A = String(a).toUpperCase(), B = String(b).toUpperCase();
  const score = BLOOD[A]?.[B] ?? 60;
  const verdict = score >= 72 ? '합' : score <= 48 ? '충' : '중립';
  return { score, verdict, note: `혈액형 통념 ${A}·${B}` };
}

const WEIGHT = { 사주: 0.35, MBTI: 0.30, 별자리: 0.25, 혈액형: 0.10 };

// personA, personB: { birth, mbti, blood }
export function analyzeCompat(personA, personB) {
  const saju = elementRelation(sajuDayElement(personA.birth), sajuDayElement(personB.birth));
  const mbti = mbtiCompat(personA.mbti, personB.mbti);
  const signA = sunSign(personA.birth.month, personA.birth.day);
  const signB = sunSign(personB.birth.month, personB.birth.day);
  const zodiac = zodiacCompat(signA, signB);
  const blood = bloodCompat(personA.blood, personB.blood);

  const systems = [
    { name: '사주', ...saju },
    { name: 'MBTI', ...mbti },
    { name: '별자리', ...zodiac },
    { name: '혈액형', ...blood },
  ];

  const totalPercent = Math.round(
    systems.reduce((sum, s) => sum + WEIGHT[s.name] * s.score, 0)
  );

  const goodPoints = systems.filter(s => s.verdict === '합').map(s => `${s.name}: ${s.note}`);
  const frictionPoints = systems.filter(s => s.verdict === '충').map(s => `${s.name}: ${s.note}`);

  return { totalPercent, systems, goodPoints, frictionPoints, signA, signB };
}
