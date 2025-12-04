/* ================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initSmoothScrolling();
  initBackToTopButton();
  initThemeToggle();
  initContactForm();
  initScrollAnimations();
  initActiveNavHighlight();
  initNavbarShadow();
  initProjectCardHover();
  setCurrentYear();
});

/* ================================
   FEATURE 1: MOBILE NAVIGATION TOGGLE
   ================================ */
function initMobileNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  // Toggle mobile menu when hamburger is clicked
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', event => {
    const isClickInsideNav =
      navToggle.contains(event.target) || navMenu.contains(event.target);

    if (!isClickInsideNav && navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

/* ================================
   FEATURE 2: SMOOTH SCROLLING
   ================================ */
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link');
  const heroButtons = document.querySelectorAll('.hero-buttons a');

  const allInternalLinks = [...navLinks, ...heroButtons];

  allInternalLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      if (!href || !href.startsWith('#')) return;

      e.preventDefault();

      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      const navbar = document.querySelector('.navbar');

      if (!targetSection || !navbar) return;

      const navbarHeight = navbar.offsetHeight;
      const targetPosition = targetSection.offsetTop - navbarHeight;

      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      } else {
        // Fallback for older browsers
        smoothScrollFallback(targetPosition);
      }
    });
  });
}

function smoothScrollFallback(targetY) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const duration = 800;
  let start = null;

  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const run = easeInOutQuad(timeElapsed, startY, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

/* ================================
   FEATURE 3: BACK TO TOP BUTTON
   ================================ */
function initBackToTopButton() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      smoothScrollFallback(0);
    }
  });
}

/* ================================
   FEATURE 4: DARK/LIGHT THEME TOGGLE
   (ICON-BASED: REMIX ICON)
   ================================ */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (!themeToggle || !themeIcon) return;

  // Check saved preference or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  const isDark = savedTheme === 'dark';

  document.body.classList.toggle('dark-theme', isDark);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const nowDark = document.body.classList.contains('dark-theme');
    const theme = nowDark ? 'dark' : 'light';

    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  });

  function updateThemeIcon(theme) {
    // Use Remix Icon classes: ri-moon-line / ri-sun-line
    if (theme === 'dark') {
      themeIcon.classList.remove('ri-moon-line');
      themeIcon.classList.add('ri-sun-line');
    } else {
      themeIcon.classList.remove('ri-sun-line');
      themeIcon.classList.add('ri-moon-line');
    }
  }
}

/* ================================
   FEATURE 5 & 6: CONTACT FORM VALIDATION
   ================================ */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const successMessage = document.getElementById('successMessage');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    clearErrors();
    let isValid = true;

    if (!nameInput.value.trim()) {
      showError('nameError', 'Please enter your name');
      isValid = false;
    }

    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      showError('emailError', 'Please enter your email address');
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      showError('emailError', 'Please enter a valid email address');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showError('messageError', 'Please enter your message');
      isValid = false;
    }

    if (isValid) {
      showSuccessMessage();
      contactForm.reset();
    }
  });

  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) errorElement.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
    });
    if (successMessage) successMessage.classList.remove('show');
  }

  function showSuccessMessage() {
    if (!successMessage) return;
    successMessage.classList.add('show');

    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 5000);

    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Real-time validation
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      if (!nameInput.value.trim()) {
        showError('nameError', 'Please enter your name');
      } else {
        document.getElementById('nameError').textContent = '';
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const value = emailInput.value.trim();
      if (!value) {
        showError('emailError', 'Please enter your email address');
      } else if (!emailPattern.test(value)) {
        showError('emailError', 'Please enter a valid email address');
      } else {
        document.getElementById('emailError').textContent = '';
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      if (!messageInput.value.trim()) {
        showError('messageError', 'Please enter your message');
      } else {
        document.getElementById('messageError').textContent = '';
      }
    });
  }
}

/* ================================
   FEATURE 7: SCROLL-BASED ANIMATIONS
   ================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (!animatedElements.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  animatedElements.forEach(element => observer.observe(element));
}

/* ================================
   FEATURE 8: ACTIVE NAVIGATION HIGHLIGHT
   ================================ */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');
  if (!sections.length || !navLinks.length || !navbar) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset;
    const navbarHeight = navbar.offsetHeight;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollPosition >= sectionTop - navbarHeight - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

/* ================================
   FEATURE 9: DYNAMIC CURRENT YEAR
   ================================ */
function setCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (!yearElement) return;
  yearElement.textContent = new Date().getFullYear();
}

/* ================================
   EXTRA: NAVBAR SHADOW ON SCROLL
   ================================ */
function initNavbarShadow() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  });
}

/* ================================
   EXTRA: PROJECT CARD HOVER ENHANCEMENT
   ================================ */
function initProjectCardHover() {
  const projectCards = document.querySelectorAll('.project-card');
  if (!projectCards.length) return;

  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s ease';
    });
  });
}

/* ================================
   ERROR HANDLING
   ================================ */
window.addEventListener('error', e => {
  console.error('JavaScript Error:', e.message);
  // In production, send this to a monitoring service
});
