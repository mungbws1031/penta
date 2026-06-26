import { AXES } from './axes.js';
import { computeAxis } from './consensus.js';
import { mbtiSignals } from './mbti.js';
import { sunSign, zodiacSignals } from './zodiac.js';
import { bloodSignals } from './bloodtype.js';
import { sajuSignals, sajuDayElement } from './saju.js';
import { strengthCounts } from './strengths.js';
import { analyzeName } from './nameology.js';
import { analyzeDigitRatio } from './digitRatio.js';
import { analyzeFortune } from './fortune.js';
import { analyzeSajuDetail } from './sajuDetail.js';
import { analyzeZiwei } from './ziwei.js';

const BASE_WEIGHT = { 사주:1.0, MBTI:1.0, 별자리:0.6, 혈액형:0.3 };

export function runEngine(input) {
  const { birth, mbti, blood, name, digit } = input;

  const saju = sajuSignals(birth);
  const sajuCounts = saju.counts;
  const dayElement = sajuDayElement(birth);
  const sign = sunSign(birth.month, birth.day);
  const sys = {
    사주: saju.signals,
    MBTI: mbtiSignals(mbti),
    별자리: zodiacSignals(sign),
    혈액형: bloodSignals(blood),
  };
  const weight = { ...BASE_WEIGHT, 사주: saju.timeUnknown ? 0.85 : 1.0 };

  const axes = AXES.map(meta => {
    const entries = Object.keys(sys).map(system => ({
      system,
      signal: sys[system][meta.id],
      weight: weight[system],
      counted: system !== '혈액형',
    }));
    const r = computeAxis(entries);
    const poleLabel = r.resultPole > 0 ? meta.plus : r.resultPole < 0 ? meta.minus : '균형';
    return { ...meta, ...r, poleLabel };
  });

  const strengths = strengthCounts({ sajuCounts, mbti, sign });
  const nameAnalysis = name ? analyzeName(name, dayElement) : null;
  const digitAnalysis = analyzeDigitRatio(digit);
  const fortune = analyzeFortune(sajuCounts, birth);
  const sajuDetail = analyzeSajuDetail(birth, sajuCounts);

  const ziwei = analyzeZiwei(birth);
  return { axes, strengths, sajuTimeUnknown: saju.timeUnknown, sunSign: sign, dayElement, mbti, name: nameAnalysis, digit: digitAnalysis, fortune, sajuDetail, ziwei, birthYear: birth.year };
}
