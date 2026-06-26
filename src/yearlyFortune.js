import { Solar } from 'lunar-javascript';
import { tenGod } from './fortune.js';

const ZHI_ANIMAL = { '子':'쥐','丑':'소','寅':'호랑이','卯':'토끼','辰':'용','巳':'뱀','午':'말','未':'양','申':'원숭이','酉':'닭','戌':'개','亥':'돼지' };

const TG_FORTUNE = {
  비견: {
    score: 62, label: '비견운 — 자기 주도',
    yearly: '독립심이 강해지고 스스로 결정하는 일이 많아지는 해다. 경쟁이 치열해지기 쉽지만, 이 시기에 쌓은 자립력이 오래 간다. 같은 방향의 파트너를 곁에 두는 것이 혼자 달리는 것보다 훨씬 이익이다.',
    daily: '혼자서도 잘 해낼 수 있는 날이다. 자신감이 올라오고 독립적인 판단이 빛을 발한다. 다만 고집이 세지는 날이기도 하니, 타인의 의견을 한 번 더 들어보는 것이 좋다.',
  },
  겁재: {
    score: 55, label: '겁재운 — 경쟁·변동',
    yearly: '변동과 경쟁의 에너지가 강한 해다. 재물이 들어오는 만큼 나가기도 쉬워 예상 밖의 지출이 생기기 쉽다. 무리한 투자보다 기존 것을 지키고 다지는 데 집중하는 편이 현명하다.',
    daily: '경쟁적인 기운이 강한 날이다. 의욕이 넘치지만 잃는 것도 생기기 쉬운 날 — 재물과 말에 신중을 기하라.',
  },
  식신: {
    score: 76, label: '식신운 — 표현·여유',
    yearly: '여유와 창의가 살아나는 좋은 해다. 하고 싶은 일에 힘이 실리고 먹고 즐기는 복이 따른다. 새로운 것을 시작하거나 창의적 작업에 집중하기 좋은 시기다. 건강도 전반적으로 무난하다.',
    daily: '여유롭고 창의적인 날이다. 먹고 즐기는 복이 따르고, 아이디어가 잘 떠오른다. 좋아하는 일에 에너지를 쏟기 좋은 하루다.',
  },
  상관: {
    score: 63, label: '상관운 — 도전·창의',
    yearly: '기존 틀을 깨고 싶어지는 에너지가 강한 해다. 창의력이 폭발하지만 윗사람·규칙과 마찰이 생기기 쉽다. 표현은 신중하게, 행동은 전략적으로 해야 오히려 기회가 된다.',
    daily: '도전적이고 날이 서는 날이다. 창의력이 넘치지만 말 실수나 마찰이 생기기 쉬우니 언행을 조심하라.',
  },
  편재: {
    score: 71, label: '편재운 — 기회·재물',
    yearly: '의외의 재물 기회와 인맥 확장의 해다. 사교 활동과 네트워킹에서 이득이 오고, 새로운 수입원이 생기기도 한다. 다만 지출도 늘기 쉬우니 씀씀이를 조절하는 것이 중요하다.',
    daily: '예상치 못한 기회나 작은 행운이 따르는 날이다. 사람들과의 만남에서 이득이 생기고, 기분 좋은 소식이 올 수 있다.',
  },
  정재: {
    score: 73, label: '정재운 — 안정 수입',
    yearly: '성실하게 쌓아온 것이 결실로 돌아오는 해다. 안정적인 수입과 재물운이 따르며, 꾸준히 노력한 것이 인정받는다. 무리하지 않고 본업에 충실한 것이 가장 큰 전략이다.',
    daily: '착실하고 안정적인 날이다. 해야 할 일을 차분히 처리하면 좋은 결과로 돌아온다. 금전 거래는 정직하고 명확하게 하라.',
  },
  편관: {
    score: 50, label: '편관운 — 압박·단련',
    yearly: '외부의 압박과 도전이 많아지는 해다. 힘들지만 이 시기를 버티면 실력이 크게 늘고 강해진다. 건강 관리를 최우선으로 하고, 무리한 싸움보다 실속을 챙기는 것이 현명하다.',
    daily: '부담감이 느껴지는 날이다. 예상치 못한 장애물이나 압박이 생길 수 있으니 무리하지 말고 유연하게 대응하라.',
  },
  정관: {
    score: 69, label: '정관운 — 직업·명예',
    yearly: '직업과 명예운이 올라오는 해다. 인정받을 기회가 오고 책임 있는 역할에서 빛을 발한다. 원칙을 지키고 정당한 방식으로 나아가는 것이 오히려 기회가 된다.',
    daily: '책임감이 강해지는 날이다. 맡은 역할을 묵묵히 처리하면 인정받는다. 원칙대로 행동하는 것이 장기적으로 유리한 하루다.',
  },
  편인: {
    score: 62, label: '편인운 — 직관·탐구',
    yearly: '직관이 살아나고 배움의 기운이 강한 해다. 새로운 것을 배우고 연구하기 좋지만, 시작하고 중단하는 패턴이 생기기 쉽다. 하나를 끝까지 완성하는 것을 의식적으로 챙겨야 한다.',
    daily: '직관이 살아나는 날이다. 아이디어가 뚜렷하게 떠오르고, 혼자 생각하는 시간이 유익하다. 시작한 일은 완성까지 책임지는 것이 중요하다.',
  },
  정인: {
    score: 71, label: '정인운 — 학문·귀인',
    yearly: '귀인의 도움과 학문·자기계발의 기운이 강한 해다. 좋은 멘토나 스승을 만나기 쉽고, 배운 것이 실력으로 쌓이는 시기다. 쉬면서 내면을 채우는 것이 오히려 도약의 준비가 된다.',
    daily: '좋은 도움이 오거나 배우는 기회가 생기는 날이다. 겸손하게 받아들이면 뜻밖의 지혜나 지원이 따른다.',
  },
};

