import { Solar, Lunar } from 'lunar-javascript';
import { scoreLuck } from './luckScore.js';
import { SHENG, KE } from './ganzhi.js';

// 천간 → 오행/음양
const GAN_INFO = {
  甲:{e:'목',yin:false}, 乙:{e:'목',yin:true}, 丙:{e:'화',yin:false}, 丁:{e:'화',yin:true},
  戊:{e:'토',yin:false}, 己:{e:'토',yin:true}, 庚:{e:'금',yin:false}, 辛:{e:'금',yin:true},
  壬:{e:'수',yin:false}, 癸:{e:'수',yin:true},
};

const clamp = (n, lo = 18, hi = 96) => Math.max(lo, Math.min(hi, Math.round(n)));

// 일간 기준 다른 천간의 십성
export function tenGod(dayGan, other) {
  const d = GAN_INFO[dayGan], o = GAN_INFO[other];
  if (!d || !o) return null;
  const same = d.yin === o.yin;
  if (d.e === o.e) return same ? '비견' : '겁재';
  if (SHENG[d.e] === o.e) return same ? '식신' : '상관';
  if (KE[d.e] === o.e) return same ? '편재' : '정재';
  if (KE[o.e] === d.e) return same ? '편관' : '정관';
  if (SHENG[o.e] === d.e) return same ? '편인' : '정인';
  return '비견';
}

// 사주 본명(natal) 십성 카운트 → 가족 인연 점수 (성별 반영)
export function relationFortune(counts, gender) {
  const c = k => counts[k] || 0;
  const isFemale = gender === 'female';

  // 배우자성: 남=재성(정재+편재), 여=관성(정관+편관); 상관은 관성을 극해 여성 배우자운 손상
  const spouse = isFemale
    ? clamp(42 + c('정관') * 12 + c('편관') * 7 - c('상관') * 5)
    : clamp(42 + c('정재') * 12 + c('편재') * 7 - c('겁재') * 3);

  // 자식성: 남=관성, 여=식상
  const child = isFemale
    ? clamp(42 + c('식신') * 14 + c('상관') * 7)
    : clamp(42 + c('정관') * 12 + c('편관') * 8);

  // 부모: 인성=어머니, 재성(편재)=아버지
  const parent = clamp(45 + c('정인') * 12 + c('편인') * 5 + c('편재') * 8 + c('정재') * 4);

  // 형제: 비견=형제, 겁재=경쟁형 형제(2개 이상이면 갈등)
  const sibling = clamp(42 + c('비견') * 14 + c('겁재') * 3 - Math.max(0, c('겁재') - 1) * 5);

  return { 배우자: spouse, 자식: child, 부모: parent, 형제: sibling };
}

// 사주 본명(natal) 십성 카운트 → 4대 운 점수
export function natalFortune(counts) {
  const c = k => counts[k] || 0;
  return {
    재물: clamp(40 + c('정재') * 14 + c('편재') * 10 + (c('식신') + c('상관')) * 4),
    성공: clamp(40 + c('정관') * 14 + c('편관') * 8 + (c('정인') + c('편인')) * 5),
    연애: clamp(42 + (c('정재') + c('편재')) * 8 + (c('식신') + c('상관')) * 8 + (c('정관') + c('편관')) * 4),
    건강: clamp(55 + (c('정인') + c('편인')) * 8 + (c('비견') + c('겁재')) * 5 - c('편관') * 6),
  };
}

// 대운 천간 십성 → 그 시기 종합 운세 가중
const TENGOD_FORTUNE = {
  정관: 16, 정재: 14, 편재: 12, 식신: 10, 정인: 8, 편인: 2,
  비견: 2, 상관: -2, 겁재: -8, 편관: -12,
};

const TENGOD_LABEL = {
  정관: '명예·직장운', 편관: '시련·압박', 정재: '재물운', 편재: '활동·투자운',
  식신: '표현·여유', 상관: '변화·구설', 정인: '학업·안정', 편인: '재능·고독',
  비견: '협력·경쟁', 겁재: '경쟁·지출',
};

// 대운 타임라인. birth: { year, month, day, hour, calendar, gender }
// ctx: { strength, gyeokguk } — 대운 길흉을 이 사주의 용신·격국 기준으로 평가
export function lifeTimeline(birth, ctx) {
  try {
    const { year, month, day, hour, calendar, gender } = birth;
    const h = hour == null ? 12 : hour;
    const solar = calendar === 'lunar'
      ? Lunar.fromYmdHms(year, month, day, h, 0, 0).getSolar()
      : Solar.fromYmdHms(year, month, day, h, 0, 0);
    const ec = solar.getLunar().getEightChar();
    const dayGan = ec.getDayGan();
    const yun = ec.getYun(gender === 'female' ? 0 : 1);
    const list = yun.getDaYun() || [];

    const periods = [];
    list.forEach(dy => {
      const gz = dy.getGanZhi();
      if (!gz) return; // 기운(起運) 전 구간 제외
      const gan = gz.charAt(0);
      const god = tenGod(dayGan, gan);
      if (!god) return;
      // 용신·격국 기준 길흉. ctx 없으면 일반 십신표로 폴백.
      const overall = ctx
        ? scoreLuck(god, 50, ctx).score
        : clamp(50 + (TENGOD_FORTUNE[god] || 0));
      periods.push({
        startAge: dy.getStartAge(),
        ganZhi: gz,
        tenGod: god,
        label: TENGOD_LABEL[god] || '',
        overall,
      });
    });
    if (periods.length < 2) return { periods: [], lows: [], peak: null };

    const overalls = periods.map(p => p.overall);
    const minV = Math.min(...overalls), maxV = Math.max(...overalls);
    const lows = periods.filter(p => p.overall === minV).map(p => p.startAge);
    const peak = periods.find(p => p.overall === maxV) || null;
    return { periods, lows, peak: peak ? peak.startAge : null, minV, maxV };
  } catch (e) {
    return { periods: [], lows: [], peak: null };
  }
}

export function analyzeFortune(counts, birth, ctx) {
  return {
    natal: natalFortune(counts),
    relation: relationFortune(counts, birth.gender),
    gender: birth.gender,
    timeline: lifeTimeline(birth, ctx),
  };
}
