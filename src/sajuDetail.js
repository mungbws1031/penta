import { Solar, Lunar } from 'lunar-javascript';

const GAN_ELEMENT = { '甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수' };
const ZHI_ELEMENT = { '子':'수','丑':'토','寅':'목','卯':'목','辰':'토','巳':'화','午':'화','未':'토','申':'금','酉':'금','戌':'토','亥':'수' };
const GAN_KO = { '甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계' };
const ZHI_KO = { '子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해' };
const ZHI_ANIMAL = { '子':'쥐','丑':'소','寅':'호랑이','卯':'토끼','辰':'용','巳':'뱀','午':'말','未':'양','申':'원숭이','酉':'닭','戌':'개','亥':'돼지' };

export const OHAENG_COLOR = { 목:'#4caf50', 화:'#e53935', 토:'#ff9800', 금:'#9e9e9e', 수:'#2196f3' };

export const DAY_GAN_PROFILE = {
  '甲': { symbol:'큰 나무(大木)', element:'목(木)', core:'독립·성장·선구',
    text:'하늘을 향해 곧게 뻗는 큰 나무의 기운을 타고났다. 뚜렷한 목표의식과 선구자적 기질이 있으며, 한번 방향을 정하면 굽히지 않는 추진력이 있다. 리더십이 자연스럽고 새로운 시작에 강하다. 남의 지시보다 스스로 길을 개척하는 자리에서 진가가 드러난다. 다만 고집이 지나쳐 주변의 조언을 흘려듣는 순간이 있으니, 유연함을 의식적으로 키울 필요가 있다.' },
  '乙': { symbol:'덩굴·꽃(草木)', element:'목(木)', core:'유연·관계·적응',
    text:'유연하게 뻗어나가는 덩굴풀과 꽃의 기운이다. 환경에 탁월하게 적응하고, 사람들 사이에서 조화를 이끌어내는 능력이 뛰어나다. 겉은 부드러우나 안은 단단하다. 인간관계에서 자신의 존재감을 드러내며, 섬세한 감각으로 상대의 마음을 읽는다. 억지로 밀기보다 스며드는 방식으로 원하는 것을 이루는 유형이다.' },
  '丙': { symbol:'태양(太陽)', element:'화(火)', core:'열정·카리스마·표현',
    text:'세상을 환하게 비추는 태양의 기운이다. 밝고 따뜻한 에너지로 주변을 끌어당기며, 어디서나 존재감이 뚜렷하다. 표현이 직접적이고 열정이 강하며, 사람들에게 희망과 활력을 불어넣는 역할을 자연스럽게 맡는다. 다만 지속성보다 순간의 강렬함에 치우칠 수 있으니, 마무리하는 힘을 키우면 더욱 빛난다.' },
  '丁': { symbol:'촛불·달(月火)', element:'화(火)', core:'집중·섬세·내공',
    text:'어둠 속 촛불처럼 집중된 빛을 발하는 기운이다. 예민하고 섬세한 내면의 불꽃을 품고 있으며, 겉은 조용해도 안에서 강렬하게 타오른다. 끊임없이 학습하고 탐구하며, 한 분야에 깊이 파고드는 집중력이 뛰어나다. 예술·기술·연구 분야에서 빛을 발한다. 화려함보다 깊이로 승부하는 유형이다.' },
  '戊': { symbol:'큰 산(大山)', element:'토(土)', core:'안정·신뢰·중심',
    text:'흔들리지 않는 큰 산의 기운이다. 묵직한 존재감과 신뢰감으로 주변에 안정을 준다. 결코 서두르지 않으며, 오랜 시간 한 자리를 지키는 인내심을 가졌다. 책임감이 강하고 의리를 중시하며, 조직 안에서 중심을 잡는 역할을 자주 맡는다. 느리게 가더라도 흔들리지 않는 힘이 이 사람의 핵심이다.' },
  '己': { symbol:'논밭·대지(田土)', element:'토(土)', core:'세심·배려·현실',
    text:'만물을 기르는 논밭 같은 기운이다. 꼼꼼하고 세심하게 상황을 살피며, 현실적인 방식으로 문제를 해결한다. 배려심이 깊어 남의 필요를 먼저 채우려 하며, 주변을 풍성하게 만드는 능력이 있다. 다만 자신의 욕구를 뒤로 미루는 경향이 있다. 스스로를 챙기는 연습이 필요하며, 자신이 먼저 건강해야 남도 잘 돌볼 수 있음을 기억하자.' },
  '庚': { symbol:'도끼·원석(金石)', element:'금(金)', core:'결단·강직·원칙',
    text:'원석을 깎아내는 도끼의 기운이다. 원칙과 기준이 뚜렷하며, 일 처리가 빠르고 과감하다. 옳고 그름에 대한 판단이 명확해 불의를 참지 못한다. 강한 의지와 실행력으로 어려운 일도 밀어붙이는 추진력이 있다. 다만 유연함이 부족해 불필요한 충돌이 생길 수 있으니, 상황에 따라 방식을 바꾸는 지혜가 필요하다.' },
  '辛': { symbol:'보석·칼날(金刃)', element:'금(金)', core:'정교·완벽·심미',
    text:'갈고 닦아 빛을 내는 보석의 기운이다. 세밀하고 정교하며, 완성도에 대한 기준이 높다. 예리한 감각으로 문제의 핵심을 정확히 짚어내며, 지식과 심미안에 대한 자부심이 크다. 표현은 직선적이고 솔직하며, 자신의 기준을 타인에게도 적용하는 경향이 있다. 완벽을 추구하되, 충분히 좋은 것으로 만족할 줄 아는 여유도 필요하다.' },
  '壬': { symbol:'큰 강·바다(大水)', element:'수(水)', core:'지략·포용·변화',
    text:'모든 것을 받아들이는 큰 강과 바다의 기운이다. 넓은 시야와 깊은 지략을 타고났으며, 다양한 상황에서도 흐름을 읽고 방향을 잡는 능력이 있다. 사람과 정보를 끌어모으는 흡인력이 있으며, 변화와 이동을 두려워하지 않는다. 큰 그림을 보는 전략적 사고가 강점이다. 다만 방향이 너무 많아 집중이 흩어지기도 하니, 한 곳을 깊이 파는 훈련이 필요하다.' },
  '癸': { symbol:'이슬·비(雨水)', element:'수(水)', core:'직관·감수성·내면',
    text:'대지를 조용히 적시는 이슬비의 기운이다. 남다른 직관력과 깊은 감수성을 타고났으며, 보이지 않는 것을 감지하는 능력이 뛰어나다. 내면이 풍요롭고 상상력이 풍부하며, 예술·철학·심리 분야에서 천부적인 면이 있다. 다만 자신의 감정을 겉으로 드러내기 어려워 고독을 느끼기도 한다. 자신의 깊은 내면을 신뢰하고 표현하는 용기를 키우면 더 빛난다.' },
};