function pillarFromDate(year, month, day) {
  try {
    const ec = Solar.fromYmd(year, month, day).getLunar().getEightChar();
    return {
      yearGan: ec.getYearGan(), yearZhi: ec.getYearZhi(),
      monthGan: ec.getMonthGan(), dayGan: ec.getDayGan(), dayZhi: ec.getDayZhi(),
    };
  } catch { return null; }
}

function pad2(n) { return String(n).padStart(2, '0'); }

export function analyzeYearlyFortune(birth) {
  try {
    const userPillar = pillarFromDate(birth.year, birth.month, birth.day);
    if (!userPillar) return null;
    const dayGan = userPillar.dayGan;

    const now = new Date();
    const cy = now.getFullYear(), cm = now.getMonth() + 1, cd = now.getDate();

    const todayP = pillarFromDate(cy, cm, cd);
    const nyP = pillarFromDate(cy + 1, 1, 15);
    if (!todayP) return null;

    const todayDayTG  = tenGod(dayGan, todayP.dayGan);
    const todayMonTG  = tenGod(dayGan, todayP.monthGan);
    const thisYearTG  = tenGod(dayGan, todayP.yearGan);
    const nextYearTG  = nyP ? tenGod(dayGan, nyP.yearGan) : null;

    const dayF  = TG_FORTUNE[todayDayTG]  || TG_FORTUNE['비견'];
    const tyF   = TG_FORTUNE[thisYearTG]  || TG_FORTUNE['비견'];
    const nyF   = nextYearTG ? (TG_FORTUNE[nextYearTG] || TG_FORTUNE['비견']) : null;

    const monMod = (TG_FORTUNE[todayMonTG]?.score || 60) >= 68 ? 4 : -3;
    const todayScore = Math.min(95, Math.max(30, dayF.score + monMod));

    return {
      dayGan,
      today: {
        dateStr: `${cy}.${pad2(cm)}.${pad2(cd)}`,
        gan: todayP.dayGan, zhi: todayP.dayZhi,
        tenGod: todayDayTG, score: todayScore,
        label: dayF.label, text: dayF.daily,
      },
      thisYear: {
        year: cy, gan: todayP.yearGan, zhi: todayP.yearZhi,
        animal: ZHI_ANIMAL[todayP.yearZhi] || '',
        tenGod: thisYearTG, score: tyF.score,
        label: tyF.label, text: tyF.yearly,
      },
      nextYear: nyP ? {
        year: cy + 1, gan: nyP.yearGan, zhi: nyP.yearZhi,
        animal: ZHI_ANIMAL[nyP.yearZhi] || '',
        tenGod: nextYearTG, score: nyF?.score || 60,
        label: nyF?.label || nextYearTG, text: nyF?.yearly || '',
      } : null,
    };
  } catch { return null; }
}
