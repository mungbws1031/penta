// 운세 시각화 (의존성 없는 SVG/HTML 문자열)

const ICON = { 재물: '💰', 성공: '🏆', 연애: '💕', 건강: '🌿' };

export function renderFortuneBars(natal) {
  return `<div class="f-bars">` + Object.entries(natal).map(([k, v]) => `
    <div class="f-row">
      <span class="f-name">${ICON[k] || ''} ${k}운</span>
      <span class="f-bar"><i style="width:${v}%"></i></span>
      <span class="f-score">${v}</span>
    </div>`).join('') + `</div>`;
}

const W = 680, H = 250, PADL = 34, PADR = 18, PADT = 26, PADB = 52;
const VMIN = 15, VMAX = 97;

export function renderLifeGraph(timeline) {
  const periods = timeline.periods || [];
  if (periods.length < 2) {
    return `<p class="note">대운 정보를 계산할 수 없어 인생 흐름 그래프는 생략됐습니다(출생 정보 확인).</p>`;
  }
  const n = periods.length;
  const x = i => PADL + i * (W - PADL - PADR) / (n - 1);
  const y = v => PADT + (1 - (v - VMIN) / (VMAX - VMIN)) * (H - PADT - PADB);

  // 가로 기준선
  let grid = '';
  [25, 50, 75].forEach(v => {
    grid += `<line x1="${PADL}" y1="${y(v).toFixed(1)}" x2="${W - PADR}" y2="${y(v).toFixed(1)}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
  });

  const pts = periods.map((p, i) => [x(i), y(p.overall)]);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  // 면적 채우기
  const area = `M${pts[0][0].toFixed(1)},${(H - PADB).toFixed(1)} ` +
    pts.map(p => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
    ` L${pts[n - 1][0].toFixed(1)},${(H - PADB).toFixed(1)} Z`;

  let dots = '', labels = '';
  periods.forEach((p, i) => {
    const isLow = (timeline.lows || []).includes(p.startAge);
    const isPeak = timeline.peak === p.startAge;
    const color = isLow ? '#ff8a8a' : isPeak ? '#f0c75e' : '#cdc7f0';
    const r = isLow || isPeak ? 6 : 4;
    dots += `<circle cx="${pts[i][0].toFixed(1)}" cy="${pts[i][1].toFixed(1)}" r="${r}" fill="${color}"/>`;
    if (isLow) labels += `<text x="${pts[i][0].toFixed(1)}" y="${(pts[i][1] - 12).toFixed(1)}" text-anchor="middle" fill="#ff8a8a" font-size="12" font-weight="700">고비</text>`;
    if (isPeak) labels += `<text x="${pts[i][0].toFixed(1)}" y="${(pts[i][1] - 12).toFixed(1)}" text-anchor="middle" fill="#f0c75e" font-size="12" font-weight="700">전성기</text>`;
    // 나이 축
    labels += `<text x="${pts[i][0].toFixed(1)}" y="${(H - PADB + 20).toFixed(1)}" text-anchor="middle" fill="#a39fc8" font-size="11">${p.startAge}세</text>`;
  });

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="인생 운세 흐름 그래프" xmlns="http://www.w3.org/2000/svg">
    ${grid}
    <path d="${area}" fill="rgba(240,199,94,0.12)"/>
    <path d="${path}" fill="none" stroke="#f0c75e" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
    ${labels}
  </svg>`;
}
