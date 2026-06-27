import { zodiacDetail } from './zodiacInfo.js';
import { DAY_GAN_PROFILE, TENGOD_GROUP_TEXT, OHAENG_CAREER } from './sajuDetail.js';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ===== 타고난 기질: 축별 서술 =====
const AXIS_TEXT = {
  A1: {
    '외향': '사람들 사이에 있을 때 비로소 생기가 도는 유형이다. 말로 생각을 정리하고, 새로운 만남과 활동에서 에너지를 충전한다. 혼자 너무 오래 있으면 가라앉기 쉬우니, 바깥으로 향하는 통로를 늘 열어두는 편이 너답게 사는 길이다.',
    '내향': '안으로 깊어지는 사람이다. 혼자만의 시간에 생각이 정리되고 에너지가 차오르며, 떠들썩한 자리보다 소수의 깊은 관계에서 편안함을 느낀다. 말수가 적다고 마음이 닫힌 것은 아니다 — 안에서 충분히 익힌 뒤에야 꺼내놓을 뿐이다.',
    '균형': '상황에 따라 외향과 내향을 오가는 유연한 에너지의 소유자다. 사람들 속에서 빛나다가도 혼자만의 동굴이 필요해지는, 양쪽의 리듬을 모두 가진 결이다.',
  },
  A2: {
    '직관': '눈앞의 사실보다 그 너머의 가능성과 의미를 먼저 보는 사람이다. 패턴을 읽고 미래를 그리며 \'왜\'와 \'만약\'을 즐긴다. 사소한 디테일을 놓치는 대신, 큰 그림과 숨은 연결을 보는 데 강하다.',
    '현실': '추상보다 구체, 이론보다 경험을 믿는 사람이다. 지금 여기에서 검증된 것, 손에 잡히는 사실에 발을 딛는다. 뜬구름 잡는 이야기보다 실제로 작동하는 방법을 찾는 데 능하다.',
    '균형': '현실 감각과 상상력 사이를 오가는 사람이다. 발은 땅에 두되 시선은 멀리 두는, 실용과 가능성을 함께 저울질하는 결이다.',
  },
  A3: {
    '사고': '판단의 기준이 논리와 객관에 있는 사람이다. 감정에 휘둘리기보다 원인과 결과, 옳고 그름을 따져 결정한다. 때로 냉정해 보일 수 있지만, 그 바탕에는 공정함과 일관성을 지키려는 마음이 있다.',
    '감정': '사람과 관계, 마음의 온도를 먼저 살피는 사람이다. 결정을 내릴 때 \'이게 맞나\'보다 \'누가 다치지 않나, 따뜻한가\'를 먼저 묻는다. 공감의 폭이 넓어, 곁에 있으면 마음이 놓이는 유형이다.',
    '균형': '머리와 가슴을 함께 쓰는 사람이다. 논리로 따지면서도 사람의 마음을 놓치지 않는, 이성과 온기 사이의 균형을 아는 결이다.',
  },
  A4: {
    '계획': '미리 정하고 차근차근 밟아가는 데서 안정을 느끼는 사람이다. 마감과 계획, 정돈된 환경을 좋아하며 일을 끝맺는 힘이 강하다. 갑작스러운 변수보다 예측 가능한 흐름에서 더 잘 작동한다.',
    '유연': '정해진 틀보다 열린 가능성을 좋아하는 사람이다. 즉흥과 변화에 강하고, 마지막 순간에 폭발적으로 몰입하기도 한다. 계획에 묶이기보다 흐름을 타며 상황에 맞춰 길을 내는 유형이다.',
    '균형': '계획과 즉흥 사이를 오가는 사람이다. 큰 틀은 잡되 세부는 열어두는, 질서와 자유를 함께 쥐는 결이다.',
  },
  A5: {
    '주도': '스스로 방향을 정하고 앞장서는 사람이다. 끌려가기보다 끌고 가며, 책임을 지는 자리에서 오히려 힘이 난다. 결단이 빠르고 추진력이 있어, 멈춰 있는 판을 움직이는 역할을 자주 맡는다.',
    '수용': '흐름을 받아들이고 조화를 만드는 사람이다. 앞에서 끌기보다 곁에서 떠받치며, 남의 의견을 품는 그릇이 넓다. 다투어 이기기보다 함께 가는 길을 택하는, 부드러운 힘의 소유자다.',
    '균형': '이끌 때와 따를 때를 아는 사람이다. 나설 자리에선 나서고 물러설 자리에선 물러서는, 주도와 수용의 균형 감각을 지닌 결이다.',
  },
};

function consensusPhrase(a) {
  if (a.conflict) {
    const c = a.contributingSystems.join('·') || '한쪽';
    const d = a.dissentingSystems.join('·') || '다른 쪽';
    return ` 다만 ${c}와 ${d}의 신호가 엇갈린다. 겉으로 드러나는 모습과 속마음이 다른, 입체적인 긴장을 품은 영역이다.`;
  }
  if (a.stars >= 3) return ' 사주·MBTI·별자리 세 렌즈가 모두 이 방향을 가리킨다 — 의심의 여지가 적은, 너의 또렷한 핵심 기질이다.';
  if (a.stars === 2) return ' 두 개의 렌즈가 같은 방향에 동의하는, 비교적 분명한 성향이다.';
  if (a.stars === 1) return ' 한 렌즈에서 도드라지는, 상황에 따라 달라질 수 있는 결이다.';
  return ' 여러 신호가 팽팽해 어느 한쪽으로 단정하기 어려운, 그만큼 유연한 영역이다.';
}

const ELEMENT_TEMPER = {
  목: '나무처럼 위로 뻗는 성장과 추진의 기운',
  화: '불처럼 환하게 퍼지는 열정과 표현의 기운',
  토: '흙처럼 품고 버티는 안정과 신뢰의 기운',
  금: '쇠처럼 단단하고 분명한 결단과 의리의 기운',
  수: '물처럼 스미고 흐르는 지혜와 융통의 기운',
};

export function temperamentNarrative(result, dayElement) {
  const z = zodiacDetail(result.sunSign);
  let html = '';
  const elem = dayElement && ELEMENT_TEMPER[dayElement]
    ? `사주의 일간은 <b>${dayElement}(${ELEMENT_TEMPER[dayElement]})</b>을 타고났고, ` : '';
  if (z) {
    html += `<p>${elem}별자리는 <b>${z.sign}</b> — ${z.blurb} 이 두 바탕 위에, 다섯 렌즈가 함께 비추는 너의 기질을 하나씩 풀어보면 이렇다.</p>`;
  }
  result.axes.forEach(a => {
    const pole = a.poleLabel === '균형' ? '균형' : a.poleLabel;
    const body = (AXIS_TEXT[a.id] && AXIS_TEXT[a.id][pole]) || '';
    html += `<p><b>${a.label} · ${a.poleLabel}</b><br>${body}${consensusPhrase(a)}</p>`;
  });
  return html;
}

// ===== 강점 서술 =====
const STRENGTH_TEXT = {
  논리: '복잡한 것을 구조로 정리하고 인과를 짚어내는 힘이 있다. 문제를 만나면 감정보다 먼저 \'왜 그런가\'를 분해해 답에 다가간다.',
  언어: '생각을 말과 글로 풀어내는 감각이 뛰어나다. 설명하고 설득하고 이야기로 엮는 자리에서 너의 매력이 드러난다.',
  공간: '사물의 형태와 위치, 전체 구조를 머릿속에 그리는 감각이 있다. 손으로 만들고 배치하고 조립하는 영역에서 강점이 빛난다.',
  신체: '몸으로 익히고 표현하는 힘이 좋다. 머리로만이 아니라 직접 움직이고 부딪히며 배우는 유형이다.',
  음악: '리듬과 소리, 분위기를 예민하게 느낀다. 감정을 가락처럼 다루는 섬세함이 너의 무기다.',
  대인: '사람의 마음을 읽고 관계를 잇는 데 능하다. 분위기를 살피고 다리를 놓는 자리에서 자연스럽게 빛난다.',
  자기성찰: '자신의 내면을 들여다보고 성장의 실마리를 찾는 힘이 있다. 혼자만의 사유에서 너의 깊이가 만들어진다.',
  자연: '생명과 환경, 보이지 않는 흐름을 감지하는 감각이 있다. 큰 주기와 균형을 읽는 데 강하다.',
  창의: '익숙한 것을 비틀어 새로움을 만드는 힘이 있다. 정답이 정해지지 않은 자리에서 오히려 진가가 나온다.',
  실행력: '생각을 현실로 옮기는 추진력이 있다. 말로 끝내지 않고 끝내 해내는 마무리의 힘이 너의 강점이다.',
  직관: '근거를 다 따지기 전에 답의 방향을 먼저 감지하는 촉이 있다. 설명하긴 어렵지만 자주 맞는, 너만의 나침반이다.',
  분석: '현상을 쪼개어 핵심을 가려내는 힘이 있다. 데이터와 디테일 속에서 패턴과 의미를 길어 올린다.',
};

export function strengthNarrative(result) {
  const ranked = [...result.strengths].sort((a, b) => b.count - a.count);
  const strong = ranked.filter(s => s.count >= 2);
  const mild = ranked.filter(s => s.count === 1);
  let html = '';
  if (strong.length) {
    html += `<p class="nv-head nv-confirm">⭐ 여러 렌즈가 함께 가리키는 핵심 강점</p>`;
    strong.forEach(s => {
      html += `<p><b>${s.name}</b> <span class="nv-src">${s.systems.join(' · ')}</span><br>${STRENGTH_TEXT[s.name] || ''} ${s.count}개의 렌즈가 동시에 이 자질을 비추니, 믿고 밀어붙여도 좋은 너의 무기다.</p>`;
    });
  }
  if (mild.length) {
    html += `<p class="nv-head">🔹 한 렌즈에서 비치는 잠재 강점</p>`;
    html += `<p>${mild.map(s => s.name).join(' · ')} — 아직 한 시스템에서만 신호가 잡히지만, 의식적으로 키우면 충분히 너의 무기가 될 수 있는 씨앗들이다.</p>`;
  }
  if (!html) html = '<p>아직 뚜렷하게 합의된 강점이 옅다. 여러 영역을 폭넓게 시도하며 너만의 무기를 찾아가는 시기다.</p>';
  return html;
}

