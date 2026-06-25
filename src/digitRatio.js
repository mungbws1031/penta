// 2D:4D 손가락 비율 — 검지(2D)와 약지(4D) 길이 비로 태내 테스토스테론 노출을 가늠하는 지표.
// 약지가 길수록(낮은 2D:4D) 태내 테스토스테론 노출이 높았다고 보는 통설. (상관 연구이며 논쟁 있음 — 재미용)
// choice: 'ring'(약지가 더 김) | 'similar'(비슷) | 'index'(검지가 더 김)

const DATA = {
  ring: {
    category: '약지 > 검지 (낮은 2D:4D)',
    testosterone: '높은 편',
    tone: 'T',
    blurb: '넷째 손가락(약지)이 둘째(검지)보다 길다면, 태아기에 테스토스테론에 상대적으로 더 노출됐을 가능성을 본다. 통계적으로 경쟁심·추진력·공간 지각·모험 성향과 느슨하게 연관된다고 이야기되는 쪽이다.',
    traits: ['추진력', '경쟁심', '공간 지각', '모험성'],
  },
  similar: {
    category: '검지 ≈ 약지 (중간 2D:4D)',
    testosterone: '중간',
    tone: 'M',
    blurb: '두 손가락 길이가 엇비슷하다면 중간 지대다. 태내 호르몬 환경이 어느 한쪽으로 크게 치우치지 않은, 균형형으로 본다.',
    traits: ['균형', '적응력'],
  },
  index: {
    category: '검지 > 약지 (높은 2D:4D)',
    testosterone: '낮은 편',
    tone: 'E',
    blurb: '둘째(검지)가 넷째(약지)보다 길다면, 상대적으로 에스트로겐 쪽 환경이었을 가능성을 본다. 공감·언어 감각·섬세한 관계 조율과 느슨하게 연관된다고 이야기되는 쪽이다.',
    traits: ['공감', '언어 감각', '섬세함', '관계 조율'],
  },
};

export function analyzeDigitRatio(choice) {
  const d = DATA[choice];
  if (!d) return null;
  return { choice, ...d };
}
