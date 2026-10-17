// Lightweight interactions for the static GitHub Pages portfolio.
// No API keys, fabricated data or simulated form submissions.

const menuButton = document.querySelector('.nav-toggle');
const nav = document.querySelector('#primary-nav');
const header = document.querySelector('.site-header');

function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const wasOpen = nav.classList.contains('is-open');
      closeMenu();
      if (wasOpen) menuButton.focus();
    }
  });

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
}

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 12);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (!reducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('can-reveal');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Soft spotlight that follows the pointer across cards (mouse/trackpad only).
if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card, .service-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}


// Give the footer rocket time to launch before scrolling to the top.
// The #home link still works normally if JavaScript is unavailable.
const rocketLink = document.querySelector('.rocket-top');
if (rocketLink) {
  rocketLink.addEventListener('click', event => {
    // Preserve native link behavior for reduced motion and modified clicks.
    if (reducedMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (rocketLink.classList.contains('is-launching')) return;

    rocketLink.classList.add('is-launching');
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.getElementById('home')?.focus({ preventScroll: true });
      window.history.replaceState(null, '', '#home');
      rocketLink.classList.remove('is-launching');
    }, 730);
  });
}