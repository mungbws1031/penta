import { describe, it, expect } from 'vitest';
import { buildProfileCardSVG, buildCompatCardSVG, CARD_W, CARD_H } from '../src/shareCard.js';
import { runEngine } from '../src/engine.js';
import { analyzeCompat } from '../src/compat.js';

const profile = runEngine({
  birth: { year:1990, month:5, day:15, hour:10, calendar:'solar', gender:'male' },
  mbti: 'ENTJ', blood: 'O', selectedStrengths: ['논리','실행력','분석'],
});

describe('buildProfileCardSVG', () => {
  it('지정 크기의 SVG + PENTA + 별 배지 + 태양궁 포함', () => {
    const svg = buildProfileCardSVG(profile);
    expect(svg).toMatch(/^<svg[\s\S]*<\/svg>$/);
    expect(svg).toContain(`viewBox="0 0 ${CARD_W} ${CARD_H}"`);
    expect(svg).toContain('PENTA');
    expect(svg).toMatch(/[★☆]/);
    expect(svg).toContain('태양궁');
    expect(svg).toContain('재미용');
  });
  it('XML 특수문자를 이스케이프(원시 < > & 없음)', () => {
    const svg = buildProfileCardSVG(profile);
    // 태그 사이 텍스트 노드에 원시 앰퍼샌드가 남지 않아야 함
    expect(svg).not.toMatch(/&(?!amp;|lt;|gt;|#)/);
  });
});

describe('buildCompatCardSVG', () => {
  it('궁합 % 와 시스템 합/충을 포함', () => {
    const compat = analyzeCompat(
      { birth:{year:1990,month:5,day:15,hour:10,calendar:'solar',gender:'male'}, mbti:'ENTJ', blood:'O' },
      { birth:{year:1992,month:11,day:3,hour:14,calendar:'solar',gender:'female'}, mbti:'INFP', blood:'A' },
    );
    const svg = buildCompatCardSVG(compat);
    expect(svg).toContain('%');
    expect(svg).toContain('PENTA');
    expect(svg).toMatch(/합|충|중립/);
  });
});