// ===== 성명학 서술 =====
export function nameNarrative(n) {
  if (!n) return '';
  let html = `<p>이름 <b>${esc(n.raw)}</b>을(를) 소리오행(發音五行)으로 풀어본다. 각 글자의 첫소리가 품은 기운은 이렇다.</p>`;
  html += `<p>${n.syllables.map(s => `<b>${esc(s.char)}</b> → ${s.element}(${s.choseong})`).join(' &nbsp; ')}</p>`;
  if (n.flow.length) {
    const good = n.flow.filter(f => f.relation === '상생').length;
    const bad = n.flow.filter(f => f.relation === '상극').length;
    html += `<p><b>글자 사이 기운의 흐름</b><br>` +
      n.flow.map(f => `${f.from}→${f.to} <b>${f.relation}</b> — ${f.note}`).join('<br>') + `</p>`;
    const verdict = good > bad ? '서로 북돋우는 기운이 우세해, 이름이 순하게 흐른다.'
      : bad > good ? '부딪히는 기운이 섞여 있어, 그만큼 자기 색이 강하고 굴곡이 있는 이름이다.'
      : '생과 극이 균형을 이뤄, 안정과 자극을 함께 품은 이름이다.';
    html += `<p>${verdict}</p>`;
  }
  if (n.sajuRelation) {
    html += `<p><b>사주와의 어울림</b><br>${n.sajuRelation.note} — <b>${n.sajuRelation.verdict}</b>.</p>`;
  }
  html += `<p class="nv-foot">한글 초성 소리오행 기준의 재미용 풀이입니다. 한자 획수·수리(數理) 정밀 해석은 포함하지 않았어요.</p>`;
  return html;
}

// ===== 손가락 비율(2D:4D) 서술 =====
export function digitNarrative(d) {
  if (!d) return '';
  let html = `<p><b>${esc(d.category)}</b> 유형이다. 태내 테스토스테론 노출은 <b>${esc(d.testosterone)}</b>으로 추정된다.</p>`;
  html += `<p>${esc(d.blurb)}</p>`;
  html += `<p>느슨하게 연관되는 키워드: <b>${d.traits.map(esc).join(' · ')}</b></p>`;
  html += `<p class="nv-foot">2D:4D는 상관 연구에 기반한 지표로 학계 논쟁이 있고 개인차가 큽니다. 재미로만 참고하세요.</p>`;
  return html;
}

// ===== 운세(재물·성공·연애·건강 + 인생 고비) 서술 =====
export function fortuneNarrative(f) {
  if (!f) return '';
  const entries = Object.entries(f.natal).sort((a, b) => b[1] - a[1]);
  const top = entries[0], low = entries[entries.length - 1];
  let html = `<p>타고난 사주 십성으로 본 네 가지 운의 기본값이다. 가장 도드라지는 건 <b>${top[0]}운(${top[1]})</b>, 상대적으로 더 공들여야 할 건 <b>${low[0]}운(${low[1]})</b>이다.</p>`;
  const tl = f.timeline;
  if (tl && tl.periods && tl.periods.length > 1) {
    html += `<p>아래 그래프는 10년 단위 <b>대운(大運)</b>의 흐름이다. `;
    if (tl.peak != null) html += `<b>${tl.peak}세</b> 무렵 전성기의 기운이 들어오고, `;
    if (tl.lows && tl.lows.length) html += `<b>${tl.lows.join('·')}세</b> 무렵은 인생의 고비로 읽힌다 — 이 시기엔 큰 결정을 서두르기보다 내실을 다지는 편이 낫다.`;
    html += `</p>`;
    html += `<p class="nv-period">` + tl.periods.map(p => `${p.startAge}세~ <b>${p.label}</b>`).join('　·　') + `</p>`;
  }
  html += `<p class="nv-foot">대운 흐름은 사주 십성에 기반한 재미용 해석입니다. 정밀 명리(용신·격국)는 반영하지 않았어요.</p>`;
  return html;
}

// ===== 사주 상세 풀이 서술 =====
const HANJA = { 목:'木', 화:'火', 토:'土', 금:'金', 수:'水' };

const OHAENG_NATURE = {
  목: '성장과 추진의 기운이 강해 새로운 것을 시작하고 위로 뻗으려는 에너지가 크다',
  화: '열정과 표현의 기운이 강해 감정과 창의를 밖으로 드러내는 힘이 크다',
  토: '안정과 신뢰의 기운이 강해 중심을 잡고 품어내는 포용력이 크다',
  금: '결단과 의리의 기운이 강해 원칙을 지키고 정확하게 처리하는 힘이 크다',
  수: '지혜와 융통의 기운이 강해 흐름을 읽고 깊이 사유하는 힘이 크다',
};
const OHAENG_WEAK = {
  목: '추진·성장 기운이 약하다 — 시작을 미루거나 끈기가 약해지는 순간을 의식적으로 살필 것',
  화: '열정·표현 기운이 약하다 — 감정을 드러내거나 적극적으로 나서기가 어색할 수 있다',
  토: '안정·중심 기운이 약하다 — 중심이 흔들리거나 지속성이 부족해지는 시기를 경계할 것',
  금: '결단·의리 기운이 약하다 — 결정이 늦어지거나 원칙이 흔들릴 때를 주의할 것',
  수: '지혜·유연 기운이 약하다 — 고집이 강해지거나 변화에 둔감해지는 시기를 살필 것',
};

export function sajuNarrative(detail) {
  if (!detail) return '';
  const { pillars, ohaeng, tenGodGroups } = detail;
  const p = pillars.dayProfile;
  let html = '';

  // ① 일간 기질
  if (p) {
    html += `<p class="nv-head">⚡ 일간(日干) ${pillars.dayGan} · ${p.symbol}</p>`;
    html += `<p>핵심 기질: <b>${p.core}</b><br>${p.text}</p>`;
  }

  // ② 타고난 재능
  if (p?.talent) {
    html += `<p class="nv-head nv-confirm">🌟 타고난 재능</p>`;
    html += `<p>${p.talent}</p>`;
    // 오행 강세 보정
    const domEl = Object.entries(ohaeng).filter(([,v]) => v >= 3).map(([k]) => k);
    if (domEl.length) {
      const bonus = domEl.flatMap(e => OHAENG_CAREER[e] || []);
      if (bonus.length) html += `<p>팔자에 <b>${domEl.map(e=>`${e}(${HANJA[e]})`).join('·')}</b> 기운이 두드러져, <b>${bonus.join(' · ')}</b> 분야에서도 타고난 감각이 빛난다.</p>`;
    }
  }

  // ③ 어울리는 직업군
  if (p?.careers?.length) {
    // 기본 직업 (일간)
    let careers = [...p.careers];
    // 십성 보정
    const topTg = Object.entries(tenGodGroups).sort((a,b)=>b[1]-a[1]).filter(([,v])=>v>=2);
    const bonus = topTg.flatMap(([g]) => TENGOD_GROUP_TEXT[g]?.careers || []);
    // 중복 제거
    const unique = [...new Set([...careers, ...bonus])];
    html += `<p class="nv-head">💼 어울리는 직업군</p>`;
    html += `<p>${unique.map(c=>`<span class="career-chip">${c}</span>`).join(' ')}</p>`;
    if (topTg.length) {
      const labels = topTg.map(([g,cnt])=>`${g}(${cnt})`).join('·');
      html += `<p class="nv-src">십성 ${labels} 강세로 ${topTg.map(([g])=>TENGOD_GROUP_TEXT[g]?.careers?.join('·')||'').filter(Boolean).join(', ')} 계열이 추가로 어울린다.</p>`;
    }
  }

  // ④ 팔자(八字) — 인생 흐름
  if (p?.fate) {
    html += `<p class="nv-head">☯ 팔자(八字) — 인생 흐름</p>`;
    html += `<p>${p.fate}</p>`;
  }

  // ⑤ 단점 · 주의할 성향
  if (p?.weakness) {
    html += `<p class="nv-head nv-caution">⚠ 단점 · 주의할 성향</p>`;
    html += `<p>${p.weakness}</p>`;
    // 십성 약한 그룹 보정
    const zeroTg = Object.entries(tenGodGroups).filter(([,v])=>v===0).map(([g])=>g);
    if (zeroTg.length) {
      const zTexts = zeroTg.map(g => TENGOD_GROUP_TEXT[g]?.low).filter(Boolean);
      if (zTexts.length) html += `<p><b>부족한 십성 영역</b> — ${zTexts.join(' / ')}</p>`;
    }
  }

  // ⑥ 액운 · 조심해야 할 때
  if (p?.caution) {
    html += `<p class="nv-head nv-caution">🔴 액운 · 조심해야 할 때</p>`;
    html += `<p>${p.caution}</p>`;
    // 약한 오행
    const weakEl = Object.entries(ohaeng).filter(([,v])=>v===0).map(([k])=>k);
    if (weakEl.length) {
      html += `<p>팔자에 <b>${weakEl.map(e=>`${e}(${HANJA[e]})`).join('·')}</b> 기운이 없어 이 오행이 들어오는 시기(년·운)에 보완이 필요하다 — ${weakEl.map(e=>OHAENG_WEAK[e]).join(' / ')}.</p>`;
    }
  }

  // ⑦ 오행 균형 요약 (강세만)
  const domEl2 = Object.entries(ohaeng).filter(([,v])=>v>=3).map(([k])=>k);
  if (domEl2.length) {
    html += `<p class="nv-foot">오행 강세 — ${domEl2.map(e=>`${e}(${HANJA[e]}): ${OHAENG_NATURE[e]}`).join('. ')}.</p>`;
  }

  html += `<p class="nv-foot">천간·지지 기반 재미용 풀이입니다. 합충·용신·격국을 포함한 정밀 명리는 반영하지 않았어요.</p>`;
  return html;
}

// ===== 가족 인연운 =====
// 배우자궁(일지) 오행별 — 외모·성격·강점
const SPOUSE_BY_ELEMENT = {
  목: {
    el: '목(木)',
    look: '키가 크고 늘씬한 편에 자세가 곧고 이목구비가 시원시원한 경우가 많다. 나이보다 젊어 보이는 동안형이 흔하고, 차림새도 깔끔하고 단정한 인상을 준다.',
    character: '정직하고 진취적이며 자기 일에 열정을 쏟는 성장 지향형이다. 곧은 성품이라 거짓이나 편법을 싫어하고, 한번 정한 방향으로 묵묵히 밀고 나가는 우직함이 있다.',
    strength: '미래를 내다보고 가정을 한 걸음씩 키워 나가는 추진력과 책임감이 가장 큰 강점이다. 곁에 있으면 "이 사람과는 무언가를 함께 쌓아갈 수 있다"는 신뢰를 준다.',
  },
  화: {
    el: '화(火)',
    look: '화사하고 눈에 띄는 외모에 표정이 밝고 이목구비가 또렷하다. 어디서나 분위기를 환하게 만드는 인상이며, 패션·스타일 감각이 좋은 경우가 많다.',
    character: '밝고 활달하며 정이 많고 표현이 풍부하다. 좋고 싫음이 분명하고 감정이 솔직해, 함께 있으면 지루할 틈이 없는 열정적인 유형이다.',
    strength: '어떤 자리에서도 분위기를 살리는 사교성과 활력이 강점이다. 가정에 따뜻한 생기를 불어넣고, 지치고 위축된 순간에도 기운을 북돋아 주는 힘이 있다.',
  },
  토: {
    el: '토(土)',
    look: '후덕하고 푸근한 인상에 안정감 있는 체형과 부드러운 얼굴선을 가진 경우가 많다. 화려하기보다 편안하고 믿음직한 느낌을 주는 외모다.',
    character: '듬직하고 믿음직하며 성실하다. 말보다 행동으로 책임을 다하는 가정적인 유형으로, 좀처럼 흔들리지 않는 든든한 무게중심을 가졌다.',
    strength: '한결같은 신뢰감과 헌신이 가장 큰 강점이다. 어떤 어려움이 와도 가정을 지키는 울타리가 되어 주며, 곁에 있으면 마음이 놓이는 사람이다.',
  },
  금: {
    el: '금(金)',
    look: '이목구비가 또렷하고 단정하며 깔끔하고 세련된 스타일을 가진 경우가 많다. 피부가 희고 깨끗하며, 인상에서 야무지고 분명한 기운이 느껴진다.',
    character: '원칙이 뚜렷하고 깔끔하며 의리가 있다. 옳고 그름이 분명해 우유부단하지 않고, 한번 한 약속은 끝까지 지키는 신의가 있는 유형이다.',
    strength: '분명한 결단력과 일을 야무지게 처리하는 능력이 강점이다. 중요한 순간에 흐트러지지 않고 가정을 단단하게 정리해 주는 든든함이 있다.',
  },
  수: {
    el: '수(水)',
    look: '부드럽고 지적인 인상에 눈매가 그윽하고 유연한 분위기를 가진 경우가 많다. 나이보다 어려 보이며, 어딘가 신비롭고 편안한 매력이 있다.',
    character: '지혜롭고 유연하며 생각이 깊다. 상황에 맞춰 융통성 있게 대응하고, 상대의 마음을 잘 헤아리는 감수성과 포용력을 가진 유형이다.',
    strength: '뛰어난 적응력과 지략, 공감 능력이 강점이다. 갈등을 부드럽게 풀어내고 어떤 환경에서도 길을 찾아내는 현명함으로 가정의 중심을 잡는다.',
  },
};

