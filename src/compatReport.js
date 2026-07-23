const verdictClass = v => v === '합' ? 'v-good' : v === '충' ? 'v-bad' : 'v-mid';
const scoreClass = s => s >= 75 ? 'yf-good' : s >= 55 ? 'yf-mid' : 'yf-low';

function systemRow(s) {
  return `<div class="compat-row">
    <span class="cr-name">${s.name}</span>
    <span class="cr-bar"><i style="width:${s.score}%"></i></span>
    <span class="cr-verdict ${verdictClass(s.verdict)}">${s.verdict}</span>
    <p class="cr-note">${s.note}</p>
  </div>`;
}

function domainCard(d) {
  return `<div class="cd-item">
    <div class="cd-head"><span class="cd-label">${d.icon} ${d.label}</span><span class="cd-score">${d.score}</span></div>
    <div class="cd-bar"><i class="${scoreClass(d.score)}" style="width:${d.score}%"></i></div>
    <p class="cd-text">${d.text}</p>
  </div>`;
}

function pointList(title, arr, cls, empty) {
  const items = arr.length ? arr.map(t => `<li>${t}</li>`).join('') : `<li class="empty">${empty}</li>`;
  return `<div class="pt-col ${cls}"><h4>${title}</h4><ul>${items}</ul></div>`;
}

export function renderCompat(result) {
  const { totalPercent, grade, systems, domains, goodPoints, frictionPoints,
    narrative, advice, signA, signB, dayGanA, dayGanB } = result;

  return `
  <section class="report" id="compat-report">
    <div class="hero">
      <p class="hero-sub">${signA} ✕ ${signB} · 일간 ${dayGanA}·${dayGanB}</p>
      <div class="big-percent">${totalPercent}<span>%</span></div>
      <h2 class="catch"><span class="hl">${grade}</span></h2>
    </div>

    <div class="card">
      <h3>영역별 궁합 <small>연애 · 결혼 · 소통 · 가치관</small></h3>
      <div class="cd-grid">${domains.map(domainCard).join('')}</div>
    </div>

    <div class="card">
      <h3>사주로 본 두 사람 <small>일간 · 배우자궁 · 용신 · 배우자성</small></h3>
      <div class="narrative">${narrative.map(p => `<p>${p}</p>`).join('')}</div>
    </div>

    <div class="card">
      <h3>시스템별 합 · 충 <small>7개 렌즈</small></h3>
      <div class="compat-grid">${systems.map(systemRow).join('')}</div>
    </div>

    <div class="card">
      <h3>잘 맞는 / 부딪히는 지점</h3>
      <div class="pt-grid">
        ${pointList('🟢 잘 맞는 지점', goodPoints, 'pt-good', '뚜렷한 합 없음 — 무난한 흐름')}
        ${pointList('🔴 부딪히는 지점', frictionPoints, 'pt-bad', '큰 충 없음 — 평온한 흐름')}
      </div>
    </div>

    <div class="card">
      <h3>💡 관계 조언</h3>
      <p class="compat-advice">${advice}</p>
    </div>

    <p class="disclaimer">이 결과는 <b>재미용</b>입니다. 관계는 숫자보다 두 사람의 노력으로 만들어집니다.</p>
    <div class="actions">
      <button type="button" id="compat-share-btn" class="submit" style="max-width:320px">📸 궁합 이미지로 저장</button>
      <div class="action-row">
        <button type="button" id="compat-pdf-btn" class="ghost">📄 PDF로 저장</button>
        <button type="button" id="compat-kakao-btn" class="ghost">💬 카카오톡 공유</button>
      </div>
      <div style="margin-top:10px"><button type="button" id="compat-restart" class="ghost">다시 하기</button></div>
    </div>
  </section>`;
}
