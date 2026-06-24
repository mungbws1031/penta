import { TRAITS_LOOKUP } from './zodiac.js';

// 별자리 상세(원소·모드·양음 + 짧은 성향 설명). 재미용 일반 통설 수준.
const BLURB = {
  양자리: '먼저 부딪혀 길을 내는 개척자. 추진력은 최고, 마무리는 숙제.',
  황소자리: '느긋하지만 한번 정하면 끝까지. 안정과 감각을 사랑함.',
  쌍둥이자리: '호기심 천국, 말과 정보의 달인. 변화무쌍한 멀티플레이어.',
  게자리: '정 많고 품이 넓은 보호자. 내 사람에겐 한없이 따뜻함.',
  사자자리: '타고난 주인공. 당당함과 너그러움으로 사람을 끌어당김.',
  처녀자리: '디테일을 놓치지 않는 분석가. 완벽주의 속 다정함.',
  천칭자리: '균형과 조화의 외교관. 관계와 미감에 예민함.',
  전갈자리: '깊고 강렬한 몰입형. 한번 마음 주면 끝까지 파고듦.',
  사수자리: '자유로운 모험가. 큰 그림과 의미를 좇는 낙천가.',
  염소자리: '묵묵히 정상까지 오르는 현실주의자. 책임감의 화신.',
  물병자리: '틀을 깨는 독창적 사고. 쿨하지만 인류애 가득.',
  물고기자리: '공감과 상상의 예술혼. 경계 없이 스며드는 감성가.',
};

const ELEMENT_LABEL = { 불: '불 🔥', 흙: '흙 🌱', 공기: '공기 💨', 물: '물 💧' };
const MODALITY_LABEL = { 활동: '활동궁(시작)', 고정: '고정궁(유지)', 변통: '변통궁(적응)' };

export function zodiacDetail(sign) {
  const t = TRAITS_LOOKUP[sign];
  if (!t) return null;
  return {
    sign,
    element: t.element,
    polarity: t.polarity,
    modality: t.modality,
    elementLabel: ELEMENT_LABEL[t.element],
    modalityLabel: MODALITY_LABEL[t.modality],
    blurb: BLURB[sign],
  };
}
