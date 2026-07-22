import { CARD_W, CARD_H } from './shareCard.js';

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('이미지 인코딩 실패'));
    reader.readAsDataURL(blob);
  });
}

// SVG 안의 <image href="..."> 참조(상대경로 배경 이미지)를 base64 data URI로 치환.
// blob: URL로 렌더되는 SVG는 상대경로 해석이 불안정하고, 캔버스 오염(taint) 위험도 있어
// 래스터화 전에 미리 실제 바이트를 인라인해 둔다.
async function inlineExternalImages(svgString) {
  const hrefs = [...svgString.matchAll(/<image[^>]+href="([^"]+)"/g)]
    .map(m => m[1])
    .filter(href => !href.startsWith('data:'));
  let out = svgString;
  for (const href of new Set(hrefs)) {
    const res = await fetch(href);
    const dataUrl = await blobToDataURL(await res.blob());
    out = out.split(`href="${href}"`).join(`href="${dataUrl}"`);
  }
  return out;
}

// SVG 문자열 → PNG 다운로드. 의존성 없이 캔버스로 래스터화.
// 2배 스케일로 선명하게. 브라우저 환경 전용(캔버스 필요).
export async function downloadSVGAsPNG(svgString, filename, scale = 2) {
  const inlined = await inlineExternalImages(svgString);
  return new Promise((resolve, reject) => {
    const blob = new Blob([inlined], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = CARD_W * scale;
      canvas.height = CARD_H * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(pngBlob => {
        if (!pngBlob) { reject(new Error('PNG 변환 실패')); return; }
        const a = document.createElement('a');
        const pngUrl = URL.createObjectURL(pngBlob);
        a.href = pngUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG 로드 실패')); };
    img.src = url;
  });
}
