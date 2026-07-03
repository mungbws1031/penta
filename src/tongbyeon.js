import { GYEOK_LUCK } from './luckScore.js';

// 종합 통변(通變) — 격국 × 신강신약 교차 패턴 + 운의 성패 전이(자평진전 成敗·救應)

const isJae = k => k === '정재' || k === '편재';
const isSik = k => k === '식신' || k === '상관';
const isIn  = k => k === '정인' || k === '편인';

const GROUP_GODS = {
  비겁: ['비견', '겁재'], 식상: ['식신', '상관'], 재성: ['정재', '편재'],
  관성: ['정관', '편관'], 인성: ['정인', '편인'],
};

// 파격(破格)을 구해주는 구응(救應) 십신 — 격별
const GUYING = {
  정관: { gods: ['정인', '편인'], label: '인성(印星)', why: '상관을 눌러 깨진 관(官)을 되살리는' },
  상관: { gods: ['정재', '편재'], label: '재성(財星)', why: '상관의 날을 재물로 흘려보내 관과의 충돌을 푸는' },
  식신: { gods: ['정재', '편재'], label: '재성(財星)', why: '밥그릇을 빼앗는 효신(편인)을 제압하는' },
  편인: { gods: ['정재', '편재'], label: '재성(財星)', why: '치우친 편인을 제어해 균형을 되찾는' },
  정인: { gods: ['비견', '겁재'], label: '비겁(比劫)', why: '재(財)의 공격을 막아 인수를 보호하는' },
  정재: { gods: ['정관', '편관'], label: '관성(官星)', why: '재물을 다투는 비겁을 제압하는' },
  편재: { gods: ['정관', '편관'], label: '관성(官星)', why: '재물을 다투는 비겁을 제압하는' },
  편관: { gods: ['식신', '정인', '편인'], label: '식상·인성', why: '살(殺)을 제압하거나 지혜로 돌려내는' },
  건록: { gods: ['정재', '편재', '정관', '편관'], label: '재성·관성', why: '갇힌 힘의 출구를 열어주는' },
  양인: { gods: ['편관', '정관'], label: '관살(官殺)', why: '날뛰는 양인을 다스리는' },
};

