import { CARD_W, CARD_H } from './shareCard.js';

// SVG 문자열 → PNG 다운로드. 의존성 없이 캔버스로 래스터화.
// 2배 스케일로 선명하게. 브라우저 환경 전용(캔버스 필요).
export function downloadSVGAsPNG(svgString, filename, scale = 2) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
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
