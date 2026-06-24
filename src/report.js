const stars = n => '★'.repeat(n) + '☆'.repeat(Math.max(0, 3 - n));

function catchphrase(axes) {
  const strong = axes.filter(a => a.stars >= 3 && a.resultPole !== 0);
  if (strong.length) {
    return `${strong.length}개 렌즈가 한 방향을 가리키는 너: ` +
      strong.map(a => a.poleLabel).join(' · ');
  }
  return '여러 렌즈가 입체적으로 엇갈리는, 단순하지 않은 너';
}

function axisRow(a) {
  const conflict = a.conflict ? ' <span class="conflict">충돌·입체</span>' : '';
  const who = a.contributingSystems.join(', ') || '신호 약함';
  return `<li><b>${a.label}</b>: ${a.poleLabel} <span class="badge">${stars(a.stars)}</span>${conflict}<br><small>${who}</small></li>`;
}

function strengthBlock(strengths) {
  const top = strengths.filter(s => s.count >= 2).map(s => `${s.name}(${s.count})`);
  return `<p>시스템 추론 강점: ${top.join(', ') || '뚜렷한 합의 없음'}</p>`;
}

function gapBlock(gap) {
  const fmt = arr => arr.join(', ') || '-';
  return `<ul class="gap">
    <li>확인된 강점: ${fmt(gap.confirmed)}</li>
    <li>숨은 강점: ${fmt(gap.hidden)}</li>
    <li>키워온 강점: ${fmt(gap.nurtured)}</li>
  </ul>`;
}

export function renderReport(result) {
  const { axes, strengths, gap, sajuTimeUnknown, sunSign } = result;
  const timeNote = sajuTimeUnknown
    ? `<p class="note">※ 시주(출생시) 없이 추정 — 내면·말년 영역 정밀도가 낮습니다.</p>` : '';
  return `
    <section class="report">
      <h2 class="catch">${catchphrase(axes)}</h2>
      <p class="sub">태양궁: ${sunSign}</p>
      <h3>성격 5축</h3>
      <ul class="axes">${axes.map(axisRow).join('')}</ul>
      <h3>강점</h3>
      ${strengthBlock(strengths)}
      <h3>갭 분석</h3>
      ${gapBlock(gap)}
      ${timeNote}
      <p class="disclaimer">이 결과는 <b>재미용 셀프 분석</b>입니다. 과학적·확정적 예측이 아닙니다.</p>
    </section>`;
}
