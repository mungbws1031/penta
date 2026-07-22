export function bindReportToc(rootEl) {
  rootEl.querySelectorAll('.toc-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const targets = rootEl.querySelectorAll(`.card[data-group="${group}"]`);
      if (!targets.length) return;
      targets.forEach(el => { if (el.tagName === 'DETAILS') el.open = true; });
      targets[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
