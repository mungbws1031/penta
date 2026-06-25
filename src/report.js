import { renderRadarSVG } from './radar.js';
import { zodiacDetail } from './zodiacInfo.js';
import { revealedCard } from './tarotView.js';
import { temperamentNarrative, strengthNarrative, timeNarrative, nameNarrative, digitNarrative } from './narrative.js';

const stars = n => '★'.repeat(n) + '☆'.repeat(Math.max(0, 3 - n));

function catchphrase(axes) {
  // ★★★ = 3개 시스템(렌즈) 일치. 그 축들의 극을 캐치프레이즈로.
  const strong = axes.filter(a => a.stars >= 3 && a.resultPole !== 0);
  if (strong.length) {
    return `세 렌즈가 한 곳을 가리키는 너,<br><span class="hl">${strong.map(a => a.poleLabel).join(' · ')}</span>`;
  }
  const twos = axes.filter(a => a.stars >= 2 && a.resultPole !== 0);
  if (twos.length) {
    return `여러 렌즈가 겹쳐 보이는 너,<br><span class="hl">${twos.map(a => a.poleLabel).join(' · ')}</span>`;
  }
  if (axes.some(a => a.conflict)) {
    return `여러 렌즈가 엇갈리는,<br><span class="hl">단순하지 않은 입체적인 너</span>`;
  }
  return `여러 렌즈로 비춰 본<br><span class="hl">너의 통합 프로파일</span>`;
}

function systemChips(list) {
  if (!list.length) return `<span class="chip muted">신호 약함</span>`;
  return list.map(s => `<span class="chip">${s}</span>`).join('');
}

function axisCard(a) {
  const conflict = a.conflict ? `<span class="tag conflict">충돌 · 입체</span>` : '';
  return `<div class="axis-card">
    <div class="axis-head">
      <span class="axis-label">${a.label}</span>
      <span class="axis-pole">${a.poleLabel}</span>
      <span class="badge" title="근거 시스템 ${a.stars}개">${stars(a.stars)}</span>
    </div>
    <div class="axis-foot">${systemChips(a.contributingSystems)}${conflict}</div>
  </div>`;
}

function strengthChips(strengths) {
  const ranked = [...strengths].sort((a, b) => b.count - a.count);
  return ranked.map(s => {
    const cls = s.count >= 3 ? 'gold' : s.count === 2 ? 'silver' : s.count === 1 ? 'bronze' : 'zero';
    return `<span class="s-chip ${cls}">${s.name}<i>${s.count}</i></span>`;
  }).join('');
}

function digitBlock(d) {
  if (!d) return '';
  return `<div class="card">
    <h3>손가락 비율 <small>2D:4D · 태내 호르몬</small></h3>
    <div class="narrative">${digitNarrative(d)}</div>
  </div>`;
}

function nameBlock(nameAnalysis) {
  if (!nameAnalysis) return '';
  return `<div class="card">
    <h3>성명학 <small>소리오행 · 점수 ${nameAnalysis.score}</small></h3>
    <div class="narrative">${nameNarrative(nameAnalysis)}</div>
  </div>`;
}

function zodiacBlock(sunSign) {
  const z = zodiacDetail(sunSign);
  if (!z) return '';
  return `<div class="card zodiac-card">
    <h3>별자리 <small>${z.sign}</small></h3>
    <div class="z-meta">
      <span class="z-pill">${z.elementLabel}</span>
      <span class="z-pill">${z.modalityLabel}</span>
      <span class="z-pill">${z.polarity}(陰陽)</span>
    </div>
    <p class="z-blurb">${z.blurb}</p>
  </div>`;
}

function tarotBlock(spread) {
  if (!spread || !spread.length) return '';
  return `<div class="card">
    <h3>과거 · 현재 · 미래 <small>타로 시간축</small></h3>
    <div class="tresult">${spread.map(revealedCard).join('')}</div>
    <div class="narrative">${timeNarrative(spread)}</div>
  </div>`;
}

export function renderReport(result, spread) {
  const { axes, strengths, sajuTimeUnknown, sunSign } = result;
  const timeNote = sajuTimeUnknown
    ? `<p class="note">※ 시주(출생시) 없이 추정 — 내면·말년 영역 정밀도가 낮습니다.</p>` : '';

  return `
  <section class="report" id="report">
    <div class="hero">
      <p class="hero-sub">★★★ = 3개 렌즈 일치 · 신뢰도 배지</p>
      <h2 class="catch">${catchphrase(axes)}</h2>
      <p class="sun">☀ 태양궁 <b>${sunSign}</b></p>
    </div>

    <div class="card radar-card">
      <h3>일치도 레이더</h3>
      <div class="radar-wrap">${renderRadarSVG(axes)}</div>
    </div>

    ${zodiacBlock(sunSign)}

    <div class="card">
      <h3>성격 5축</h3>
      <div class="axis-grid">${axes.map(axisCard).join('')}</div>
    </div>

    <div class="card">
      <h3>타고난 기질 풀이</h3>
      <div class="narrative">${temperamentNarrative(result, result.dayElement)}</div>
    </div>

    ${digitBlock(result.digit)}

    <div class="card">
      <h3>강점 <small>(숫자 = 근거 시스템 수)</small></h3>
      <div class="s-grid">${strengthChips(strengths)}</div>
      <div class="narrative" style="margin-top:14px">${strengthNarrative(result)}</div>
    </div>

    ${nameBlock(result.name)}

    ${tarotBlock(spread)}

    ${timeNote}
    <p class="disclaimer">이 결과는 <b>재미용 셀프 분석</b>입니다. 과학적·확정적 예측이 아닙니다.</p>

    <div class="actions">
      <button type="button" id="share-btn" class="submit" style="max-width:320px">📸 결과 이미지로 저장</button>
      <div style="margin-top:10px"><button type="button" id="restart-btn" class="ghost">다시 하기</button></div>
    </div>
  </section>`;
}
