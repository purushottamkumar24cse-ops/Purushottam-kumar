/**
 * PURUSHOTTAM KUMAR — PORTFOLIO MOTION SYSTEM & SCRIPTS
 * Vanilla JavaScript (ES6+) — Zero external dependencies.
 * Motion system: requestAnimationFrame lerp, IntersectionObserver, pointer effects & accessible interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Accessibility check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* ==========================================================================
     1. DYNAMIC FOOTER YEAR
     ========================================================================== */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     2. PAGE LOAD INTRO ORCHESTRATION
     ========================================================================== */
  // Trigger hero headline masked reveal and entrance sequence smoothly
  const heroSection = document.getElementById('hero');
  const heroItems = heroSection ? heroSection.querySelectorAll('.reveal-item') : [];

  setTimeout(() => {
    heroItems.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('revealed', 'intro-revealed');
      }, index * 90);
    });
  }, 100);

  /* ==========================================================================
     3. SCROLL PROGRESS INDICATOR
     ========================================================================== */
  const progressBar = document.getElementById('scroll-progress');

  const updateScrollProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ==========================================================================
     4. NAVBAR SCROLL EFFECT & ACTIVE SECTION SPY
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleNavbarScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Elevation & glass compression on scroll
    if (navbar) {
      if (scrollY > 25) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll spy for active navigation item
    let currentActiveId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 160;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentActiveId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentActiveId && link.getAttribute('href') === `#${currentActiveId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ==========================================================================
     5. LUXURY SCROLL REVEAL SYSTEM (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-item:not(.intro-revealed)');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ==========================================================================
     6. MOUSE PARALLAX ON DECORATIVE ELEMENTS (DESKTOP ONLY)
     ========================================================================== */
  const floatingGlyphs = document.querySelectorAll('.floating-glyph');

  if (floatingGlyphs.length > 0 && isFinePointer && !prefersReducedMotion && window.innerWidth >= 992) {
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Max 6-10px displacement
      targetParallaxX = ((e.clientX - centerX) / centerX) * 8;
      targetParallaxY = ((e.clientY - centerY) / centerY) * 8;
    });

    const updateParallax = () => {
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.08;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.08;

      floatingGlyphs.forEach((glyph, i) => {
        const factor = (i % 2 === 0 ? 1 : -1) * (0.6 + (i % 3) * 0.3);
        glyph.style.transform = `translate3d(${currentParallaxX * factor}px, ${currentParallaxY * factor}px, 0)`;
      });

      requestAnimationFrame(updateParallax);
    };
    requestAnimationFrame(updateParallax);
  }

  /* ==========================================================================
     8–9. POINTER-FOLLOW VISUAL EFFECTS DISABLED
     ========================================================================== */
  // Intentionally disabled: no mouse-follow radial light or cursor-like spotlight.
  // The site keeps ambient motion, scroll reveals, parallax glyphs and button motion.

  /* ==========================================================================
     10. MAGNETIC BUTTON EFFECT (DESKTOP ONLY)
     ========================================================================== */
  const magneticButtons = document.querySelectorAll('.btn-primary-dark, .btn-nav-connect, .btn-contact-action');

  if (magneticButtons.length > 0 && isFinePointer && !prefersReducedMotion && window.innerWidth >= 992) {
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        // Subtle 3-4px pull towards cursor
        const deltaX = (e.clientX - btnCenterX) * 0.22;
        const deltaY = (e.clientY - btnCenterY) * 0.22;
        const clampedX = Math.max(-4, Math.min(4, deltaX));
        const clampedY = Math.max(-4, Math.min(4, deltaY));

        btn.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ==========================================================================
     11. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-connect-btn');

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (hamburgerToggle) hamburgerToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (hamburgerToggle) hamburgerToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburgerToggle) {
    hamburgerToggle.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeDrawer();
      }
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ==========================================================================
     12. RESUME / CV PREVIEW MODAL
     ========================================================================== */
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  }

  if (closeResumeBtn && resumeModal) {
    closeResumeBtn.addEventListener('click', () => closeModal(resumeModal));
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* ==========================================================================
     13. PROJECT DEEP DIVE MODAL
     ========================================================================== */
  const projModal = document.getElementById('project-detail-modal');
  const closeProjModalBtn = document.getElementById('close-proj-modal-btn');
  const projTriggers = document.querySelectorAll('.view-details-trigger');

  const modalTitle = document.getElementById('modal-proj-title');
  const modalDesc = document.getElementById('modal-proj-desc');
  const modalTags = document.getElementById('modal-proj-tags');
  const modalGithub = document.getElementById('modal-proj-github');

  projTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Project Overview';
      const summary = btn.getAttribute('data-summary') || '';
      const stack = btn.getAttribute('data-stack') || '';
      const github = btn.getAttribute('data-github') || 'https://github.com';

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = summary;
      if (modalGithub) modalGithub.setAttribute('href', github);

      if (modalTags) {
        modalTags.innerHTML = '';
        const tags = stack.split(',').map(s => s.trim()).filter(Boolean);
        tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'modal-tech-tag';
          span.textContent = tag;
          modalTags.appendChild(span);
        });
      }

      openModal(projModal);
    });
  });

  if (closeProjModalBtn && projModal) {
    closeProjModalBtn.addEventListener('click', () => closeModal(projModal));
  }

  // Generic modal dismiss buttons
  document.querySelectorAll('.modal-dismiss-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(resumeModal);
      closeModal(projModal);
    });
  });

  // Close modals on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Global ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(resumeModal);
      closeModal(projModal);
      closeDrawer();
    }
  });

  /* ==========================================================================
     14. CONTACT FORM VALIDATION & SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clearErrors = () => {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    if (nameInput) nameInput.classList.remove('is-invalid');
    if (emailInput) emailInput.classList.remove('is-invalid');
    if (messageInput) messageInput.classList.remove('is-invalid');
    if (formStatus) {
      formStatus.className = 'form-status-alert';
      formStatus.textContent = '';
    }
  };

  if (contactForm) {
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
          const errorSpan = document.getElementById(`${input.name}-error`);
          if (errorSpan) errorSpan.textContent = '';
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        if (nameError) nameError.textContent = 'Please enter your name (at least 2 characters).';
        if (nameInput) nameInput.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal || !validateEmail(emailVal)) {
        if (emailError) emailError.textContent = 'Please provide a valid email address.';
        if (emailInput) emailInput.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal || messageVal.length < 8) {
        if (messageError) messageError.textContent = 'Please enter a message (at least 8 characters).';
        if (messageInput) messageInput.classList.add('is-invalid');
        isValid = false;
      }

      if (!isValid) return;

      // Submit feedback simulation
      if (submitBtn) {
        submitBtn.disabled = true;
        const textSpan = submitBtn.querySelector('.btn-text');
        const origBtnText = textSpan ? textSpan.textContent : 'Send Message';
        if (textSpan) textSpan.textContent = 'Sending...';

        setTimeout(() => {
          submitBtn.disabled = false;
          if (textSpan) textSpan.textContent = origBtnText;

          if (formStatus) {
            formStatus.className = 'form-status-alert success';
            formStatus.textContent = `Thank you, ${nameVal}! Your message has been sent successfully. I will get back to you shortly.`;
          }

          contactForm.reset();

          setTimeout(() => {
            if (formStatus) {
              formStatus.className = 'form-status-alert';
              formStatus.textContent = '';
            }
          }, 7000);
        }, 800);
      }
    });
  }

  /* ==========================================================================
     15. BACK TO TOP SMOOTH SCROLL
     ========================================================================== */
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});