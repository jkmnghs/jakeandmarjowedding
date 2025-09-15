/**
 * Wedding Website JavaScript
 * Handles navigation, carousels, lightbox, forms, and dynamic content
 */

// Global state
let config = {};
let currentLightboxIndex = 0;
let lightboxImages = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load configuration
    await loadConfig();
    
    // Configure typography from theme settings
    configureFonts();
    
    // Initialize all components
    initializeNavigation();
    initializeCountdown();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeLightbox();
    initializeCarousels();
    initializeFAQ();
    initializeRSVP();
    initializeMobileOptimizations();
    
    // Populate content from config
    populateContent();
    
    console.log('Wedding website initialized successfully');
  } catch (error) {
    console.error('Error initializing website:', error);
  }
});

/**
 * Mobile-specific optimizations
 */
function initializeMobileOptimizations() {
  // Initialize responsive hero image
  initializeResponsiveHeroImage();
  
  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    // Force a reflow after orientation change
    setTimeout(() => {
      window.scrollTo(window.scrollX, window.scrollY);
      
      // Update hero image for new orientation
      updateHeroImage();
      
      // Update carousel dimensions
      const carousels = document.querySelectorAll('.carousel');
      carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        if (track) {
          // Force recalculation of scroll positions
          track.style.scrollBehavior = 'auto';
          setTimeout(() => {
            track.style.scrollBehavior = 'smooth';
          }, 100);
        }
      });
    }, 100);
  });
  
  // Improve touch scrolling
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.style.webkitOverflowScrolling = 'touch';
  });
  
  // Add touch-friendly class to body for CSS targeting
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
  }
  
  // Prevent zoom on double tap for specific elements
  const preventZoomElements = document.querySelectorAll('.btn, .carousel-btn, .nav-toggle');
  preventZoomElements.forEach(element => {
    element.addEventListener('touchend', (e) => {
      e.preventDefault();
      element.click();
    });
  });
  
  // Optimize scroll performance on mobile
  let ticking = false;
  
  function updateScrollEffects() {
    // Only update when necessary
    const scrollY = window.scrollY;
    
    // Update nav background
    const nav = document.getElementById('nav');
    if (nav) {
      if (scrollY > 50) {
        nav.style.background = 'rgba(250, 248, 243, 0.98)';
      } else {
        nav.style.background = 'rgba(250, 248, 243, 0.95)';
      }
    }
    
    // Update back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (scrollY > 600) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }, { passive: true });
  
  // Handle viewport height changes (mobile browser address bar)
  const setVHProperty = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVHProperty();
  window.addEventListener('resize', debounce(setVHProperty, 100));
}

/**
 * Configuration Management
 */
async function loadConfig() {
  try {
    const response = await fetch('./config.json');
    if (!response.ok) throw new Error('Failed to load config');
    config = await response.json();
    
    // Load saved customizations from localStorage
    const savedConfig = localStorage.getItem('wedding-config');
    if (savedConfig) {
      const customConfig = JSON.parse(savedConfig);
      config = { ...config, ...customConfig };
    }
  } catch (error) {
    console.error('Error loading config:', error);
    // Fallback configuration
    config = {
      names: "Jake & Marjo",
      dateISO: "2025-12-12T15:00:00+08:00",
      locationShort: "Silang & Tagaytay, Cavite",
      tagline: "We're getting married!",
      heroImage: "images/hero.jpg"
    };
  }
}

/**
 * Configure typography from theme settings
 * Maps config.theme fonts to CSS variables
 */
function configureFonts() {
  const theme = (config && config.theme) || {};
  const root = document.documentElement;
  
  // Map theme fonts to CSS variables
  if (theme.display) root.style.setProperty('--cfg-display', theme.display);
  if (theme.serif)   root.style.setProperty('--cfg-serif',   theme.serif);
  if (theme.sans)    root.style.setProperty('--cfg-sans',    theme.sans);
  if (theme.script)  root.style.setProperty('--cfg-script',  theme.script);
  
  // Optional: toggle script style for hero names via config.hero.useScript
  if (config && config.hero && config.hero.useScript) {
    document.querySelectorAll('.hero .names, .hero-names').forEach(el => el.classList.add('script'));
  }
}

/**
 * Navigation
 */
function initializeNavigation() {
  const nav = document.getElementById('nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    
    // Prevent body scroll when menu is open on mobile
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('open') && 
        !navMenu.contains(e.target) && 
        !navToggle?.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70; // Account for fixed nav
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Close mobile menu
        navMenu.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Handle escape key to close mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle?.focus();
    }
  });
  
  // Scroll spy for navigation
  window.addEventListener('scroll', debounce(() => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        activeLink?.classList.add('active');
      }
    });
    
    // Update nav background opacity
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(250, 248, 243, 0.98)';
      nav.classList.add('is-scrolled');
    } else {
      nav.style.background = 'rgba(250, 248, 243, 0.95)';
      nav.classList.remove('is-scrolled');
    }
  }, 10));
}

