import { sajuSignals } from './saju.js';
import { analyzeSajuDetail } from './sajuDetail.js';
import { analyzeStrength } from './strength.js';
import { analyzeGyeokguk } from './gyeokguk.js';
import { GYEOK_LUCK } from './luckScore.js';
import { sunSign, TRAITS_LOOKUP } from './zodiac.js';
import { tenGod } from './fortune.js';

// ===== 오행 상생상극 =====
const SHENG = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };
const KE    = { 목:'토', 토:'수', 수:'화', 화:'금', 금:'목' };
const GAN_EL = { '甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수' };
const ZHI_KO = { '子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해' };
const EL_KO = { 목:'목(木)', 화:'화(火)', 토:'토(土)', 금:'금(金)', 수:'수(水)' };

// 천간합/충
const GANHAP = { '甲己':'토','己甲':'토','乙庚':'금','庚乙':'금','丙辛':'수','辛丙':'수','丁壬':'목','壬丁':'목','戊癸':'화','癸戊':'화' };
const GANCHUNG = new Set(['甲庚','庚甲','乙辛','辛乙','丙壬','壬丙','丁癸','癸丁']);

// 지지 관계
const YUKHAP = { '子丑':'토','寅亥':'목','卯戌':'화','辰酉':'금','巳申':'수','午未':'화' };
const SAMHAP = [['申','子','辰'], ['寅','午','戌'], ['巳','酉','丑'], ['亥','卯','未']];
const JICHUNG = [['子','午'],['丑','未'],['寅','申'],['卯','酉'],['辰','戌'],['巳','亥']];
const WONJIN = [['子','未'],['丑','午'],['寅','酉'],['卯','申'],['辰','亥'],['巳','戌']];
const HYEONG = [['寅','巳'],['巳','申'],['寅','申'],['丑','戌'],['戌','未'],['丑','未'],['子','卯']];

const zko = z => `${ZHI_KO[z]}(${z})`;
const pairIn = (list, a, b) => list.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
const sameSamhap = (a, b) => SAMHAP.some(g => g.includes(a) && g.includes(b));

function profile(p) {
  const counts = sajuSignals(p.birth).counts;
  const sd = analyzeSajuDetail(p.birth, counts);
  const st = analyzeStrength(sd);
  const gk = analyzeGyeokguk(sd, counts);
  return {
    gender: p.birth.gender, mbti: p.mbti, blood: p.blood,
    dayGan: sd.pillars.dayGan, dayGanEl: sd.pillars.day?.ganEl,
    dayZhi: sd.pillars.day?.zhi, ohaeng: sd.ohaeng || {},
    primaryYong: st?.primaryYong, level: st?.level,
    gyeokguk: gk,
    sign: sunSign(p.birth.month, p.birth.day),
  };
}

const band = (s, g, m, b) => (s >= 80 ? g : s <= 50 ? b : m);
const verdictOf = s => (s >= 78 ? '합' : s <= 52 ? '충' : '중립');

// ① 일간(日干) 천간 관계 — 두 사람의 본질이 만나는 방식
function ilganRel(a, b) {
  const A = a.dayGan, B = b.dayGan, ea = GAN_EL[A], eb = GAN_EL[B];
  if (GANHAP[A + B]) return { name: '일간 궁합', score: 90, verdict: '합',
    note: `두 일간 ${A}·${B}이 <b>천간합(化${GANHAP[A + B]})</b> — 본능적으로 끌려 묶이는, 강한 인연의 표시다. 떨어져 있어도 다시 만나는 자석 같은 사이.` };
  if (GANCHUNG.has(A + B)) return { name: '일간 궁합', score: 50, verdict: '충',
    note: `두 일간 ${A}·${B}이 <b>충(沖)</b> — 끌리면서도 부딪히는 긴장이 흐른다. 강렬하지만 주도권 다툼을 조율해야 오래간다.` };
  if (ea === eb) return { name: '일간 궁합', score: 72, verdict: '중립',
    note: `두 일간이 같은 <b>${ea} 기운</b> — 닮아서 편안하지만 비슷해서 자극은 적다. 친구 같은 동질감이 강점.` };
  if (SHENG[ea] === eb || SHENG[eb] === ea) return { name: '일간 궁합', score: 86, verdict: '합',
    note: `두 일간이 <b>상생(${ea}↔${eb})</b> — 한쪽이 다른 쪽을 북돋우는 관계. 함께 있을수록 서로 성장하는 결이다.` };
  return { name: '일간 궁합', score: 58, verdict: '중립',
    note: `두 일간이 <b>상극(${ea}↔${eb})</b> — 한쪽이 다른 쪽을 누르는 구도. 적절한 긴장은 약이 되지만 주도권 균형이 관건이다.` };
}

