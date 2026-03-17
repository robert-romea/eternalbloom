/**
 * EternalBloom Luxury Website - Main JavaScript
 * Pure vanilla JavaScript, no frameworks
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. SCROLL-BASED NAVIGATION
  // ============================================================
  const nav = document.querySelector('nav') || document.querySelector('.nav') || document.querySelector('header');

  const handleNavScroll = () => {
    if (!nav) return;
    if (window.scrollY > 100) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run on load in case page is already scrolled


  // ============================================================
  // 2. MOBILE MENU
  // ============================================================
  const hamburger = document.querySelector('.hamburger') || document.querySelector('.menu-toggle') || document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('.mobile-menu') || document.querySelector('.nav-mobile') || document.querySelector('[data-mobile-menu]');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  const openMenu = () => {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.add('is-open');
    hamburger.classList.add('is-active');
    document.body.classList.add('no-scroll');
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu && mobileMenu.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  // Close menu when a mobile nav link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  // ============================================================
  // 3. SCROLL ANIMATIONS (Intersection Observer)
  // ============================================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // Inject base animation styles dynamically
  const animationStyles = document.createElement('style');
  animationStyles.textContent = `
    .animate-on-scroll {
      opacity: 0;
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .animate-on-scroll[data-animation="fadeInUp"],
    .animate-on-scroll:not([data-animation]) {
      transform: translateY(40px);
    }
    .animate-on-scroll[data-animation="fadeInLeft"] {
      transform: translateX(-40px);
    }
    .animate-on-scroll[data-animation="fadeInRight"] {
      transform: translateX(40px);
    }
    .animate-on-scroll[data-animation="fadeIn"] {
      transform: none;
    }
    .animate-on-scroll[data-animation="scaleIn"] {
      transform: scale(0.9);
    }
    .animate-on-scroll.is-visible {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
  `;
  document.head.appendChild(animationStyles);

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || 0;
            setTimeout(() => {
              el.classList.add('is-visible');
            }, parseInt(delay));
            scrollObserver.unobserve(el); // Animate only once
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    animatedElements.forEach((el, index) => {
      // Stagger animations for grid children
      if (!el.dataset.delay) {
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('grid') || parent.classList.contains('cards') || parent.classList.contains('collection-grid') || parent.classList.contains('services-grid') || parent.classList.contains('features-grid'))) {
          const siblings = Array.from(parent.querySelectorAll('.animate-on-scroll'));
          const indexInParent = siblings.indexOf(el);
          el.dataset.delay = indexInParent * 120;
        }
      }
      scrollObserver.observe(el);
    });
  } else {
    // Fallback for older browsers â show all
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }


  // ============================================================
  // 4. SMOOTH SCROLL (Anchor Links)
  // ============================================================
  const getNavHeight = () => {
    const navEl = document.querySelector('nav') || document.querySelector('header');
    return navEl ? navEl.offsetHeight : 80;
  };

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const offset = getNavHeight() + 16;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });


  // ============================================================
  // 5. ACTIVE NAV LINK
  // ============================================================
  const navLinks = document.querySelectorAll('nav a, .nav a, header a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (!linkPath) return;

    const linkFile = linkPath.split('/').pop().split('#')[0];

    if (
      linkFile === currentPath ||
      (currentPath === '' && (linkFile === 'index.html' || linkFile === '')) ||
      (linkFile !== '' && currentPath.includes(linkFile))
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });


  // ============================================================
  // 6. FORM HANDLING
  // ============================================================

  // --- Toast / Success Message ---
  const createToast = (message) => {
    // Remove existing toast
    const existing = document.querySelector('.eb-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'eb-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="eb-toast__icon">â¦</div>
      <p class="eb-toast__message">${message}</p>
      <button class="eb-toast__close" aria-label="Close">Ã</button>
    `;

    // Toast styles
    const toastStyles = document.createElement('style');
    toastStyles.id = 'eb-toast-styles';
    if (!document.getElementById('eb-toast-styles')) {
      toastStyles.textContent = `
        .eb-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #f5f0e8;
          padding: 1.25rem 1.5rem;
          border-radius: 4px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.1);
          max-width: 380px;
          min-width: 280px;
          animation: toastSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: inherit;
        }
        .eb-toast.is-hiding {
          animation: toastSlideOut 0.4s ease forwards;
        }
        .eb-toast__icon {
          color: #d4af37;
          font-size: 1.25rem;
          flex-shrink: 0;
          animation: iconPulse 1s ease infinite alternate;
        }
        .eb-toast__message {
          flex: 1;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
          letter-spacing: 0.02em;
        }
        .eb-toast__close {
          background: none;
          border: none;
          color: rgba(245,240,232,0.5);
          font-size: 1.5rem;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .eb-toast__close:hover {
          color: #d4af37;
        }
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(100%) translateY(10px); }
          to   { opacity: 1; transform: translateX(0) translateY(0); }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(110%); }
        }
        @keyframes iconPulse {
          from { opacity: 0.6; }
          to   { opacity: 1; }
        }
        @media (max-width: 480px) {
          .eb-toast {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
          }
        }
      `;
      document.head.appendChild(toastStyles);
    }

    document.body.appendChild(toast);

    // Close button
    toast.querySelector('.eb-toast__close').addEventListener('click', () => dismissToast(toast));

    // Auto dismiss after 6 seconds
    setTimeout(() => dismissToast(toast), 6000);

    return toast;
  };

  const dismissToast = (toast) => {
    if (!toast || !document.body.contains(toast)) return;
    toast.classList.add('is-hiding');
    setTimeout(() => toast.remove(), 400);
  };

  // --- Validation Helpers ---
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\d\s\+\-\(\)]{7,20}$/.test(phone);

  const setFieldError = (field, message) => {
    field.classList.add('field-error');
    field.classList.remove('field-success');
    let errorEl = field.parentElement.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      // Inject error style once
      if (!document.getElementById('eb-field-styles')) {
        const fieldStyles = document.createElement('style');
        fieldStyles.id = 'eb-field-styles';
        fieldStyles.textContent = `
          .field-error {
            border-color: #c0392b !important;
            box-shadow: 0 0 0 2px rgba(192,57,43,0.2) !important;
          }
          .field-success {
            border-color: #27ae60 !important;
            box-shadow: 0 0 0 2px rgba(39,174,96,0.15) !important;
          }
          .error-message {
            display: block;
            color: #c0392b;
            font-size: 0.78rem;
            margin-top: 0.3rem;
            letter-spacing: 0.03em;
            animation: errorFadeIn 0.2s ease;
          }
          @keyframes errorFadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `;
        document.head.appendChild(fieldStyles);
      }
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  };

  const clearFieldError = (field) => {
    field.classList.remove('field-error');
    field.classList.add('field-success');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) errorEl.remove();
  };

  // --- Input Focus Animations ---
  document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('input-focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('input-focused');
      // Live validation on blur
      if (input.required && input.value.trim() === '') {
        setFieldError(input, 'This field is required.');
      } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
        setFieldError(input, 'Please enter a valid email address.');
      } else if (input.type === 'tel' && input.value && !validatePhone(input.value)) {
        setFieldError(input, 'Please enter a valid phone number.');
      } else if (input.value.trim() !== '') {
        clearFieldError(input);
      }
    });
  });

  // --- Form Submit Handler ---
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fields = form.querySelectorAll('input[required], textarea[required], select[required]');

      fields.forEach(field => {
        const value = field.value.trim();

        if (value === '') {
          setFieldError(field, 'This field is required.');
          isValid = false;
        } else if (field.type === 'email' && !validateEmail(value)) {
          setFieldError(field, 'Please enter a valid email address.');
          isValid = false;
        } else if (field.type === 'tel' && !validatePhone(value)) {
          setFieldError(field, 'Please enter a valid phone number.');
          isValid = false;
        } else {
          clearFieldError(field);
        }
      });

      if (!isValid) return;

      // Show loading state on submit button
      const submitBtn = form.querySelector('[type="submit"], button:not([type="button"])');
      let originalText = '';
      if (submitBtn) {
        originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Simulate async submission
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        form.reset();
        // Remove all success states
        form.querySelectorAll('.field-success').forEach(f => f.classList.remove('field-success'));

        createToast('Thank you for your interest. Our team will be in touch within 24 hours.');
      }, 800);
    });
  });


  // ============================================================
  // 7. PRICING TOGGLE
  // ============================================================
  const pricingToggle = document.querySelector('.pricing-toggle') || document.querySelector('[data-pricing-toggle]');
  const pricingCards = document.querySelectorAll('[data-price-monthly], [data-price-annual]');

  if (pricingToggle && pricingCards.length > 0) {
    pricingToggle.addEventListener('change', function () {
      const isAnnual = this.checked;
      pricingCards.forEach(card => {
        const monthlyPrice = card.dataset.priceMonthly;
        const annualPrice = card.dataset.priceAnnual;
        const priceEl = card.querySelector('.price-amount') || card.querySelector('[data-price-display]');

        if (priceEl) {
          priceEl.style.transition = 'opacity 0.3s ease';
          priceEl.style.opacity = '0';
          setTimeout(() => {
            priceEl.textContent = isAnnual ? annualPrice : monthlyPrice;
            priceEl.style.opacity = '1';
          }, 150);
        }
      });

      // Update toggle labels
      const labels = document.querySelectorAll('.pricing-label');
      labels.forEach(label => {
        label.classList.toggle('active', label.dataset.pricingLabel === (isAnnual ? 'annual' : 'monthly'));
      });
    });
  }


  // ============================================================
  // 8. COUNTER ANIMATION
  // ============================================================
  const counters = document.querySelectorAll('[data-counter], .counter-number, .stat-number');

  const animateCounter = (el) => {
    const raw = el.dataset.counter || el.textContent;
    const match = raw.match(/([\d,]+)/);
    if (!match) return;

    const targetStr = match[1].replace(/,/g, '');
    const target = parseInt(targetStr, 10);
    if (isNaN(target)) return;

    // Detect suffix/prefix
    const prefix = raw.slice(0, raw.indexOf(match[1]));
    const suffix = raw.slice(raw.indexOf(match[1]) + match[1].length);

    const duration = 1800;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(easedProgress * target);

      // Format with commas if original had them
      const formatted = match[1].includes(',')
        ? current.toLocaleString()
        : current.toString();

      el.textContent = prefix + formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => counterObserver.observe(counter));
  }


  // ============================================================
  // 9. TESTIMONIAL AUTO-ROTATE
  // ============================================================
  const testimonialWrappers = document.querySelectorAll('.testimonials-slider, .testimonial-carousel, [data-testimonials]');

  testimonialWrappers.forEach(wrapper => {
    const slides = wrapper.querySelectorAll('.testimonial, .testimonial-slide, [data-testimonial-slide]');
    if (slides.length <= 1) return;

    // Inject testimonial styles
    if (!document.getElementById('eb-testimonial-styles')) {
      const tStyles = document.createElement('style');
      tStyles.id = 'eb-testimonial-styles';
      tStyles.textContent = `
        [data-testimonials] .testimonial,
        .testimonials-slider .testimonial,
        .testimonial-carousel .testimonial-slide {
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        [data-testimonials] .testimonial:not(.t-active),
        .testimonials-slider .testimonial:not(.t-active),
        .testimonial-carousel .testimonial-slide:not(.t-active) {
          display: none;
          opacity: 0;
        }
        [data-testimonials] .testimonial.t-active,
        .testimonials-slider .testimonial.t-active,
        .testimonial-carousel .testimonial-slide.t-active {
          display: block;
          opacity: 1;
          animation: testimonialFadeIn 0.6s ease;
        }
        @keyframes testimonialFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(tStyles);
    }

    let currentIndex = 0;
    let rotateInterval = null;

    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('t-active'));
      slides[index].classList.add('t-active');
    };

    showSlide(0);

    const startRotation = () => {
      rotateInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
      }, 5000);
    };

    const stopRotation = () => {
      if (rotateInterval) clearInterval(rotateInterval);
    };

    startRotation();

    // Pause on hover
    wrapper.addEventListener('mouseenter', stopRotation);
    wrapper.addEventListener('mouseleave', startRotation);

    // Create dot indicators
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';
    dotsContainer.setAttribute('aria-label', 'Testimonial navigation');

    if (!document.getElementById('eb-dots-styles')) {
      const dotsStyles = document.createElement('style');
      dotsStyles.id = 'eb-dots-styles';
      dotsStyles.textContent = `
        .testimonial-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }
        .testimonial-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .testimonial-dot.is-active {
          background: #d4af37;
          transform: scale(1.3);
        }
      `;
      document.head.appendChild(dotsStyles);
    }

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        stopRotation();
        currentIndex = i;
        showSlide(currentIndex);
        updateDots();
        startRotation();
      });
      dotsContainer.appendChild(dot);
    });

    wrapper.appendChild(dotsContainer);

    const updateDots = () => {
      dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    };

    // Patch showSlide to also update dots
    const originalShowSlide = showSlide;
    const patchedShowSlide = (index) => {
      originalShowSlide(index);
      updateDots();
    };

    // Re-bind interval with dot updates
    stopRotation();
    rotateInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      patchedShowSlide(currentIndex);
    }, 5000);

    wrapper.addEventListener('mouseenter', stopRotation);
    wrapper.addEventListener('mouseleave', () => {
      rotateInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        patchedShowSlide(currentIndex);
      }, 5000);
    });
  });


  // ============================================================
  // 10. PARALLAX EFFECT
  // ============================================================
  const parallaxElements = document.querySelectorAll('[data-parallax], .hero-parallax, .hero-background');

  const handleParallax = () => {
    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only parallax when element is in view
      if (rect.bottom < 0 || rect.top > windowHeight) return;

      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.3;
      const scrolled = window.pageYOffset;
      const yPos = -(scrolled * speed);

      // Apply to background or the element itself
      if (el.dataset.parallaxTarget === 'bg' || el.classList.contains('hero-background')) {
        el.style.transform = `translateY(${yPos}px) translateZ(0)`;
      } else {
        const offset = (rect.top + rect.height / 2 - windowHeight / 2) * speed;
        el.style.transform = `translateY(${offset * -1}px) translateZ(0)`;
      }
    });
  };

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax();
  }


  // ============================================================
  // 11. BACK TO TOP BUTTON
  // ============================================================
  const backToTopBtn = document.querySelector('.back-to-top') || (() => {
    // Create button if it doesn't exist in HTML
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `;

    // Inject styles
    if (!document.getElementById('eb-btt-styles')) {
      const bttStyles = document.createElement('style');
      bttStyles.id = 'eb-btt-styles';
      bttStyles.textContent = `
        .back-to-top {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          z-index: 9990;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #d4af37, #b8963e);
          color: #fff;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.35);
          opacity: 0;
          visibility: hidden;
          transform: translateY(12px);
          transition: opacity 0.35s ease, visibility 0.35s ease, transform 0.35s ease, box-shadow 0.25s ease;
        }
        .back-to-top.is-visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .back-to-top:hover {
          box-shadow: 0 8px 28px rgba(212, 175, 55, 0.55);
          transform: translateY(-2px);
        }
        .back-to-top:active {
          transform: translateY(0);
        }
        @media (max-width: 480px) {
          .back-to-top {
            bottom: 1rem;
            left: 1rem;
            width: 42px;
            height: 42px;
          }
        }
      `;
      document.head.appendChild(bttStyles);
    }

    document.body.appendChild(btn);
    return btn;
  })();

  const handleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  };

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', handleBackToTop, { passive: true });
  handleBackToTop();


  // ============================================================
  // BONUS: IMAGE LAZY LOADING (enhance performance)
  // ============================================================
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.add('img-loaded');
            imageObserver.unobserve(img);
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    lazyImages.forEach(img => imageObserver.observe(img));
  }


  // ============================================================
  // BONUS: CURSOR SPARKLE EFFECT (luxury touch)
  // ============================================================
  const sparkleContainer = document.createElement('div');
  sparkleContainer.className = 'sparkle-container';
  sparkleContainer.setAttribute('aria-hidden', 'true');

  if (!document.getElementById('eb-sparkle-styles')) {
    const sparkleStyles = document.createElement('style');
    sparkleStyles.id = 'eb-sparkle-styles';
    sparkleStyles.textContent = `
      .sparkle-container {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      }
      .sparkle-particle {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: radial-gradient(circle, #d4af37, rgba(212,175,55,0));
        pointer-events: none;
        animation: sparkleFade 0.8s ease forwards;
      }
      @keyframes sparkleFade {
        0%   { opacity: 1; transform: scale(1) translate(0, 0); }
        100% { opacity: 0; transform: scale(0.2) translate(var(--tx), var(--ty)); }
      }
    `;
    document.head.appendChild(sparkleStyles);
  }

  document.body.appendChild(sparkleContainer);

  let sparkleThrottle = null;
  document.addEventListener('mousemove', (e) => {
    if (sparkleThrottle) return;
    sparkleThrottle = setTimeout(() => { sparkleThrottle = null; }, 80);

    const particle = document.createElement('div');
    particle.className = 'sparkle-particle';

    const x = e.clientX - 2;
    const y = e.clientY - 2;
    const tx = (Math.random() - 0.5) * 30 + 'px';
    const ty = (Math.random() - 0.5) * 30 + 'px';

    particle.style.cssText = `left:${x}px;top:${y}px;--tx:${tx};--ty:${ty};`;
    sparkleContainer.appendChild(particle);

    setTimeout(() => particle.remove(), 800);
  });


  // ============================================================
  // INIT COMPLETE
  // ============================================================
  console.log('%câ¦ EternalBloom %c| Luxury Script Initialized', 'color:#d4af37;font-weight:bold;font-size:14px;', 'color:#888;font-size:12px;');

});
