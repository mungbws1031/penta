import { runEngine } from './engine.js';
import { renderReport } from './report.js';
import { analyzeCompat } from './compat.js';
import { renderCompat } from './compatReport.js';
import { drawThree } from './tarot.js';
import { renderTarotBoard, revealedCard } from './tarotView.js';
import { buildProfileCardSVG, buildCompatCardSVG } from './shareCard.js';
import { downloadSVGAsPNG } from './share.js';
import { bindReportToc } from './reportToc.js';

function bindShare(btnId, svgString, filename) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = '이미지 만드는 중…';
    try { await downloadSVGAsPNG(svgString, filename); btn.textContent = '저장 완료 ✓'; }
    catch (e) { console.error(e); btn.textContent = '저장 실패'; }
    finally { setTimeout(() => { btn.disabled = false; btn.textContent = orig; }, 1500); }
  });
}

const MBTIS = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];

function fillMbti(sel, withPlaceholder) {
  if (withPlaceholder) sel.add(new Option('선택', '', true, true));
  MBTIS.forEach(m => sel.add(new Option(m, m)));
}

// 타로 보드를 container에 띄우고, 3장 선택이 끝나면 onComplete(spread) 호출.
function runTarotPick(container, onComplete) {
  const spread = drawThree(Math.random); // 3장 미리 결정(과거/현재/미래)
  container.innerHTML = renderTarotBoard();
  const pickCountEl = container.querySelector('#pick-count');
  const slotsEl = container.querySelector('#picked-slots');
  let picked = 0;
  container.querySelectorAll('.tcard.back').forEach(btn => btn.addEventListener('click', () => {
    if (btn.disabled || picked >= 3) return;
    btn.disabled = true;
    slotsEl.insertAdjacentHTML('beforeend', revealedCard(spread[picked]));
    picked += 1;
    pickCountEl.textContent = String(picked);
    if (picked === 3) setTimeout(() => onComplete(spread), 700);
  }));
  container.querySelector('#tarot-board')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 탭 네비게이션 =====
const navButtons = document.querySelectorAll('.nav button');
const views = document.querySelectorAll('.view');
navButtons.forEach(btn => btn.addEventListener('click', () => {
  navButtons.forEach(b => b.classList.toggle('active', b === btn));
  const target = btn.dataset.view;
  views.forEach(v => v.classList.toggle('active', v.id === `view-${target}`));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}));

// ===== 프로파일 (입력 → 타로 → 통합 결과) =====
const mbtiSel = document.getElementById('mbti');
fillMbti(mbtiSel, true);
const nameInput = document.getElementById('name');

const hourUnknown = document.getElementById('hourUnknown');
hourUnknown.addEventListener('change', () => { document.getElementById('hour').disabled = hourUnknown.checked; });

const resultEl = document.getElementById('result');

function showProfileResult(input, spread) {
  try {
    const result = runEngine(input);
    resultEl.innerHTML = renderReport(result, spread);
    bindReportToc(resultEl);
    bindShare('share-btn', buildProfileCardSVG(result, spread), 'penta-profile.png');
    const r = document.getElementById('restart-btn');
    if (r) r.addEventListener('click', () => { resultEl.innerHTML = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    resultEl.innerHTML = `<p class="note">분석 오류: ${err.message}</p>`; console.error(err);
  }
}

document.getElementById('penta-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!mbtiSel.value) { alert('MBTI를 선택하세요.'); return; }
  const input = {
    birth: {
      year: +document.getElementById('year').value, month: +document.getElementById('month').value,
      day: +document.getElementById('day').value,
      hour: hourUnknown.checked ? null : +document.getElementById('hour').value,
      calendar: document.querySelector('input[name=cal]:checked').value,
      gender: document.querySelector('input[name=gender]:checked').value,
    },
    mbti: mbtiSel.value, blood: document.getElementById('blood').value, name: nameInput.value.trim(),
    digit: document.getElementById('digit').value,
  };
  // 입력 확정 → 타로 3장 뽑기 → 통합 결과
  runTarotPick(resultEl, (spread) => showProfileResult(input, spread));
});

// ===== 궁합 =====
document.querySelectorAll('#compat-form .c-mbti').forEach(sel => fillMbti(sel, true));
const compatResultEl = document.getElementById('compat-result');

function readPerson(scope) {
  const g = scope.querySelector('.c-gender:checked')?.value || 'male';
  return {
    birth: {
      year: +scope.querySelector('.c-year').value, month: +scope.querySelector('.c-month').value,
      day: +scope.querySelector('.c-day').value, hour: null, calendar: 'solar', gender: g,
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
    bindShare('compat-share-btn', buildCompatCardSVG(result), 'penta-compat.png');
    const rb = document.getElementById('compat-restart');
    if (rb) rb.addEventListener('click', () => { compatResultEl.innerHTML = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.getElementById('compat-report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    compatResultEl.innerHTML = `<p class="note">궁합 분석 오류: ${err.message}</p>`; console.error(err);
  }
});
