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
import { analyzeYearlyFortune } from './yearlyFortune.js';
import { analyzeStrength } from './strength.js';
import { analyzeHapchung } from './hapchung.js';
import { analyzeGyeokguk } from './gyeokguk.js';

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
  const sajuDetail = analyzeSajuDetail(birth, sajuCounts);

  // 격국·강약·용신을 먼저 산출해 대운/세운 길흉 평가에 사용
  const strength = analyzeStrength(sajuDetail);
  const gyeokguk = analyzeGyeokguk(sajuDetail, sajuCounts);
  const luckCtx = { strength, gyeokguk };

  const fortune = analyzeFortune(sajuCounts, birth, luckCtx);
  const ziwei = analyzeZiwei(birth);
  const hapchung = analyzeHapchung(sajuDetail);
  const yearlyFortune = analyzeYearlyFortune(birth, sajuDetail.pillars?.dayGan, luckCtx);
  return { axes, strengths, sajuTimeUnknown: saju.timeUnknown, sunSign: sign, dayElement, mbti, name: nameAnalysis, digit: digitAnalysis, fortune, sajuDetail, ziwei, strength, hapchung, gyeokguk, yearlyFortune, birthYear: birth.year };
}
