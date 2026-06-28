import { renderRadarSVG } from './radar.js';
import { zodiacDetail } from './zodiacInfo.js';
import { revealedCard } from './tarotView.js';
import { temperamentNarrative, strengthNarrative, timeNarrative, nameNarrative, digitNarrative, fortuneNarrative, sajuNarrative, radarNarrative, synthesisNarrative, synthesisSummary, relationNarrative, ziweiNarrative, zodiacNarrative, workplaceNarrative, strengthBalanceNarrative, hapchungNarrative, gyeokgukNarrative, evidenceNarrative } from './narrative.js';
import { renderFortuneBars, renderLifeGraph, renderRelationBars } from './fortuneGraph.js';
import { OHAENG_COLOR } from './sajuDetail.js';

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

function sajuBlock(detail) {
  if (!detail) return '';
  const { pillars, ohaeng, tenGodGroups } = detail;

  // 사주 팔자 표
  const cols = [pillars.time, pillars.day, pillars.month, pillars.year].filter(Boolean);
  const headers = pillars.time
    ? ['시(時)', '일(日)', '월(月)', '년(年)']
    : ['일(日)', '월(月)', '년(年)'];
  const tableHtml = `<table class="saju-table">
    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
    <tr>${cols.map(p => `<td class="saju-gan" style="color:${OHAENG_COLOR[p.ganEl]}">${p.ganKo}(${p.gan})</td>`).join('')}</tr>
    <tr>${cols.map(p => `<td class="saju-el">${p.ganEl}</td>`).join('')}</tr>
    <tr class="saju-sep"><td colspan="${cols.length}"></td></tr>
    <tr>${cols.map(p => `<td class="saju-zhi" style="color:${OHAENG_COLOR[p.zhiEl]}">${p.zhiKo}(${p.zhi})</td>`).join('')}</tr>
    <tr>${cols.map(p => `<td class="saju-el">${p.zhiEl} · ${p.animal}</td>`).join('')}</tr>
  </table>`;

  // 오행 균형 막대
  const total = Math.max(1, Object.values(ohaeng).reduce((a, b) => a + b, 0));
  const OHAENG_KO = { 목:'木 목', 화:'火 화', 토:'土 토', 금:'金 금', 수:'水 수' };
  const ohaengHtml = Object.entries(ohaeng).map(([el, cnt]) => {
    const pct = Math.round(cnt / total * 100);
    return `<div class="oh-row">
      <span class="oh-label">${OHAENG_KO[el]}</span>
      <div class="oh-track"><div class="oh-fill" style="width:${pct}%;background:${OHAENG_COLOR[el]}"></div></div>
      <span class="oh-cnt">${cnt}</span>
    </div>`;
  }).join('');

  // 십성 5그룹 칩
  const tgHtml = Object.entries(tenGodGroups).map(([g, cnt]) => {
    const cls = cnt >= 3 ? 'tg-high' : cnt >= 2 ? 'tg-mid' : cnt >= 1 ? 'tg-low' : 'tg-zero';
    return `<span class="tg-chip ${cls}">${g} <i>${cnt}</i></span>`;
  }).join('');

  const timeNote = pillars.timeUnknown
    ? '<p class="note">※ 출생 시간 미입력 — 시주(時柱) 제외</p>' : '';

  return `<div class="card">
    <h3>사주 풀이 <small>四柱八字 · 日主 분석</small></h3>
    <h4 class="f-sub">사주 팔자 (四柱八字)</h4>
    ${tableHtml}
    ${timeNote}
    <h4 class="f-sub">오행 균형 <small>천간·지지 합산</small></h4>
    <div class="oh-bars">${ohaengHtml}</div>
    <h4 class="f-sub">십성 분포 <small>비겁·식상·재성·관성·인성</small></h4>
    <div class="tg-chips">${tgHtml}</div>
    <div class="narrative" style="margin-top:14px">${sajuNarrative(detail)}</div>
  </div>`;
}

