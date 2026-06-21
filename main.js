(function() {
  const body = document.body;
  const navbar = document.querySelector('.navbar');
  const mobilePanel = document.querySelector('.mobile-panel');
  const mobileScrim = document.querySelector('.mobile-scrim');
  const hamburger = document.querySelector('.hamburger');
  const backToTop = document.querySelector('.back-to-top');

  function setActiveNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-panel a').forEach((link) => {
      const href = (link.getAttribute('href') || '').split('/').pop();
      if (href === path) link.classList.add('active');
    });
  }

  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
      }, 500);
    }
    body.classList.add('loaded');
  });

  function toggleMenu(open) {
    if (!mobilePanel || !mobileScrim || !hamburger) return;
    mobilePanel.classList.toggle('open', open);
    mobileScrim.classList.toggle('open', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    body.style.overflow = open ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', () => {
    toggleMenu(hamburger.getAttribute('aria-expanded') !== 'true');
  });
  mobileScrim?.addEventListener('click', () => toggleMenu(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  document.querySelectorAll('[data-scroll-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(btn.getAttribute('data-scroll-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });

  document.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 30);
    backToTop?.classList.toggle('show', y > 600);
  }, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count || '0');
    const duration = 1300;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(step);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(el);
  });

  document.querySelectorAll('.card, .bento-card, .product-card, .timeline-card, .quote-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });

  document.querySelectorAll('.btn').forEach((btn) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let ticking = false;
    btn.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = btn.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
          btn.style.transform = `translate(${x}px, ${y}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  document.querySelectorAll('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#f87171';
          field.style.animation = 'shake 0.4s ease';
          setTimeout(() => field.style.animation = '', 400);
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        const original = button.innerHTML;
        button.disabled = true;
        button.innerHTML = 'Sending...';
        setTimeout(() => {
          button.disabled = false;
          button.innerHTML = original;
          form.reset();
        }, 1200);
      }
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach((el) => observer.observe(el));
  }

  setActiveNav();
})();
