// 공유 카드 SVG 생성 (1080×1350, 인스타 세로). foreignObject 없이 순수 <text>/<rect>로
// 구성해 캔버스 PNG 변환이 안정적이게 한다.

export const CARD_W = 1080;
export const CARD_H = 1350;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const stars = n => '★'.repeat(n) + '☆'.repeat(Math.max(0, 3 - n));

function frame(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_W} ${CARD_H}" width="${CARD_W}" height="${CARD_H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f0c29"/>
      <stop offset="0.5" stop-color="#241f47"/>
      <stop offset="1" stop-color="#15132e"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff4cf"/>
      <stop offset="1" stop-color="#f0c75e"/>
    </linearGradient>
  </defs>
  <rect width="${CARD_W}" height="${CARD_H}" fill="url(#bg)"/>
  <rect x="24" y="24" width="${CARD_W - 48}" height="${CARD_H - 48}" rx="36" fill="none" stroke="rgba(240,199,94,0.35)" stroke-width="2"/>
  <text x="${CARD_W / 2}" y="120" text-anchor="middle" font-family="system-ui, sans-serif" font-size="64" font-weight="800" letter-spacing="14" fill="url(#gold)">PENTA</text>
  ${inner}
  <text x="${CARD_W / 2}" y="${CARD_H - 70}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="26" fill="#a39fc8">재미용 셀프 분석 · penta</text>
</svg>`;
}

const FF = `font-family="system-ui, 'Apple SD Gothic Neo', sans-serif"`;

export function buildProfileCardSVG(result) {
  const { axes, strengths, sunSign } = result;
  const strong = axes.filter(a => a.stars >= 3 && a.resultPole !== 0);
  const headline = strong.length
    ? strong.map(a => a.poleLabel).join(' · ')
    : (axes.some(a => a.conflict) ? '단순하지 않은 입체적인 나' : '5개 렌즈로 비춘 나');

  let y = 210;
  let out = `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" ${FF} font-size="34" fill="#cdc7f0">여러 렌즈가 가리키는 너</text>`;
  y += 78;
  out += `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" ${FF} font-size="56" font-weight="800" fill="url(#gold)">${esc(headline)}</text>`;
  y += 64;
  out += `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" ${FF} font-size="30" fill="#a39fc8">☀ 태양궁 ${esc(sunSign)}</text>`;

  y += 90;
  out += `<text x="90" y="${y}" ${FF} font-size="34" font-weight="700" fill="#ece9ff">성격 5축</text>`;
  y += 24;
  axes.forEach(a => {
    y += 70;
    out += `<text x="90" y="${y}" ${FF} font-size="34" fill="#a39fc8">${esc(a.label)}</text>`;
    out += `<text x="300" y="${y}" ${FF} font-size="36" font-weight="700" fill="#ece9ff">${esc(a.poleLabel)}</text>`;
    out += `<text x="${CARD_W - 90}" y="${y}" text-anchor="end" ${FF} font-size="38" fill="#f0c75e" letter-spacing="4">${stars(a.stars)}</text>`;
  });

  y += 96;
  out += `<text x="90" y="${y}" ${FF} font-size="34" font-weight="700" fill="#ece9ff">강점</text>`;
  const top = strengths.filter(s => s.count >= 2).map(s => `${s.name}(${s.count})`);
  y += 56;
  out += `<text x="90" y="${y}" ${FF} font-size="32" fill="#f0c75e">${esc(top.join('  ·  ') || '뚜렷한 합의 없음')}</text>`;

  return frame(out);
}

export function buildCompatCardSVG(result) {
  const { totalPercent, systems, signA, signB } = result;
  const mood = totalPercent >= 75 ? '천생연분 흐름' : totalPercent >= 55 ? '잘 굴러가는 사이' : '서로 노력이 필요한 사이';

  let y = 220;
  let out = `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" ${FF} font-size="34" fill="#cdc7f0">${esc(signA)} ✕ ${esc(signB)}</text>`;
  y += 200;
  out += `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" ${FF} font-size="180" font-weight="800" fill="url(#gold)">${totalPercent}%</text>`;
  y += 70;
  out += `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" ${FF} font-size="48" font-weight="700" fill="#ece9ff">${esc(mood)}</text>`;

  y += 120;
  out += `<text x="90" y="${y}" ${FF} font-size="34" font-weight="700" fill="#ece9ff">시스템별 합 · 충</text>`;
  const color = v => v === '합' ? '#6ee7a8' : v === '충' ? '#ff8a8a' : '#c7c2e8';
  systems.forEach(s => {
    y += 78;
    out += `<text x="90" y="${y}" ${FF} font-size="36" fill="#a39fc8">${esc(s.name)}</text>`;
    out += `<text x="320" y="${y}" ${FF} font-size="36" font-weight="700" fill="${color(s.verdict)}">${esc(s.verdict)}</text>`;
    out += `<text x="${CARD_W - 90}" y="${y}" text-anchor="end" ${FF} font-size="32" fill="#ece9ff">${s.score}점</text>`;
  });

  return frame(out);
}