// ② 일지(日支)=배우자궁 관계 — 부부 인연의 핵심
function iljiRel(a, b) {
  const A = a.dayZhi, B = b.dayZhi;
  const tag = `${zko(A)}·${zko(B)}`;
  if (A !== B && sameSamhap(A, B)) return { name: '배우자궁', score: 92, verdict: '합',
    note: `배우자궁(일지)이 <b>삼합</b> 관계(${tag}) — 죽이 척척 맞는 찰떡 인연. 정서적 코드가 깊이 통한다.` };
  if (YUKHAP[A + B] || YUKHAP[B + A]) return { name: '배우자궁', score: 88, verdict: '합',
    note: `배우자궁이 <b>육합(六合)</b>(${tag}) — 서로 끌어당겨 묶이는 안정적 인연. 함께 있으면 마음이 놓인다.` };
  if (pairIn(JICHUNG, A, B)) return { name: '배우자궁', score: 40, verdict: '충',
    note: `배우자궁이 <b>충(沖)</b>(${tag}) — 가까울수록 부딪히기 쉬운 파란. 끌림은 강하나 거리 조절과 따로 또 같이가 필요하다.` };
  if (pairIn(WONJIN, A, B)) return { name: '배우자궁', score: 46, verdict: '충',
    note: `배우자궁이 <b>원진(怨嗔)</b>(${tag}) — 이유 없이 미웠다가도 끝내 못 떠나는 애증의 끌림. 가장 드라마틱한 인연.` };
  if (pairIn(HYEONG, A, B)) return { name: '배우자궁', score: 52, verdict: '중립',
    note: `배우자궁이 <b>형(刑)</b>(${tag}) — 서로를 갈고닦아 단련시키는 인연. 성장은 크지만 잔마찰을 다스려야 한다.` };
  if (A === B) return { name: '배우자궁', score: 70, verdict: '중립',
    note: `배우자궁이 같은 ${zko(A)} — 정서 코드가 비슷해 잘 통하지만, 닮은 약점도 함께 지닌다.` };
  return { name: '배우자궁', score: 64, verdict: '중립',
    note: `배우자궁(${tag})은 특별한 합·충 없이 무난하다. 큰 파란도 큰 끌림도 적은, 담백한 인연.` };
}

// ③ 오행 보완 — 상대가 내 용신(보약)을 지녔는가
function ohaengComplement(a, b) {
  const aNeed = a.primaryYong, bNeed = b.primaryYong;
  const bSupply = aNeed ? (b.ohaeng[aNeed] || 0) : 0;
  const aSupply = bNeed ? (a.ohaeng[bNeed] || 0) : 0;
  let score = 58;
  if (bSupply >= 2) score += 18; else if (bSupply === 1) score += 9;
  if (aSupply >= 2) score += 18; else if (aSupply === 1) score += 9;
  score = Math.min(95, score);
  const parts = [];
  if (aNeed) parts.push(bSupply >= 1
    ? `A에게 필요한 용신 <b>${EL_KO[aNeed]}</b>을(를) B가 ${bSupply}개 지녀 <b>채워준다</b>`
    : `A의 용신 <b>${EL_KO[aNeed]}</b>은 B에게 부족해 큰 보탬은 적다`);
  if (bNeed) parts.push(aSupply >= 1
    ? `B의 용신 <b>${EL_KO[bNeed]}</b>을(를) A가 ${aSupply}개 지녀 <b>채워준다</b>`
    : `B의 용신 <b>${EL_KO[bNeed]}</b>은 A에게 부족하다`);
  const mutual = bSupply >= 1 && aSupply >= 1;
  return { name: '오행 보완', score, verdict: verdictOf(score),
    note: `${parts.join('. ')}.${mutual ? ' <b>서로의 부족함을 메워주는 상호 보완형</b> — 함께일 때 더 온전해진다.' : ''}` };
}

