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

  // --- 9. Email & Phone Copy to Clipboard ---
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

  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', function () {
      const phone = '9928903550';
      navigator.clipboard.writeText(phone).then(() => {
        const originalText = copyPhoneBtn.innerHTML;
        copyPhoneBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied (9928903550)!';
        copyPhoneBtn.classList.remove('btn-outline-cyan');
        copyPhoneBtn.classList.add('btn-primary');

        showToast('Phone number 9928903550 copied to clipboard!');

        setTimeout(() => {
          copyPhoneBtn.innerHTML = originalText;
          copyPhoneBtn.classList.add('btn-outline-cyan');
          copyPhoneBtn.classList.remove('btn-primary');
        }, 2500);
      }).catch(() => {
        showToast('Contact number: +91 9928903550');
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

    contactForm.addEventListener('submit', async function (e) {
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
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      const payload = {
        full_name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim()
      };

      // Determine API endpoint
      let apiUrl = '/api/inquiries';
      if (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.apiUrl) {
        apiUrl = window.PORTFOLIO_CONFIG.apiUrl;
      } else if (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000')) {
        // If opened locally via file:// or Live Server (e.g. port 5500)
        apiUrl = 'http://localhost:3000/api/inquiries';
      }

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          showToast(data.message || 'Message processed successfully!');
          showFeedbackSuccessModal(payload.full_name, payload.email, data.delivery);
          contactForm.reset();
        } else {
          const errorMsg = data.error || `Submission failed with status ${response.status}.`;
          showToast(errorMsg);
        }
      } catch (networkErr) {
        console.error('Contact Form Submission Error:', networkErr);
        showToast('Unable to reach email server. Please run "npm start" (port 3000) or email ashishagrwal307@gmail.com.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  function showFeedbackSuccessModal(senderName, senderEmail, delivery) {
    const successModal = document.getElementById('success-modal');
    const modalIcon = document.getElementById('success-modal-icon');
    const modalTitle = document.getElementById('success-modal-title');
    const modalDesc = document.getElementById('success-modal-desc');
    const modalActions = document.getElementById('success-modal-actions');

    if (!successModal) return;

    const isTestMode = Boolean(delivery && delivery.is_test_mode);

    if (isTestMode) {
      if (modalIcon) {
        modalIcon.style.background = 'rgba(245, 158, 11, 0.15)';
        modalIcon.style.borderColor = '#fbbf24';
        modalIcon.style.color = '#fbbf24';
        modalIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
      }
      if (modalTitle) {
        modalTitle.textContent = 'Inquiry Recorded in Database!';
      }
      if (modalDesc) {
        modalDesc.innerHTML = `
          Thank you <strong>${senderName}</strong>! Your inquiry was safely captured and stored in your local database (<code style="color: #38bdf8;">db/inquiries.json</code>).
          <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 12px; margin-top: 14px; text-align: left; font-size: 0.85rem; color: #fbbf24; line-height: 1.5;">
            <strong>⚠️ Real Email Notice:</strong><br/>
            Live email delivery is currently in <strong>Test Mode</strong> because your Google App Password is not yet added to <code style="color: #fff;">.env</code>.
            To start receiving real emails in <strong>ashishagrwal307@gmail.com</strong> and delivering confirmation receipts to clients, configure your App Password below.
          </div>
        `;
      }
      if (modalActions) {
        modalActions.innerHTML = `
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <a href="/setup-smtp" target="_blank" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-key"></i> Connect App Password
            </a>
            <button type="button" onclick="closeSuccessModal();" class="btn btn-secondary btn-sm">
              Dismiss
            </button>
          </div>
        `;
      }
    } else {
      if (modalIcon) {
        modalIcon.style.background = 'rgba(16, 185, 129, 0.15)';
        modalIcon.style.borderColor = 'var(--accent-emerald)';
        modalIcon.style.color = 'var(--accent-emerald)';
        modalIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
      }
      if (modalTitle) {
        modalTitle.textContent = 'Message Sent Successfully!';
      }
      if (modalDesc) {
        modalDesc.innerHTML = `
          Thank you <strong style="color: #ffffff;">${senderName}</strong>! Your inquiry has been delivered directly to Ashish Agrawal (<strong>ashishagrwal307@gmail.com</strong>).
          An automated confirmation email has also been sent to your email (<strong style="color: var(--accent-cyan);">${senderEmail}</strong>). Ashish will review your details and respond within 2–4 hours.
        `;
      }
      if (modalActions) {
        modalActions.innerHTML = `
          <button type="button" onclick="closeSuccessModal();" class="btn btn-primary btn-sm" style="min-width: 140px;">
            Got it!
          </button>
        `;
      }
    }

    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  const successModalElem = document.getElementById('success-modal');
  if (successModalElem) {
    successModalElem.addEventListener('click', (e) => {
      if (e.target === successModalElem) {
        closeSuccessModal();
      }
    });
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