// 자녀궁(시지) 오행별 — 자녀 기질
const CHILD_BY_ELEMENT = {
  목: '진취적이고 곧은 기질의 아이일 가능성이 높다. 자기 주관이 또렷하고 리더십이 있어 또래를 이끄는 자리에 서곤 하며, 성장이 빠르고 새로운 도전을 즐긴다.',
  화: '밝고 활발하며 끼가 넘치는 아이일 가능성이 높다. 표현력이 풍부하고 사람을 좋아해, 예술·발표·운동처럼 자신을 드러내는 분야에서 특히 빛난다.',
  토: '듬직하고 효심이 깊은 아이일 가능성이 높다. 성실하고 책임감이 있어 부모 속을 덜 썩이며, 친구들 사이에서도 믿음직한 중심 역할을 한다.',
  금: '야무지고 똑 부러지는 아이일 가능성이 높다. 옳고 그름이 분명하고 자기 할 일을 스스로 챙기며, 한번 집중하면 끝을 보는 단단함이 있다.',
  수: '영리하고 지혜로운 아이일 가능성이 높다. 머리 회전이 빠르고 공부 머리가 좋으며, 상황 판단과 눈치가 빨라 어디서나 잘 적응한다.',
};

const EL_HANJA = { 목:'木', 화:'火', 토:'土', 금:'金', 수:'水' };

export function relationNarrative(fortune, sajuDetail) {
  const { relation, gender } = fortune;
  if (!relation) return '';
  const isFemale = gender === 'female';
  const tgs = sajuDetail?.tenGodGroups || {};
  const pillars = sajuDetail?.pillars || {};
  let html = '';

  // ── 배우자운 ──────────────────────────────────────
  const spouseScore = relation.배우자;
  const dayP = pillars.day;
  const spouseEl = dayP?.zhiEl;
  const sp = SPOUSE_BY_ELEMENT[spouseEl];

  html += `<p class="nv-head">💑 배우자운</p>`;
  if (sp && dayP) {
    html += `<p>배우자궁(配偶宮)인 <b>일지(日支)</b>에 <b>${dayP.zhiKo}(${dayP.zhi})·${sp.el}</b>, 즉 ${dayP.animal}의 기운이 놓였다. 이 자리가 그려내는 배우자상은 이렇다.</p>`;
    html += `<p><b>👤 외모</b><br>${sp.look}</p>`;
    html += `<p><b>🧬 성격</b><br>${sp.character}</p>`;
    html += `<p><b>✨ 강점</b><br>${sp.strength}</p>`;
  }

  const spouseStarKo = isFemale ? '관성(官星)' : '재성(財星)';
  let spouseFlow;
  if (spouseScore >= 70) {
    spouseFlow = isFemale
      ? `배우자성인 ${spouseStarKo}이 충실해 인연의 힘이 강한 팔자다(${spouseScore}점). 남편이 안정적인 울타리이자 사회적·경제적 버팀목이 되어 주는, 가정운이 탄탄한 구조다.`
      : `배우자성인 ${spouseStarKo}이 충실해 인연의 힘이 강한 팔자다(${spouseScore}점). 아내가 현실적·경제적으로 큰 도움이 되는 인연이며, 가정이 삶의 든든한 기반이 된다.`;
  } else if (spouseScore >= 55) {
    spouseFlow = `배우자 인연은 분명히 있으나, 서로의 노력이 더해질 때 비로소 빛나는 관계다(${spouseScore}점). 이해의 시간이 쌓일수록 관계가 더 단단해지는, 후반이 좋은 인연이다.`;
  } else if (spouseScore >= 44) {
    spouseFlow = `배우자운은 평범한 편이다(${spouseScore}점). 인연이 다소 늦게 오거나, 결혼 후 서로의 독립적인 영역을 존중해 주는 관계가 특히 잘 맞는다.`;
  } else {
    spouseFlow = `배우자 인연이 약하거나 굴곡이 있는 팔자다(${spouseScore}점). ${isFemale ? '상관(傷官)이 관성을 극하는 구조라 ' : '비겁이 재성을 침범하는 구조라 '}만혼이 오히려 유리하다. 인연을 억지로 붙잡기보다 자신의 세계를 먼저 완성하면, 그 뒤에 만나는 인연이 훨씬 깊고 안정적이다.`;
  }
  html += `<p><b>💞 인연의 흐름</b><br>${spouseFlow}</p>`;

  // ── 자녀운 ──────────────────────────────────────
  const childScore = relation.자식;
  const timeP = pillars.time;
  const childEl = timeP?.zhiEl;

  html += `<p class="nv-head">👶 자녀운</p>`;
  if (childEl && CHILD_BY_ELEMENT[childEl]) {
    html += `<p>자녀궁(子女宮)인 <b>시지(時支)</b>에 <b>${timeP.zhiKo}(${timeP.zhi})·${childEl}(${EL_HANJA[childEl]})</b>, 즉 ${timeP.animal}의 기운이 놓였다.</p>`;
    html += `<p><b>🧒 자녀의 기질</b><br>${CHILD_BY_ELEMENT[childEl]}</p>`;
  }

  const sik = tgs.식상 || 0;
  let childFlow;
  if (childScore >= 70) {
    childFlow = isFemale
      ? `자녀성인 식상(食傷)이 발달해 자식 복이 풍부한 팔자다(${childScore}점). 자녀와 정서적 교감이 깊고, 아이가 창의적이고 표현력 있게 자라나는 인연이다.`
      : `관성(官星)이 발달해 자식 복이 강한 팔자다(${childScore}점). 자녀가 사회적으로 인정받고 부모의 이름을 빛내는 인연이 된다.`;
  } else if (childScore >= 55) {
    childFlow = `자식과의 인연이 괜찮은 편이다(${childScore}점). 자녀가 생기면 정이 깊게 쌓이고, 노년에 든든한 지지대가 되어 주는 관계다.`;
  } else if (childScore >= 44) {
    childFlow = `자식 인연은 평범하다(${childScore}점). 자녀를 일찍 독립시키거나, 적은 수의 자녀와 깊은 관계를 맺는 형태가 자연스럽다.`;
  } else {
    childFlow = `자식 인연이 다소 약한 팔자다(${childScore}점). 자녀를 늦게 두거나, 제자·후배 같은 정신적·사회적 자녀를 키우는 역할로 채워지는 경우도 많다.`;
  }
  html += `<p><b>👨‍👩‍👧 자녀 복</b><br>${childFlow}${sik >= 3 ? ' 식상이 왕성해 자녀에게 쏟는 애정과 교육열이 특히 강한 편이다.' : ''}</p>`;

  if (!childEl) {
    html += `<p class="nv-foot">출생 시간을 입력하면 자녀궁(시주) 기준으로 자녀의 기질까지 더 상세히 풀이할 수 있어요.</p>`;
  }

  const parentScore = relation.부모;
  const insung = tgs.인성 || 0;
  html += `<p class="nv-head">🏠 부모운</p>`;
  if (parentScore >= 70) {
    html += insung >= 2
      ? `<p>인성(印星)이 발달해 어머니(또는 부모 전반)의 보살핌이 충분한 팔자다. 부모의 교육·정서적 지원이 삶의 기반이 된다.</p>`
      : `<p>편재가 발달해 부친 쪽의 경제적 기반이나 사회적 배경이 도움이 되는 팔자다. 부모의 울타리 위에서 자신의 세계를 넓힐 수 있다.</p>`;
  } else if (parentScore >= 55) {
    html += `<p>부모와의 인연이 괜찮은 편이다. 어릴 때는 평범한 지원이지만 성인이 되면서 서로 동반자 관계로 발전한다.</p>`;
  } else if (parentScore >= 44) {
    html += `<p>부모 인연이 평범하다. 일찍 독립하거나 부모 도움 없이 스스로 기반을 쌓아야 하는 자수성가형에 가깝다.</p>`;
  } else {
    html += `<p>부모 인연이 약한 팔자다. 어릴 때 부재·이별·경제적 어려움이 있을 수 있다. 이 시련이 강한 독립심과 자생 능력을 키우는 밑거름이 되는 경우가 많다.</p>`;
  }

  const sibScore = relation.형제;
  const bigeop = tgs.비겁 || 0;
  html += `<p class="nv-head">🤝 형제운</p>`;
  if (sibScore >= 70) {
    html += bigeop >= 3
      ? `<p>비겁(比劫)이 강해 형제자매·동료와의 유대가 깊은 팔자다. 함께할 때 더 큰 힘을 발휘하며, 집단 안에서 빛나는 유형이다.</p>`
      : `<p>형제자매 인연이 강한 팔자다. 형제나 동료가 삶의 중요한 파트너이자 지원군이 된다.</p>`;
  } else if (sibScore >= 55) {
    html += `<p>형제자매와의 인연이 괜찮은 편이다. 경쟁과 협력이 공존하는 관계이며, 어릴 때보다 성인 후 사이가 더 가까워지는 경향이 있다.</p>`;
  } else if (sibScore >= 44) {
    html += `<p>형제 인연이 평범하다. 독자이거나, 형제자매가 있어도 각자의 길을 가는 관계가 많다.</p>`;
  } else {
    html += `<p>형제 인연이 약한 팔자다. 혈연보다 선택한 가족(친한 친구·동료)이 더 가까운 관계가 되는 경우가 많다.</p>`;
  }

  return html;
}

