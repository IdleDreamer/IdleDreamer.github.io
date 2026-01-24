// Theme Toggle Functionality
(function() {
  'use strict';
  
  // Remove preload class after page loads to enable transitions
  window.addEventListener('load', () => {
    document.body.classList.remove('preload');
  });
  
  // Theme management
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const THEME_KEY = 'ficticiousdev-theme';
  
  // Get initial theme
  function getInitialTheme() {
    // Check HTML attribute first (set in markup for dark mode default)
    const htmlTheme = html.getAttribute('data-theme');
    if (htmlTheme) {
      return htmlTheme;
    }
    
    // Check localStorage second
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    
    // Default to dark
    return 'dark';
  }
  
  // Apply theme
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }
  
  // Toggle theme
  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }
  
  // Initialize theme
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  
  // Add event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  // Mobile menu functionality
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('nav');
  
  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    
    // Close menu when clicking a nav link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        nav.classList.remove('open');
      }
    });
  }
  
  // Active navigation link highlighting
  function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section, .hero');
    
    if (sections.length === 0) return;
    
    const scrollPos = window.scrollY + 200; // Offset for header
    let currentSection = 'about'; // Default
    
    // Find which section we've scrolled past (iterate through all sections)
    sections.forEach(section => {
      const anchor = section.querySelector('.anchor');
      if (!anchor) return;
      
      const sectionId = anchor.getAttribute('id');
      const sectionTop = section.offsetTop;
      
      // If we've scrolled past this section's top, it becomes the current section
      if (scrollPos >= sectionTop) {
        currentSection = sectionId;
      }
    });
    
    // Update active states
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Throttle function for performance
  function throttle(func, wait) {
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
  
  // Update active link on scroll
  window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
  
  // Update on page load
  updateActiveNavLink();
  
  // Smooth scroll for navigation links (fallback for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      
      // Immediately update active state
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      if (this.classList.contains('nav-link')) {
        this.classList.add('active');
      }
      
      const target = document.querySelector(href);
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
})();
