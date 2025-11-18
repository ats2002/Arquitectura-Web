// main.js — interacciones: smooth reveal, form validation, logo animation, small UX helpers

document.addEventListener('DOMContentLoaded', () => {
  // set footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth reveal with IntersectionObserver
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    // fallback: reveal all
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  // Logo animation on scroll: small scale on top -> normal when not scrolled
  const logo = document.getElementById('logo');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY || window.pageYOffset;
    if (!logo) return;
    if (y > 30) {
      logo.style.transform = 'scale(0.95)';
      logo.style.transition = 'transform 220ms ease';
    } else {
      logo.style.transform = 'scale(1)';
    }
    lastScroll = y;
  }, { passive: true });

  // Contact form validation + simulated send
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        status.textContent = 'Por favor corrige los campos en rojo.';
        return;
      }
      // Simulate sending
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.textContent = 'Enviando...';
      setTimeout(() => {
        submitBtn.disabled = false;
        form.reset();
        form.classList.remove('was-validated');
        status.textContent = 'Mensaje enviado. Te contactamos pronto.';
      }, 1100);
    }, false);
  }

  // Enable Bootstrap tooltips if available
  if (window.bootstrap && bootstrap.Tooltip) {
    const t = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    t.forEach(el => new bootstrap.Tooltip(el));
  }

  // Small accessible improvement: focus visible outlines only for keyboard users
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
});