// ④ 배우자성(配偶星) 십신 — 상대가 내게 어떤 별인가
function spouseStar(a, b) {
  const gBtoA = tenGod(a.dayGan, b.dayGan); // B가 A에게
  const gAtoB = tenGod(b.dayGan, a.dayGan); // A가 B에게
  const isJae = g => g === '정재' || g === '편재';
  const isGwan = g => g === '정관' || g === '편관';
  function role(target, otherGod) {
    if (target.gender === 'male' && isJae(otherGod)) return `상대가 <b>재성(財星) — 아내의 별</b>이라 전형적 배우자 인연, 끌림이 자연스럽다`;
    if (target.gender === 'female' && isGwan(otherGod)) return `상대가 <b>관성(官星) — 남편의 별</b>이라 의지하고 기대게 되는 배우자 인연이다`;
    const map = {
      정재:'상대가 안정적인 재성 — 챙기고 다스리게 되는 편안한 흐름', 편재:'상대가 활동적인 재성 — 설레고 자극되는 끌림',
      정관:'상대가 정관 — 나를 바로잡아 주는 듬직한 존재', 편관:'상대가 편관 — 긴장시키지만 성장시키는 강렬한 존재',
      식신:'상대가 식신 — 나를 편하게 풀어주고 챙겨주는 흐름', 상관:'상대가 상관 — 톡톡 튀게 자극하는 재미있는 존재',
      정인:'상대가 정인 — 기댈 언덕·스승처럼 품어주는 존재', 편인:'상대가 편인 — 묘하게 의지되는 독특한 존재',
      비견:'상대가 비견 — 친구처럼 대등하고 편한 사이', 겁재:'상대가 겁재 — 경쟁하듯 자극하는 동료 같은 사이',
    };
    return map[otherGod] || '';
  }
  const aView = role(a, gBtoA);
  const bView = role(b, gAtoB);
  const harmonious = isJae(gBtoA) || isGwan(gBtoA) || isJae(gAtoB) || isGwan(gAtoB);
  const score = harmonious ? 84 : 66;
  return { name: '배우자성', score, verdict: verdictOf(score),
    note: `A 시점 — ${aView}. B 시점 — ${bView}.`, aView, bView };
}

// ⑤ 격국 상호작용 — 상대가 내 그릇(격국)을 완성해주는가, 흔드는가
function gyeokgukRel(a, b) {
  const gkA = a.gyeokguk, gkB = b.gyeokguk;
  if (!gkA || !gkB) return { name: '격국 상호작용', score: 60, verdict: '중립', note: '격국 정보 부족' };

  const godBtoA = tenGod(a.dayGan, b.dayGan); // B의 일간이 A에게 맺는 관계
  const godAtoB = tenGod(b.dayGan, a.dayGan); // A의 일간이 B에게 맺는 관계
  const glA = GYEOK_LUCK[gkA.key], glB = GYEOK_LUCK[gkB.key];

  let score = 62;
  const notes = [];
  if (glA) {
    if (glA.good.includes(godBtoA)) {
      score += 16;
      notes.push(`B는 A의 <b>${gkA.name}(${gkA.hanja})</b>을 살리는 ${godBtoA} — 상대가 A라는 그릇을 완성시켜 주는 인연이다`);
    } else if (glA.bad.includes(godBtoA)) {
      score -= 13;
      notes.push(`B는 A의 <b>${gkA.name}</b>을 흔드는 ${godBtoA} — 서로 강하게 자극하지만 그만큼 관리가 필요한 관계다`);
    }
  }
  if (glB) {
    if (glB.good.includes(godAtoB)) {
      score += 16;
      notes.push(`A는 B의 <b>${gkB.name}(${gkB.hanja})</b>을 살리는 ${godAtoB} — A가 B라는 그릇을 완성시켜 주는 인연이다`);
    } else if (glB.bad.includes(godAtoB)) {
      score -= 13;
      notes.push(`A는 B의 <b>${gkB.name}</b>을 흔드는 ${godAtoB} — 서로 강하게 자극하지만 그만큼 관리가 필요한 관계다`);
    }
  }
  score = Math.max(30, Math.min(95, score));
  const note = notes.length
    ? notes.join('. ') + '.'
    : `두 사람의 격국(<b>${gkA.name}</b>·<b>${gkB.name}</b>)이 서로 크게 간섭하지 않는, 각자의 그릇을 지키는 무난한 조합이다.`;
  return { name: '격국 상호작용', score, verdict: verdictOf(score), note };
}