// ===== 레이더 설명 =====
const AXIS_MEANING = {
  A1: { plus:'외향', minus:'내향', desc:'에너지를 충전하는 방식 — 사람·활동에서 얻는가, 혼자만의 시간에서 얻는가' },
  A2: { plus:'직관', minus:'현실', desc:'정보를 처리하는 방식 — 가능성·패턴을 먼저 보는가, 눈앞의 사실·경험을 먼저 보는가' },
  A3: { plus:'사고', minus:'감정', desc:'결정의 기준 — 논리·원칙으로 판단하는가, 사람·관계·공감으로 판단하는가' },
  A4: { plus:'계획', minus:'유연', desc:'일하는 방식 — 미리 정하고 실행하는가, 흐름에 따라 즉흥적으로 움직이는가' },
  A5: { plus:'주도', minus:'수용', desc:'역할 선호 — 방향을 정하고 이끄는가, 흐름을 받아들이고 조화를 맞추는가' },
};

export function radarNarrative(axes) {
  let html = `<p>오각형의 각 꼭짓점은 성격의 한 축이다. 꼭짓점에 가까울수록 그 방향이 뚜렷하고, 중심에 가까울수록 균형 상태다. <b>★ 개수</b>는 사주·MBTI·별자리 세 렌즈 중 몇 개가 같은 방향을 가리키는지를 나타낸다 — 별이 많을수록 신뢰도 높다.</p>`;

  html += `<div class="rat-table">`;
  axes.forEach(a => {
    const m = AXIS_MEANING[a.id];
    const starsHtml = '★'.repeat(a.stars) + '☆'.repeat(Math.max(0, 3 - a.stars));
    const poleCls = a.resultPole === 0 ? 'rat-pole bal' : 'rat-pole';
    const conflictTag = a.conflict ? `<span class="tag conflict" style="font-size:.68rem;padding:1px 6px">충돌</span>` : '';
    const sysStr = a.contributingSystems.length ? a.contributingSystems.join('·') : '신호 약함';
    html += `<div class="rat-row">
      <div class="rat-meta">
        <span class="rat-label">${a.label}</span>
        <span class="${poleCls}">${a.poleLabel}</span>
        <span class="rat-stars">${starsHtml}</span>
        ${conflictTag}
      </div>
      <div class="rat-detail">
        <span class="rat-sys">${sysStr}</span>
        <span class="rat-desc">${m ? m.desc : ''}</span>
      </div>
    </div>`;
  });
  html += `</div>`;

  const threeStarAxes = axes.filter(a => a.stars >= 3 && a.resultPole !== 0);
  const conflictAxes = axes.filter(a => a.conflict);
  if (threeStarAxes.length) {
    html += `<p><b>★★★ 확정 성향</b>: ${threeStarAxes.map(a => `${a.label}(${a.poleLabel})`).join(' · ')} — 세 시스템이 동시에 가리키니 사실상 너의 고정된 결이다.</p>`;
  }
  if (conflictAxes.length) {
    html += `<p><b>충돌 영역</b>: ${conflictAxes.map(a => a.label).join(' · ')} — 시스템마다 신호가 엇갈린다. 상황에 따라 다른 모습을 보이는, 다면적인 영역이다.</p>`;
  }
  return html;
}

// ===== 종합 의견 =====

// 일간 원소별 이미지
const EL_IMAGE = {
  목: '씩씩하게 하늘로 뻗는 나무',
  화: '주변을 환하게 물들이는 불꽃',
  토: '흔들리지 않고 모든 것을 품는 대지',
  금: '불순물을 잘라내는 단단한 금속',
  수: '막힘 없이 스며드는 물',
};

// ── 교차 통찰 테이블 ────────────────────────────────────────────────
// 사주 일간 오행(5) × MBTI I/E · T/F(4) = 20가지 교차 서술
const SAJU_MBTI_CROSS = {
  목_ET: '나무처럼 뻗어가면서 논리로 방향을 정하는 조합이다. 목표가 정해지면 이유도 분명하고 실행도 빠르다. 단, "내 방향이 맞다"는 확신이 지나쳐 팀을 두고 혼자 달리는 상황이 생기기 쉽다.',
  목_EF: '나무처럼 뻗어가되 사람을 향해 뻗어가는 유형이다. 에너지를 쏟는 방향이 관계와 공감이어서 주변을 이끄는 힘이 따뜻하다. 모두를 챙기려다 자신을 잃는 것이 이 조합의 함정이다.',
  목_IT: '안으로 깊어지는 나무 — 겉은 조용하지만 안에서 치열하게 분석하고 구조를 짜는 유형이다. 혼자 그림을 그리는 데 탁월하나, 그것을 밖으로 내보이는 데 에너지가 많이 든다.',
  목_IF: '내향적 나무는 혼자 뿌리를 깊게 내린다. 섬세한 공감력이 있지만 표현하지 않아 오해를 사기 쉽다. 혼자 감당하는 것이 익숙해서 도움을 요청하는 것 자체를 어려워한다.',
  화_ET: '태양처럼 빛나는 에너지에 논리적 판단이 더해진 조합이다. 무대 위에서 논리로 설득하는 카리스마형이다. "이미 답이 나왔는데 왜 묻는가"가 이 조합의 가장 흔한 함정이다.',
  화_EF: '가장 사람을 끌어당기는 조합 중 하나다. 열정과 공감이 동시에 폭발하며, 무리를 하나로 묶는 힘이 자연스럽다. 번아웃이 조용히 쌓이는 것이 이 조합의 맹점이다.',
  화_IT: '겉은 잔잔하지만 속에서 강렬하게 타오르는 유형이다. 깊이 분석하고 혼자 판단한 뒤 결론을 내놓는다. 열정이 있는데 표현이 안 되어 주변이 그 깊이를 모르는 경우가 많다.',
  화_IF: '촛불 같은 유형 — 작고 섬세하지만 주변을 따뜻하게 한다. 공감 능력이 뛰어나고 예민하며, 상처도 쉽게 받는다. 사람을 돌보되 자신의 에너지 경계를 지키는 것이 핵심 과제다.',
  토_ET: '흔들리지 않는 대지에 논리가 더해진 조합이다. 오랜 관계 안에서 신뢰로 조직을 이끄는 유형이다. 변화에 둔하고 새로운 방식을 받아들이는 데 시간이 걸린다.',
  토_EF: '모든 사람을 품으려는 大地 유형이다. 배려의 폭이 넓고 관계 유지 능력이 탁월하다. 갈등을 너무 피하다 중요한 피드백을 미루는 경향이 있다.',
  토_IT: '묵직하게 생각하고 조용히 실행하는 유형이다. 분석이 끝나야 움직이고, 한번 정한 방향은 잘 바꾸지 않는다. 느리지만 틀리는 일이 적다.',
  토_IF: '조용히 깊은 신뢰를 쌓아가는 유형이다. 말이 적지만 행동으로 증명하고, 관계 안에서 오랫동안 의리를 지킨다. 표현이 부족해 감정이 쌓이는 것이 가장 큰 위험이다.',
  금_ET: '날선 논리와 사교적 에너지의 조합이다. 불합리한 것을 보면 직접 바로잡으려 한다. 지나치면 관계에서 적을 만든다.',
  금_EF: '단단한 원칙 위에 따뜻한 관계를 쌓는 유형이다. 원칙을 지키되 사람을 상처 주지 않는 방식을 찾는 것이 이 조합의 숙제다.',
  금_IT: '내면의 기준이 가장 엄격한 조합이다. 자신에게도 남에게도 높은 기준을 적용하며, 감정보다 원칙을 우선한다. 스스로를 용서하는 법을 배우는 것이 이 조합의 과제다.',
  금_IF: '겉은 날카롭지만 속은 섬세한 유형이다. 원칙과 공감 사이에서 자주 내적 갈등을 경험하며, 이 긴장이 오히려 깊은 통찰을 만들어낸다.',
  수_ET: '흐르는 물처럼 빠르게 상황을 읽고 논리적으로 대응하는 유형이다. 적응력과 분석력이 동시에 발달했고, 어떤 환경에서도 활로를 찾아낸다.',
  수_EF: '물처럼 스며드는 공감력에 외향성이 더해진 조합이다. 분위기를 읽는 속도가 빠르고, 다양한 사람 사이에서 다리 역할을 자연스럽게 한다.',
  수_IT: '깊은 내면에서 차갑고 날카로운 분석이 이루어지는 유형이다. 많이 말하지 않지만 생각의 밀도가 높고, 결론이 나기 전에는 절대 움직이지 않는다.',
  수_IF: '물과 내향과 감성 — 가장 깊은 공감력을 가진 조합이다. 타인의 감정을 스펀지처럼 흡수하는 능력이 있어, 경계를 지키지 않으면 쉽게 소진된다.',
};

function sajuMbtiCross(dayEl, mbti) {
  if (!dayEl || !mbti || mbti.length < 4) return null;
  const ie = mbti[0] === 'I' ? 'I' : 'E';
  const tf = mbti[2] === 'T' ? 'T' : 'F';
  return SAJU_MBTI_CROSS[`${dayEl}_${ie}${tf}`] || null;
}