export const TENGOD_GROUP_TEXT = {
  비겁: {
    high: '독립심과 자존심이 강하고, 무슨 일이든 스스로 해결하려 한다. 경쟁심이 있어 지기 싫어하며, 자수성가의 기질을 타고났다. 다만 협력보다 독립을 선호하는 경향이 있어, 팀워크를 의식적으로 키우면 더 큰 성취를 이룬다.',
    low:  '타인과의 협력과 조화를 잘 이끌어낸다. 독선보다 상황에 맞게 유연하게 대응하며, 흐름을 따르는 유형이다.',
  },
  식상: {
    high: '표현력과 창의성이 풍부하다. 생각을 말이나 글, 행동으로 드러내는 능력이 뛰어나며 재주가 많다. 예술·기술·교육·서비스 분야에서 빛을 발하며, 자유롭게 창의성을 발휘할 수 있는 자리에서 진가가 드러난다.',
    low:  '표현보다 실천을 중시한다. 말보다 행동으로 보여주는 유형이며, 주어진 일을 착실히 수행하는 데 강하다.',
  },
  재성: {
    high: '실용적이고 목표지향적이다. 재물과 현실적 성과에 관심이 높으며, 기회를 잡고 결과를 만들어내는 능력이 있다. 경영·영업·투자 분야에서 감각이 좋다.',
    low:  '물질보다 가치·이념·관계를 먼저 생각하는 유형이다. 돈보다 의미 있는 일에서 더 큰 동기를 찾으며, 재물 관리를 의식적으로 챙길 필요가 있다.',
  },
  관성: {
    high: '사회적 규범과 책임감이 강하다. 조직 안에서 역할을 충실히 수행하며, 리더십이 있고 원칙을 중시한다. 공직·관리·법·교육 분야에서 강점을 발휘한다. 다만 지나치면 압박감을 받기 쉬우니 자신의 감정도 놓치지 않도록 주의가 필요하다.',
    low:  '틀에 얽매이지 않고 자유롭게 방향을 정한다. 조직의 규율보다 자신만의 방식이 있으며, 독자적인 분야나 창업 쪽에서 빛을 발할 수 있다.',
  },
  인성: {
    high: '학문과 명예, 내면 탐구에 강한 기운이 있다. 배우는 것을 좋아하고 깊이 생각하는 사색의 힘이 있다. 교육·연구·철학·상담 분야에서 빛난다. 다만 생각이 많아 실행이 늦어지는 경향이 있으니, 행동으로 옮기는 연습이 필요하다.',
    low:  '이론보다 현장 경험을 통해 더 잘 배운다. 직관과 경험으로 길을 만들어나가는 강점이 있다.',
  },
};

