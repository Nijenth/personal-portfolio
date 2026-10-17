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

// Netlify Forms: the static HTML <form> above is discovered during Netlify
// deployment. Here we send it without leaving the page.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = contactForm.querySelector('.contact-submit-label');
  const status = document.querySelector('#contact-status');

  function setContactStatus(message, state = 'info') {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  }

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (submitButton.disabled || !contactForm.reportValidity()) return;

    // Prevent fake "message sent" confirmations from local preview servers
    // or the old GitHub Pages hosting domain, which cannot process Netlify Forms.
    const previewHost = location.protocol === 'file:' ||
      /^(localhost|127(?:\.\d{1,3}){3})$/i.test(location.hostname) ||
      location.hostname.endsWith('.github.io');

    if (previewHost) {
      setContactStatus('Preview only — sending will work after deploying this version to Netlify.', 'info');
      return;
    }

    const fields = new FormData(contactForm);
    for (const key of ['name', 'email', 'message']) {
      const value = String(fields.get(key) ?? '').trim();
      if (!value) {
        setContactStatus('Please complete your name, email and project details.', 'error');
        return;
      }
      fields.set(key, value);
    }

    submitButton.disabled = true;
    submitLabel.textContent = 'Sending…';
    setContactStatus('Sending your message…', 'info');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fields).toString()
      });

      if (!response.ok) throw new Error(`Netlify returned HTTP ${response.status}`);

      setContactStatus('Thanks! Your message has been submitted. I’ll be in touch.', 'success');
      contactForm.reset();
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setContactStatus('Could not send your message. Please retry, or use the email link on the left.', 'error');
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Send Message';
    }
  });
}