// 사주 일간 오행(5) × 별자리 원소(불/흙/공기/물) = 20가지 교차 서술
const OHAENG_ZODIAC_CROSS = {
  목_불: '목생화(木生火) — 두 렌즈가 같은 방향을 가리킨다. 성장하고 표현하고 뻗어나가는 에너지가 사주와 별자리 모두에서 확인된다. 이 힘을 한 곳에 집중하면 강력한 추진력이 된다.',
  목_흙: '성장 지향(木)과 안정 지향(흙 별자리) — 끊임없이 뻗어가면서도 현실 기반을 놓치지 않는 균형 잡힌 에너지다. 지속 가능한 성장의 조합이다.',
  목_공기: '아이디어가 쉬지 않는 조합이다. 생각이 빠르고 방향이 자주 바뀌는 경향이 있으며, 이 에너지를 하나의 뿌리로 붙잡는 것이 핵심 과제다.',
  목_물: '수생목(水生木) — 감수성이 창의성을 키우는 조합이다. 직관으로 방향을 잡고, 감정이 나무의 뿌리가 된다. 너무 자라려다 뿌리가 흔들리지 않도록 균형을 잡아야 한다.',
  화_불: '두 렌즈 모두 불의 에너지를 가리킨다. 열정과 표현력이 최고조이며, 사람을 이끄는 카리스마가 사주와 별자리 양쪽에서 동시에 확인된다. 번아웃 관리가 이 조합의 필수 과제다.',
  화_흙: '화의 열정이 흙의 현실감으로 조절되는 조합이다. 아이디어가 뜨겁지만 실행은 신중하다. 두 에너지가 갈등하기도 하고, 때론 서로를 보완하기도 한다.',
  화_공기: '불과 공기는 서로를 키운다. 아이디어가 넘치고 표현이 풍부하며 창의성이 폭발한다. 시작은 잘하는데 완성이 어려운 조합 — 집중력 관리가 핵심이다.',
  화_물: '불과 물 — 두 렌즈가 정반대의 에너지를 가리킨다. 열정과 감성, 행동과 내성이 충돌하며 풍부한 내면세계를 만든다. 이 긴장을 창조적으로 쓸 줄 아는 사람이다.',
  토_불: '안정적 기반(土) 위에서 열정(불)이 꽃피우는 구조다. 현실감 없는 열정이 아닌, 실질적인 성취로 이어지는 유형이다.',
  토_흙: '두 렌즈 모두 안정과 현실을 가리킨다. 쌓고 지키는 능력이 탁월하며, 변화에 지나치게 보수적이 될 수 있으니 의식적인 유연함이 필요하다.',
  토_공기: '안정을 원하면서도 변화와 자유를 갈망하는 내적 긴장이 있다. 이 긴장이 오히려 다양한 관점을 가진 깊이 있는 사람을 만든다.',
  토_물: '대지가 물을 머금는 조합이다. 감수성(물)과 안정성(土)이 합쳐져 사람들을 품고 보살피는 능력이 탁월하다. 감정을 너무 안에 담아두다 폭발하는 패턴을 주의해야 한다.',
  금_불: '불이 금을 제련하듯, 경험과 단련이 이 사람을 강하게 만든다. 역경을 통해 성장하는 유형이며, 위기에서 오히려 빛을 발한다.',
  금_흙: '현실적이고 단단한 기반 위에서 결과를 만드는 조합이다. 두 렌즈 모두 실용성과 지속성을 강조한다. 완벽주의가 지나치면 시작을 못하는 함정이 있다.',
  금_공기: '날카로운 금의 분석력과 공기의 언어 감각이 만나는 조합이다. 논리와 커뮤니케이션이 동시에 발달했으며, 비판적 사고와 설득력이 강점이다.',
  금_물: '원칙(金)과 감성(물)의 조합이다. 차갑고 냉철하게 판단하면서도 사람의 감정을 놓치지 않는다. 이 두 에너지를 통합하는 것이 이 사람의 평생 과제이자 강점이다.',
  수_불: '두 렌즈가 서로 반대를 가리킨다. 적응력(水)과 열정(불)이 동시에 있어 다양한 상황에서 살아남는 유형이다. 어느 쪽으로 에너지를 집중할지가 항상 고민이다.',
  수_흙: '흐르는 물이 대지를 적시는 조합이다. 유연성과 현실감이 공존하며, 변화 속에서도 안정을 찾는 능력이 있다.',
  수_공기: '두 렌즈 모두 유동적이고 변화를 즐기는 에너지를 가리킨다. 적응력과 커뮤니케이션이 강점이며, 창의적인 아이디어가 끊이지 않는다.',
  수_물: '두 렌즈 모두 물의 에너지를 가리킨다. 감수성과 직관, 공감력이 최고조이며, 창의성과 예술성도 풍부하다. 감정의 깊이가 너무 깊어 경계를 잃지 않도록 주의해야 한다.',
};

const ZODIAC_EL_MAP = {
  양자리:'불', 사자자리:'불', 사수자리:'불',
  황소자리:'흙', 처녀자리:'흙', 염소자리:'흙',
  쌍둥이자리:'공기', 천칭자리:'공기', 물병자리:'공기',
  게자리:'물', 전갈자리:'물', 물고기자리:'물',
};

function ohaengZodiacCross(dayEl, sunSign) {
  if (!dayEl || !sunSign) return null;
  const zodiacEl = ZODIAC_EL_MAP[sunSign];
  if (!zodiacEl) return null;
  return { text: OHAENG_ZODIAC_CROSS[`${dayEl}_${zodiacEl}`] || null, zodiacEl };
}

// ★★★ 세 렌즈 일치 확인 문장 (사주 일간 × MBTI × 별자리 원소)
function threeWayInsight(dayEl, mbti, sunSign) {
  if (!mbti || mbti.length < 4 || !sunSign || !dayEl) return '';
  const zodiacEl = ZODIAC_EL_MAP[sunSign];
  const ie = mbti[0] === 'I' ? 'I' : 'E';
  const tf = mbti[2] === 'T' ? 'T' : 'F';

  // 완전 3중 일치
  if (dayEl === '화' && ie === 'E' && zodiacEl === '불')
    return `<p class="cross-confirm">★★★ <b>사주(화) · MBTI E형 · ${sunSign}(불)</b> — 세 시스템 모두 외향적 에너지와 표현력을 가리킨다. 이 사람이 앞에 나설 때 나오는 힘은 연출이 아니라 타고난 본성이다.</p>`;
  if (dayEl === '수' && ie === 'I' && zodiacEl === '물')
    return `<p class="cross-confirm">★★★ <b>사주(수) · MBTI I형 · ${sunSign}(물)</b> — 세 시스템 모두 깊이와 직관, 내면에서 힘을 얻는 구조를 가리킨다. 이 사람의 강점은 겉이 아니라 속에 있다.</p>`;
  if (dayEl === '목' && ie === 'E' && zodiacEl === '불')
    return `<p class="cross-confirm">★★★ <b>사주(목) · MBTI E형 · ${sunSign}(불)</b> — 성장·에너지·표현의 방향이 세 시스템에서 모두 일치한다. 뻗어가는 것이 이 사람의 본능이다.</p>`;
  if (dayEl === '금' && tf === 'T' && (zodiacEl === '흙' || zodiacEl === '공기'))
    return `<p class="cross-confirm">★★★ <b>사주(금) · MBTI T형 · ${sunSign}(${zodiacEl})</b> — 분석·원칙·논리가 세 시스템에서 동시에 확인된다. 이 사람이 판단을 내릴 때 구조를 앞세우는 것은 습관이 아니라 본성이다.</p>`;
  if (dayEl === '토' && tf === 'F' && zodiacEl === '물')
    return `<p class="cross-confirm">★★★ <b>사주(토) · MBTI F형 · ${sunSign}(물)</b> — 돌봄·안정·공감이 세 시스템에서 모두 일치한다. 이 사람이 타인을 배려하는 것은 선택이 아니라 본능이다.</p>`;
  if (dayEl === '목' && tf === 'F' && zodiacEl === '물')
    return `<p class="cross-confirm">★★★ <b>사주(목) · MBTI F형 · ${sunSign}(물)</b> — 창의적 감수성이 세 시스템에서 겹쳐 확인된다. 공감이 이 사람의 창조력을 키우는 원천이다.</p>`;
  if (dayEl === '수' && ie === 'E' && zodiacEl === '공기')
    return `<p class="cross-confirm">★★★ <b>사주(수) · MBTI E형 · ${sunSign}(공기)</b> — 소통·적응·아이디어가 세 시스템에서 동시에 가리키는 핵심이다. 이 사람의 가장 큰 자원은 유연한 지성이다.</p>`;

  // 2중 일치 (두 렌즈 합의)
  if (ie === 'E' && zodiacEl === '불')
    return `<p class="cross-confirm">★★ <b>MBTI E형 · ${sunSign}(불)</b> — 두 렌즈가 "바깥을 향하는 열정" 을 동시에 가리킨다. 사주 일간(${dayEl})이 이 에너지에 어떤 색깔을 더하는지가 이 사람을 구분 짓는다.</p>`;
  if (ie === 'I' && zodiacEl === '물')
    return `<p class="cross-confirm">★★ <b>MBTI I형 · ${sunSign}(물)</b> — 두 렌즈가 "내면에서 힘을 얻는 구조"를 동시에 가리킨다. 사주 일간(${dayEl})이 이 깊이에 어떤 방향성을 더하는지가 핵심이다.</p>`;
  if (tf === 'T' && (zodiacEl === '흙' || zodiacEl === '공기'))
    return `<p class="cross-confirm">★★ <b>MBTI T형 · ${sunSign}(${zodiacEl})</b> — 두 렌즈가 "논리·실용" 방향을 동시에 가리킨다. 사주 일간(${dayEl})이 이 판단력을 어떻게 발현하는지가 이 사람의 특기가 된다.</p>`;
  if (tf === 'F' && zodiacEl === '물')
    return `<p class="cross-confirm">★★ <b>MBTI F형 · ${sunSign}(물)</b> — 두 렌즈가 "감성·공감" 방향을 동시에 가리킨다. 사주 일간(${dayEl})이 이 감수성을 어떤 방식으로 표현하는지가 이 사람을 특별하게 만든다.</p>`;

  return '';
}

