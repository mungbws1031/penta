// 지지 관계 분석 — 충(沖)·육합(六合)·삼합(三合)·방합(方合)·천간합(天干合)
const ZHI_KO = { '子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해' };
const GAN_KO = { '甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계' };

const CHUNG = [['子','午'],['丑','未'],['寅','申'],['卯','酉'],['辰','戌'],['巳','亥']];
const YUKHAP = { '子丑':'토','寅亥':'목','卯戌':'화','辰酉':'금','巳申':'수','午未':'화' };
const SAMHAP = [
  { m: ['申','子','辰'], king: '子', el: '수' },
  { m: ['寅','午','戌'], king: '午', el: '화' },
  { m: ['巳','酉','丑'], king: '酉', el: '금' },
  { m: ['亥','卯','未'], king: '卯', el: '목' },
];
const BANGHAP = [
  { m: ['寅','卯','辰'], el: '목' }, { m: ['巳','午','未'], el: '화' },
  { m: ['申','酉','戌'], el: '금' }, { m: ['亥','子','丑'], el: '수' },
];
const GANHAP = { '甲己':'토','乙庚':'금','丙辛':'수','丁壬':'목','戊癸':'화' };

const zko = z => `${ZHI_KO[z]}(${z})`;
const pairKey = (a, b) => [a, b].sort().join('');

export function analyzeHapchung(sajuDetail) {
  const p = sajuDetail?.pillars;
  if (!p) return null;

  // 자리 정보 (시주는 있을 때만)
  const branches = [
    { pos: '년', zhi: p.year?.zhi },
    { pos: '월', zhi: p.month?.zhi },
    { pos: '일', zhi: p.day?.zhi },
    { pos: '시', zhi: p.time?.zhi },
  ].filter(b => b.zhi);
  const stems = [
    { pos: '년', gan: p.year?.gan },
    { pos: '월', gan: p.month?.gan },
    { pos: '일', gan: p.day?.gan },
    { pos: '시', gan: p.time?.gan },
  ].filter(s => s.gan);

  const findings = [];
  const has = z => branches.some(b => b.zhi === z);
  const posOf = z => branches.filter(b => b.zhi === z).map(b => b.pos).join('·');

  // 삼합 / 반합
  SAMHAP.forEach(s => {
    const present = s.m.filter(has);
    if (present.length === 3) {
      findings.push({ type: '삼합', kind: 'good', title: `${s.m.map(zko).join('·')} 삼합 ${s.el}국(局)`,
        text: `세 지지가 완전한 삼합을 이뤄 <b>${s.el} 기운이 매우 강하게 결집</b>한다. 그 오행 분야에서 큰 힘과 인복이 따르는, 사주의 핵심 동력이다.` });
    } else if (present.length === 2 && present.includes(s.king)) {
      const other = present.find(z => z !== s.king);
      findings.push({ type: '반합', kind: 'good', title: `${zko(s.king)}·${zko(other)} 반합(半合) ${s.el}`,
        text: `왕지(旺支) ${zko(s.king)}를 낀 반합으로 <b>${s.el} 기운이 강해진다</b>. 완전한 삼합보다는 약하지만 그 방향으로 힘이 모인다.` });
    }
  });

  // 방합
  BANGHAP.forEach(b => {
    const present = b.m.filter(has);
    if (present.length === 3) {
      findings.push({ type: '방합', kind: 'good', title: `${b.m.map(zko).join('·')} 방합(方合) ${b.el}국`,
        text: `한 계절의 세 지지가 모여 <b>${b.el} 기운이 한 덩어리로 강해진다</b>. 그 오행이 사주를 주도하는 큰 세력이 된다.` });
    }
  });

  // 육합
  Object.entries(YUKHAP).forEach(([k, el]) => {
    const a = k[0], b = k[1];
    if (has(a) && has(b)) {
      findings.push({ type: '육합', kind: 'good', title: `${zko(a)}·${zko(b)} 육합(化${el})`,
        text: `${posOf(a)}·${posOf(b)} 자리가 합으로 묶여 <b>안정과 인연, 결속</b>의 기운이 생긴다. 다만 합이 지나치면 묶여서 제 역할을 못 하기도 한다.` });
    }
  });

  // 충
  CHUNG.forEach(([a, b]) => {
    if (has(a) && has(b)) {
      const pa = posOf(a), pb = posOf(b);
      const where = pairKey(pa, pb);
      const nuance =
        (pa + pb).includes('월') && (pa + pb).includes('일') ? ' (월·일 충 — 가정과 사회, 직업과 거처에 변동이 크다)'
        : (pa + pb).includes('일') && (pa + pb).includes('시') ? ' (일·시 충 — 배우자·자녀·말년 영역에 변화가 따른다)'
        : (pa + pb).includes('년') && (pa + pb).includes('월') ? ' (년·월 충 — 초년·부모대의 이동과 변동)'
        : '';
      findings.push({ type: '충', kind: 'caution', title: `${zko(a)}·${zko(b)} 충(沖)`,
        text: `${pa}·${pb} 자리가 정면으로 부딪힌다. 그 영역에 <b>변동·이동·긴장</b>이 잦아 안정이 흔들리기 쉽지만, 역마처럼 큰 변화를 만드는 추진력이 되기도 한다.${nuance}` });
    }
  });

  // 천간합
  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      const key = [stems[i].gan, stems[j].gan].sort((x, y) => '甲乙丙丁戊己庚辛壬癸'.indexOf(x) - '甲乙丙丁戊己庚辛壬癸'.indexOf(y)).join('');
      const el = GANHAP[key];
      if (el) {
        const ilGan = stems[i].pos === '일' || stems[j].pos === '일';
        findings.push({ type: '천간합', kind: ilGan ? 'caution' : 'good',
          title: `${GAN_KO[stems[i].gan]}·${GAN_KO[stems[j].gan]} 천간합(化${el})`,
          text: `${stems[i].pos}간·${stems[j].pos}간이 합을 이룬다 — 두 기운이 끌어당겨 묶이는 인연의 표시다.${ilGan ? ' 일간(나)이 합에 묶이면 정에 약해지거나 한 가지에 매이기 쉬우니, 휘둘리지 않는 중심이 필요하다.' : ''}` });
      }
    }
  }

  return { findings };
}