/**
 * Countdown Timer
 */
function initializeCountdown() {
  const countdown = document.getElementById('countdown');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  if (!countdown || !config.dateISO) return;
  
  function updateCountdown() {
    const now = new Date().getTime();
    const weddingDate = new Date(config.dateISO).getTime();
    const difference = weddingDate - now;
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours;
      if (minutesEl) minutesEl.textContent = minutes;
      if (secondsEl) secondsEl.textContent = seconds;
    } else {
      countdown.innerHTML = '<p class="countdown-finished">The big day is here! 🎉</p>';
    }
  }
  
  // Update immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/**
 * Add to Calendar
 */
function initializeAddToCalendar() {
  const btn = document.getElementById('add-to-calendar');
  
  btn?.addEventListener('click', () => {
    generateCalendarFile();
  });
}

function generateCalendarFile() {
  if (!config.dateISO) return;
  
  const weddingDate = new Date(config.dateISO);
  const utcDate = new Date(weddingDate.getTime() - weddingDate.getTimezoneOffset() * 60000);
  const startTime = utcDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  // 3 hours duration
  const endTime = new Date(utcDate.getTime() + 3 * 60 * 60 * 1000)
    .toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `wedding-${Date.now()}@wedding`;
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Site//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${config.names} – Wedding Day
LOCATION:${config.venue?.ceremony?.label || config.locationShort}
DESCRIPTION:Join us for our wedding celebration! Reception at ${config.venue?.reception?.label || 'the reception venue'}.
END:VEVENT
END:VCALENDAR`;
  
  // Create and download the file
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${config.names.replace(/[^a-zA-Z0-9]/g, '')}-Wedding.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  announceToScreenReader('Calendar event downloaded');
}

/**
 * Scroll Animations
 */
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Back to Top Button
 */
function initializeBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop?.classList.add('show');
    } else {
      backToTop?.classList.remove('show');
    }
  });
  
  backToTop?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Lightbox
 */
function initializeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  // Close lightbox
  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
    announceToScreenReader('Image viewer closed');
  };
  
  lightboxClose?.addEventListener('click', closeLightbox);
  
  // Close on backdrop click
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      closeLightbox();
    }
  });
  
  // Navigation
  lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext?.addEventListener('click', () => navigateLightbox(1));
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox?.classList.contains('open')) {
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });
}

function openLightbox(images, index) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  lightboxImages = images;
  currentLightboxIndex = index;
  
  if (lightboxImg && lightboxImages[currentLightboxIndex]) {
    lightboxImg.src = lightboxImages[currentLightboxIndex].src;
    lightboxImg.alt = lightboxImages[currentLightboxIndex].alt || '';
    
    lightbox?.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    announceToScreenReader(`Image ${currentLightboxIndex + 1} of ${lightboxImages.length} opened`);
  }
}

function navigateLightbox(direction) {
  currentLightboxIndex += direction;
  
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = lightboxImages.length - 1;
  } else if (currentLightboxIndex >= lightboxImages.length) {
    currentLightboxIndex = 0;
  }
  
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightboxImg && lightboxImages[currentLightboxIndex]) {
    lightboxImg.src = lightboxImages[currentLightboxIndex].src;
    lightboxImg.alt = lightboxImages[currentLightboxIndex].alt || '';
    
    announceToScreenReader(`Image ${currentLightboxIndex + 1} of ${lightboxImages.length}`);
  }
}

/**
 * Carousels
 */
function initializeCarousels() {
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    initializeCarousel(carousel);
  });
}

function initializeCarousel(carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const carouselContainer = carousel.closest('.carousel-container');
  
  if (!track || !slides.length) return;
  
  // Touch/swipe variables
  let isDown = false;
  let startX;
  let scrollLeft;
  let isDragging = false;
  let hasStartedSwiping = false;
  
  // Function to hide swipe indicator
  function hideSwipeIndicator() {
    if (carouselContainer && !hasStartedSwiping) {
      hasStartedSwiping = true;
      carouselContainer.classList.add('swiping-started');
    }
  }
  
  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.setAttribute('role', 'tab');
      if (index === 0) dot.setAttribute('aria-current', 'true');
      
      dot.addEventListener('click', () => {
        scrollToSlide(track, index);
        updateActiveDot(dotsContainer, index);
      });
      
      dotsContainer.appendChild(dot);
    });
  }
  
  // Navigation buttons
  prevBtn?.addEventListener('click', () => {
    track.scrollBy({
      left: -track.clientWidth * 0.9,
      behavior: 'smooth'
    });
  });
  
  nextBtn?.addEventListener('click', () => {
    track.scrollBy({
      left: track.clientWidth * 0.9,
      behavior: 'smooth'
    });
  });
  
  // Touch/mouse events for swipe
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  
  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });
  
  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
    
    // If we dragged significantly, don't trigger click events
    if (isDragging) {
      setTimeout(() => { isDragging = false; }, 100);
    }
  });
  
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    isDragging = true;
    hideSwipeIndicator(); // Hide indicator when dragging starts
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 2;
    track.scrollLeft = scrollLeft - walk;
  });
  
  // Touch events for mobile
  track.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  
  track.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    isDragging = true;
    hideSwipeIndicator(); // Hide indicator when swiping starts
    const x = e.touches[0].pageX - track.offsetLeft;
    const walk = (x - startX) * 2;
    track.scrollLeft = scrollLeft - walk;
  });
  
  track.addEventListener('touchend', () => {
    isDown = false;
    if (isDragging) {
      setTimeout(() => { isDragging = false; }, 100);
    }
  });
  
  // Hide indicator on scroll (for programmatic scrolling)
  track.addEventListener('scroll', () => {
    hideSwipeIndicator();
  });
  
  // Intersection Observer for dots
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slideIndex = Array.from(slides).indexOf(entry.target);
        updateActiveDot(dotsContainer, slideIndex);
        announceToScreenReader(`Slide ${slideIndex + 1} of ${slides.length} in view`);
      }
    });
  }, {
    root: track,
    threshold: 0.5
  });
  
  slides.forEach(slide => slideObserver.observe(slide));
  
  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    const focusedSlide = document.activeElement;
    const slideIndex = Array.from(slides).indexOf(focusedSlide);
    
    if (slideIndex === -1) return;
    
    let newIndex = slideIndex;
    
    switch (e.key) {
      case 'ArrowLeft':
        newIndex = slideIndex > 0 ? slideIndex - 1 : slides.length - 1;
        break;
      case 'ArrowRight':
        newIndex = slideIndex < slides.length - 1 ? slideIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = slides.length - 1;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    slides[newIndex].focus();
    scrollToSlide(track, newIndex);
    updateActiveDot(dotsContainer, newIndex);
  });
  
  // Click to open lightbox (only if not dragging)
  slides.forEach((slide, index) => {
    slide.addEventListener('click', (e) => {
      if (isDragging) {
        e.preventDefault();
        return;
      }
      
      const images = Array.from(slides).map(s => ({
        src: s.querySelector('img')?.src || '',
        alt: s.querySelector('img')?.alt || ''
      }));
      openLightbox(images, index);
    });
    
    // Make slides focusable
    slide.setAttribute('tabindex', '0');
    slide.setAttribute('role', 'button');
    slide.setAttribute('aria-label', `View image ${index + 1}`);
  });
}

function scrollToSlide(track, index) {
  const slides = track.querySelectorAll('.carousel-slide');
  if (slides[index]) {
    slides[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
}

function updateActiveDot(dotsContainer, activeIndex) {
  if (!dotsContainer) return;
  
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  });
}

/**
 * FAQ Accordion
 */
function initializeFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      // Close all other FAQ items
      faqQuestions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        const a = q.nextElementSibling;
        if (a) a.classList.remove('open');
      });
      
      // Toggle current item
      if (!isExpanded) {
        question.setAttribute('aria-expanded', 'true');
        answer?.classList.add('open');
      }
    });
    
    // Keyboard support
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

/**
 * RSVP Form
 */
function initializeRSVP() {
  // Populate RSVP content from config
  populateRSVPSection();
  
  // Initialize RSVP modal functionality
  initializeRSVPModal();
  
  // Check if RSVP is closed
  checkRSVPDeadline();
}

function populateRSVPSection() {
  if (!config.rsvp) return;
  
  // Update deadline text
  const deadlineEl = document.querySelector('.rsvp .deadline');
  if (deadlineEl && config.rsvp.deadlineISO) {
    const deadline = new Date(config.rsvp.deadlineISO);
    const formattedDeadline = deadline.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    deadlineEl.textContent = formattedDeadline;
  }
  
  // Update images
  const envelopeBg = document.querySelector('.envelope-bg');
  const envelopeCard = document.querySelector('.envelope-card');
  const rsvpButton = document.querySelector('#rsvpButton');
  
  if (envelopeBg && config.rsvp.envelopeImage) {
    envelopeBg.src = config.rsvp.envelopeImage;
  }
  
  if (envelopeCard && config.rsvp.cardImage) {
    envelopeCard.src = config.rsvp.cardImage;
  }
  
  if (rsvpButton) {
    rsvpButton.textContent = config.rsvp.buttonLabel || 'RSVP HERE';
    rsvpButton.href = config.rsvp.link || '#';
  }
}

function initializeRSVPModal() {
  const trigger = document.querySelector('[data-rsvp-trigger]');
  const modal = document.querySelector('.rsvp-modal');
  const closeBtn = modal?.querySelector('.close');
  const iframe = modal?.querySelector('iframe');
  
  if (!trigger || !modal) return;
  
  trigger.addEventListener('click', (e) => {
    if (config.rsvp?.embed) {
      e.preventDefault();
      openRSVPModal();
    } else {
      // Open in new tab
      e.preventDefault();
      window.open(config.rsvp.link, '_blank', 'noopener,noreferrer');
    }
  });
  
  closeBtn?.addEventListener('click', closeRSVPModal);
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeRSVPModal();
    }
  });
  
  // Close modal on backdrop click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeRSVPModal();
    }
  });
  
  function openRSVPModal() {
    if (!modal || !iframe) return;
    
    // Set iframe source
    iframe.src = config.rsvp.link;
    
    // Show modal
    modal.hidden = false;
    
    // Focus management
    const firstFocusable = closeBtn;
    firstFocusable?.focus();
    
    // Trap focus within modal
    trapFocusInModal(modal);
    
    announceToScreenReader('RSVP form opened');
  }
  
  function closeRSVPModal() {
    if (!modal || !iframe) return;
    
    // Hide modal
    modal.hidden = true;
    
    // Clear iframe source for privacy
    iframe.src = '';
    
    // Return focus to trigger
    trigger?.focus();
    
    announceToScreenReader('RSVP form closed');
  }
}

function checkRSVPDeadline() {
  if (!config.rsvp?.deadlineISO) return;
  
  const now = new Date();
  const deadline = new Date(config.rsvp.deadlineISO);
  
  // Set deadline to end of day
  deadline.setHours(23, 59, 59, 999);
  
  if (now > deadline) {
    // RSVP is closed
    const trigger = document.querySelector('[data-rsvp-trigger]');
    const closedNote = document.querySelector('.closed-note');
    
    if (trigger) {
      trigger.setAttribute('aria-disabled', 'true');
      trigger.style.display = 'none';
    }
    
    if (closedNote && config.rsvp.closedMessage) {
      closedNote.textContent = config.rsvp.closedMessage;
      closedNote.hidden = false;
      
      // Add contact link if email is available
      if (config.rsvpEmail) {
        const contactLink = document.createElement('a');
        contactLink.href = `mailto:${config.rsvpEmail}`;
        contactLink.textContent = 'Contact us';
        contactLink.style.marginLeft = '0.5rem';
        closedNote.appendChild(contactLink);
      }
    }
  }
}

function trapFocusInModal(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  function handleTabKey(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  modal.addEventListener('keydown', handleTabKey);
  
  // Remove event listener when modal is closed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'hidden' && modal.hidden) {
        modal.removeEventListener('keydown', handleTabKey);
        observer.disconnect();
      }
    });
  });
  
  observer.observe(modal, { attributes: true });
}

/**
 * Falling Petals Animation System
 */
function initializeFallingPetals() {
  if (!config?.decor?.petals?.enabled || !config.decor.petals.images?.length) {
    return;
  }

  let petalContainer;
  let petalsActive = false;
  let animationFrameId;
  let lastPetalTime = 0;

  function createPetalContainer() {
    // Remove existing container if it exists
    if (petalContainer) {
      petalContainer.remove();
    }
    
    const scheduleSection = document.getElementById('schedule');
    const venueSection = document.getElementById('venue');
    
    if (!scheduleSection || !venueSection) return;
    
    // Calculate the combined height of timeline and venue sections
    const scheduleHeight = scheduleSection.offsetHeight;
    const venueHeight = venueSection.offsetHeight;
    const totalHeight = scheduleHeight + venueHeight;
    
    // Create container positioned relative to the timeline section
    petalContainer = document.createElement('div');
    petalContainer.className = 'petal-container-sections';
    petalContainer.style.position = 'absolute';
    petalContainer.style.top = '0';
    petalContainer.style.left = '0';
    petalContainer.style.right = '0';
    petalContainer.style.width = '100%';
    petalContainer.style.height = totalHeight + 'px';
    petalContainer.style.pointerEvents = 'none';
    petalContainer.style.zIndex = '900'; // Below navigation (1000)
    petalContainer.style.overflow = 'hidden';
    
    // Append to schedule section so petals start from timeline
    scheduleSection.style.position = 'relative';
    scheduleSection.appendChild(petalContainer);
  }

  function createPetal() {
    if (!petalContainer) {
      createPetalContainer();
    }
    
    const petal = document.createElement('div');
    petal.className = 'falling-petal';
    
    // Random petal image
    const images = config.decor.petals.images;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    petal.style.backgroundImage = `url('${randomImage}')`;
    petal.style.backgroundSize = 'contain';
    petal.style.backgroundRepeat = 'no-repeat';
    petal.style.backgroundPosition = 'center';
    
    // Random size
    const sizes = ['small', 'medium', 'large'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    petal.classList.add(randomSize);
    
    // Random horizontal position
    petal.style.left = Math.random() * 100 + '%';
    
    // Always start from the top of the container (no scroll-based positioning)
    petal.style.top = '-100px';
    
    // Random animation duration (fall speed)
    const duration = 8 + Math.random() * 12; // 8-20 seconds
    petal.style.animationDuration = duration + 's';
    
    // Add sway animation randomly
    if (Math.random() > 0.5) {
      petal.classList.add('sway');
      petal.style.animationDuration = `${duration}s, ${3 + Math.random() * 4}s`;
    }
    
    petalContainer.appendChild(petal);
    
    // Remove petal after animation
    setTimeout(() => {
      if (petal.parentNode) {
        petal.parentNode.removeChild(petal);
      }
    }, duration * 1000);
  }

  function shouldShowPetals() {
    const scheduleSection = document.getElementById('schedule');
    const venueSection = document.getElementById('venue');
    
    if (!scheduleSection || !venueSection) return false;
    
    const scheduleRect = scheduleSection.getBoundingClientRect();
    const venueRect = venueSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Show petals when either timeline or venue section is visible
    const scheduleVisible = scheduleRect.top < windowHeight && scheduleRect.bottom > 0;
    const venueVisible = venueRect.top < windowHeight && venueRect.bottom > 0;
    
    return scheduleVisible || venueVisible;
  }

  function animatePetals(currentTime) {
    const shouldShow = shouldShowPetals();
    
    if (shouldShow && !petalsActive) {
      petalsActive = true;
      createPetalContainer();
      console.log('Petals activated - sections visible');
    } else if (!shouldShow && petalsActive) {
      petalsActive = false;
      // Clean up petals when deactivating
      if (petalContainer) {
        petalContainer.remove();
        petalContainer = null;
      }
      console.log('Petals deactivated - sections not visible');
    }
    
    // Create new petals periodically when active
    if (petalsActive && currentTime - lastPetalTime > 750) { // Every 0.75 seconds (doubled rate)
      createPetal();
      lastPetalTime = currentTime;
    }
    
    animationFrameId = requestAnimationFrame(animatePetals);
  }

  // Start animation with a small delay to ensure page is loaded
  setTimeout(() => {
    animationFrameId = requestAnimationFrame(animatePetals);
  }, 1000);
  
  // Cleanup function
  window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
}

/**
 * Content Population
 */
function populateContent() {
  // Update title and meta tags
  document.title = `${config.names} Wedding – ${formatDate(config.dateISO)}`;
  
  // Hero section
  updateElement('hero-names', config.names);
  updateElement('hero-tagline', config.tagline);
  updateElement('hero-date', formatDate(config.dateISO));
  updateElement('hero-location', config.locationShort);
  
  // Hero background - use responsive image function
  updateHeroImage();
  
  // Branding
  populateBranding();
  
  // Story section
  updateElement('story-text', config.story ? `<p>${config.story}</p>` : '');
  
  // Schedule
  populateSchedule();
  
  // Venue
  populateVenue();
  
  // Gallery
  populateGallery();
  
  // Stays & Travel
  populateStaysTravel();
  
  // Attire
  populateAttire();
  
  // Registry
  populateRegistry();
  
  // FAQ
  populateFAQ();
  
  // Initialize Add to Calendar
  initializeAddToCalendar();
  
  // Initialize falling petals animation
  initializeFallingPetals();
}

function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element && content) {
    if (typeof content === 'string' && content.includes('<')) {
      element.innerHTML = content;
    } else {
      element.textContent = content;
    }
  }
}

function formatDate(dateISO) {
  if (!dateISO) return '';
  
  const date = new Date(dateISO);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function populateBranding() {
  // Update CSS variables with config values
  if (config.branding?.nav?.size) {
    const navSize = config.branding.nav.size;
    const root = document.documentElement;
    
    if (typeof navSize === 'object') {
      // Handle responsive sizing
      root.style.setProperty('--nav-logo-size-desktop', `${navSize.desktop}px`);
      root.style.setProperty('--nav-logo-size-mobile', `${navSize.mobile}px`);
    } else {
      // Handle single size value
      root.style.setProperty('--nav-logo-size-desktop', `${navSize}px`);
      root.style.setProperty('--nav-logo-size-mobile', `${navSize}px`);
    }
  }
  
  // Update footer logo size
  if (config.branding?.footer?.size) {
    const footerSize = config.branding.footer.size;
    const root = document.documentElement;
    root.style.setProperty('--footer-logo-size', `${footerSize}px`);
  }
  
  // Navigation branding
  const navBrand = document.getElementById('nav-brand');
  if (navBrand && config.branding?.nav) {
    const brandConfig = config.branding.nav;
    const srcsetAttr = brandConfig.srcset ? `srcset="${brandConfig.srcset}"` : '';
    
    navBrand.innerHTML = `
      <a class="brand" href="#hero" aria-label="Home">
        <img class="brand-logo" 
             alt="${brandConfig.alt}"
             src="${brandConfig.src}"
             ${srcsetAttr}
             width="auto" 
             height="auto"
             onerror="this.style.display='none'" />
      </a>
    `;
  }
  
  // Footer branding
  const footerBrand = document.getElementById('footer-brand');
  if (footerBrand && config.branding?.footer) {
    const brandConfig = config.branding.footer;
    const srcsetAttr = brandConfig.srcset ? `srcset="${brandConfig.srcset}"` : '';
    
    footerBrand.innerHTML = `
      <img class="footer-logo" 
           alt="${brandConfig.alt}"
           src="${brandConfig.src}"
           ${srcsetAttr}
           width="auto" 
           height="auto"
           onerror="this.style.display='none'" />
    `;
  }
}

function populateSchedule() {
  const container = document.getElementById('schedule-grid');
  if (!container || !config.schedule) return;
  
  container.innerHTML = config.schedule.map(item => `
    <div class="schedule-item">
      <h3 class="schedule-title">${item.title}</h3>
      <div class="schedule-time">${item.time}</div>
      <p class="schedule-desc">${item.desc}</p>
      ${item.note ? `<p class="schedule-note">${item.note}</p>` : ''}
    </div>
  `).join('');
}

function populateVenue() {
  // Ceremony venue
  if (config.venue?.ceremony) {
    const venue = config.venue.ceremony;
    updateElement('ceremony-label', venue.label);
    
    const ceremonyMap = document.getElementById('ceremony-map');
    if (ceremonyMap && venue.gmapsQuery) {
      ceremonyMap.src = `https://www.google.com/maps?q=${encodeURIComponent(venue.gmapsQuery)}&z=16&output=embed`;
    }
    
    const ceremonyDirections = document.getElementById('ceremony-directions');
    if (ceremonyDirections && venue.directions) {
      ceremonyDirections.innerHTML = `
        <a href="${venue.directions.google}" target="_blank" rel="noopener">Open in Google Maps</a>
        <a href="${venue.directions.waze}" target="_blank" rel="noopener">Open in Waze</a>
      `;
    }
    
    const ceremonyNotes = document.getElementById('ceremony-notes');
    if (ceremonyNotes && venue.notes) {
      ceremonyNotes.innerHTML = venue.notes.map(note => `<li>${note}</li>`).join('');
    }
  }
  
  // Reception venue
  if (config.venue?.reception) {
    const venue = config.venue.reception;
    updateElement('reception-label', venue.label);
    
    const receptionMap = document.getElementById('reception-map');
    if (receptionMap && venue.gmapsQuery) {
      receptionMap.src = `https://www.google.com/maps?q=${encodeURIComponent(venue.gmapsQuery)}&z=16&output=embed`;
    }
    
    const receptionDirections = document.getElementById('reception-directions');
    if (receptionDirections && venue.directions) {
      receptionDirections.innerHTML = `
        <a href="${venue.directions.google}" target="_blank" rel="noopener">Open in Google Maps</a>
        <a href="${venue.directions.waze}" target="_blank" rel="noopener">Open in Waze</a>
      `;
    }
    
    const receptionNotes = document.getElementById('reception-notes');
    if (receptionNotes && venue.notes) {
      receptionNotes.innerHTML = venue.notes.map(note => `<li>${note}</li>`).join('');
    }
  }
}