// ── 입체 분석(兩面性 심층) — 축별 두 얼굴 ──────────────────────
// keyed by 축 id. plus/minus 극의 '언제 나오는가'와 대가·강점·조언.
const AXIS_DUALITY = {
  A1: {
    field: '에너지',
    desc: '에너지를 충전하는 회로가 이중으로 깔려 있다. 사람들 속에서 켜지는 회로와 혼자일 때 켜지는 회로가 둘 다 살아 있어, 보는 사람에 따라 전혀 다른 사람으로 기억된다.',
    when: { 외향: '익숙하고 안전한 자리, 컨디션이 좋을 때, 좋아하는 주제 앞에서는 누구보다 활발하게 무대 중앙에 선다', 내향: '낯선 자리, 에너지가 떨어졌을 때, 의미 없는 잡담이 길어지면 조용히 물러나 혼자만의 동굴을 찾는다' },
    cost: '가장 흔한 대가는 "남들은 나를 외향이라 아는데 정작 나는 방전돼 있다"는 간극이다. 밖에서 다 쓰고 집에 와 무너지는 패턴, 그리고 "쟤 변덕스럽다"는 오해를 사기 쉽다.',
    gift: '무대에 설 줄도, 혼자 깊이 파고들 줄도 안다. 사람을 모으다가도 혼자 결과물을 완성해내는 — 한쪽만 가진 사람은 못 하는 일을 해낸다.',
    advice: '회복 시간을 미리 일정에 넣어라. 외향 모드로 쓴 에너지를 내향 모드로 채우는 리듬을 스스로 설계하면, 변덕이 아니라 전략이 된다.',
  },
  A2: {
    field: '정보 처리',
    desc: '세상을 읽는 두 채널이 동시에 켜져 있다. 큰 그림과 가능성을 먼저 보는 눈, 그리고 손에 잡히는 사실과 디테일을 챙기는 눈이 번갈아 작동한다.',
    when: { 직관: '새로운 일을 구상하거나 미래를 그릴 때는 디테일을 건너뛰고 큰 그림으로 도약한다', 현실: '책임이 걸린 실무, 돈이 오가는 결정, 검증이 필요한 순간에는 갑자기 깐깐한 현실주의자로 돌변한다' },
    cost: '아이디어는 폭발하는데 실행에서 스스로 발목을 잡거나("이게 진짜 될까"), 반대로 디테일에 빠져 큰 그림을 놓치는 양극단을 오간다. 주변은 "비전가인지 실무가인지" 헷갈려 한다.',
    gift: '꿈을 꾸면서 동시에 그 꿈을 검증할 수 있다. 몽상으로 끝나지도, 무모한 추진으로 망하지도 않는 — 기획과 실행을 한 몸에 담은 드문 조합이다.',
    advice: '두 모드를 "순서"로 분리하라. 구상 단계엔 직관에 전권을, 실행 단계엔 현실 검증에 전권을. 동시에 켜면 충돌하지만 단계별로 쓰면 최강이다.',
  },
  A3: {
    field: '판단',
    desc: '결정을 내리는 저울이 두 개다. 논리와 원칙으로 따지는 머리, 사람과 관계의 온도를 살피는 가슴이 매 순간 경합한다.',
    when: { 사고: '일·숫자·시스템 앞에서는 냉정하고 객관적으로 옳고 그름을 가른다', 감정: '가까운 사람이 얽히면 논리로는 답이 나왔는데도 마음이 그 답을 거부한다' },
    cost: '"냉정하다"와 "감정적이다"를 동시에 듣는다. 머리로 내린 결정에 가슴이 죄책감을 얹고, 가슴으로 내린 결정에 머리가 비효율을 따져 — 한 번 결정하고 두 번 후회하기 쉽다.',
    gift: '옳은 판단과 따뜻한 판단을 모두 할 줄 안다. 원칙을 지키되 사람을 상하지 않게 하는, 리더에게 가장 필요한 균형감을 타고났다.',
    advice: '결정 전에 "이건 머리로 풀 문제인가, 가슴으로 풀 문제인가"부터 정하라. 영역을 구분하지 않으면 두 저울이 서로를 깎아먹는다.',
  },
  A4: {
    field: '생활 양식',
    desc: '일을 다루는 두 모드가 공존한다. 미리 정하고 정돈하는 질서의 모드, 흐름을 타고 즉흥적으로 움직이는 자유의 모드다.',
    when: { 계획: '중요한 일·마감·책임 앞에서는 철저히 계획을 세우고 끝을 본다', 유연: '익숙해진 일이나 여유가 있을 때는 계획을 풀어버리고 즉흥적으로 흘러간다' },
    cost: '스스로도 "내가 계획형인지 즉흥형인지" 헷갈린다. 빡빡하게 조이다 갑자기 풀어지는 낙차가 커서, 함께 일하는 사람이 페이스를 읽기 어려워한다.',
    gift: '판을 짤 줄도, 변수에 즉흥으로 대응할 줄도 안다. 계획대로 가다 무너졌을 때 오히려 빛나는 — 위기에 강한 조합이다.',
    advice: '"큰 틀은 계획, 세부는 유연"으로 층을 나눠라. 뼈대만 단단히 잡고 살은 흐름에 맡기면 두 성향이 싸우지 않고 협력한다.',
  },
  A5: {
    field: '역할',
    desc: '집단 안에서 두 자리를 다 점유할 수 있다. 앞장서 끌고 가는 리더의 자리, 곁에서 받치고 조율하는 조력자의 자리다.',
    when: { 주도: '판이 멈춰 있거나 아무도 나서지 않을 때, 책임이 분명할 때는 망설임 없이 키를 잡는다', 수용: '더 나은 적임자가 있거나 조화가 중요할 때는 기꺼이 한 발 물러나 떠받친다' },
    cost: '"리더인 줄 알았는데 빠진다" 또는 "따르는 줄 알았는데 갑자기 나선다"는 인상을 준다. 나설 때와 빠질 때의 기준이 스스로에게도 흐리면 우유부단으로 비치기 쉽다.',
    gift: '이끌 줄도 따를 줄도 아는 사람은 어떤 팀에서도 쓰인다. 권력을 쥐어도 독선에 빠지지 않고, 받쳐도 자기를 잃지 않는 — 성숙한 리더의 조건이다.',
    advice: '"이 자리에서 내 역할은 끄는 것인가 받치는 것인가"를 의식적으로 선언하라. 역할을 스스로 정하면 입체성이 강점, 떠밀려 정해지면 약점이 된다.',
  },
};

// 충돌 축 → 깊이 있는 입체 풀이 (사주쟁이 스타일)
function deepConflictAnalysis(conflicts) {
  if (!conflicts.length) return '';
  let html = '';
  conflicts.forEach(a => {
    const d = AXIS_DUALITY[a.id];
    if (!d) return;
    // 어느 렌즈가 어느 극에 섰는지
    const plusSys = (a.plusSystems || []).join('·');
    const minusSys = (a.minusSystems || []).join('·');
    const splitLine = (plusSys && minusSys)
      ? `<span class="dc-split">${plusSys}는 <b>${a.plus}</b> 쪽, ${minusSys}는 <b>${a.minus}</b> 쪽 — 렌즈가 정확히 양분된다.</span>`
      : '';

    html += `<div class="deep-conflict">
      <div class="dc-head">⚔ ${a.label}<span class="dc-field">${a.plus} ↔ ${a.minus}</span></div>
      <p class="dc-desc">${d.desc}${splitLine ? '<br>' + splitLine : ''}</p>
      <div class="dc-faces">
        <div class="dc-face"><span class="dc-face-pole">${a.plus} 모드</span><span class="dc-face-when">${d.when[a.plus]}.</span></div>
        <div class="dc-face"><span class="dc-face-pole">${a.minus} 모드</span><span class="dc-face-when">${d.when[a.minus]}.</span></div>
      </div>
      <p class="dc-row"><b class="dc-cost">치르는 대가</b> ${d.cost}</p>
      <p class="dc-row"><b class="dc-gift">숨은 강점</b> ${d.gift}</p>
      <p class="dc-row"><b class="dc-advice">다루는 법</b> ${d.advice}</p>
    </div>`;
  });
  return html;
}

// 사주 내부의 긴장 — 오행 편중 / 십성 모순
function sajuInnerTension(sajuDetail) {
  if (!sajuDetail) return '';
  const oh = sajuDetail.ohaeng || {};
  const tgs = sajuDetail.tenGodGroups || {};
  const out = [];

  // 오행 편중: 강한 것(>=3)과 빈 것(0)
  const strong = Object.entries(oh).filter(([,v]) => v >= 3).map(([k]) => k);
  const empty  = Object.entries(oh).filter(([,v]) => v === 0).map(([k]) => k);
  if (strong.length && empty.length) {
    const sEl = strong.map(e => `${e}(${HANJA[e]})`).join('·');
    const eEl = empty.map(e => `${e}(${HANJA[e]})`).join('·');
    out.push(`<p class="dc-row"><b class="dc-tension">오행의 쏠림</b> 팔자가 <b>${sEl}</b>으로 넘치는 만큼 <b>${eEl}</b>은 텅 비어 있다. 넘치는 기운은 그 분야에서 과잉(고집·과열·반복)으로, 빈 기운은 평생의 결핍이자 끌림으로 작동한다 — 사람은 흔히 자기에게 없는 것을 가진 상대에게 끌리고, 없는 기운이 들어오는 시기에 인생이 크게 출렁인다.</p>`);
  }

  // 십성 모순
  const bi = tgs.비겁||0, sik = tgs.식상||0, jae = tgs.재성||0, gwan = tgs.관성||0, in_ = tgs.인성||0;
  if (bi >= 3 && jae <= 1) {
    out.push(`<p class="dc-row"><b class="dc-tension">독립과 재물의 긴장</b> 혼자 서려는 힘(비겁)은 강한데 그것을 돈으로 바꾸는 통로(재성)가 약하다. 자존심이 수익을 가로막는 역설이라, 혼자 다 쥐려 할수록 손에 남는 게 적다 — 나눌수록 커지는 구조다.</p>`);
  } else if (sik >= 3 && gwan >= 2) {
    out.push(`<p class="dc-row"><b class="dc-tension">자유와 규율의 긴장</b> 틀을 깨고 표현하려는 힘(식상)과 틀을 지키고 책임지려는 힘(관성)이 안에서 정면으로 맞선다. 규칙 안에서 답답해하면서도 규칙 없는 곳에선 불안해하는 — 평생 "내 식대로 하되 인정도 받고 싶은" 줄다리기를 한다.</p>`);
  } else if (in_ >= 3 && sik <= 1) {
    out.push(`<p class="dc-row"><b class="dc-tension">받아들임과 내보냄의 긴장</b> 배우고 채우는 힘(인성)은 큰데 꺼내 표현하는 힘(식상)이 약하다. 머릿속엔 가득한데 밖으로 내보내질 못해 안에 고이기 쉽다 — 완벽히 준비되기 전엔 시작을 미루는 패턴을 의식적으로 깨야 한다.</p>`);
  }

  if (!out.length) return '';
  return `<p class="dc-sub">팔자 안에서도 두 기운이 맞서는 지점이 있다.</p>` + out.join('');
}

// 십성 조합 → 수입 역설 서술
function incomeParadox(tgs) {
  const jae = tgs.재성 || 0, gwan = tgs.관성 || 0,
        sik = tgs.식상 || 0, in_ = tgs.인성 || 0, bi = tgs.비겁 || 0;

  if (jae >= 2 && gwan <= 1)
    return `재성은 강한데 관성이 약한 구조다. 돈 감각은 타고났지만 조직의 틀 안에서는 그 감각이 눌린다. <b>독립·사업·자영</b>으로 움직일 때 진짜 수입이 열린다 — 월급의 안정감이 오히려 이 팔자의 능력을 잠재운다.`;
  if (gwan >= 2 && jae <= 1)
    return `관성은 강하고 재성이 약한 구조다. 인정과 직위가 먼저 쌓이고 돈은 그 다음에 따라온다. 빠른 수입을 쫓기보다 <b>전문성·명예·조직 내 지위</b>를 쌓는 방향이 장기적으로 훨씬 큰 결실을 만든다.`;
  if (sik >= 2 && jae <= 1 && gwan <= 1)
    return `식상이 발달하고 재성·관성이 약한 구조다. <b>재능·기술·표현</b>이 수입원인 팔자다. 남이 만들어 놓은 구조보다 자신만의 방식으로 일할 때 돈이 따라온다 — 프리랜서, 강의, 창작, 서비스에서 가장 자연스럽다.`;
  if (in_ >= 2 && jae <= 1)
    return `인성이 강한 구조다. 성급하게 수익을 추구할수록 오히려 역효과가 난다. <b>신뢰와 학식</b>이 먼저 쌓이고, 전문성이 깊어질수록 수입이 자연스럽게 따라오는 패턴이다.`;
  if (bi >= 2 && jae <= 1)
    return `비겁이 강하고 재성이 약한 구조다. 혼자 벌기보다 <b>팀·협업</b>에서 더 큰 수입이 나오는 역설적인 팔자다. 경쟁하기보다 연대하고, 재능 있는 파트너를 곁에 두는 것이 수입의 열쇠다.`;
  return `재성·관성·식상이 고르게 분포된 구조다. 여러 경로로 벌 수 있는 팔자이지만, 집중하지 않으면 모든 방향에서 중간치에 머문다 — <b>하나를 깊게 파는 것</b>이 전략이다.`;
}

const CORE_LINE = {
  비겁: '파트너십이 이 팔자의 빈 칸을 채운다 — 혼자보다 함께일 때 더 크다.',
  식상: '표현하지 않으면 세상은 모른다 — 재능을 꺼내는 용기가 첫 번째 과제다.',
  재성: '돈을 쫓지 마라, 가치 있는 일을 쫓아라 — 가치가 쌓이면 재물은 따라온다.',
  관성: '책임지는 자리가 이 사람을 성장시킨다 — 그 자리를 두려워하지 마라.',
  인성: '배운 것을 쌓아두지 말고 행동으로 내보내라 — 실행이 지식을 실력으로 바꾼다.',
};
const CORE_LINE_DEFAULT = '5개 시스템이 가리키는 방향을 믿고, 자신의 결에 맞는 삶을 살아라.';

