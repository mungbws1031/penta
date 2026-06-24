import { runEngine } from './engine.js';
import { renderReport } from './report.js';

const MBTIS = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const STRENGTHS = ['논리','언어','공간','신체','음악','대인','자기성찰','자연','창의','실행력','직관','분석'];

const mbtiSel = document.getElementById('mbti');
MBTIS.forEach(m => mbtiSel.add(new Option(m, m)));
const sf = document.getElementById('strengths');
STRENGTHS.forEach(s => {
  const l = document.createElement('label');
  l.innerHTML = `<input type="checkbox" name="strength" value="${s}" /> ${s}`;
  sf.appendChild(l);
});

sf.addEventListener('change', () => {
  const checked = sf.querySelectorAll('input:checked');
  const boxes = sf.querySelectorAll('input[type=checkbox]');
  boxes.forEach(b => { b.disabled = !b.checked && checked.length >= 3; });
});

const hourUnknown = document.getElementById('hourUnknown');
hourUnknown.addEventListener('change', () => {
  document.getElementById('hour').disabled = hourUnknown.checked;
});

document.getElementById('penta-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const selected = [...sf.querySelectorAll('input:checked')].map(b => b.value);
  if (selected.length !== 3) { alert('강점을 정확히 3개 선택하세요.'); return; }
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
    document.getElementById('result').innerHTML = renderReport(runEngine(input));
  } catch (err) {
    document.getElementById('result').innerHTML = `<p class="note">분석 오류: ${err.message}</p>`;
    console.error(err);
  }
});
