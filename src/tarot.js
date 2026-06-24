// 메이저 아르카나 22장 (텍스트+이모지, 저작권 안전). 재미용 짧은 해석.
export const MAJOR_ARCANA = [
  { id: 0,  name: '바보',     emoji: '🃏', upright: '새로운 시작, 자유, 모험', reversed: '무모함, 망설임, 준비 부족' },
  { id: 1,  name: '마법사',   emoji: '🪄', upright: '의지, 실행력, 가능성', reversed: '재능 낭비, 속임수' },
  { id: 2,  name: '여사제',   emoji: '🌙', upright: '직관, 비밀, 내면의 지혜', reversed: '혼란, 억눌린 감정' },
  { id: 3,  name: '여황제',   emoji: '👑', upright: '풍요, 모성, 창조', reversed: '의존, 정체' },
  { id: 4,  name: '황제',     emoji: '🏛️', upright: '권위, 안정, 리더십', reversed: '독선, 경직' },
  { id: 5,  name: '교황',     emoji: '⛪', upright: '전통, 가르침, 신뢰', reversed: '관습 거부, 독립' },
  { id: 6,  name: '연인',     emoji: '💕', upright: '사랑, 선택, 조화', reversed: '갈등, 잘못된 선택' },
  { id: 7,  name: '전차',     emoji: '🛡️', upright: '추진, 승리, 통제', reversed: '폭주, 방향 상실' },
  { id: 8,  name: '힘',       emoji: '🦁', upright: '용기, 인내, 부드러운 힘', reversed: '자기의심, 무기력' },
  { id: 9,  name: '은둔자',   emoji: '🏮', upright: '성찰, 고독, 탐구', reversed: '고립, 회피' },
  { id: 10, name: '운명의수레', emoji: '🎡', upright: '전환점, 행운, 흐름', reversed: '불운, 통제 불능' },
  { id: 11, name: '정의',     emoji: '⚖️', upright: '균형, 공정, 인과', reversed: '불공정, 편향' },
  { id: 12, name: '매달린사람', emoji: '🙃', upright: '멈춤, 관점 전환, 희생', reversed: '정체, 헛된 버팀' },
  { id: 13, name: '죽음',     emoji: '🦋', upright: '끝과 재생, 변화', reversed: '변화 거부, 정체' },
  { id: 14, name: '절제',     emoji: '🍷', upright: '조화, 절제, 중용', reversed: '과잉, 불균형' },
  { id: 15, name: '악마',     emoji: '😈', upright: '집착, 욕망, 속박', reversed: '해방, 자각' },
  { id: 16, name: '탑',       emoji: '🗼', upright: '갑작스런 붕괴, 각성', reversed: '위기 회피, 지연' },
  { id: 17, name: '별',       emoji: '⭐', upright: '희망, 영감, 치유', reversed: '낙담, 자신감 상실' },
  { id: 18, name: '달',       emoji: '🌕', upright: '불안, 환상, 무의식', reversed: '혼란 해소, 진실' },
  { id: 19, name: '태양',     emoji: '☀️', upright: '활력, 성공, 기쁨', reversed: '일시적 흐림, 과신' },
  { id: 20, name: '심판',     emoji: '📯', upright: '각성, 부활, 결단', reversed: '미련, 자기비판' },
  { id: 21, name: '세계',     emoji: '🌍', upright: '완성, 성취, 통합', reversed: '미완, 마무리 지연' },
];

export const POSITIONS = ['과거', '현재', '미래'];

// Fisher-Yates. randomFn: () => [0,1)
export function shuffle(deck, randomFn = Math.random) {
  const a = [...deck];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 3장 뽑기 → [{ position, card, reversed }]. randomFn 주입으로 테스트 결정적.
export function drawThree(randomFn = Math.random) {
  const drawn = shuffle(MAJOR_ARCANA, randomFn).slice(0, 3);
  return drawn.map((card, i) => ({
    position: POSITIONS[i],
    card,
    reversed: randomFn() < 0.5,
  }));
}

// 한 장의 위치 해석 텍스트.
export function readingText(slot) {
  const { card, reversed, position } = slot;
  const meaning = reversed ? card.reversed : card.upright;
  const orient = reversed ? '역방향' : '정방향';
  return `${position} — ${card.name}(${orient}): ${meaning}`;
}