// MBTI
function mbtiCompat(a, b) {
  const valid = /^[EI][NS][TF][JP]$/;
  const A = String(a).toUpperCase(), B = String(b).toUpperCase();
  if (!valid.test(A) || !valid.test(B)) return { name: 'MBTI', score: 60, verdict: '중립', note: 'MBTI 정보 부족' };
  const eiOpp = A[0] !== B[0], nsSame = A[1] === B[1], tfSame = A[2] === B[2], jpOpp = A[3] !== B[3];
  let score = Math.min(100, 50 + (eiOpp ? 12 : 6) + (nsSame ? 16 : 2) + (tfSame ? 10 : 4) + (jpOpp ? 12 : 6));
  const bits = [];
  bits.push(nsSame ? '인식 방식(N/S)이 같아 말이 잘 통한다' : '인식 차이로 서로의 빈틈을 채워준다');
  bits.push(tfSame ? '판단 코드(T/F)가 비슷해 갈등 처리가 수월하다' : '머리와 가슴이 갈려 결정에서 부딪힐 수 있다');
  bits.push(eiOpp ? '외향·내향이 달라 에너지 균형이 좋다' : '에너지 방향이 같아 리듬이 맞는다');
  return { name: 'MBTI', score, verdict: verdictOf(score), note: bits.join('. ') + '.' };
}

// 별자리
const isHarmonyEl = (a, b) => a === b || (['불','공기'].includes(a) && ['불','공기'].includes(b)) || (['흙','물'].includes(a) && ['흙','물'].includes(b));
const isTensionEl = (a, b) => (a === '불' && b === '물') || (a === '물' && b === '불') || (a === '공기' && b === '흙') || (a === '흙' && b === '공기');
function zodiacCompat(signA, signB) {
  const eA = TRAITS_LOOKUP[signA]?.element, eB = TRAITS_LOOKUP[signB]?.element;
  if (!eA || !eB) return { name: '별자리', score: 60, verdict: '중립', note: '별자리 정보 부족' };
  if (isHarmonyEl(eA, eB)) return { name: '별자리', score: 84, verdict: '합', note: `${eA}·${eB} 원소가 잘 어울려 정서 호흡이 맞는다` };
  if (isTensionEl(eA, eB)) return { name: '별자리', score: 48, verdict: '충', note: `${eA}·${eB} 원소가 상충해 템포 차이가 난다` };
  return { name: '별자리', score: 64, verdict: '중립', note: `${eA}·${eB} 원소는 무난한 조합` };
}

// 혈액형 (통념·저비중)
const BLOOD = { A:{A:60,B:45,O:75,AB:65}, B:{A:45,B:60,O:70,AB:72}, O:{A:75,B:70,O:65,AB:60}, AB:{A:65,B:72,O:60,AB:62} };
function bloodCompat(a, b) {
  const A = String(a).toUpperCase(), B = String(b).toUpperCase();
  const score = BLOOD[A]?.[B] ?? 60;
  return { name: '혈액형', score, verdict: verdictOf(score), note: `혈액형 통념상 ${A}·${B} 조합` };
}

const WEIGHT = { '일간 궁합':0.16, '배우자궁':0.18, '오행 보완':0.16, '격국 상호작용':0.16, MBTI:0.16, 별자리:0.11, 혈액형:0.07 };

