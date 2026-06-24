import { readingText } from './tarot.js';

const BOARD_SIZE = 12; // 펼쳐 놓을 카드 수

export function renderTarotIntro() {
  return `
  <section class="tarot">
    <div class="hero">
      <p class="hero-sub">시간축 · 타로 3장 스프레드</p>
      <h2 class="catch"><span class="hl">과거 · 현재 · 미래</span><br>카드를 펼쳐볼까?</h2>
      <p class="sun">덱을 섞고, 마음 가는 카드 3장을 골라.</p>
    </div>
    <div class="actions"><button type="button" id="tarot-shuffle" class="submit">🔮 카드 셔플하기</button></div>
  </section>`;
}

export function boardCards() {
  let cells = '';
  for (let i = 0; i < BOARD_SIZE; i++) {
    cells += `<button type="button" class="tcard back" data-idx="${i}" aria-label="카드 ${i+1}">✦</button>`;
  }
  return cells;
}

export function renderTarotBoard() {
  return `
  <section class="tarot" id="tarot-board">
    <div class="hero">
      <p class="hero-sub">덱을 섞었어 · <span id="pick-count">0</span>/3 선택</p>
      <h2 class="catch"><span class="hl">3장을 골라</span></h2>
    </div>
    <div class="tboard">${boardCards()}</div>
    <div class="picked-slots" id="picked-slots"></div>
  </section>`;
}

// 뒤집힌 한 장 카드(결과 위치)
export function revealedCard(slot) {
  const orient = slot.reversed ? 'rev' : 'up';
  const arrow = slot.reversed ? '🔻역' : '🔼정';
  const meaning = slot.reversed ? slot.card.reversed : slot.card.upright;
  return `<div class="tcard face ${orient}">
    <span class="t-pos">${slot.position}</span>
    <span class="t-emoji">${slot.card.emoji}</span>
    <span class="t-name">${slot.card.name}</span>
    <span class="t-orient">${arrow}</span>
    <span class="t-mean">${meaning}</span>
  </div>`;
}

export function renderTarotResult(spread) {
  const cards = spread.map(revealedCard).join('');
  const lines = spread.map(s => `<li>${readingText(s)}</li>`).join('');
  return `
  <section class="report tarot" id="tarot-result">
    <div class="hero">
      <p class="hero-sub">너의 타로 3장</p>
      <h2 class="catch"><span class="hl">과거 · 현재 · 미래</span></h2>
    </div>
    <div class="tresult">${cards}</div>
    <div class="card"><h3>흐름 읽기</h3><ul class="t-readings">${lines}</ul></div>
    <p class="disclaimer">타로는 <b>지금 이 순간의 변동값</b>입니다. 뽑을 때마다 달라지는 재미용 메시지예요.</p>
    <div class="actions"><button type="button" id="tarot-again" class="ghost">다시 뽑기</button></div>
  </section>`;
}
