import { Solar } from 'lunar-javascript';
import { TENGOD_GROUP } from './strength.js';
import { ZHI_KO } from './ganzhi.js';

// ── 지지 삼합국(三合局) — 신살 계산의 기준 ──
const GROUPS = {
  수국: { members: ['申','子','辰'], dohwa: '酉', yeokma: '寅', hwagae: '辰', samjae: ['寅','卯','辰'] },
  금국: { members: ['巳','酉','丑'], dohwa: '午', yeokma: '亥', hwagae: '丑', samjae: ['亥','子','丑'] },
  화국: { members: ['寅','午','戌'], dohwa: '卯', yeokma: '申', hwagae: '戌', samjae: ['申','酉','戌'] },
  목국: { members: ['亥','卯','未'], dohwa: '子', yeokma: '巳', hwagae: '未', samjae: ['巳','午','未'] },
};
function groupOf(zhi) {
  return Object.values(GROUPS).find(g => g.members.includes(zhi)) || null;
}

// 천을귀인(天乙貴人) — 일간 기준 최고 길신
const CHEONEUL = {
  '甲':['丑','未'], '戊':['丑','未'], '庚':['丑','未'],
  '乙':['子','申'], '己':['子','申'],
  '丙':['亥','酉'], '丁':['亥','酉'],
  '辛':['寅','午'],
  '壬':['巳','卯'], '癸':['巳','卯'],
};

// ── 몸주신(수호신령) — 일간 오행별 ──
const GUARDIAN = {
  목: {
    name: '산신(山神)', emoji: '⛰️',
    nature: '큰 산을 지키는 도력 높은 신령',
    personality: '깊은 산처럼 묵직하고 지혜로운 기운을 내려 준다. 이 신령을 몸주로 모신 사람은 쉽게 흔들리지 않는 중심과 멀리 보는 통찰을 타고난다.',
    guard: '학업·건강·장수를 관장하며, 길을 잃은 순간 산속 등불처럼 방향을 밝혀 준다.',
    direction: '동쪽', color: '청색·녹색',
    remedy: '이른 아침 산이나 나무를 향해 마음을 다스리면 막힌 기운이 풀린다.',
    keywords: ['지혜','인내','도력','건강'],
  },
  화: {
    name: '칠성신(七星神)', emoji: '✨',
    nature: '북두칠성의 빛을 다스리는 신령',
    personality: '어둠 속에서도 길을 비추는 별빛의 기운을 내려 준다. 이 신령의 가호를 받는 이는 어디서나 주목받는 광채와 식지 않는 열정을 지닌다.',
    guard: '명예·시험·자손운을 밝히고, 큰 액을 별빛으로 흩어 흐트러뜨린다.',
    direction: '남쪽', color: '적색·자색',
    remedy: '밤하늘 별을 올려다보며 소원을 빌면 칠성이 굽어살핀다. 정화수 한 그릇이 정성이다.',
    keywords: ['명예','광채','자손','열정'],
  },
  토: {
    name: '대감신(大監神)', emoji: '🪙',
    nature: '터와 재물을 관장하는 후덕한 신령',
    personality: '곳간을 지키는 대감의 기운을 내려 준다. 재물과 권세, 사람을 끌어모으는 힘을 타고나, 이 신령을 모신 이에게는 자연히 사람과 재물이 따른다.',
    guard: '재물·사업·집터의 안정을 지키고, 두터운 인덕으로 위기를 넘기게 한다.',
    direction: '중앙·남서쪽', color: '황색',
    remedy: '집안의 곳간(부엌·금고)을 정갈히 하고 베풀면 재물이 든다.',
    keywords: ['재물','권세','인덕','터복'],
  },
  금: {
    name: '장군신(將軍神)', emoji: '⚔️',
    nature: '칼을 든 무신(武神), 액을 베는 장군 신령',
    personality: '한 번 휘두르면 잡귀를 베는 결단의 기운을 내려 준다. 추진력과 승부욕, 액을 막아 내는 힘을 타고나, 이 신령의 가호를 받는 이는 위기일수록 더 강해진다.',
    guard: '관재·구설·잡귀를 막아 내고, 승부와 결단의 순간에 큰 힘을 실어 준다.',
    direction: '서쪽', color: '백색',
    remedy: '날붙이와 거울을 깨끗이 두고, 미뤄 둔 결단을 더는 미루지 말라.',
    keywords: ['결단','추진','액막이','승부'],
  },
  수: {
    name: '용왕신(龍王神)', emoji: '🐉',
    nature: '물길과 재물을 다스리는 바다의 신령',
    personality: '깊은 물처럼 헤아릴 수 없는 지략의 기운을 내려 준다. 재물의 흐름과 이동, 자손을 관장하며, 이 신령을 모신 이는 어떤 막다른 곳에서도 물길처럼 길을 찾아낸다.',
    guard: '재물의 흐름·이동수·자손운을 돌보고, 막힌 일을 물 흐르듯 틔워 준다.',
    direction: '북쪽', color: '흑색·청색',
    remedy: '물가를 찾아 마음을 비우거나 정화수를 갈아 두면 막힌 일이 풀린다.',
    keywords: ['재물','지략','이동','흐름'],
  },
};

