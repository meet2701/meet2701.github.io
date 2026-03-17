// ===================================
// Meet Parekh — Portfolio V2 Scripts
// GSAP · Vanta.js · Vanilla Tilt · Easter Egg
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // ========= GSAP LOADING SCREEN =========
  const loader = document.getElementById('loader');
  const chars = document.querySelectorAll('.loader-char');
  const loaderBar = document.getElementById('loader-bar');
  const tagline = document.querySelector('.loader-tagline');

  const tl = gsap.timeline({
    onComplete: () => {
      // Fade out loader
      gsap.to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          document.body.style.overflow = '';
          // Init everything after loader
          initSite();
        },
      });
    },
  });

  // Prevent scrolling during loading
  document.body.style.overflow = 'hidden';

  // Animate characters in one by one
  tl.to(chars, {
    opacity: 1,
    y: 0,
    stagger: 0.08,
    duration: 0.4,
    ease: 'back.out(1.7)',
    from: { y: 20 },
  });

  // Animate loading bar
  tl.to(
    loaderBar,
    {
      width: '100%',
      duration: 1.2,
      ease: 'power2.inOut',
    },
    '-=0.3'
  );

  // Show tagline
  tl.to(
    tagline,
    {
      opacity: 1,
      duration: 0.4,
    },
    '-=0.8'
  );

  // Pause briefly before dismissing
  tl.to({}, { duration: 0.4 });

  // ========= INIT SITE (after loader) =========
  function initSite() {
    initAOS();
    initVanta();
    initTyped();
    initTilt();
    initNavbar();
    initEasterEgg();
  }

  // ========= AOS =========
  function initAOS() {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }

  // ========= VANTA.JS 3D BACKGROUND =========
  function initVanta() {
    const vantaEl = document.getElementById('vanta-bg');
    if (vantaEl && window.VANTA && window.VANTA.NET) {
      try {
        VANTA.NET({
          el: vantaEl,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x00d4ff,
          backgroundColor: 0x0a0e1a,
          points: 9.0,
          maxDistance: 22.0,
          spacing: 18.0,
          showDots: true,
        });
      } catch (e) {
        console.warn('Vanta.js failed to initialize:', e);
      }
    }
  }

  // ========= TYPED.JS =========
  function initTyped() {
    const typedEl = document.getElementById('typed-output');
    if (typedEl && window.Typed) {
      new Typed('#typed-output', {
        strings: [
          'CS Undergrad @ IIIT Hyderabad',
          'Systems Programmer',
          'Competitive Coder — CF Specialist',
          'Full-Stack Developer',
          'Building Multi-Agent AI Systems',
          'Exploring Trustworthy AI Research',
        ],
        typeSpeed: 45,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 300,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });
    }
  }

  // ========= VANILLA TILT =========
  function initTilt() {
    if (window.VanillaTilt) {
      const tiltElements = document.querySelectorAll('[data-tilt]');
      VanillaTilt.init(tiltElements, {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.15,
        scale: 1.02,
      });
    }
  }

  // ========= NAVBAR & NAVIGATION =========
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Scroll effect
    function onScroll() {
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      }
      // Active nav
      const scrollY = window.scrollY + 200;
      sections.forEach((section) => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < bottom) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      });
      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          const navH = navbar ? navbar.offsetHeight : 80;
          const pos = target.getBoundingClientRect().top + window.pageYOffset - navH;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });
  }

  // ========= ONE PIECE EASTER EGG 🏴‍☠️ =========
  function initEasterEgg() {
    const logo = document.getElementById('site-logo');
    const overlay = document.getElementById('easter-egg-overlay');
    let clickCount = 0;
    let clickTimer = null;

    if (logo && overlay) {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clickCount++;

        // Reset counter after 3 seconds of no clicks
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 3000);

        if (clickCount >= 5) {
          clickCount = 0;
          showEasterEgg();
        }
      });

      overlay.addEventListener('click', () => {
        hideEasterEgg();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
          hideEasterEgg();
        }
      });
    }

    function showEasterEgg() {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Auto-dismiss after 6 seconds
      setTimeout(() => {
        if (overlay.classList.contains('active')) {
          hideEasterEgg();
        }
      }, 6000);
    }

    function hideEasterEgg() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});