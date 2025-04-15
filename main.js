document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS with custom settings
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  // Initialize GLightbox for image gallery
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: true
  });

  // Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-links');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Animate skill bars on scroll
  const skillSection = document.getElementById('skills');
  
  if (skillSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.skill-level').forEach(skill => {
          const width = skill.getAttribute('data-level');
          skill.style.width = width;
        });
        observer.unobserve(skillSection);
      }
    }, { threshold: 0.5 });
    
    observer.observe(skillSection);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add active class to nav items when scrolling
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNavOnScroll() {
    let scrollPosition = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - navbar.offsetHeight;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  highlightNavOnScroll();

  initEventTracking();
  
  initTextAnalysis();
});

function initEventTracking() {

  logEvent('view', 'page', 'Page loaded');
  
  document.addEventListener('click', function(e) {

    let elementType = getElementType(e.target);
    let elementDescription = getElementDescription(e.target);
    
    logEvent('click', elementType, elementDescription);
  });
  
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      logEvent('view', 'page', 'Page became visible');
    }
  });
}

function getElementType(element) {

  if (element.tagName === 'A') return 'link';
  if (element.tagName === 'BUTTON') return 'button';
  if (element.tagName === 'IMG') return 'image';
  if (element.tagName === 'INPUT') return 'input';
  if (element.tagName === 'SELECT') return 'dropdown';
  if (element.tagName === 'TEXTAREA') return 'textbox';
  if (element.classList.contains('gallery-item')) return 'gallery-item';
  if (element.classList.contains('social-icon')) return 'social-icon';
  if (element.classList.contains('nav-links')) return 'navigation';
  if (element.classList.contains('hamburger')) return 'menu-toggle';
  
  let parent = element.parentElement;
  while (parent) {
    if (parent.classList && parent.classList.contains('gallery-item')) return 'gallery-item';
    if (parent.classList && parent.classList.contains('social-icon')) return 'social-icon';
    parent = parent.parentElement;
  }
  
 
  return element.tagName.toLowerCase();
}

function getElementDescription(element) {
 
  if (element.alt) return element.alt;
  if (element.title) return element.title;
  if (element.innerText && element.innerText.trim().length > 0) {
    return element.innerText.trim().substring(0, 30) + (element.innerText.length > 30 ? '...' : '');
  }
  if (element.id) return `id: ${element.id}`;
  
  let parent = element.parentElement;
  while (parent) {
    if (parent.innerText && parent.innerText.trim().length > 0) {
      return `parent text: ${parent.innerText.trim().substring(0, 30)}${parent.innerText.length > 30 ? '...' : ''}`;
    }
    parent = parent.parentElement;
  }
  
  return `${element.tagName.toLowerCase()} element`;
}