// ── 신살 풀이 ──
const SAL_TEXT = {
  도화살: { emoji:'🌸', good:true, text:'이성을 끄는 매력과 인기의 살. 예술·연예·서비스 분야에서 빛나지만, 구설과 이성 문제를 부르기도 하니 처신이 중요하다.' },
  역마살: { emoji:'🐎', good:true, text:'한곳에 머물지 못하는 이동·변화의 살. 해외·출장·이사·사업 확장에 길하며, 움직이는 곳에 기회가 따른다.' },
  화개살: { emoji:'🎨', good:true, text:'예술·종교·학문의 살. 영적 감수성과 신끼가 깊고, 고독을 즐기며 한 분야를 파고드는 예인(藝人)의 기질이 있다.' },
  천을귀인:{ emoji:'🕊️', good:true, text:'하늘이 내린 최고의 길신(吉神). 위기마다 귀인이 나타나 돕고, 큰 화(禍)를 면하게 하는 든든한 방패다.' },
};

const POS_LABEL = { year:'년주(年柱)·조상·초년', month:'월주(月柱)·부모형제', day:'일주(日柱)·나·배우자', time:'시주(時柱)·자녀·말년' };

// 신살이 어느 궁(자리)의 어느 십성 위에 앉았는지에 따른 문맥 — 살마다, 십성 그룹마다 결이 다르다
const SAL_GROUP_CTX = {
  도화살: {
    비겁: '친구·동료 사이에서 유독 인기가 많은 자리다. 매력이 관계망을 넓히는 힘이 된다.',
    식상: '매력이 재능·표현으로 직결되는 자리다. 끼가 예술·창작으로 흘러나온다.',
    재성: '매력이 곧 돈이 되는 자리다. 인기·호감을 실질적 수익으로 바꾸는 감각이 있다 — 연예·서비스·마케팅에 유리.',
    관성: '매력이 명예·지위로 이어지는 자리다. 대중 앞에 설수록 빛나는 위치다.',
    인성: '매력이 은근한 신망(信望)으로 쌓이는 자리다. 배움이나 자격을 통해 인기가 깊어진다.',
  },
  역마살: {
    비겁: '움직일수록 인맥이 넓어지는 자리다. 이동이 곧 관계 확장이 된다.',
    식상: '이동하며 재능을 펼치는 자리다. 여행·미디어·프리랜서 활동과 잘 맞는다.',
    재성: '움직여야 버는 돈의 자리다. 무역·물류·출장·영업에서 재물이 따른다.',
    관성: '이동하며 커리어가 열리는 자리다. 해외·출장이 잦은 직무에서 성취가 크다.',
    인성: '이동하며 배우는 자리다. 유학·연수 등 낯선 환경에서의 학습운이 좋다.',
  },
  화개살: {
    비겁: '혼자 수련하며 자기 세계를 완성하는 자리다. 고독이 힘이 된다.',
    식상: '몰입이 예술로 승화되는 자리다. 창작 자체가 구도(求道)의 방식이 된다.',
    재성: '고독 속에서도 실속을 챙기는 자리다. 조용히 자산을 불리는 유형.',
    관성: '홀로 쌓은 전문성이 결국 명예로 인정받는 자리다.',
    인성: '학문·종교·역학의 깊이가 가장 짙게 드러나는 자리다. 정신적 스승·수행자의 기질이 있다.',
  },
};
const CHEONEUL_POS_CTX = {
  year: '조상·윗사람의 음덕으로 귀인이 온다 — 집안·연장자의 도움이 크다.',
  month: '부모형제와 초년의 인맥에서 귀인이 온다 — 젊을 때 만난 인연이 평생 간다.',
  day: '배우자 인연으로 귀인이 온다 — 짝이 곧 인생의 방패가 된다.',
  time: '자녀와 말년의 인복으로 귀인이 온다 — 노년의 복이 두텁다.',
};

function pillarBranches(pillars) {
  return [pillars.year, pillars.month, pillars.day, pillars.time]
    .filter(Boolean).map(p => p.zhi);
}

