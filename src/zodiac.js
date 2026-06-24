// 태양궁 경계(통용 날짜). [시작월, 시작일, 궁이름]
const SIGNS = [
  [1, 20, '물병자리'], [2, 19, '물고기자리'], [3, 21, '양자리'],
  [4, 20, '황소자리'], [5, 21, '쌍둥이자리'], [6, 22, '게자리'],
  [7, 23, '사자자리'], [8, 23, '처녀자리'], [9, 23, '천칭자리'],
  [10, 23, '전갈자리'], [11, 22, '사수자리'], [12, 22, '염소자리'],
];

export function sunSign(month, day) {
  const cur = SIGNS.find(s => s[0] === month);
  if (day >= cur[1]) return cur[2];
  const prevMonth = month === 1 ? 12 : month - 1;
  return SIGNS.find(s => s[0] === prevMonth)[2];
}

// 궁 → (원소, 양음, 모드)
const TRAITS = {
  양자리:   ['불', '양', '활동'], 사자자리: ['불', '양', '고정'], 사수자리: ['불', '양', '변통'],
  황소자리: ['흙', '음', '고정'], 처녀자리: ['흙', '음', '변통'], 염소자리: ['흙', '음', '활동'],
  쌍둥이자리:['공기','양','변통'], 천칭자리: ['공기','양','활동'], 물병자리: ['공기','양','고정'],
  게자리:   ['물', '음', '활동'], 전갈자리: ['물', '음', '고정'], 물고기자리:['물','음','변통'],
};

export function zodiacSignals(sign) {
  const [element, polarity, modality] = TRAITS[sign];
  const A1 = polarity === '양' ? 0.5 : -0.5;
  const A2 = (element === '불' || element === '공기') ? 0.5 : element === '흙' ? -0.5 : 0;
  const A3 = element === '공기' ? 0.5 : element === '물' ? -0.5 : 0;
  const A4 = modality === '고정' ? 0.5 : modality === '변통' ? -0.5 : 0.25;
  const A5 = modality === '활동' ? 0.5 : modality === '변통' ? -0.25 : 0;
  return { A1, A2, A3, A4, A5 };
}

export const TRAITS_LOOKUP = Object.fromEntries(
  Object.entries(TRAITS).map(([sign, [element, polarity, modality]]) => [
    sign, { element, polarity, modality },
  ])
);
