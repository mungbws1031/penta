import { runEngine } from './engine.js';
import { renderReport } from './report.js';
import { analyzeCompat } from './compat.js';
import { renderCompat } from './compatReport.js';
import { drawThree } from './tarot.js';
import { renderTarotIntro, renderTarotBoard, revealedCard, renderTarotResult } from './tarotView.js';

const MBTIS = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const STRENGTHS = ['논리','언어','공간','신체','음악','대인','자기성찰','자연','창의','실행력','직관','분석'];

function fillMbti(sel, withPlaceholder) {
  if (withPlaceholder) sel.add(new Option('선택', '', true, true));
  MBTIS.forEach(m => sel.add(new Option(m, m)));
}

// ===== 탭 네비게이션 =====
const navButtons = document.querySelectorAll('.nav button');
const views = document.querySelectorAll('.view');
let tarotInitialized = false;
navButtons.forEach(btn => btn.addEventListener('click', () => {
  navButtons.forEach(b => b.classList.toggle('active', b === btn));
  const target = btn.dataset.view;
  views.forEach(v => v.classList.toggle('active', v.id === `view-${target}`));
  if (target === 'tarot' && !tarotInitialized) { initTarot(); tarotInitialized = true; }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}));

// ===== 프로파일 =====
const mbtiSel = document.getElementById('mbti');
fillMbti(mbtiSel, true);

const sf = document.getElementById('strengths');
const sOptions = sf.querySelector('.s-options');
const countHint = sf.querySelector('.count-hint');
const submitBtn = document.getElementById('submit-btn');
STRENGTHS.forEach(s => {
  const l = document.createElement('label');
  l.innerHTML = `<input type="checkbox" name="strength" value="${s}" /> ${s}`;
  sOptions.appendChild(l);
});
sf.addEventListener('change', () => {
  const checked = sOptions.querySelectorAll('input:checked');
  sOptions.querySelectorAll('input[type=checkbox]').forEach(b => { b.disabled = !b.checked && checked.length >= 3; });
  countHint.textContent = `${checked.length} / 3 선택`;
  submitBtn.disabled = checked.length !== 3;
});
submitBtn.disabled = true;

const hourUnknown = document.getElementById('hourUnknown');
hourUnknown.addEventListener('change', () => { document.getElementById('hour').disabled = hourUnknown.checked; });

const resultEl = document.getElementById('result');
document.getElementById('penta-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const selected = [...sOptions.querySelectorAll('input:checked')].map(b => b.value);
  if (selected.length !== 3) { alert('강점을 정확히 3개 선택하세요.'); return; }
  if (!mbtiSel.value) { alert('MBTI를 선택하세요.'); return; }
  const input = {
    birth: {
      year: +document.getElementById('year').value, month: +document.getElementById('month').value,
      day: +document.getElementById('day').value,
      hour: hourUnknown.checked ? null : +document.getElementById('hour').value,
      calendar: document.querySelector('input[name=cal]:checked').value,
      gender: document.querySelector('input[name=gender]:checked').value,
    },
    mbti: mbtiSel.value, blood: document.getElementById('blood').value, selectedStrengths: selected,
  };
  try {
    resultEl.innerHTML = renderReport(runEngine(input));
    const r = document.getElementById('restart-btn');
    if (r) r.addEventListener('click', () => { resultEl.innerHTML = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    resultEl.innerHTML = `<p class="note">분석 오류: ${err.message}</p>`; console.error(err);
  }
});

// ===== 궁합 =====
document.querySelectorAll('#compat-form .c-mbti').forEach(sel => fillMbti(sel, true));
const compatResultEl = document.getElementById('compat-result');

function readPerson(scope) {
  return {
    birth: {
      year: +scope.querySelector('.c-year').value, month: +scope.querySelector('.c-month').value,
      day: +scope.querySelector('.c-day').value, hour: null, calendar: 'solar', gender: 'male',
    },
    mbti: scope.querySelector('.c-mbti').value,
    blood: scope.querySelector('.c-blood').value,
  };
}
document.getElementById('compat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const blocks = document.querySelectorAll('#compat-form .person-block');
  try {
    const result = analyzeCompat(readPerson(blocks[0]), readPerson(blocks[1]));
    compatResultEl.innerHTML = renderCompat(result);
    const rb = document.getElementById('compat-restart');
    if (rb) rb.addEventListener('click', () => { compatResultEl.innerHTML = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.getElementById('compat-report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    compatResultEl.innerHTML = `<p class="note">궁합 분석 오류: ${err.message}</p>`; console.error(err);
  }
});

// ===== 타로 =====
const tarotArea = document.getElementById('tarot-area');
function initTarot() {
  tarotArea.innerHTML = renderTarotIntro();
  document.getElementById('tarot-shuffle').addEventListener('click', startTarotBoard);
}
function startTarotBoard() {
  const spread = drawThree(Math.random); // 3장 미리 결정
  tarotArea.innerHTML = renderTarotBoard();
  const pickCountEl = document.getElementById('pick-count');
  const slotsEl = document.getElementById('picked-slots');
  let picked = 0;
  tarotArea.querySelectorAll('.tcard.back').forEach(btn => btn.addEventListener('click', () => {
    if (btn.disabled || picked >= 3) return;
    btn.disabled = true;
    const slot = spread[picked];
    slotsEl.insertAdjacentHTML('beforeend', revealedCard(slot));
    picked += 1;
    pickCountEl.textContent = String(picked);
    if (picked === 3) {
      setTimeout(() => {
        tarotArea.innerHTML = renderTarotResult(spread);
        document.getElementById('tarot-again').addEventListener('click', initTarot);
        document.getElementById('tarot-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    }
  }));
}
