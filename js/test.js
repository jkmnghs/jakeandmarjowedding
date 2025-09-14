// Simplified Wedding Website JavaScript - No Customization Panel
console.log('Wedding website script loaded');

let config = {};

// Load configuration
async function loadConfig() {
  try {
    const response = await fetch('./config.json');
    if (!response.ok) throw new Error('Failed to load config');
    config = await response.json();
    console.log('Config loaded:', config);
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

// Countdown Timer
function initializeCountdown() {
  const countdown = document.getElementById('countdown');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  
  console.log('Initializing countdown...', { countdown: !!countdown, daysEl: !!daysEl, hoursEl: !!hoursEl, minutesEl: !!minutesEl });
  
  if (!countdown || !config.dateISO) return;
  
  function updateCountdown() {
    const now = new Date().getTime();
    const weddingDate = new Date(config.dateISO).getTime();
    const difference = weddingDate - now;
    
    console.log('Updating countdown:', { 
      now: new Date(now), 
      weddingDate: new Date(weddingDate), 
      difference,
      days: Math.floor(difference / (1000 * 60 * 60 * 24))
    });
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours;
      if (minutesEl) minutesEl.textContent = minutes;
    } else {
      countdown.innerHTML = '<p class="countdown-finished">The big day is here! 🎉</p>';
    }
  }
  
  // Update immediately and then every minute
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

// Hero Image with responsive support
function setupHeroImage() {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && config.heroImage) {
    console.log('Setting responsive hero background...');
    
    let heroImageUrl;
    
    // Check if heroImage is an object with responsive images or just a string
    if (typeof config.heroImage === 'object' && config.heroImage.desktop) {
      // Responsive image configuration
      const screenWidth = window.innerWidth;
      
      if (screenWidth <= 480) {
        // Mobile - use smaller image for faster loading
        heroImageUrl = config.heroImage.mobile || config.heroImage.fallback;
        console.log('Using mobile hero image for screen width:', screenWidth);
      } else if (screenWidth <= 768) {
        // Tablet - medium sized image
        heroImageUrl = config.heroImage.tablet || config.heroImage.mobile || config.heroImage.fallback;
        console.log('Using tablet hero image for screen width:', screenWidth);
      } else {
        // Desktop - full resolution image
        heroImageUrl = config.heroImage.desktop || config.heroImage.fallback;
        console.log('Using desktop hero image for screen width:', screenWidth);
      }
    } else {
      // Fallback to simple string configuration
      heroImageUrl = config.heroImage;
    }
    
    // Apply the background image
    heroBg.style.backgroundImage = `url('${heroImageUrl}')`;
    heroBg.style.backgroundSize = 'cover';
    heroBg.style.backgroundPosition = 'center center';
    
    // Optimize background properties for the current screen
    if (window.innerWidth <= 768) {
      // Mobile optimization - scroll attachment for better performance
      heroBg.style.backgroundAttachment = 'scroll';
    } else {
      // Desktop optimization - fixed attachment for parallax effect
      heroBg.style.backgroundAttachment = 'fixed';
    }
    
    console.log('Hero image set to:', heroImageUrl);
  }
}

// Update hero image on window resize
function updateHeroImageOnResize() {
  setupHeroImage();
}

// Debounce function to limit resize event calls
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

// Basic Navigation
function initializeNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  navToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
  });
  
  // Close menu when clicking links
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
    });
  });
}

// Populate content from config
function populateContent() {
  if (!config) return;
  
  // Update title
  document.title = `${config.names} Wedding`;
  
  // Update basic content
  const elements = {
    'hero-names': config.names,
    'hero-date': config.date,
    'hero-location': config.locationShort,
    'hero-tagline': config.tagline
  };
  
  Object.entries(elements).forEach(([id, content]) => {
    const element = document.getElementById(id);
    if (element && content) {
      element.textContent = content;
    }
  });
}

// Main initialization
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing...');
  
  try {
    // Load config first
    await loadConfig();
    
    // Initialize components
    initializeNavigation();
    initializeCountdown();
    setupHeroImage();
    populateContent();
    
    // Add resize listener for responsive hero images
    window.addEventListener('resize', debounce(updateHeroImageOnResize, 250));
    
    console.log('Wedding website initialized successfully');
  } catch (error) {
    console.error('Error initializing website:', error);
  }
});