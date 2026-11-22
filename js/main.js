/**
 * Ashish Agrawal - Modern Portfolio Interactions & Logic
 * High-performance, clean, modular JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. Typing Effect for Hero Roles ---
  const typedRoleElement = document.getElementById('typed-role');
  if (typedRoleElement && window.PORTFOLIO_CONFIG) {
    const roles = PORTFOLIO_CONFIG.personal.roles;
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typedRoleElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typedRoleElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at full word
        isDeleting = true;
        typingSpeed = 1600;
      } else if (isDeleting && charIndex === 0) {
        // Move to next word
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  // --- 2. Sticky Navbar & Scrollspy ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Sticky nav state
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }

    // Scrollspy active state
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial state

  // Smooth scroll for back to top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. Mobile Navigation Drawer ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 4. Skills Tabs & Animated Progress Bars ---
  const skillTabBtns = document.querySelectorAll('.skills-tab-btn');
  const skillPanes = document.querySelectorAll('.skills-pane');

  skillTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetPaneId = btn.getAttribute('data-target');

      skillTabBtns.forEach((b) => b.classList.remove('active'));
      skillPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) {
        targetPane.classList.add('active');
        animateProgressBars(targetPane);
      }
    });
  });

  function animateProgressBars(container = document) {
    const bars = container.querySelectorAll('.skill-progress-fill');
    bars.forEach((bar) => {
      const targetWidth = bar.getAttribute('data-width');
      if (targetWidth) {
        bar.style.width = targetWidth;
      }
    });
  }

  // Trigger skill animation on scroll into view
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateProgressBars(skillsSection);
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillsSection);
  }

  // --- 5. Projects Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 6. Project Modal Logic ---
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContentBox = document.getElementById('modal-dynamic-content');

  window.openProjectModal = function (projectId) {
    if (!window.PORTFOLIO_CONFIG || !projectModal || !modalContentBox) return;

    const project = PORTFOLIO_CONFIG.projects.find((p) => p.id === projectId);
    if (!project) return;

    modalContentBox.innerHTML = `
      <div class="modal-preview-media">
        <img src="${project.image}" alt="${project.title} Preview" />
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem;">
        <span class="project-badge-overlay" style="position: static;">${project.badge}</span>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #10b981; background: rgba(16,185,129,0.12); padding: 0.25rem 0.6rem; border-radius: 4px; border: 1px solid rgba(16,185,129,0.3);">
          <i class="fa-solid fa-circle-check"></i> ${project.timelineTag || 'Production Project'}
        </span>
      </div>
      <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #ffffff; margin-bottom: 0.6rem;">${project.title}</h3>
      <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.65; margin-bottom: 1.2rem;">${project.summary}</p>
      
      <div style="background: rgba(11,15,29,0.7); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 1.4rem;">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Problem & Strategic Solution</h4>
        <p style="font-size: 0.88rem; color: var(--text-light); line-height: 1.6;">${project.problemSolution}</p>
      </div>

      <div style="margin-bottom: 1.4rem;">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: #ffffff; margin-bottom: 0.6rem;">Key Features & Architecture:</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.45rem; padding-left: 0;">
          ${project.keyFeatures.map((f) => `<li style="font-size: 0.88rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-check" style="color: var(--accent-emerald);"></i> ${f}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 1.6rem;">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: #ffffff; margin-bottom: 0.6rem;">Technologies Applied:</h4>
        <div class="project-tags">
          ${project.technologies.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div style="padding-top: 1rem; border-top: 1px solid var(--border-light); display: flex; gap: 1rem; flex-wrap: wrap;">
        ${project.liveUrl && project.liveUrl.startsWith('http') ? `
          <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="flex: 1.2;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Live Website (${project.liveUrl.replace('https://', '')})
          </a>
          <a href="#contact" onclick="closeProjectModal(); prefillInquiry('Inquiry regarding custom WordPress redesign like ${encodeURIComponent(project.title)}');" class="btn btn-secondary btn-sm" style="flex: 1;">
            <i class="fa-solid fa-paper-plane"></i> Request Similar Redesign
          </a>
        ` : `
          <a href="#contact" onclick="closeProjectModal(); prefillInquiry('Inquiry regarding ${encodeURIComponent(project.title)}');" class="btn btn-primary btn-sm" style="flex: 1;">
            <i class="fa-solid fa-paper-plane"></i> Request Similar Project
          </a>
          <button type="button" onclick="showToast('Concept model ready for your live repository or client URL in config.js');" class="btn btn-secondary btn-sm" style="flex: 1;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Demo Link
          </button>
        `}
      </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function () {
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // --- 7. Resume Modal / Fallback Handler ---
  const resumeModal = document.getElementById('resume-modal');
  const resumeCloseBtn = document.getElementById('resume-close-btn');

  window.handleResumeClick = function (e) {
    if (e) e.preventDefault();
    if (resumeModal) {
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeResumeModal = function () {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener('click', closeResumeModal);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  // --- 8. Service Inquiry Auto-Prefill ---
  window.prefillInquiry = function (serviceTitle) {
    const subjectField = document.getElementById('contact-subject');
    const messageField = document.getElementById('contact-message');
    const contactSection = document.getElementById('contact');

    if (subjectField) {
      subjectField.value = `Inquiry: ${serviceTitle}`;
    }

    if (messageField) {
      messageField.value = `Hi Ashish,\n\nI would like to discuss a project related to "${serviceTitle}". Please let me know your availability for a quick discovery call.\n\nBest regards,`;
    }

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (subjectField) subjectField.focus();
      }, 700);
    }
  };

  // --- 9. Email Copy to Clipboard ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      const email = 'ashishagrwal307@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        copyEmailBtn.classList.remove('btn-outline-cyan');
        copyEmailBtn.classList.add('btn-primary');

        showToast('Email address copied to clipboard!');

        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
          copyEmailBtn.classList.add('btn-outline-cyan');
          copyEmailBtn.classList.remove('btn-primary');
        }, 2200);
      }).catch(() => {
        showToast('Could not copy automatically. Email: ashishagrwal307@gmail.com');
      });
    });
  }

  // --- 10. Contact Form Validation & Submission ---
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    // Real-time input cleaner on typing
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('error');
        });
      }
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.classList.add('error');
        isValid = false;
      } else {
        nameInput.classList.remove('error');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('error');
        isValid = false;
      } else {
        emailInput.classList.remove('error');
      }

      // Validate Subject
      if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
        subjectInput.classList.add('error');
        isValid = false;
      } else {
        subjectInput.classList.remove('error');
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.classList.add('error');
        isValid = false;
      } else {
        messageInput.classList.remove('error');
      }

      if (!isValid) {
        showToast('Please fix the highlighted fields before sending.');
        return;
      }

      // Show Sending State
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing Transmission...';

      // Simulate network dispatch & construct mailto fallback
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // Open Direct Mail client with pre-filled content
        const mailtoUrl = `mailto:ashishagrwal307@gmail.com?subject=${encodeURIComponent(
          subjectInput.value.trim()
        )}&body=${encodeURIComponent(
          `From: ${nameInput.value.trim()} (${emailInput.value.trim()})\n\nMessage:\n${messageInput.value.trim()}`
        )}`;

        // Trigger mail client
        window.location.href = mailtoUrl;

        // Show Success Feedback Modal / Toast
        showToast('Message formatted! Opening your email client to send to Ashish.');
        showFeedbackSuccessModal(nameInput.value.trim());

        // Reset form
        contactForm.reset();
      }, 1000);
    });
  }

  function showFeedbackSuccessModal(senderName) {
    const successModal = document.getElementById('success-modal');
    const senderNameSpan = document.getElementById('success-sender-name');
    if (successModal) {
      if (senderNameSpan) senderNameSpan.textContent = senderName;
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  window.closeSuccessModal = function () {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // --- 11. Toast System ---
  window.showToast = function (message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Remove after 3.5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  };

  // --- 12. Reveal on Scroll (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // --- 13. Hero Visual Switcher (Photo vs Emblem) ---
  const visualSwitchBtn = document.getElementById('visual-switch-btn');
  const heroDisplayImg = document.getElementById('hero-display-img');
  const heroAvatarWrapper = document.getElementById('hero-avatar-wrapper');
  const switchText = document.getElementById('switch-text');

  if (visualSwitchBtn && heroDisplayImg) {
    let currentMode = 'photo'; // 'photo' or 'emblem'
    const photoSrc = 'assets/images/ashish-agrawal.jpg';
    const emblemSrc = 'assets/images/logo.png';

    visualSwitchBtn.addEventListener('click', () => {
      heroDisplayImg.style.opacity = '0';
      heroDisplayImg.style.transform = 'scale(0.92)';

      setTimeout(() => {
        if (currentMode === 'photo') {
          heroDisplayImg.src = emblemSrc;
          heroDisplayImg.alt = 'Ashish Agrawal - Official Brand Emblem';
          if (heroAvatarWrapper) heroAvatarWrapper.classList.add('is-emblem');
          if (switchText) switchText.textContent = 'Show Executive Photo';
          currentMode = 'emblem';
          showToast('Switched to Official AA Emblem view');
        } else {
          heroDisplayImg.src = photoSrc;
          heroDisplayImg.alt = 'Ashish Agrawal - Web Developer & Sales Executive';
          if (heroAvatarWrapper) heroAvatarWrapper.classList.remove('is-emblem');
          if (switchText) switchText.textContent = 'Show Brand Emblem';
          currentMode = 'photo';
          showToast('Switched to Executive Portrait view');
        }
        heroDisplayImg.style.opacity = '1';
        heroDisplayImg.style.transform = 'scale(1)';
      }, 200);
    });
  }

  // Escape key closes open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
      closeSuccessModal();
    }
  });
});