// 격국 × 신강신약 → 고전 팔자 패턴
function detectPattern(gk, st, tgs) {
  const key = gk.key;
  const inCnt = tgs?.인성 || 0;

  if (st.balanced) return {
    name: '중화지명', hanja: '中和之命', quality: '길',
    text: `${gk.name}의 그릇에 기운까지 고르게 잡혔다. 어떤 운이 와도 크게 무너지지 않는, 명리에서 가장 귀하게 치는 안정 구조다. 극적인 대박보다 꾸준한 상승이 이 사주의 문법이다.`,
    unlock: null,
  };

  if (isJae(key) && st.isWeak) return {
    name: '재다신약', hanja: '財多身弱', quality: '주의',
    text: '재물의 그릇(재격)은 큰데 그것을 쥘 체력(일간)이 약하다 — 고전에서 "부옥빈인(富屋貧人)", 부잣집의 가난한 사람이라 부르는 구조다. 돈 기회는 계속 보이는데 혼자 다 잡으려 하면 몸과 돈이 함께 샌다.',
    unlock: '비겁', unlockWhy: '어깨를 나눠 질 동료·파트너의 힘(비겁)이 들어올 때 비로소 그 큰 재물을 감당해낸다',
  };
  if (isJae(key) && st.isStrong) return {
    name: '신왕재왕', hanja: '身旺財旺', quality: '귀',
    text: '재물의 그릇도 크고 그것을 감당할 체력도 강하다 — 명리에서 최상급 부명(富命)으로 치는 구조다. 판을 키울수록 감당해내는 유형이니, 작게 안주하는 것이 오히려 이 사주에 대한 낭비다.',
    unlock: '식상', unlockWhy: '재능이 재물을 낳는 식상생재(食傷生財)의 운이 들어올 때 재산이 크게 붇는다',
  };

  if (key === '편관') {
    if (st.isWeak && inCnt >= 1) return {
      name: '살인상생', hanja: '殺印相生', quality: '귀',
      text: '강한 칠살의 압박을 인성이 지혜와 권위로 돌려내는 귀격(貴格) 구조다. 시련이 올 때마다 그것을 공부·자격·명예로 바꿔내는 힘이 있어, 고생 끝에 높이 서는 대기만성의 전형이다.',
      unlock: '인성', unlockWhy: '인성운이 들어올 때 압박이 승진·명예로 전환된다',
    };
    if (st.isWeak) return {
      name: '살중신약', hanja: '殺重身弱', quality: '흉',
      text: '칠살의 압박은 무거운데 그것을 받아낼 체력도, 돌려낼 인성도 부족하다 — 명리에서 가장 조심스럽게 보는 구조다. 무리한 싸움과 과로가 최대의 적이며, 자신을 지키는 것이 평생의 제1과제다.',
      unlock: '인성', unlockWhy: '인성·식상운이 들어와 살(殺)을 돌리거나 제압할 때 비로소 숨통이 트인다',
    };
    return {
      name: '신왕살왕', hanja: '身旺殺旺', quality: '귀',
      text: '강한 칠살을 강한 일간이 정면으로 받아내는 구조 — 잘 다스려지면 큰 권력과 전문성이 되는 무관(武官)의 명이다. 위기와 경쟁이 오히려 이 사주를 단련시키는 연료다.',
      unlock: '식상', unlockWhy: '식신제살(食神制殺)의 운에 실력이 권위로 공인받는다',
    };
  }

  if (key === '정관') {
    if (st.isWeak) return {
      name: '신약관왕', hanja: '身弱官旺', quality: '주의',
      text: '명예와 책임의 그릇(정관격)은 반듯한데 그 무게를 지는 체력이 부친다. 자리가 올라갈수록 부담도 함께 커지는 구조라, 승진·중책이 마냥 복만은 아니다 — 힘을 보태줄 기반이 먼저다.',
      unlock: '인성', unlockWhy: '관인상생(官印相生)의 운에 책임이 부담이 아니라 권위로 바뀐다',
    };
    return {
      name: '신왕관왕', hanja: '身旺官旺', quality: '귀',
      text: '반듯한 명예의 그릇을 든든한 체력이 받치는 구조 — 조직과 사회에서 높이 오르는 전형적 귀명(貴命)이다. 정도(正道)로 갈수록 크게 되는 사주다.',
      unlock: '재성', unlockWhy: '재생관(財生官)의 운에 실적이 그대로 지위로 직결된다',
    };
  }

  if (isSik(key)) {
    if (st.isStrong) return {
      name: '식상설수', hanja: '食傷泄秀', quality: '길',
      text: '넘치는 기운이 재능과 표현으로 아름답게 빠져나가는 구조 — 고전에서 "빼어날 수(秀)"자를 붙이는 예술가·전문가의 명이다. 막히면 병이 되고 흐르면 작품이 되니, 표현의 출구를 늘 열어둘 것.',
      unlock: '재성', unlockWhy: '식상생재(食傷生財)의 운에 재능이 돈으로 환금된다',
    };
    return {
      name: '신약설기', hanja: '身弱泄氣', quality: '주의',
      text: '재능은 넘치는데 그것을 뿜어낼수록 몸이 축나는 구조다. 하고 싶은 일을 다 벌이면 소진이 먼저 온다 — 재능의 수도꼭지를 조절하고, 채우는 시간(휴식·배움)을 의식적으로 확보해야 오래 간다.',
      unlock: '인성', unlockWhy: '인성운이 바닥난 기운을 채워줄 때 재능이 다시 살아난다',
    };
  }

  if (isIn(key)) {
    if (st.level === '태강') return {
      name: '모자멸자', hanja: '母慈滅子', quality: '주의',
      text: '돕는 기운(인성)이 지나쳐 오히려 자립을 눌러버리는 역설의 구조 — "어머니의 사랑이 과하면 자식을 망친다"는 고전의 경구가 붙는다. 받는 것에 익숙해질수록 무기력해지니, 스스로 부딪히는 경험이 약이다.',
      unlock: '재성', unlockWhy: '재성운이 과한 인성을 덜어낼 때 비로소 제 발로 선다',
    };
    if (st.isStrong) return {
      name: '인다신강', hanja: '印多身强', quality: '보통',
      text: '배움과 뒷배가 두터워 기반은 든든하지만, 생각이 실행을 앞질러 기회를 흘려보내기 쉬운 구조다. 채우는 힘은 이미 충분하니, 꺼내 쓰는 훈련이 관건이다.',
      unlock: '식상', unlockWhy: '식상·재성운에 쌓아둔 것이 결과물로 터져 나온다',
    };
    return {
      name: '신약용인', hanja: '身弱用印', quality: '길',
      text: '약한 일간을 인성이 정확히 살려주는 구조 — 귀인·스승·문서의 덕이 평생 따르는 유형이다. 맨몸으로 부딪히기보다 배움과 자격, 윗사람의 지원을 딛고 오를 때 가장 멀리 간다.',
      unlock: '인성', unlockWhy: '인성·비겁운에 기반이 단단해지며 도약한다',
    };
  }

  if (key === '건록' || key === '양인') {
    if (st.isWeak) return {
      name: '녹겁신약', hanja: '祿劫身弱', quality: '보통',
      text: '월령에 뿌리는 내렸으나 전체 세력은 약한 구조다. 홀로 서려는 기질은 강한데 뒷심이 달리니, 자존심을 내려놓고 같은 편을 늘리는 것이 실리다.',
      unlock: '비겁', unlockWhy: '비겁·인성운에 세력이 붙으며 본래의 자수성가 기질이 살아난다',
    };
    return {
      name: '녹인신왕', hanja: '祿刃身旺', quality: '길',
      text: '월령에 뿌리를 둔 강건한 자수성가형 구조다. 남의 밑천 없이 제 힘으로 일어서는 명이지만, 강한 힘은 출구가 없으면 안에서 탈이 난다 — 벌이는 일(재)과 책임지는 자리(관)로 계속 흘려보내야 한다.',
      unlock: '재성', unlockWhy: '재성·관성운에 그 힘이 실질적인 성취로 결실을 맺는다',
    };
  }

  return null;
}