function strengthBlock(strength, hapchung, gyeokguk) {
  const html = strengthBalanceNarrative(strength);
  if (!html) return '';
  const gk = gyeokgukNarrative(gyeokguk);
  const hc = hapchungNarrative(hapchung);
  return `<div class="card">
    <h3>격국·신강신약·용신 <small>格局 · 身强身弱 · 用神</small></h3>
    ${gk ? `<h4 class="f-sub">격국(格局) — 사주의 그릇</h4><div class="narrative">${gk}</div><div class="sb-div"></div>` : ''}
    <div class="narrative">${html}</div>
    ${hc ? `<h4 class="f-sub" style="margin-top:18px">지지 관계 · 합충(合沖)</h4><div class="narrative">${hc}</div>` : ''}
  </div>`;
}

function fortuneBlock(f) {
  if (!f) return '';
  return `<div class="card">
    <h3>재물 · 성공 · 연애운 <small>+ 인생의 고비</small></h3>
    ${renderFortuneBars(f.natal)}
    <h4 class="f-sub">인생 운세 흐름 <small>10년 단위 대운</small></h4>
    <div class="life-graph">${renderLifeGraph(f.timeline)}</div>
    <div class="narrative">${fortuneNarrative(f)}</div>
  </div>`;
}

function workplaceBlock(sajuDetail) {
  const html = workplaceNarrative(sajuDetail);
  if (!html) return '';
  return `<div class="card">
    <h3>직장에서의 평가 <small>조직운 · 십성 기준</small></h3>
    <div class="narrative">${html}</div>
  </div>`;
}

function relationBlock(fortune, sajuDetail) {
  if (!fortune?.relation) return '';
  return `<div class="card">
    <h3>가족 인연운 <small>배우자 · 자식 · 부모 · 형제</small></h3>
    ${renderRelationBars(fortune.relation)}
    <div class="narrative" style="margin-top:14px">${relationNarrative(fortune, sajuDetail)}</div>
  </div>`;
}

function digitBlock(d) {
  if (!d) return '';
  return `<div class="card">
    <h3>손가락 비율 <small>2D:4D · 태내 호르몬</small></h3>
    <div class="narrative">${digitNarrative(d)}</div>
  </div>`;
}

function ziweiBlock(ziwei) {
  if (!ziwei) return '';
  const { mingongKo, bureauKo, mainStars, profiles } = ziwei;
  const starLabel = profiles.length
    ? profiles.map(p => p.nameKo).join(' · ')
    : '공궁(空宮)';
  return `<div class="card ziwei-card">
    <h3>자미두수 명궁 <small>紫微斗數 · 命宮 + 主星</small></h3>
    <div class="zw-meta">
      <span class="zw-pill">명궁 <b>${mingongKo}</b></span>
      <span class="zw-pill">오행국 <b>${bureauKo}</b></span>
      <span class="zw-pill">주성 <b>${starLabel}</b></span>
    </div>
    <div class="narrative" style="margin-top:14px">${ziweiNarrative(ziwei)}</div>
  </div>`;
}

