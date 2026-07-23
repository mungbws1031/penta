// 리포트 섹션을 PDF로 저장. 별도 라이브러리 없이 브라우저 인쇄(→ PDF로 저장)를 이용한다.
// 접힌 <details> 카드는 인쇄에 안 잡히므로 인쇄 전 전부 펼치고, 인쇄가 끝나면 원래 상태로 되돌린다.
export function exportSectionAsPDF(sectionEl, fileTitle) {
  if (!sectionEl) return;
  const closedDetails = [...sectionEl.querySelectorAll('details:not([open])')];
  closedDetails.forEach(d => { d.open = true; });

  const prevTitle = document.title;
  document.title = fileTitle;

  const restore = () => {
    closedDetails.forEach(d => { d.open = false; });
    document.title = prevTitle;
    window.removeEventListener('afterprint', restore);
  };
  window.addEventListener('afterprint', restore);

  window.print();
}