// ── 종합 한눈에(짧은 요약) — 리포트 맨 위 ──
export function synthesisSummary(result) {
  if (!result.sajuDetail) return '';
  const { axes, strengths, sajuDetail } = result;
  const dp = sajuDetail.pillars?.dayProfile;
  const dayEl = sajuDetail.pillars?.day?.ganEl || '';
  const tgs = sajuDetail.tenGodGroups || {};

  const conflicts = axes.filter(a => a.conflict);
  const confirmed = axes.filter(a => a.stars >= 3 && a.resultPole !== 0 && !a.conflict);
  const notable   = axes.filter(a => a.stars >= 2 && a.resultPole !== 0 && !a.conflict);
  const coreAxes  = (confirmed.length ? confirmed : notable).slice(0, 4);
  const ranked    = [...strengths].sort((a, b) => b.count - a.count);
  const topS      = (ranked.filter(s => s.count >= 3).length ? ranked.filter(s => s.count >= 3) : ranked).slice(0, 3);

  let html = '';

  // 한 줄 정체성
  const elImg = EL_IMAGE[dayEl];
  const daySymbol = dp?.symbol || '';
  const poleStr = coreAxes.length ? coreAxes.map(a => a.poleLabel).join(' · ') : '';
  let ident = '';
  if (elImg) ident += `${daySymbol ? `일간 <b>${daySymbol}</b>, ` : ''}${elImg}처럼 — `;
  if (poleStr) ident += `<b>${poleStr}</b>의 결을 지닌 사람.`;
  if (ident) html += `<p class="sum-ident">${ident}</p>`;

  // 확정/주요 성향 배지
  if (coreAxes.length) {
    const tag = confirmed.length ? '★★★ 확정 성향' : '주요 성향';
    html += `<div class="sum-row"><span class="sum-key">${tag}</span><span class="sum-vals">${coreAxes.map(a => `<span class="sum-chip">${a.label} · ${a.poleLabel}</span>`).join('')}</span></div>`;
  }

  // 핵심 강점
  if (topS.length) {
    html += `<div class="sum-row"><span class="sum-key">핵심 강점</span><span class="sum-vals">${topS.map(s => `<span class="sum-chip gold">${s.name}</span>`).join('')}</span></div>`;
  }

  // 입체(충돌) 요약
  if (conflicts.length) {
    html += `<div class="sum-row"><span class="sum-key">입체성</span><span class="sum-vals sum-text">${conflicts.map(a => a.label).join(' · ')} 영역에서 겉과 속이 갈리는 다면형 — 자세한 풀이는 아래 <b>종합 의견</b>에서.</span></div>`;
  }

  // 한 줄 핵심
  const weakTg = Object.entries(tgs).sort((a, b) => a[1] - b[1])[0]?.[0];
  html += `<p class="sum-core">✨ ${CORE_LINE[weakTg] || CORE_LINE_DEFAULT}</p>`;

  html += `<p class="sum-guide">↓ 레이더 · 사주 · 신점 · 운세 등 상세 분석이 이어집니다</p>`;
  return html;
}

export function synthesisNarrative(result) {
  if (!result.sajuDetail) return '';
  const { axes, strengths, sunSign, fortune, sajuDetail, birthYear, mbti } = result;
  const CURRENT_YEAR = 2026;
  const approxAge = birthYear ? CURRENT_YEAR - birthYear : null;
  const dp = sajuDetail.pillars?.dayProfile;
  const dayEl = sajuDetail.pillars?.day?.ganEl || '';
  const tgs = sajuDetail.tenGodGroups || {};
  const natal = fortune?.natal || {};
  const timeline = fortune?.timeline || {};

  let html = '';

  // ① 핵심 정체성 — 조합·역설 중심
  const confirmed = axes.filter(a => a.stars >= 3 && a.resultPole !== 0);
  const notable   = axes.filter(a => a.stars >= 2 && a.resultPole !== 0);
  const conflicts = axes.filter(a => a.conflict);
  const coreAxes  = confirmed.length ? confirmed : notable.slice(0, 3);
  const topS = [...strengths].sort((a,b) => b.count - a.count).filter(s => s.count >= 3);

  html += `<p class="nv-head nv-confirm">🔮 이 사람은 어떤 사람인가</p>`;

  // 일간 이미지 + 확정 성향
  const elImg = EL_IMAGE[dayEl];
  const daySymbol = dp?.symbol || '';
  let identLine = elImg
    ? `${daySymbol ? `일간 ${daySymbol}, ` : ''}${elImg}처럼 — `
    : '';

  if (coreAxes.length) {
    const poleStr = coreAxes.map(a => `<b>${a.poleLabel}</b>`).join(' · ');
    const certainty = confirmed.length >= 2
      ? `세 렌즈가 동시에 가리키는 신호, 경향이 아니라 이 사람의 고정된 결이다`
      : `여러 렌즈에서 반복 포착되는 패턴이다`;
    identLine += `${poleStr}의 성향이 ${certainty}.`;
  }
  html += `<p>${identLine}</p>`;

  // 핵심 강점 (3개 시스템 이상 지목)
  if (topS.length) {
    html += `<p>세 시스템 이상이 동시에 지목하는 자질 — <b>${topS.map(s => s.name).join(' · ')}</b>. 이 강점이 살아나는 자리에 있을 때 이 사람의 진짜 잠재력이 열린다.</p>`;
  }

  // 그림자: 일간의 함정
  if (dp?.caution) {
    const shadow = dp.caution.split(/[.·]/)[0].trim();
    if (shadow) html += `<p style="color:var(--muted);font-size:.91rem">그늘 — ${shadow}. 이것이 이 사람이 가장 자주 걸려 넘어지는 함정이다.</p>`;
  }

  // ① 교차 통찰 — 사주 × MBTI · 사주 × 별자리
  const mbtiCrossText = sajuMbtiCross(dayEl, mbti);
  const zodiacCrossObj = ohaengZodiacCross(dayEl, sunSign);
  const threeWayText = threeWayInsight(dayEl, mbti, sunSign);

  if (mbtiCrossText || zodiacCrossObj?.text || threeWayText) {
    html += `<p class="nv-head nv-cross">🔗 렌즈 교차 통찰 — 시스템이 겹치는 곳</p>`;

    if (mbtiCrossText && mbti) {
      html += `<div class="cross-insight">
        <div class="cross-label">사주 일간(${dayEl}) × MBTI(${mbti})</div>
        <p>${mbtiCrossText}</p>
      </div>`;
    }

    if (zodiacCrossObj?.text) {
      html += `<div class="cross-insight">
        <div class="cross-label">사주 일간(${dayEl}) × ${sunSign} 원소(${zodiacCrossObj.zodiacEl})</div>
        <p>${zodiacCrossObj.text}</p>
      </div>`;
    }

    if (threeWayText) html += threeWayText;
  }

  // ①-2 입체 분석 — 너 안의 모순(兩面性) 심층
  const conflictHtml = deepConflictAnalysis(conflicts);
  const innerTension = sajuInnerTension(sajuDetail);
  if (conflictHtml || innerTension) {
    html += `<p class="nv-head nv-cross">🎭 입체 분석 — 너 안의 모순</p>`;
    html += `<p class="dc-intro">단순한 사람은 한 방향만 가리킨다. 이 사람은 렌즈와 기운이 서로 엇갈리는 지점을 품고 있다 — 모순처럼 보이지만, 사주에서는 이것을 <b>그릇이 큰 입체적 운명</b>으로 읽는다. 어느 상황에서 어느 얼굴이 나오는지, 그 대가와 강점은 무엇인지 깊이 들여다본다.</p>`;
    html += conflictHtml;
    html += innerTension;
    if (!conflictHtml && innerTension) {
      // 교차 충돌은 없지만 사주 내부 긴장만 있을 때
    }
    if (conflictHtml || innerTension) {
      html += `<p class="dc-foot">이 모순들을 억지로 한쪽으로 정리하려 들면 평생 자신과 싸우게 된다. 둘 다 '진짜 나'임을 받아들이고 <b>상황에 맞게 꺼내 쓰는 법</b>을 익히는 순간, 입체성은 약점이 아니라 누구도 흉내 못 낼 무기가 된다.</p>`;
    }
  }

  // ② 돈 — 역설과 구체 타이밍
  html += `<p class="nv-head">💰 어떻게 돈을 버는 사람인가</p>`;
  html += `<p>${incomeParadox(tgs)}</p>`;

  const moneyScore = natal.재물 || 50;
  const successScore = natal.성공 || 50;
  let moneyCtx = moneyScore >= 68
    ? `재물 인연이 강한 팔자(${moneyScore}점) — 자산을 다루는 감각이 있고 돈이 비교적 잘 따라온다.`
    : moneyScore >= 52
    ? `재물운이 중간(${moneyScore}점) — 노력과 타이밍이 결과를 만드는 유형이다. 기회를 알아보는 안목이 관건이다.`
    : `재물보다 성취·명예(${successScore}점)가 먼저 오는 팔자(${moneyScore}점) — 인정이 쌓인 뒤 수입이 따라오는 순서다.`;
  html += `<p>${moneyCtx}</p>`;

  if (timeline.periods?.length > 1) {
    const good = timeline.periods.filter(p => p.overall >= 65);
    const hard = timeline.periods.filter(p => p.overall < 40);
    if (good.length) {
      const gs = good.map(p => `<b>${p.startAge}~${p.startAge + 9}세</b>(${p.label})`).join(', ');
      html += `<p>기운이 올라오는 구간 ${gs} — 이 시기엔 확장·투자가 결실로 이어진다.</p>`;
    }
    if (hard.length) {
      const hs = hard.map(p => `<b>${p.startAge}~${p.startAge + 9}세</b>`).join(', ');
      html += `<p>${hs}는 수축·점검의 시기 — 이때 무리한 도박보다 기반을 조이는 것이 훨씬 현명하다.</p>`;
    }
  }

  // ③ 앞으로 어떻게 될 것인가 — 미니 인생 이야기
  html += `<p class="nv-head">🌊 앞으로 어떻게 될 것인가</p>`;

  if (approxAge && timeline.periods?.length > 1) {
    const sorted = [...timeline.periods].sort((a, b) => a.startAge - b.startAge);
    let ci = -1;
    for (let i = 0; i < sorted.length; i++) {
      const nx = sorted[i + 1];
      if (sorted[i].startAge <= approxAge && (!nx || nx.startAge > approxAge)) { ci = i; break; }
    }
    if (ci >= 0) {
      const cur = sorted[ci], nxt = sorted[ci + 1], nxt2 = sorted[ci + 2];

      const curMood = cur.overall >= 68
        ? `기운이 살아있는 시기다 — 지금 결정한 것이 3년 후의 결과가 된다. 준비보다 실행이 먼저다.`
        : cur.overall < 42
        ? `기운이 낮은 구간이다. 이 시기의 진짜 과제는 '기다리는 힘'을 기르는 것 — 성급한 결정은 대부분 후회로 돌아온다.`
        : `잔잔하게 흐르는 시기다. 파도가 없다는 것은, 지금 쌓는 것이 소리 없이 다음 도약의 기반이 된다는 뜻이다.`;
      html += `<p>지금(약 ${approxAge}세)은 <b>${cur.label}</b> 대운 한가운데 — ${curMood}</p>`;

      if (nxt) {
        const nxtMood = nxt.overall >= 70
          ? `전성기에 가까운 흐름이 들어온다. 지금이 그 시기를 위해 씨앗을 심는 순간이다.`
          : nxt.overall < 42
          ? `어려운 파도가 예고된다. 지금 지반을 단단히 하는 것이 그 파도를 헤쳐 나가는 유일한 준비다.`
          : `무난하게 흘러간다. 방향을 정하고 꾸준히 걷는 것이 최선이다.`;
        html += `<p><b>${nxt.startAge}세</b>부터 <b>${nxt.label}</b> 대운이 시작된다 — ${nxtMood}</p>`;
      }

      if (nxt2) {
        html += `<p><b>${nxt2.startAge}세</b> 이후 <b>${nxt2.label}</b>까지, 이 세 대운이 만들어가는 궤적이 이 사람의 인생 후반을 결정한다. 지금 이 시점에서 역산해 큰 그림을 그려야 한다.</p>`;
      }
    }
  } else if (timeline.peak != null) {
    html += `<p><b>${timeline.peak}세</b> 무렵 전성기 기운이 온다. 그 시점을 역산해 지금부터 움직여야 한다.</p>`;
  }

  // ④ 한 줄 핵심
  html += `<p class="nv-head">✨ 한 줄 핵심</p>`;
  const weakTg = Object.entries(tgs).sort((a, b) => a[1] - b[1])[0]?.[0];
  html += `<p><b>${CORE_LINE[weakTg] || CORE_LINE_DEFAULT}</b></p>`;

  html += `<p class="nv-foot">사주·MBTI·별자리·혈액형·타로 5개 시스템 종합 분석입니다. 재미용 풀이이며 확정 예측이 아닙니다.</p>`;
  return html;
}

