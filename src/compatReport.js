const verdictClass = v => v === '합' ? 'v-good' : v === '충' ? 'v-bad' : 'v-mid';

function systemRow(s) {
  return `<div class="compat-row">
    <span class="cr-name">${s.name}</span>
    <span class="cr-bar"><i style="width:${s.score}%"></i></span>
    <span class="cr-verdict ${verdictClass(s.verdict)}">${s.verdict}</span>
    <p class="cr-note">${s.note}</p>
  </div>`;
}

function pointList(title, arr, cls, empty) {
  const items = arr.length ? arr.map(t => `<li>${t}</li>`).join('') : `<li class="empty">${empty}</li>`;
  return `<div class="pt-col ${cls}"><h4>${title}</h4><ul>${items}</ul></div>`;
}

export function renderCompat(result) {
  const { totalPercent, systems, goodPoints, frictionPoints, signA, signB } = result;
  const mood = totalPercent >= 75 ? '천생연분 흐름' : totalPercent >= 55 ? '잘 굴러가는 사이' : '서로 노력이 필요한 사이';
  return `
  <section class="report" id="compat-report">
    <div class="hero">
      <p class="hero-sub">두 사람 · ${signA} ✕ ${signB}</p>
      <div class="big-percent">${totalPercent}<span>%</span></div>
      <h2 class="catch"><span class="hl">${mood}</span></h2>
    </div>

    <div class="card">
      <h3>시스템별 합 · 충</h3>
      <div class="compat-grid">${systems.map(systemRow).join('')}</div>
    </div>

    <div class="card">
      <h3>잘 맞는 / 부딪히는 지점</h3>
      <div class="pt-grid">
        ${pointList('🟢 잘 맞는 지점', goodPoints, 'pt-good', '뚜렷한 합 없음')}
        ${pointList('🔴 부딪히는 지점', frictionPoints, 'pt-bad', '큰 충 없음')}
      </div>
    </div>

    <p class="disclaimer">이 결과는 <b>재미용</b>입니다. 관계는 숫자보다 두 사람의 노력으로 만들어집니다.</p>
    <div class="actions"><button type="button" id="compat-restart" class="ghost">다시 하기</button></div>
  </section>`;
}