// timeline: fortune.timeline (대운 periods)
export function analyzeTongbyeon({ gyeokguk, strength, sajuDetail, timeline }) {
  if (!gyeokguk || !strength) return null;
  const tgs = sajuDetail?.tenGodGroups || {};
  const pattern = detectPattern(gyeokguk, strength, tgs);
  const periods = timeline?.periods || [];

  // 패턴이 풀리는 대운 (unlock 그룹의 십신이 들어오는 시기)
  let unlockPeriods = [];
  if (pattern?.unlock) {
    const gods = GROUP_GODS[pattern.unlock] || [];
    unlockPeriods = periods.filter(p => gods.includes(p.tenGod)).slice(0, 3);
  }

  // 패중유성(敗中有成) — 원국이 파격일 때, 구응 운이 오는 시기
  let guYing = null;
  if (gyeokguk.warn && GUYING[gyeokguk.key]) {
    const g = GUYING[gyeokguk.key];
    const hits = periods.filter(p => g.gods.includes(p.tenGod)).slice(0, 3);
    guYing = { label: g.label, why: g.why, periods: hits };
  }

  // 성중유패(成中有敗) — 원국이 성격인데, 격을 깨는 운이 오는 시기
  let risk = null;
  if (!gyeokguk.warn && GYEOK_LUCK[gyeokguk.key]?.bad?.length) {
    const bad = GYEOK_LUCK[gyeokguk.key].bad;
    const hits = periods.filter(p => bad.includes(p.tenGod)).slice(0, 2);
    if (hits.length) risk = { gods: bad.join('·'), periods: hits };
  }

  return { pattern, unlockPeriods, guYing, risk };
}
