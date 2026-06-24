import { runEngine } from './engine.js';
import { renderReport } from './report.js';

const MBTIS = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const STRENGTHS = ['논리','언어','공간','신체','음악','대인','자기성찰','자연','창의','실행력','직관','분석'];

const mbtiSel = document.getElementById('mbti');
mbtiSel.add(new Option('선택', '', true, true));
MBTIS.forEach(m => mbtiSel.add(new Option(m, m)));

const sf = document.getElementById('strengths');
const sOptions = sf.querySelector('.s-options');
const countHint = sf.querySelector('.count-hint');
const submitBtn = document.getElementById('submit-btn');

STRENGTHS.forEach(s => {
  const l = document.createElement('label');
  l.innerHTML = `<input type="checkbox" name="strength" value="${s}" /> ${s}`;
  sOptions.appendChild(l);
});

// 강점은 정확히 3개까지. 3개 차면 나머지 비활성 + 카운트/제출버튼 갱신.
sf.addEventListener('change', () => {
  const checked = sOptions.querySelectorAll('input:checked');
  sOptions.querySelectorAll('input[type=checkbox]').forEach(b => {
    b.disabled = !b.checked && checked.length >= 3;
  });
  countHint.textContent = `${checked.length} / 3 선택`;
  submitBtn.disabled = checked.length !== 3;
});
submitBtn.disabled = true;

const hourUnknown = document.getElementById('hourUnknown');
hourUnknown.addEventListener('change', () => {
  document.getElementById('hour').disabled = hourUnknown.checked;
});

const resultEl = document.getElementById('result');

function bindReportActions() {
  const restart = document.getElementById('restart-btn');
  if (restart) restart.addEventListener('click', () => {
    resultEl.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.getElementById('penta-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const selected = [...sOptions.querySelectorAll('input:checked')].map(b => b.value);
  if (selected.length !== 3) { alert('강점을 정확히 3개 선택하세요.'); return; }
  if (!mbtiSel.value) { alert('MBTI를 선택하세요.'); return; }

  const input = {
    birth: {
      year: +document.getElementById('year').value,
      month: +document.getElementById('month').value,
      day: +document.getElementById('day').value,
      hour: hourUnknown.checked ? null : +document.getElementById('hour').value,
      calendar: document.querySelector('input[name=cal]:checked').value,
      gender: document.querySelector('input[name=gender]:checked').value,
    },
    mbti: mbtiSel.value,
    blood: document.getElementById('blood').value,
    selectedStrengths: selected,
  };

  try {
    resultEl.innerHTML = renderReport(runEngine(input));
    bindReportActions();
    document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    resultEl.innerHTML = `<p class="note">분석 오류: ${err.message}</p>`;
    console.error(err);
  }
});