function populateGallery() {
  const container = document.getElementById('gallery-grid');
  if (!container || !config.gallery) return;
  
  container.innerHTML = config.gallery.map((image, index) => `
    <div class="gallery-item" onclick="openGalleryLightbox(${index})" tabindex="0" role="button" aria-label="View gallery image ${index + 1}">
      <img src="${image}" alt="Gallery image ${index + 1}" loading="lazy" decoding="async">
    </div>
  `).join('');
}

// Global function for gallery lightbox
window.openGalleryLightbox = function(index) {
  const images = config.gallery.map((src, i) => ({
    src,
    alt: `Gallery image ${i + 1}`
  }));
  openLightbox(images, index);
};

function populateStaysTravel() {
  if (!config.staysTravel) return;
  
  // Populate Stays section
  if (config.staysTravel.stays) {
    updateElement('stays-title', config.staysTravel.stays.title);
    updateElement('stays-subcopy', config.staysTravel.stays.subcopy);
    
    const staysLink = document.getElementById('stays-link');
    if (staysLink) {
      staysLink.textContent = config.staysTravel.stays.label;
      staysLink.href = config.staysTravel.stays.url;
    }
  }
  
  // Populate Travel Guide section
  if (config.staysTravel.travel) {
    updateElement('travel-title', config.staysTravel.travel.title);
    updateElement('travel-subcopy', config.staysTravel.travel.subcopy);
    
    const travelLinksContainer = document.getElementById('travel-links');
    if (travelLinksContainer && config.staysTravel.travel.links) {
      travelLinksContainer.innerHTML = config.staysTravel.travel.links.map(link => `
        <a class="cta outline" data-embed-link href="${link.url}" role="button" rel="noopener noreferrer">${link.label}</a>
      `).join('');
    }
  }
  
  // Initialize modal functionality
  initializeStaysTravelModal();
}