// 신살의 표적 지지(zhi)가 실제 어느 기둥(자리)에 앉았는지 찾아, 그 자리의 십성 그룹으로 문맥 문장을 만든다
function findSalContext(pillars, salName, targetZhi) {
  const hits = ['year', 'month', 'day', 'time']
    .map(k => pillars[k] && pillars[k].zhi === targetZhi ? { pos: k, p: pillars[k] } : null)
    .filter(Boolean);
  if (!hits.length) return null;
  const parts = hits.map(({ pos, p }) => {
    const label = POS_LABEL[pos];
    if (salName === '천을귀인') return `<b>${label}</b> 자리 — ${CHEONEUL_POS_CTX[pos]}`;
    const group = TENGOD_GROUP[p.zhiGod];
    const ctx = group && SAL_GROUP_CTX[salName]?.[group];
    return ctx ? `<b>${label}</b> 자리(${group}) — ${ctx}` : `<b>${label}</b> 자리에 앉았다.`;
  });
  return parts.join(' ');
}

function currentYearZhi() {
  try {
    const now = new Date();
    return Solar.fromYmd(now.getFullYear(), 6, 1).getLunar().getEightChar().getYearZhi();
  } catch { return null; }
}

export function analyzeSinjeom(birth, sajuDetail) {
  if (!sajuDetail?.pillars) return null;
  const { pillars, tenGodGroups } = sajuDetail;
  const dayGan = pillars.dayGan;
  const dayEl = pillars.day?.ganEl;
  const dayZhi = pillars.day?.zhi;
  const yearZhi = pillars.year?.zhi;
  if (!dayEl || !GUARDIAN[dayEl]) return null;

  const guardian = GUARDIAN[dayEl];
  const branches = pillarBranches(pillars);

  // 신살 판정 — 일지 기준 삼합국에서 도화/역마/화개, 일간 기준 천을귀인
  const g = groupOf(dayZhi);
  const sals = [];       // 이름만
  const salZhi = {};     // 이름 → 표적 지지
  if (g) {
    if (branches.includes(g.dohwa))  { sals.push('도화살'); salZhi['도화살'] = g.dohwa; }
    if (branches.includes(g.yeokma)) { sals.push('역마살'); salZhi['역마살'] = g.yeokma; }
    if (branches.includes(g.hwagae)) { sals.push('화개살'); salZhi['화개살'] = g.hwagae; }
  }
  const cheonList = CHEONEUL[dayGan] || [];
  const matchedCheon = cheonList.find(z => branches.includes(z));
  const hasCheoneul = !!matchedCheon;
  if (hasCheoneul) { sals.push('천을귀인'); salZhi['천을귀인'] = matchedCheon; }

  const salList = sals.map(name => ({
    name, ...SAL_TEXT[name],
    context: findSalContext(pillars, name, salZhi[name]),
  }));

  // 삼재 판정 — 출생 년지 삼합국 기준, 올해 년지가 삼재년인가
  const cyZhi = currentYearZhi();
  let samjae = null;
  const yg = groupOf(yearZhi);
  if (yg && cyZhi && yg.samjae.includes(cyZhi)) {
    const phaseIdx = yg.samjae.indexOf(cyZhi);
    const phase = ['들삼재(첫해)', '눌삼재(중간해)', '날삼재(끝해)'][phaseIdx];
    samjae = {
      active: true, phase,
      text: phaseIdx === 0
        ? '삼재가 막 들어선 첫해(들삼재)다. 새로운 일을 크게 벌이기보다 몸을 낮추고 기존의 것을 지키는 데 집중하라.'
        : phaseIdx === 1
        ? '삼재의 한가운데(눌삼재)다. 구설·관재·손재가 가장 거센 때이니, 보증·다툼·과욕을 멀리하고 건강을 살펴라.'
        : '삼재가 물러가는 끝해(날삼재)다. 벌여 둔 일을 매듭짓고 정리하면, 다음 9년의 흐름이 한결 가벼워진다.',
    };
  }

  // 신기(神氣) 지수 — 화개살·인성·수/화 기운
  let sinki = 38;
  if (sals.includes('화개살')) sinki += 22;
  const insung = tenGodGroups?.인성 || 0;
  sinki += Math.min(18, insung * 6);
  if (dayEl === '수' || dayEl === '화') sinki += 10;
  if (branches.filter(b => b === g?.hwagae).length >= 2) sinki += 8;
  sinki = Math.min(95, Math.max(20, sinki));

  const sinkiLevel = sinki >= 75 ? '높음' : sinki >= 55 ? '보통' : '낮음';
  const SINKI_INFO = {
    높음: {
      text: '신끼가 <b>매우 강한 편</b>이다. 보이지 않는 것을 먼저 감지하는 안테나가 예민해, 영적·예술적 세계와 가깝다.',
      traits: [
        '사람·자리의 분위기를 1초 만에 읽어내는 촉이 있다',
        '꿈·예감·기시감(데자뷔)이 자주 들어맞는다',
        '사람 많은 곳에서 쉽게 기가 빨리고 유난히 피곤해진다',
        '"왠지 그럴 것 같았다"가 자주 적중한다',
        '종교·역학·예술·상담·치유 분야에 묘하게 끌린다',
      ],
      use: '첫 느낌을 흘리지 말고 메모해 두면 적중률이 의외로 높다. 사람의 결을 읽는 일 — 상담·기획·예술·치유에서 남들이 못 가진 무기가 된다.',
      caution: '예민한 만큼 부정적인 기운·사람·장소에 쉽게 동화된다. 혼자만의 정화 시간(물가 산책·명상·정리)과 마음의 경계 세우기가 필수. 무속에서는 신끼가 매우 강하면 \'신가물\'이라 하여 기도·굿으로 다스린다고 보지만, 대개는 <b>예민한 감수성</b>으로 이해하면 충분하다.',
    },
    보통: {
      text: '신끼가 <b>어느 정도 있는 편</b>이다. 촉과 직감이 좋아 분위기와 사람을 빠르게 읽어낸다.',
      traits: [
        '처음 만난 사람의 분위기를 곧잘 파악한다',
        '가끔 예감이나 꿈이 들어맞는다',
        '직관과 논리를 함께 굴리는 균형형이다',
        '영감이 필요한 일에서 한 끗을 낸다',
      ],
      use: '머리와 촉이 엇갈릴 때, 촉에게도 한 표를 주면 균형 잡힌 판단이 된다. 직감을 완전히 무시하지 않는 것이 포인트.',
      caution: '컨디션에 따라 촉의 정확도가 출렁인다 — 피곤하거나 감정이 격할 땐 직감보다 검증을 우선하라.',
    },
    낮음: {
      text: '신끼는 <b>옅은 편</b>이다. 보이는 것과 검증된 것을 믿는 현실적인 기질로, 흔들림 없이 땅을 딛고 산다.',
      traits: [
        '근거와 데이터로 판단하는 현실주의자다',
        '분위기나 소문에 잘 휘둘리지 않는다',
        '미신·괴담에 흔들림이 적고 담대하다',
        '꾸준하고 안정적인 멘탈을 지녔다',
      ],
      use: '흔들리지 않는 현실 감각이 강점이다. 다만 \'설명되지 않는 직감\'도 일종의 데이터로 한 번쯤 받아들이면 시야가 넓어진다.',
      caution: '논리만 앞세우다 사람의 미묘한 감정 신호를 놓칠 수 있으니, 가끔은 \'느낌\'도 살펴볼 것.',
    },
  };
  const sinkiInfo = SINKI_INFO[sinkiLevel];
  const sinkiText = sinkiInfo.text;

  // 부신(副神) — 신끼가 강하면 함께 붙는 신령
  const subGuardian = sinki >= 75
    ? { name: '동자신(童子神)', emoji: '🧒', text: '영리한 동자의 예지 기운이 함께한다 — 직관과 점복(占卜)의 감각이 뛰어나고, 보이지 않는 흐름을 먼저 읽는다.' }
    : null;

  // 공수(神授) — 신령의 한마디
  let gongsu = '들어 보거라.';
  if (samjae) {
    gongsu += ' 올해는 삼재가 들었으니, 새 일은 미루고 몸을 낮추어라.';
  } else if (sals.includes('천을귀인')) {
    gongsu += ' 네 뒤에 큰 귀인이 서 있으니, 급할수록 사람을 믿고 손을 내밀어라.';
  } else if (sals.includes('역마살')) {
    gongsu += ' 길 위에 네 운이 있으니, 머무르지 말고 움직이는 곳에서 복을 구하라.';
  } else if (sals.includes('도화살')) {
    gongsu += ' 네 빛이 사람을 끄는구나. 그 인기를 한눈팔지 말고 네 일로 돌리면 크게 된다.';
  } else {
    gongsu += ` ${guardian.name.split('(')[0]}이 네 뒤를 든든히 받치고 있으니, 두려워 말고 네 길을 가거라.`;
  }
  gongsu += hasCheoneul && samjae ? ' 허나 귀인이 곁에 있어 큰 화는 비껴가리라.' : '';

  return {
    guardian, subGuardian,
    sinki, sinkiText, sinkiLevel, sinkiInfo,
    salList, samjae, gongsu,
    dayElKo: { 목:'목(木)', 화:'화(火)', 토:'토(土)', 금:'금(金)', 수:'수(水)' }[dayEl],
    dayZhiKo: dayZhi ? `${ZHI_KO[dayZhi]}(${dayZhi})` : '',
  };
}
