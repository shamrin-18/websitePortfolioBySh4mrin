// Small JS file for my portfolio site
// I keep each feature in its own function so it's easier for me to understand later.

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initSmoothScrolling();
  initBackToTopButton();
  initThemeToggle();
  initContactForm();
  initScrollAnimations();
  initActiveNavHighlight();
  initNavbarShadow();
  setCurrentYear();
});

// handles the mobile menu (hamburger) on small screens
function initMobileNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // when I click any nav link on mobile, I close the menu
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // close the menu if I click outside of it
  document.addEventListener('click', event => {
    const clickedInsideNav =
      navToggle.contains(event.target) || navMenu.contains(event.target);

    if (!clickedInsideNav && navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// smooth scroll when I click the navbar links or hero buttons
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

      // if the browser supports smooth scroll, just use it
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      } else {
        // fallback for older browsers
        smoothScrollFallback(targetPosition);
      }
    });
  });
}

// simple custom smooth scroll for older browsers
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

// back-to-top button logic
function initBackToTopButton() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  // I only show this button once you've scrolled down a bit
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

// dark / light theme toggle with localStorage
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (!themeToggle || !themeIcon) return;

  // check what theme I saved before (if any)
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
    // swapping the icon between moon and sun
    if (theme === 'dark') {
      themeIcon.classList.remove('ri-moon-line');
      themeIcon.classList.add('ri-sun-line');
    } else {
      themeIcon.classList.remove('ri-sun-line');
      themeIcon.classList.add('ri-moon-line');
    }
  }
}

// basic front-end validation for the contact form
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

    // hide the success message automatically after a few seconds
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 5000);

    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // a bit of real-time feedback when the fields lose focus
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

// simple scroll animation using IntersectionObserver
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (!animatedElements.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => observer.observe(element));
}

// highlight the nav link that matches the section I'm currently on
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

// just sets the current year in the footer so I don't have to update it manually
function setCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (!yearElement) return;
  yearElement.textContent = new Date().getFullYear();
}

// add a bit more shadow to the navbar when the page is scrolled
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
