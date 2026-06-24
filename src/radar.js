// 5축 일치도 레이더 차트 (의존성 없는 SVG 문자열 생성).
// axes: engine 출력의 axes 배열 [{ label, plus, minus, resultPole, stars, weightedLean }]

// weightedLean 의 이론적 최대(한 축 전부 같은 극): 1.0+1.0+0.6+0.3 = 2.9 근사.
const MAX_LEAN = 2.9;
const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 120; // 최대 반지름

function pointAt(angleDeg, radius) {
  const a = (angleDeg - 90) * (Math.PI / 180); // -90 => 12시 방향 시작
  return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)];
}

export function renderRadarSVG(axes) {
  const n = axes.length;
  const step = 360 / n;

  // 배경 격자(동심 오각형 4겹)
  const rings = [0.25, 0.5, 0.75, 1].map(f => {
    const pts = axes.map((_, i) => pointAt(i * step, R * f).map(v => v.toFixed(1)).join(',')).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`;
  }).join('');

  // 축 스포크 + 라벨
  let spokes = '';
  let labels = '';
  axes.forEach((ax, i) => {
    const [x, y] = pointAt(i * step, R);
    spokes += `<line x1="${CX}" y1="${CY}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`;
    const [lx, ly] = pointAt(i * step, R + 22);
    const pole = ax.resultPole > 0 ? ax.plus : ax.resultPole < 0 ? ax.minus : ax.label;
    const anchor = Math.abs(lx - CX) < 8 ? 'middle' : lx > CX ? 'start' : 'end';
    labels += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" fill="#cdc7f0" font-size="12" font-weight="600">${pole}</text>`;
  });

  // 데이터 폴리곤: |lean| 정규화 반지름
  const dataPts = axes.map((ax, i) => {
    const mag = Math.min(Math.abs(ax.weightedLean) / MAX_LEAN, 1);
    const r = R * mag;
    return pointAt(i * step, r);
  });
  const polyStr = dataPts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  const dots = dataPts.map(p =>
    `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="#f0c75e"/>`
  ).join('');

  return `<svg viewBox="0 0 ${SIZE} ${SIZE}" width="100%" role="img" aria-label="일치도 레이더 차트" xmlns="http://www.w3.org/2000/svg">
    ${rings}
    ${spokes}
    <polygon points="${polyStr}" fill="rgba(240,199,94,0.22)" stroke="#f0c75e" stroke-width="2" stroke-linejoin="round"/>
    ${dots}
    ${labels}
  </svg>`;
}
