# PENTA — 5중 셀프 프로파일러 (고정특성 프로토타입)

재미용 셀프 분석. 사주·MBTI·혈액형·별자리 신호를 공통 5축으로 합성해 일치도(★)·충돌·강점·갭을 보여준다.

## 실행
- 개발 서버: `npm install && npm run dev`
- 테스트: `npm test`

## 구조
`src/` 순수 엔진 모듈 + UI 셸:
- `axes.js` 5축 메타 + `vote()` / `consensus.js` 가중lean·별점·충돌
- `mbti.js` `zodiac.js` `bloodtype.js` `saju.js` 시스템별 → 5축 신호
- `strengths.js` 12강점 직접 매핑 / `gap.js` 갭 분석
- `engine.js` 입력 → 통합 출력 / `report.js` 출력 → 리포트 HTML
- `index.html` + `main.js` 입력 폼 ↔ 엔진 ↔ 리포트

설계 근거: [`../docs/superpowers/specs/2026-06-24-penta-consensus-mapping-design.md`](../docs/superpowers/specs/2026-06-24-penta-consensus-mapping-design.md)

## 핵심 규칙
- 배지(★) 카운트 = {사주·MBTI·별자리} 중 다수극 투표 수 (혈액형은 가중 합산에만 기여, 카운트 제외).
- 충돌(입체) = 양극 분할 + 소수극 가중질량 ≥ 35%.
- 시주 미상 시 사주 가중 1.0 → 0.85 + 리포트 고지.

## 범위 / 한계
- 고정특성 트랙만. 타로·시간축·궁합·데일리는 후속.
- 사주 십성 매핑은 대중적 통설 수준 (유파별 정밀도 v2).
- 만세력은 `lunar-javascript` 사용. 한국 사주 정확도는 별도 검증 필요(PRD Open Question).