function initializeStaysTravelModal() {
  const embed = config.staysTravel?.embed;
  const modal = document.querySelector('.flip-modal');
  const iframe = modal?.querySelector('iframe');
  const closeBtn = modal?.querySelector('.close');
  
  if (!embed || !modal || !iframe || !closeBtn) return;
  
  // Handle embed link clicks
  const embedLinks = document.querySelectorAll('[data-embed-link]');
  embedLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (!embed) return;
      
      e.preventDefault();
      
      // Set iframe source and open modal
      iframe.src = link.href;
      iframe.title = `Flip book: ${link.textContent}`;
      modal.hidden = false;
      modal.dataset.returnFocus = link;
      
      // Focus close button for accessibility
      closeBtn.focus();
      
      // Dispatch analytics event
      const event = new CustomEvent('external-link:open', {
        detail: { label: link.textContent, url: link.href }
      });
      document.dispatchEvent(event);
    });
  });
  
  // Close modal function
  const closeModal = () => {
    modal.hidden = true;
    iframe.src = '';
    
    // Restore focus to trigger element
    const returnFocus = modal.dataset.returnFocus;
    if (returnFocus) {
      document.querySelector(`[href="${returnFocus}"]`)?.focus();
    }
  };
  
  // Close button click
  closeBtn.addEventListener('click', closeModal);
  
  // ESC key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
  
  // Backdrop click (if clicking on modal but not iframe)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