function logEvent(eventType, objectType, description) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}, ${eventType}, ${objectType}: ${description}`;
  
  console.log(logMessage);
  
  const eventLog = document.getElementById('event-log');
  if (eventLog) {
    const logEntry = document.createElement('div');
    logEntry.textContent = logMessage;
    eventLog.prepend(logEntry);
    
    if (eventLog.children.length > 15) {
      eventLog.removeChild(eventLog.lastChild);
    }
  }
}

function initTextAnalysis() {
  const analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', analyzeText);
  } else {
    console.error("Could not find analyze-btn element");
  }
}

function analyzeText() {
  const textInput = document.getElementById('text-input');
  
  if (!textInput) {
    console.error("Could not find text-input element");
    return;
  }
  
  const text = textInput.value;
  
  if (text.trim().length < 500) {
    alert('Please enter a longer text (10,000+ words recommended) for proper analysis.');
    return;
  }
  
  calculateBasicStats(text);
  
  countPronouns(text);
  
  countPrepositions(text);
  
  countIndefiniteArticles(text);
}

function calculateBasicStats(text) {
  
  const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
  const wordCount = text.trim().split(/\s+/).length;
  const spaceCount = (text.match(/\s/g) || []).length;
  const newlineCount = (text.match(/\n/g) || []).length;
  const specialSymbolCount = (text.match(/[^\w\s]/g) || []).length;
  
  const basicStats = document.getElementById('basic-stats');
  if (!basicStats) {
    console.error("Could not find basic-stats element");
    return;
  }
  
  basicStats.innerHTML = `
    <div class="stat-item"><span class="stat-label">Letters:</span> ${letterCount}</div>
    <div class="stat-item"><span class="stat-label">Words:</span> ${wordCount}</div>
    <div class="stat-item"><span class="stat-label">Spaces:</span> ${spaceCount}</div>
    <div class="stat-item"><span class="stat-label">Newlines:</span> ${newlineCount}</div>
    <div class="stat-item"><span class="stat-label">Special Symbols:</span> ${specialSymbolCount}</div>
  `;
}

function countPronouns(text) {
 
  const pronouns = [
    'i', 'me', 'my', 'mine', 'myself',
    'you', 'your', 'yours', 'yourself', 'yourselves',
    'he', 'him', 'his', 'himself',
    'she', 'her', 'hers', 'herself',
    'it', 'its', 'itself',
    'we', 'us', 'our', 'ours', 'ourselves',
    'they', 'them', 'their', 'theirs', 'themselves',
    
    'who', 'whom', 'whose', 'which', 'that',
    
    'this', 'that', 'these', 'those',
    
    'what', 'which', 'who', 'whom', 'whose',
    
    'anybody', 'anyone', 'anything', 'each', 'either', 'everybody', 'everyone', 
    'everything', 'neither', 'nobody', 'none', 'nothing', 'one', 'somebody', 
    'someone', 'something', 'both', 'few', 'many', 'several', 'all', 'any', 
    'most', 'some'
  ];
  
  const pronounCounts = {};
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  words.forEach(word => {
    if (pronouns.includes(word)) {
      pronounCounts[word] = (pronounCounts[word] || 0) + 1;
    }
  });
  
  const pronounStats = document.getElementById('pronoun-stats');
  if (!pronounStats) {
    console.error("Could not find pronoun-stats element");
    return;
  }
  
  pronounStats.innerHTML = '';
  
  if (Object.keys(pronounCounts).length === 0) {
    pronounStats.innerHTML = '<p>No pronouns found.</p>';
    return;
  }
  
  const sortedPronouns = Object.entries(pronounCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15); //
  
  sortedPronouns.forEach(([pronoun, count]) => {
    pronounStats.innerHTML += `
      <div class="stat-item">
        <span class="stat-label">${pronoun}:</span> ${count}
      </div>
    `;
  });
}

function countPrepositions(text) {

  const prepositions = [
    'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
    'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside',
    'besides', 'between', 'beyond', 'by', 'concerning', 'considering', 'despite',
    'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like',
    'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
    'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards', 'under',
    'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
  ];
  
  const prepositionCounts = {};
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  words.forEach(word => {
    if (prepositions.includes(word)) {
      prepositionCounts[word] = (prepositionCounts[word] || 0) + 1;
    }
  });
  
  const prepositionStats = document.getElementById('preposition-stats');
  if (!prepositionStats) {
    console.error("Could not find preposition-stats element");
    return;
  }
  
  prepositionStats.innerHTML = '';
  
  if (Object.keys(prepositionCounts).length === 0) {
    prepositionStats.innerHTML = '<p>No prepositions found.</p>';
    return;
  }
  
  const sortedPrepositions = Object.entries(prepositionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15); 
  
  sortedPrepositions.forEach(([preposition, count]) => {
    prepositionStats.innerHTML += `
      <div class="stat-item">
        <span class="stat-label">${preposition}:</span> ${count}
      </div>
    `;
  });
}

function countIndefiniteArticles(text) {
  const articles = ['a', 'an', 'the', 'some', 'any'];
  
  const articleCounts = {};
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  words.forEach(word => {
    if (articles.includes(word)) {
      articleCounts[word] = (articleCounts[word] || 0) + 1;
    }
  });
  
  const articleStats = document.getElementById('article-stats');
  if (!articleStats) {
    console.error("Could not find article-stats element");
    return;
  }
  
  articleStats.innerHTML = '';
  
  if (Object.keys(articleCounts).length === 0) {
    articleStats.innerHTML = '<p>No indefinite articles found.</p>';
    return;
  }
  
  Object.entries(articleCounts).forEach(([article, count]) => {
    articleStats.innerHTML += `
      <div class="stat-item">
        <span class="stat-label">${article}:</span> ${count}
      </div>
    `;
  });
}