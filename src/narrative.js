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
export function relationNarrative(fortune, sajuDetail) {
  const { relation, gender } = fortune;
  if (!relation) return '';
  const isFemale = gender === 'female';
  const tgs = sajuDetail?.tenGodGroups || {};
  let html = '';

  const spouseScore = relation.배우자;
  html += `<p class="nv-head">💑 배우자운</p>`;
  if (spouseScore >= 70) {
    html += isFemale
      ? `<p>관성(官星)이 충실해 배우자 인연이 강한 팔자다. 남편이 안정적인 울타리가 되고 사회적·경제적 지원을 준다. 가정 운이 탄탄하다.</p>`
      : `<p>재성(財星)이 충실해 배우자 인연이 강한 팔자다. 아내가 현실적·경제적 도움을 주는 인연이 된다. 가정이 든든한 기반이 된다.</p>`;
  } else if (spouseScore >= 55) {
    html += `<p>배우자 인연은 있으나 노력이 더해질 때 빛나는 관계다. 서로를 이해하는 시간이 쌓일수록 더 단단해진다.</p>`;
  } else if (spouseScore >= 44) {
    html += `<p>배우자운이 평범한 편이다. 인연이 늦게 오거나, 결혼 후 서로의 독립적인 영역을 존중하는 관계가 잘 맞는다.</p>`;
  } else {
    html += `<p>배우자 인연이 약하거나 복잡한 팔자다. ${isFemale ? '상관(傷官)이 관성을 극하는 구조 — ' : '비겁이 재성을 침범하는 구조 — '}만혼·이별 가능성이 있으므로 인연을 억지로 붙잡기보다 자신의 세계를 먼저 완성하는 것이 현명하다.</p>`;
  }

  const childScore = relation.자식;
  html += `<p class="nv-head">👶 자식운</p>`;
  if (childScore >= 70) {
    html += isFemale
      ? `<p>식상(食傷)이 발달해 자식 복이 풍부한 팔자다. 자녀와 정서적 교감이 깊고, 자녀가 창의적·표현적으로 성장하는 인연이 된다.</p>`
      : `<p>관성(官星)이 발달해 자식 복이 강한 팔자다. 자녀가 사회적으로 인정받고 부모의 이름을 빛내는 인연이 된다.</p>`;
  } else if (childScore >= 55) {
    html += `<p>자식과의 인연이 괜찮은 편이다. 자녀가 생기면 정이 깊게 쌓이고, 노년에 든든한 지지대가 된다.</p>`;
  } else if (childScore >= 44) {
    html += `<p>자식 인연이 평범하다. 자녀를 일찍 독립시키거나 적은 수의 자녀와 깊은 관계를 맺는 것이 자연스러운 형태다.</p>`;
  } else {
    html += `<p>자식 인연이 약한 팔자다. 늦게 자녀를 두거나, 정신적·사회적 자녀(제자·후배)를 키우는 역할로 채워지는 경우도 많다.</p>`;
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

export function synthesisNarrative(result) {
  if (!result.sajuDetail) return '';
  const { axes, strengths, sunSign, fortune, sajuDetail, birthYear } = result;
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

  // 시스템 간 충돌 → 입체감
  if (conflicts.length) {
    const cls = conflicts.map(a => a.label).join(' · ');
    html += `<p><b>${cls}</b> 영역에서는 시스템마다 신호가 엇갈린다. 이 모순이 결점이 아니다 — 상황에 따라 다른 모습이 나오는, 단순하지 않은 입체적 사람의 증거다.</p>`;
  }

  // 핵심 강점 (3개 시스템 이상 지목)
  if (topS.length) {
    html += `<p>세 시스템 이상이 동시에 지목하는 자질 — <b>${topS.map(s => s.name).join(' · ')}</b>. 이 강점이 살아나는 자리에 있을 때 이 사람의 진짜 잠재력이 열린다.</p>`;
  }

  // 그림자: 일간의 함정
  if (dp?.caution) {
    const shadow = dp.caution.split(/[.·]/)[0].trim();
    if (shadow) html += `<p style="color:var(--muted);font-size:.91rem">그늘 — ${shadow}. 이것이 이 사람이 가장 자주 걸려 넘어지는 함정이다.</p>`;
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
  const CORE_LINE = {
    비겁: '파트너십이 이 팔자의 빈 칸을 채운다 — 혼자보다 함께일 때 더 크다.',
    식상: '표현하지 않으면 세상은 모른다 — 재능을 꺼내는 용기가 첫 번째 과제다.',
    재성: '돈을 쫓지 마라, 가치 있는 일을 쫓아라 — 가치가 쌓이면 재물은 따라온다.',
    관성: '책임지는 자리가 이 사람을 성장시킨다 — 그 자리를 두려워하지 마라.',
    인성: '배운 것을 쌓아두지 말고 행동으로 내보내라 — 실행이 지식을 실력으로 바꾼다.',
  };
  html += `<p><b>${CORE_LINE[weakTg] || '5개 시스템이 가리키는 방향을 믿고, 자신의 결에 맞는 삶을 살아라.'}</b></p>`;

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