function populateAttire() {
  // Women's attire
  if (config.attire?.women) {
    updateElement('women-title', config.attire.women.title);
    updateElement('women-guidelines', config.attire.women.guidelines);
    
    // Women's color palette
    const womenPaletteContainer = document.getElementById('women-palette');
    if (womenPaletteContainer && config.attire.women.palette) {
      womenPaletteContainer.innerHTML = config.attire.women.palette.map(color => `
        <div class="color-chip">
          <div class="color-swatch" style="background-color: ${color.hex}"></div>
          <span class="color-name">${color.name}</span>
        </div>
      `).join('');
    }
    
    const womenTrack = document.getElementById('women-track');
    if (womenTrack && config.attire.women.slides) {
      womenTrack.innerHTML = config.attire.women.slides.map((slide, index) => `
        <div class="carousel-slide" tabindex="0" role="button" aria-label="${slide.alt}">
          <img src="${slide.img}" alt="${slide.alt}" loading="lazy" decoding="async">
        </div>
      `).join('');
      
      // Re-initialize the women's attire carousel
      const womenCarousel = womenTrack.closest('.carousel');
      if (womenCarousel) {
        initializeCarousel(womenCarousel);
      }
    }
  }
  
  // Men's attire
  if (config.attire?.men) {
    updateElement('men-title', config.attire.men.title);
    updateElement('men-guidelines', config.attire.men.guidelines);
    
    // Men's color palette
    const menPaletteContainer = document.getElementById('men-palette');
    if (menPaletteContainer && config.attire.men.palette) {
      menPaletteContainer.innerHTML = config.attire.men.palette.map(color => `
        <div class="color-chip">
          <div class="color-swatch" style="background-color: ${color.hex}${color.hex === '#FFFFFF' ? '; border: 1px solid #ddd' : ''}"></div>
          <span class="color-name">${color.name}</span>
        </div>
      `).join('');
    }
    
    const menTrack = document.getElementById('men-track');
    if (menTrack && config.attire.men.slides) {
      menTrack.innerHTML = config.attire.men.slides.map((slide, index) => `
        <div class="carousel-slide" tabindex="0" role="button" aria-label="${slide.alt}">
          <img src="${slide.img}" alt="${slide.alt}" loading="lazy" decoding="async">
        </div>
      `).join('');
      
      // Re-initialize the men's attire carousel
      const menCarousel = menTrack.closest('.carousel');
      if (menCarousel) {
        initializeCarousel(menCarousel);
      }
    }
  }
  
  // Attire note
  updateElement('attire-note', config.attire?.note);
}

