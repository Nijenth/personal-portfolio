// Lightweight shared six-theme picker for both portfolio pages.
// No external dependencies, backend or visitor tracking.
(() => {
  const themes = ['midnight', 'pearl', 'graphite', 'nebula', 'emerald', 'amber'];
  const picker = document.querySelector('.theme-picker');
  const trigger = picker?.querySelector('.theme-trigger');
  const panel = picker?.querySelector('.theme-panel');
  const options = picker?.querySelectorAll('[data-theme-choice]');
  if (!picker || !trigger || !panel || !options?.length) return;

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const browserColors = {
    midnight: '#080b15', pearl: '#f7f9fe', graphite: '#13171a',
    nebula: '#190f26', emerald: '#0d211c', amber: '#261b13'
  };

  function updateChoice(theme, save = false) {
    if (!themes.includes(theme)) theme = 'midnight';
    document.documentElement.dataset.theme = theme;
    options.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    });
    if (themeMeta) themeMeta.content = browserColors[theme];
    if (save) {
      try { localStorage.setItem('nijenth-portfolio-theme', theme); } catch (_) {
        // Still works for the current page when storage is unavailable.
      }
    }
  }

  function setOpen(open, restoreFocus = false) {
    trigger.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    picker.classList.toggle('is-open', open);
    if (restoreFocus) trigger.focus();
  }

  updateChoice(document.documentElement.dataset.theme);

  trigger.addEventListener('click', () => setOpen(panel.hidden));
  options.forEach(button => button.addEventListener('click', () => {
    updateChoice(button.dataset.themeChoice, true);
    setOpen(false, true);
  }));

  document.addEventListener('pointerdown', event => {
    if (!panel.hidden && !picker.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (panel.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); }
  });
})();