// ===== 타로 시간축 서술 (메이저 22 × 정/역) =====
const TAROT_LONG = {
  0:  { up: '겁 없이 첫발을 내딛던 순수한 모험의 기운이 흐른다. 정해진 길이 없다는 건 곧 무엇이든 될 수 있다는 뜻이었다.', down: '준비 없이 뛰어들어 휘청였거나, 두려움에 발이 묶여 시작을 미뤘던 시간이다.' },
  1:  { up: '가진 재료를 능숙하게 다루어 원하는 것을 현실로 빚어내는 힘이 발휘됐다. 의지가 곧 길이 되던 때다.', down: '재능을 제대로 쓰지 못했거나, 말과 겉모습이 앞서 알맹이가 비었던 흐름이다.' },
  2:  { up: '겉으로 드러나지 않는 직관과 내면의 지혜가 작동했다. 답은 바깥이 아니라 너의 안에 고요히 있었다.', down: '마음의 소리를 외면했거나, 드러나지 않은 비밀과 혼란이 발목을 잡았다.' },
  3:  { up: '풍요와 돌봄, 무언가를 길러내는 너그러운 기운이 가득했다. 마음을 쏟은 것들이 자라나던 시기다.', down: '베풂이 의존으로 기울었거나, 창조의 흐름이 막혀 정체됐던 때다.' },
  4:  { up: '질서를 세우고 책임을 짊어지는 단단한 기운이 있었다. 스스로 기준이 되어 판을 안정시켰다.', down: '고집과 통제가 지나쳐 경직됐거나, 기댈 울타리가 흔들렸던 흐름이다.' },
  5:  { up: '전통과 배움, 믿을 만한 가르침의 손길이 닿았다. 앞서간 이들의 지혜가 길잡이가 되어주었다.', down: '낡은 관습을 거부하고 너만의 길을 고집하던, 독립의 진통이 있었다.' },
  6:  { up: '사랑과 깊은 연결, 그리고 마음을 건 중요한 선택의 순간이 있었다. 누군가와 손잡으며 조화를 이루었다.', down: '관계의 균열이나 잘못된 선택으로 마음이 갈라졌던 시간이다.' },
  7:  { up: '강한 의지로 방향을 통제하며 앞으로 돌진하는 승리의 기운이 흘렀다. 흔들림 없이 목표를 향해 나아갔다.', down: '제어를 잃고 폭주했거나, 방향을 놓쳐 헛바퀴를 돌던 흐름이다.' },
  8:  { up: '거칠게 누르는 대신 부드럽게 다스리는 진짜 용기가 발휘됐다. 인내가 곧 힘이 되던 때다.', down: '자기 의심과 무기력에 눌려, 안의 힘을 충분히 꺼내지 못했다.' },
  9:  { up: '잠시 물러나 홀로 깊이 사유하며 등불을 밝히던 시간이다. 고독 속에서 진짜 답이 영글었다.', down: '고립이 길어져 단절로 굳었거나, 마주해야 할 것을 회피했던 흐름이다.' },
  10: { up: '운명의 수레바퀴가 크게 돌며 전환점이 찾아왔다. 흐름을 타자 뜻밖의 행운이 따라왔다.', down: '예기치 못한 불운이나, 통제 밖의 변화에 휩쓸렸던 시기다.' },
  11: { up: '균형과 공정, 뿌린 대로 거두는 인과의 저울이 작동했다. 정직한 선택이 정직한 결과로 돌아왔다.', down: '불공정함이나 한쪽으로 치우친 판단이 매듭을 꼬이게 했다.' },
  12: { up: '잠시 멈추어 거꾸로 매달린 듯 관점을 뒤집던 시간이다. 내려놓음과 기다림이 새로운 시야를 열었다.', down: '의미 없는 정체에 갇혔거나, 놓아야 할 것을 헛되이 붙들었다.' },
  13: { up: '하나의 막이 내리고 새로운 막이 오르는 깊은 변화가 있었다. 끝은 곧 다른 시작의 문이었다.', down: '변화를 거부하며 끝난 것을 붙잡아, 흐름이 고였던 시기다.' },
  14: { up: '서로 다른 것을 섞어 알맞게 조율하는 절제의 기운이 흘렀다. 극단을 피하고 중용을 지켰다.', down: '균형이 깨져 과하거나 모자랐고, 조율이 어긋났던 흐름이다.' },
  15: { up: '욕망과 집착, 끊어내기 어려운 속박의 힘이 강하게 작동했다. 무엇에 묶여 있는지 들여다볼 때다.', down: '오래된 사슬을 끊고 해방되는, 자각과 자유의 흐름이다.' },
  16: { up: '쌓아온 것이 갑자기 무너지며 충격적인 각성이 찾아왔다. 흔들린 자리에서 진짜가 드러났다.', down: '닥쳐올 위기를 가까스로 피했거나, 무너짐을 미뤄둔 흐름이다.' },
  17: { up: '폭풍 뒤의 별처럼 희망과 치유, 맑은 영감이 비추었다. 다시 믿어볼 용기가 차올랐다.', down: '낙담과 자신감 상실로 빛을 잠시 잃었던 시기다.' },
  18: { up: '안갯속 같은 불안과 환상, 무의식의 물결이 일렁였다. 또렷하지 않은 것들 사이를 더듬어 걸었다.', down: '혼란이 걷히고 가려졌던 진실이 드러나는 흐름이다.' },
  19: { up: '구름을 걷어낸 태양처럼 활력과 성공, 순수한 기쁨이 넘쳤다. 모든 것이 환하게 제자리를 찾았다.', down: '잠시 빛이 흐려졌거나, 지나친 자신감이 발을 헛디디게 했다.' },
  20: { up: '지난 것을 매듭짓고 더 높은 자리로 부름받는 각성의 순간이 있었다. 결단으로 새 장을 열었다.', down: '미련과 자기 비판에 갇혀, 부름에 응답하길 망설였다.' },
  21: { up: '오랜 여정이 하나로 완성되는 성취의 기운이 흘렀다. 흩어졌던 조각들이 마침내 통합됐다.', down: '거의 다 왔으나 마무리가 미뤄진, 미완의 아쉬움이 남았다.' },
};

const POS_FRAME = {
  과거: '지나온 시간 속에서, ',
  현재: '지금 이 순간, ',
  미래: '다가올 흐름 속에서, ',
};

export function timeNarrative(spread) {
  if (!spread || !spread.length) return '';
  let html = '';
  spread.forEach(s => {
    const long = TAROT_LONG[s.card.id] || { up: s.card.upright, down: s.card.reversed };
    const body = s.reversed ? long.down : long.up;
    const orient = s.reversed ? '역방향' : '정방향';
    html += `<p><b>${s.position} · ${s.card.emoji} ${s.card.name} (${orient})</b><br>${POS_FRAME[s.position] || ''}${body}</p>`;
  });
  html += '<p class="nv-foot">기억하자 — 타로의 미래는 정해진 운명이 아니라, 지금 너의 선택으로 얼마든지 다시 쓸 수 있는 가능성의 지도다.</p>';
  return html;
}

export function ziweiNarrative(ziwei) {
  if (!ziwei) return '';
  const { mingongKo, bureauKo, profiles, mainStars } = ziwei;

  if (!profiles || profiles.length === 0) {
    return `<p>명궁 <b>${mingongKo}</b>은 주성이 없는 공궁(空宮)이다. 인접한 대궁(對宮)의 에너지를 빌려오는 구조로, 환경과 타인의 영향을 더 많이 받으며 성장하는 유형이다.</p>`;
  }

  let html = '';
  profiles.forEach(p => {
    if (!p.nature) return;
    html += `
      <div class="zw-star">
        <div class="zw-star-head">
          <span class="zw-star-name">${p.nameKo}</span>
          <span class="zw-star-nature">${p.nature}</span>
        </div>
        <p>${p.personality}</p>
        <div class="zw-meta-row">
          <span class="zw-label">핵심 강점</span>
          <span class="zw-val">${p.strength}</span>
        </div>
        <div class="zw-meta-row">
          <span class="zw-label">그림자</span>
          <span class="zw-val zw-shadow">${p.shadow}</span>
        </div>
        <div class="zw-meta-row">
          <span class="zw-label">이 명궁의 과제</span>
          <span class="zw-val">${p.advice}</span>
        </div>
        <div class="zw-keywords">${(p.keywords || []).map(k => `<span class="chip">${k}</span>`).join('')}</div>
      </div>`;
  });

  const starCount = mainStars.length;
  const coda = starCount >= 2
    ? `<p class="nv-foot">명궁에 주성이 ${starCount}개 이상 있다는 것은, 여러 에너지가 동시에 작용하는 복합적 운명이라는 뜻이다. 어느 하나만이 '나'가 아니며, 두 힘을 통합하는 것이 이 삶의 핵심 과제다.</p>`
    : '';

  return html + coda;
}