function populateRegistry() {
  const container = document.getElementById('registry-grid');
  if (!container || !config.registry) return;
  
  container.innerHTML = config.registry.map(item => `
    <a href="${item.url}" class="registry-item" target="_blank" rel="noopener">
      ${item.label}
    </a>
  `).join('');
}

function populateFAQ() {
  const container = document.getElementById('faq-list');
  if (!container || !config.faq) return;
  
  container.innerHTML = config.faq.map((item, index) => `
    <div class="faq-item">
      <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}">
        ${item.q}
        <svg class="faq-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>
      <div class="faq-answer" id="faq-answer-${index}">
        ${item.a}
      </div>
    </div>
  `).join('');
  
  // Re-initialize FAQ after population
  initializeFAQ();
}

/**
 * Responsive Hero Image Management
 */
function initializeResponsiveHeroImage() {
  updateHeroImage();
  
  // Update hero image on window resize with debouncing
  window.addEventListener('resize', debounce(updateHeroImage, 250));
}

function updateHeroImage() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg || !config.heroImage) return;
  
  let heroImageUrl;
  
  // Check if heroImage is an object with responsive images or just a string
  if (typeof config.heroImage === 'object' && config.heroImage.desktop) {
    // Responsive image configuration
    const screenWidth = window.innerWidth;
    const pixelRatio = window.devicePixelRatio || 1;
    
    if (screenWidth <= 480) {
      // Mobile
      heroImageUrl = config.heroImage.mobile || config.heroImage.fallback;
    } else if (screenWidth <= 768) {
      // Tablet
      heroImageUrl = config.heroImage.tablet || config.heroImage.mobile || config.heroImage.fallback;
    } else {
      // Desktop
      heroImageUrl = config.heroImage.desktop || config.heroImage.fallback;
    }
    
    // For high DPI screens, try to use a higher resolution variant if available
    if (pixelRatio > 1.5 && config.heroImage.retina) {
      heroImageUrl = config.heroImage.retina || heroImageUrl;
    }
  } else {
    // Fallback to simple string configuration
    heroImageUrl = config.heroImage;
  }
  
  // Apply the background image without gradient overlay
  heroBg.style.backgroundImage = `url('${heroImageUrl}')`;
  
  // Optimize background properties for the current screen
  if (window.innerWidth <= 768) {
    // Mobile optimization
    heroBg.style.backgroundSize = 'cover';
    heroBg.style.backgroundPosition = 'center center';
    heroBg.style.backgroundAttachment = 'scroll'; // Better performance on mobile
  } else {
    // Desktop optimization
    heroBg.style.backgroundSize = 'cover';
    heroBg.style.backgroundPosition = 'center center';
    heroBg.style.backgroundAttachment = 'fixed'; // Parallax effect on desktop
  }
  
  // Preload the image for better performance
  preloadHeroImage(heroImageUrl);
}

