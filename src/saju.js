const AXIS_MEMBERS = {
  A1: { plus: ['식신','상관','비견','겁재'], minus: ['정인','편인'] },
  A2: { plus: ['정인','편인','편관'],       minus: ['정재','편재','식신'] },
  A3: { plus: ['정관','편관','정재','편재'], minus: ['정인','편인','식신','상관'] },
  A4: { plus: ['정관','정인','정재'],       minus: ['상관','편재','겁재'] },
  A5: { plus: ['비견','겁재','편관'],       minus: ['정인','편인'] },
};

function diffToSignal(diff) {
  if (diff >= 2) return 1;
  if (diff === 1) return 0.5;
  if (diff === 0) return 0;
  if (diff === -1) return -0.5;
  return -1;
}

export function clustersToSignals(counts) {
  const out = {};
  for (const [axis, { plus, minus }] of Object.entries(AXIS_MEMBERS)) {
    const sum = keys => keys.reduce((a, k) => a + (counts[k] || 0), 0);
    out[axis] = diffToSignal(sum(plus) - sum(minus));
  }
  return out;
}

import { Solar, Lunar } from 'lunar-javascript';

const ZH2KO = {
  '比肩':'비견','劫財':'겁재','劫财':'겁재','食神':'식신','傷官':'상관','伤官':'상관',
  '偏財':'편재','偏财':'편재','正財':'정재','正财':'정재','七殺':'편관','七杀':'편관',
  '正官':'정관','偏印':'편인','正印':'정인',
};
const EMPTY = () => ({ 비견:0,겁재:0,식신:0,상관:0,편재:0,정재:0,편관:0,정관:0,편인:0,정인:0 });

function addGod(counts, zh) {
  const ko = ZH2KO[zh];
  if (ko) counts[ko] += 1;
}

export function tallyTenGods(birth) {
  const { year, month, day, hour, calendar } = birth;
  const timeUnknown = hour == null;
  const h = timeUnknown ? 12 : hour;
  const solar = calendar === 'lunar'
    ? Lunar.fromYmdHms(year, month, day, h, 0, 0).getSolar()
    : Solar.fromYmdHms(year, month, day, h, 0, 0);
  const ec = solar.getLunar().getEightChar();

  const counts = EMPTY();
  addGod(counts, ec.getYearShiShenGan());
  addGod(counts, ec.getMonthShiShenGan());
  if (!timeUnknown) addGod(counts, ec.getTimeShiShenGan());
  const firstOf = arr => (arr && arr.length ? arr[0] : null);
  [ec.getYearShiShenZhi(), ec.getMonthShiShenZhi(), ec.getDayShiShenZhi()]
    .forEach(arr => { const g = firstOf(arr); if (g) addGod(counts, g); });
  if (!timeUnknown) { const g = firstOf(ec.getTimeShiShenZhi()); if (g) addGod(counts, g); }

  return { counts, timeUnknown };
}

export function sajuSignals(birth) {
  const { counts, timeUnknown } = tallyTenGods(birth);
  return { signals: clustersToSignals(counts), timeUnknown };
}