function domainText(label, s) {
  const m = {
    '연애 케미': band(s, '불꽃 튀는 강한 끌림. 함께 있으면 설렘이 끊이지 않는다.', '잔잔하게 데워지는 편안한 끌림.', '끌림보다 노력으로 가까워지는 사이.'),
    '결혼·안정': band(s, '오래 함께할 안정감이 탄탄한 조합. 현실의 파도에도 든든하다.', '서로 맞춰가며 단단해지는 결혼운.', '생활 방식 조율에 의식적 노력이 필요하다.'),
    '대화·소통': band(s, '말이 술술 통해 오해가 적다. 대화 자체가 즐거운 사이.', '대체로 통하지만 가끔 결이 어긋난다.', '표현 방식이 달라 소통에 번역이 필요하다.'),
    '가치관·방향': band(s, '바라보는 방향이 같아 함께 멀리 간다.', '큰 틀은 맞고 세부에서 조율이 필요하다.', '추구하는 가치가 달라 합의의 기술이 중요하다.'),
  };
  return m[label] || '';
}

export function analyzeCompat(personA, personB) {
  const a = profile(personA), b = profile(personB);

  const ilgan = ilganRel(a, b);
  const ilji = iljiRel(a, b);
  const ohaeng = ohaengComplement(a, b);
  const star = spouseStar(a, b);
  const gyeokgukI = gyeokgukRel(a, b);
  const mbti = mbtiCompat(a.mbti, b.mbti);
  const zodiac = zodiacCompat(a.sign, b.sign);
  const blood = bloodCompat(a.blood, b.blood);

  const systems = [ilgan, ilji, ohaeng, gyeokgukI, mbti, zodiac, blood];
  const totalPercent = Math.round(systems.reduce((sum, s) => sum + (WEIGHT[s.name] || 0) * s.score, 0));

  // 영역별 궁합
  const domains = [
    { label: '연애 케미', icon: '💕', score: Math.round(ilji.score * 0.4 + zodiac.score * 0.3 + mbti.score * 0.3) },
    { label: '결혼·안정', icon: '💍', score: Math.round(ilgan.score * 0.25 + ohaeng.score * 0.25 + star.score * 0.2 + gyeokgukI.score * 0.2 + blood.score * 0.1) },
    { label: '대화·소통', icon: '💬', score: Math.round(mbti.score * 0.5 + zodiac.score * 0.25 + ilgan.score * 0.25) },
    { label: '가치관·방향', icon: '🧭', score: Math.round(ohaeng.score * 0.3 + gyeokgukI.score * 0.3 + mbti.score * 0.2 + ilgan.score * 0.2) },
  ].map(d => ({ ...d, text: domainText(d.label, d.score) }));

  const goodPoints = systems.filter(s => s.verdict === '합').map(s => `${s.name}: ${s.note}`);
  const frictionPoints = systems.filter(s => s.verdict === '충').map(s => `${s.name}: ${s.note}`);

  // 종합 서술
  const grade = totalPercent >= 82 ? '천생연분' : totalPercent >= 70 ? '잘 맞는 인연' : totalPercent >= 58 ? '노력으로 빛나는 사이' : '서로 다른 결의 도전적 인연';
  const narrative = [
    `${ilgan.note}`,
    `${ilji.note}`,
    `${ohaeng.note}`,
    `<b>배우자성</b> — ${star.note}`,
    `<b>격국 상호작용</b> — ${gyeokgukI.note}`,
  ];
  const advice = totalPercent >= 82
    ? '타고난 합이 좋은 인연이다. 익숙함에 안주하지 말고 서로에게 계속 새로움을 선물하면 오래도록 빛난다.'
    : totalPercent >= 70
    ? '기본 궁합이 든든하다. 부딪히는 한두 지점만 의식해서 다루면 깊고 안정적인 관계로 자란다.'
    : totalPercent >= 58
    ? '타고난 점수보다 만들어가는 관계다. 서로의 다름을 약점이 아니라 보완으로 읽는 순간 크게 깊어진다.'
    : '결이 많이 다른 인연이다. 그만큼 서로에게 없는 세계를 열어주는 관계 — 차이를 존중하는 대화가 모든 것을 가른다.';

  return {
    totalPercent, grade, systems, domains, goodPoints, frictionPoints,
    ilgan, ilji, ohaeng, star, gyeokgukI, narrative, advice,
    signA: a.sign, signB: b.sign,
    dayGanA: a.dayGan, dayGanB: b.dayGan,
    gyeokgukA: a.gyeokguk?.name, gyeokgukB: b.gyeokguk?.name,
  };
}