function preloadHeroImage(imageUrl) {
  if (!imageUrl) return;
  
  const img = new Image();
  img.onload = () => {
    console.log(`Hero image loaded: ${imageUrl}`);
  };
  img.onerror = () => {
    console.warn(`Failed to load hero image: ${imageUrl}`);
    // Fallback to default if the specific image fails
    if (config.heroImage.fallback && imageUrl !== config.heroImage.fallback) {
      const heroBg = document.querySelector('.hero-bg');
      if (heroBg) {
        heroBg.style.backgroundImage = `url('${config.heroImage.fallback}')`;
      }
    }
  };
  img.src = imageUrl;
}

/**
 * Theme Application
 */
function applyTheme() {
  if (!config.theme) return;
  
  const root = document.documentElement;
  const theme = config.theme;
  
  // Apply CSS variables
  Object.entries(theme).forEach(([key, value]) => {
    if (key !== 'serif' && key !== 'sans' && key !== 'script') {
      root.style.setProperty(`--${key}`, value);
    }
  });
  
  // Apply font families if needed
  if (theme.serif) root.style.setProperty('--serif', theme.serif);
  if (theme.sans) root.style.setProperty('--sans', theme.sans);
  if (theme.script) root.style.setProperty('--script', theme.script);
}

/**
 * Accessibility Helper
 */