function yearlyFortuneBlock(yf) {
  if (!yf) return '';
  const scoreClass = s => s >= 70 ? 'yf-good' : s >= 55 ? 'yf-mid' : 'yf-low';
  const bar = (score) => `
    <div class="yf-bar-row">
      <div class="yf-bar-wrap"><div class="yf-bar-fill ${scoreClass(score)}" style="width:${score}%"></div></div>
      <span class="yf-score">${score}</span>
    </div>`;
  const aspectsHtml = (list) => !list ? '' : `
    <div class="yf-aspects">
      ${list.map(a => `
        <div class="yf-aspect">
          <span class="yf-aspect-label">${a.icon} ${a.label}</span>
          <span class="yf-aspect-text">${a.text}</span>
        </div>`).join('')}
    </div>`;
  const period = (title, sub, p) => `
    <div class="yf-period">
      <div class="yf-period-head">
        <span class="yf-period-title">${title}</span>
        <span class="yf-period-sub">${sub}</span>
        <span class="yf-tg-badge">${p.label}</span>
      </div>
      ${bar(p.score)}
      ${p.yongNote ? `<p class="yf-yong">${p.yongNote}</p>` : ''}
      ${p.climate ? `<p class="yf-climate">${p.climate}</p>` : ''}
      <p class="yf-text">${p.flow}</p>
      ${aspectsHtml(p.aspects)}
      ${p.advice ? `<p class="yf-advice"><b>한 줄 조언</b> · ${p.advice}</p>` : ''}
    </div>`;

  const monthsHtml = (yf) => {
    if (!yf.months?.length) return '';
    const rows = yf.months.map(mo => `
      <div class="ym-row ${mo.kind || ''}">
        <div class="ym-head">
          <span class="ym-m">${mo.month}월</span>
          <span class="ym-gz">${mo.gan}${mo.zhi}</span>
        </div>
        <div class="ym-body">
          <div class="ym-line">
            <span class="ym-tg">${mo.tenGod}</span>
            <div class="ym-bar"><div class="yf-bar-fill ${scoreClass(mo.score)}" style="width:${mo.score}%"></div></div>
            <span class="ym-score">${mo.score}</span>
          </div>
          <p class="ym-text">${mo.text}</p>
        </div>
      </div>`).join('');
    return `<h4 class="f-sub" style="margin-top:20px">올해 월별 흐름 <small>1월~12월 월운(月運)</small></h4>
      <p class="ym-summary">기운이 가장 좋은 달 <b class="good">${yf.bestMonth}월</b> · 조심할 달 <b class="bad">${yf.worstMonth}월</b></p>
      <div class="yf-months">${rows}</div>`;
  };

  const { today, thisYear, nextYear, dayGan } = yf;
  return `<div class="card yf-card">
    <h3>오늘 · 올해 · 내년 운세 <small>세운 · 일운 · 일간(${dayGan}) 기준</small></h3>
    ${period('오늘의 운세', `${today.dateStr} · ${today.gan}${today.zhi}일`, today)}
    ${period('올해의 운세', `${thisYear.year}년 ${thisYear.gan}${thisYear.zhi} · ${thisYear.animal}의 해`, thisYear)}
    ${monthsHtml(yf)}
    ${nextYear ? period('내년의 운세', `${nextYear.year}년 ${nextYear.gan}${nextYear.zhi} · ${nextYear.animal}의 해`, nextYear) : ''}
  </div>`;
}

function summaryBlock(result) {
  const html = synthesisSummary(result);
  if (!html) return '';
  return `<div class="card summary-card">
    <h3>종합 한눈에 <small>핵심만 먼저</small></h3>
    ${html}
  </div>`;
}

