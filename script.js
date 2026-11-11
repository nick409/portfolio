/* ============================================================
   Devansh's Portfolio — vanilla JS interactions
   ============================================================ */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav drawer ---------- */
  const navToggle = document.getElementById('navToggle');
  const navDrawer = document.getElementById('navDrawer');

  function closeNav() {
    navDrawer.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navDrawer.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navDrawer.querySelectorAll('[data-nav]').forEach((link) => {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ---------- Custom cursor (desktop only) ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHover && cursorDot && cursorRing && !prefersReducedMotion) {
    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorDot.style.left = targetX + 'px';
      cursorDot.style.top = targetY + 'px';
    });

    function animateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .project-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '52px';
        cursorRing.style.height = '52px';
        cursorRing.style.borderColor = 'var(--c-yellow)';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '32px';
        cursorRing.style.height = '32px';
        cursorRing.style.borderColor = 'var(--c-mint)';
      });
    });
  } else if (cursorDot && cursorRing) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* ---------- Magnetic buttons ---------- */
  if (supportsHover && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---------- Scroll-triggered reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Project category filters ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  /* ---------- Project detail modals ---------- */
  const expandButtons = document.querySelectorAll('.project-expand');
  let lastFocusedEl = null;

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    lastFocusedEl = document.activeElement;
    modal.classList.add('is-open');
    const closeBtn = modal.querySelector('[data-modal-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  expandButtons.forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.modal));
  });

  document.querySelectorAll('[data-modal-root]').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
    const closeBtn = modal.querySelector('[data-modal-close]');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.is-open').forEach((modal) => closeModal(modal));
    }
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function setFieldError(fieldName, message) {
    const row = form.querySelector(`#${fieldName}`).closest('.form-row');
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (message) {
      row.classList.add('has-error');
      errorEl.textContent = message;
    } else {
      row.classList.remove('has-error');
      errorEl.textContent = '';
    }
  }

  function validateForm() {
    let valid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      setFieldError('name', 'Please enter your name.');
      valid = false;
    } else {
      setFieldError('name', '');
    }

    if (!email || !emailPattern.test(email)) {
      setFieldError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      setFieldError('email', '');
    }

    if (!message) {
      setFieldError('message', 'Please enter a message.');
      valid = false;
    } else {
      setFieldError('message', '');
    }

    return valid;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) {
        formStatus.textContent = 'Please fix the highlighted fields.';
        formStatus.style.color = 'var(--c-coral)';
        return;
      }

      // No backend is wired up — this opens the user's email client with the message pre-filled.
      // Replace YOUR_EMAIL in index.html with a real address, or point this at a form backend.
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:YOUR_EMAIL?subject=${subject}&body=${body}`;

      formStatus.textContent = 'Opening your email client…';
      formStatus.style.color = 'var(--c-mint)';
      form.reset();
    });
  }
})();
