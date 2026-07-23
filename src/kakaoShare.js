// 카카오톡 공유(Kakao JS SDK). 도메인 화이트리스트 + JavaScript 키가 있어야 동작한다.
// 발급: Kakao Developers(https://developers.kakao.com) > 내 애플리케이션 > 앱 키 > JavaScript 키
// 등록: 같은 콘솔의 플랫폼 > Web 플랫폼에 배포 도메인(예: https://mungbws1031.github.io)을 추가해야 한다.
const KAKAO_JS_KEY = '';

export function initKakao() {
  const Kakao = window.Kakao;
  if (!KAKAO_JS_KEY || !Kakao) return;
  if (!Kakao.isInitialized()) Kakao.init(KAKAO_JS_KEY);
}

function absoluteAssetUrl(path) {
  const base = import.meta.env.BASE_URL;
  return new URL(base + path, location.href).href;
}

// title/description: 공유 카드에 뜨는 문구. imagePath: public/의 정적 이미지 파일명(예: 'profile-card-bg.jpg').
export function shareToKakao({ title, description, imagePath }) {
  const Kakao = window.Kakao;
  if (!Kakao || !Kakao.isInitialized()) {
    alert('카카오톡 공유는 아직 연결 전이에요. (Kakao Developers에서 JavaScript 키를 발급받아 연결해야 동작해요)');
    return;
  }
  const homeUrl = new URL(import.meta.env.BASE_URL, location.href).href;
  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl: absoluteAssetUrl(imagePath),
      link: { mobileWebUrl: homeUrl, webUrl: homeUrl },
    },
    buttons: [
      { title: '나도 해보기', link: { mobileWebUrl: homeUrl, webUrl: homeUrl } },
    ],
  });
}