function sinjeomBlock(s) {
  if (!s) return '';
  const { guardian, subGuardian, sinki, sinkiText, salList, samjae, gongsu, dayElKo, dayZhiKo } = s;
  const sinkiCls = sinki >= 75 ? 'yf-good' : sinki >= 55 ? 'yf-mid' : 'yf-low';

  const salHtml = salList.length
    ? salList.map(sal => `
        <div class="sj-sal">
          <span class="sj-sal-name">${sal.emoji} ${sal.name}</span>
          <span class="sj-sal-text">${sal.text}</span>
        </div>`).join('')
    : `<p class="sj-none">올해 두드러지는 신살(神煞)은 잡히지 않는다 — 큰 굴곡 없이 평탄하게 흐르는 해다.</p>`;

  const subHtml = subGuardian
    ? `<div class="sj-sub">
        <span class="sj-sub-name">${subGuardian.emoji} 부신(副神) · ${subGuardian.name}</span>
        <span class="sj-sub-text">${subGuardian.text}</span>
       </div>`
    : '';

  const samjaeHtml = samjae
    ? `<div class="sj-samjae">
        <span class="sj-samjae-head">⚠ 삼재(三災) · ${samjae.phase}</span>
        <p>${samjae.text}</p>
       </div>`
    : '';

  return `<div class="card sinjeom-card">
    <h3>신점 (神占) <small>몸주신 · 신살 · 공수</small></h3>

    <div class="sj-guardian">
      <div class="sj-g-emoji">${guardian.emoji}</div>
      <div class="sj-g-body">
        <div class="sj-g-name">몸주신 · ${guardian.name}</div>
        <div class="sj-g-nature">${guardian.nature} <span class="sj-g-src">일간 ${dayElKo} 기준</span></div>
        <p class="sj-g-text">${guardian.personality}</p>
        <p class="sj-g-guard"><b>가호</b> · ${guardian.guard}</p>
        <div class="zw-keywords">${guardian.keywords.map(k => `<span class="chip">${k}</span>`).join('')}</div>
      </div>
    </div>
    ${subHtml}

    <h4 class="f-sub">신기(神氣) 지수 <small>직관·영적 감수성</small></h4>
    <div class="yf-bar-row">
      <div class="yf-bar-wrap"><div class="yf-bar-fill ${sinkiCls}" style="width:${sinki}%"></div></div>
      <span class="yf-score">${sinki}</span>
    </div>
    <p class="yf-text">${sinkiText}</p>
    ${s.sinkiInfo ? `
      <div class="sj-sinki">
        <div class="sj-sinki-row"><span class="sj-sinki-k">이런 특징</span>
          <ul class="sj-sinki-list">${s.sinkiInfo.traits.map(t => `<li>${t}</li>`).join('')}</ul></div>
        <div class="sj-sinki-row"><span class="sj-sinki-k good">살리는 법</span><span class="sj-sinki-v">${s.sinkiInfo.use}</span></div>
        <div class="sj-sinki-row"><span class="sj-sinki-k caution">주의할 점</span><span class="sj-sinki-v">${s.sinkiInfo.caution}</span></div>
      </div>` : ''}

    <h4 class="f-sub">올해 신살(神煞) 점검</h4>
    <div class="sj-sals">${salHtml}</div>
    ${samjaeHtml}

    <div class="sj-gongsu">
      <div class="sj-gongsu-head">🔔 공수 — ${guardian.name.split('(')[0]}의 한마디</div>
      <p class="sj-gongsu-text">${gongsu}</p>
    </div>

    <div class="sj-remedy">
      <b>비방(秘方) · 액막이</b><br>
      길한 방향 <b>${guardian.direction}</b> · 길한 색 <b>${guardian.color}</b><br>
      ${guardian.remedy}
    </div>

    <p class="nv-foot">무속의 신령·신살을 사주 지지(地支)로 풀어낸 재미용 해석입니다. 실제 신점·굿과는 무관해요.</p>
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
    <div class="narrative">${zodiacNarrative(sunSign)}</div>
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

    ${summaryBlock(result)}

    <div class="card radar-card">
      <h3>일치도 레이더 <small>5축 성향 · ★ = 시스템 일치 수</small></h3>
      <div class="radar-wrap">${renderRadarSVG(axes)}</div>
      <div class="narrative" style="margin-top:12px">${radarNarrative(axes)}</div>
    </div>

    ${sajuBlock(result.sajuDetail)}

    ${strengthBlock(result.strength, result.hapchung, result.gyeokguk)}

    ${ziweiBlock(result.ziwei)}

    ${sinjeomBlock(result.sinjeom)}

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

    ${fortuneBlock(result.fortune)}

    ${workplaceBlock(result.sajuDetail)}

    ${relationBlock(result.fortune, result.sajuDetail)}

    ${yearlyFortuneBlock(result.yearlyFortune)}

    ${nameBlock(result.name)}

    ${tarotBlock(spread)}

    <div class="card synthesis-card">
      <h3>종합 의견 <small>5개 시스템 통합 분석</small></h3>
      <div class="narrative">${synthesisNarrative(result)}</div>
    </div>

    <div class="card evidence-card">
      <h3>🔬 과학적 근거 노트 <small>학술 문헌 기준</small></h3>
      <div class="narrative">${evidenceNarrative()}</div>
    </div>

    ${timeNote}
    <p class="disclaimer">이 결과는 <b>재미용 셀프 분석</b>입니다. 과학적·확정적 예측이 아닙니다.</p>

    <div class="actions">
      <button type="button" id="share-btn" class="submit" style="max-width:320px">📸 결과 이미지로 저장</button>
      <div style="margin-top:10px"><button type="button" id="restart-btn" class="ghost">다시 하기</button></div>
    </div>
  </section>`;
}