function announceToScreenReader(message) {
  const announcements = document.getElementById('sr-announcements');
  if (announcements) {
    announcements.textContent = message;
    // Clear after a short delay
    setTimeout(() => {
      announcements.textContent = '';
    }, 1000);
  }
}

/**
 * Utility Functions
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Error handling
window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Performance optimization
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading is supported
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.loading = 'lazy';
  });
} else {
  // Fallback for older browsers
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/intersection-observer@0.12.0/intersection-observer.js';
  document.head.appendChild(script);
}

// Simple fallback countdown and image fixes - runs after main code
setTimeout(() => {
  // Fix countdown if it's still at 0 0 0
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  
  if (daysEl && daysEl.textContent === '0' && hoursEl && hoursEl.textContent === '0') {
    const weddingDate = new Date('2025-12-12T15:00:00+08:00').getTime();
    const now = new Date().getTime();
    const difference = weddingDate - now;
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours;
      if (minutesEl) minutesEl.textContent = minutes;
    }
  }
  
  // Fix hero image if not visible
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && !heroBg.style.backgroundImage) {
    heroBg.style.backgroundImage = `url('images/hero.jpg')`;
    heroBg.style.backgroundSize = 'cover';
    heroBg.style.backgroundPosition = 'center center';
  }
}, 2000);