function makePillar(g, z) {
  return {
    gan: g, zhi: z,
    ganKo: GAN_KO[g] || g, zhiKo: ZHI_KO[z] || z,
    ganEl: GAN_ELEMENT[g], zhiEl: ZHI_ELEMENT[z],
    animal: ZHI_ANIMAL[z] || '',
  };
}

export function getSajuPillars(birth) {
  const { year, month, day, hour, calendar } = birth;
  const timeUnknown = hour == null;
  const h = timeUnknown ? 12 : hour;
  const solar = calendar === 'lunar'
    ? Lunar.fromYmdHms(year, month, day, h, 0, 0).getSolar()
    : Solar.fromYmdHms(year, month, day, h, 0, 0);
  const ec = solar.getLunar().getEightChar();

  const yg = ec.getYearGan(), yz = ec.getYearZhi();
  const mg = ec.getMonthGan(), mz = ec.getMonthZhi();
  const dg = ec.getDayGan(), dz = ec.getDayZhi();
  const tg = timeUnknown ? null : ec.getTimeGan();
  const tz = timeUnknown ? null : ec.getTimeZhi();

  return {
    year:  makePillar(yg, yz),
    month: makePillar(mg, mz),
    day:   makePillar(dg, dz),
    time:  tg ? makePillar(tg, tz) : null,
    dayGan: dg,
    dayProfile: DAY_GAN_PROFILE[dg] || null,
    timeUnknown,
  };
}

export function getOhaengBalance(pillars) {
  const counts = { 목:0, 화:0, 토:0, 금:0, 수:0 };
  const add = el => { if (el && counts[el] !== undefined) counts[el]++; };
  [pillars.year, pillars.month, pillars.day, pillars.time].filter(Boolean).forEach(p => {
    add(p.ganEl); add(p.zhiEl);
  });
  return counts;
}

export function getTenGodGroups(counts) {
  return {
    비겁: (counts.비견||0) + (counts.겁재||0),
    식상: (counts.식신||0) + (counts.상관||0),
    재성: (counts.편재||0) + (counts.정재||0),
    관성: (counts.편관||0) + (counts.정관||0),
    인성: (counts.편인||0) + (counts.정인||0),
  };
}

export function analyzeSajuDetail(birth, counts) {
  const pillars = getSajuPillars(birth);
  const ohaeng = getOhaengBalance(pillars);
  const tenGodGroups = getTenGodGroups(counts);
  return { pillars, ohaeng, tenGodGroups };
}
