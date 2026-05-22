/* ========================================
   WATERFALL MODEL - SCRIPT.JS
   Funzioni di interazione e animazioni
   ======================================== */

// ========================================
// SMOOTH SCROLLING
// ========================================
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Chiudi il menu mobile se aperto
    closeNavMenu();
  }
}

// ========================================
// INTERSECTION OBSERVER - LAZY LOAD ANIMATIONS
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      entry.target.classList.add('in-view');
    }
  });
}, observerOptions);

// Osserva tutti gli elementi che devono avere animazioni
document.addEventListener('DOMContentLoaded', function() {
  // Osserva le cards di vantaggi
  document.querySelectorAll('.advantage-card, .disadvantage-card, .example-card, .when-card').forEach(card => {
    observer.observe(card);
  });

  // Osserva le fasi
  document.querySelectorAll('.phase-card').forEach(card => {
    observer.observe(card);
  });

  // Osserva i timeline items
  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
});

// ========================================
// NAVBAR ACTIVE STATE DURANTE SCROLL
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links span');

window.addEventListener('scroll', function() {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick')?.includes(current)) {
      link.classList.add('active');
    }
  });
});

// ========================================
// PARALLAX EFFECT (HERO SECTION)
// ========================================
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
  });
}

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
const buttons = document.querySelectorAll('.btn-cta, button');
buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// ========================================
// TASTIERA - ACCESSIBILITÀ
// ========================================
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeNavMenu();
  }
});

// ========================================
// TOOLTIP ON HOVER (FUTURE USE)
// ========================================
function createTooltip(element, text) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  document.body.appendChild(tooltip);

  element.addEventListener('mouseenter', function(e) {
    const rect = element.getBoundingClientRect();
    tooltip.style.display = 'block';
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = rect.top - 40 + 'px';
  });

  element.addEventListener('mouseleave', function() {
    tooltip.style.display = 'none';
  });
}

// ========================================
// PERFORMANCE - DEBOUNCE SCROLL LISTENER
// ========================================
let scrollTimeout;
function debounce(func, wait) {
  return function executedFunction(...args) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => func(...args), wait);
  };
}

const debouncedScroll = debounce(function() {
  // Aggiorna lo stato delle sezioni se necessario
}, 250);

// ========================================
// MENU MOBILE TOGGLE (FUTURE IMPLEMENTATION)
// ========================================
function toggleNavMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

function closeNavMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.remove('active');
  }
}

// ========================================
// CONTATORE STATISTICO (ANIMAZIONE NUMERI)
// ========================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const range = target - start;
  const increment = target / (duration / 16);
  let current = start;

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// ========================================
// DARK MODE TOGGLE (OPZIONALE)
// ========================================
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Carica la preferenza salvata
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// ========================================
// COPY LINK TO CLIPBOARD
// ========================================
function copyLinkToClipboard(sectionId) {
  const url = window.location.href.split('#')[0] + '#' + sectionId;
  navigator.clipboard.writeText(url).then(() => {
    showNotification('Link copiato!');
  }).catch(() => {
    showNotification('Errore nel copiare il link', 'error');
  });
}

// ========================================
// NOTIFICHE TOAST
// ========================================
function showNotification(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'success' ? '#2E7D52' : '#8B2635'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    animation: slideInUp 0.3s ease;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========================================
// FORM VALIDATION (SE NECESSARIO)
// ========================================
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;

  const inputs = form.querySelectorAll('input, textarea, select');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#8B2635';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  return isValid;
}

// ========================================
// PRINT-FRIENDLY PAGE
// ========================================
function printPage() {
  window.print();
}

// ========================================
// EXPORT AS PDF (FUTURE)
// ========================================
function exportAsPDF() {
  showNotification('Funzione PDF in sviluppo', 'success');
  // Implementazione con libreria pdf.js o simile
}

// ========================================
// SHARE FUNCTIONALITY
// ========================================
function shareSection(sectionId, title) {
  const url = window.location.href.split('#')[0] + '#' + sectionId;
  
  if (navigator.share) {
    navigator.share({
      title: 'Waterfall Model',
      text: title,
      url: url
    }).catch(err => console.log('Errore sharing:', err));
  } else {
    copyLinkToClipboard(sectionId);
  }
}

// ========================================
// SEARCH FUNCTIONALITY (FUTURE)
// ========================================
function searchContent(query) {
  const sections = document.querySelectorAll('section[id]');
  const results = [];

  sections.forEach(section => {
    const text = section.textContent.toLowerCase();
    if (text.includes(query.toLowerCase())) {
      results.push({
        id: section.id,
        title: section.querySelector('h2')?.textContent || 'Sezione'
      });
    }
  });

  return results;
}

// ========================================
// TABLE OF CONTENTS GENERATOR
// ========================================
function generateTableOfContents() {
  const toc = document.createElement('div');
  toc.className = 'table-of-contents';
  
  const sections = document.querySelectorAll('section[id]');
  const list = document.createElement('ul');

  sections.forEach(section => {
    const h2 = section.querySelector('h2');
    if (h2) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + section.id;
      a.textContent = h2.textContent;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection(section.id);
      });
      li.appendChild(a);
      list.appendChild(li);
    }
  });

  toc.appendChild(list);
  return toc;
}

// ========================================
// READING TIME ESTIMATOR
// ========================================
function estimateReadingTime() {
  const text = document.body.innerText;
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}

// Log reading time al caricamento
window.addEventListener('load', () => {
  const readingTime = estimateReadingTime();
  console.log(`Tempo di lettura stimato: ${readingTime} minuti`);
});

// ========================================
// BACK TO TOP BUTTON
// ========================================
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 999;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(30, 90, 139, 0.3);
  transition: all 0.3s ease;
`;

document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'flex';
  } else {
    backToTopButton.style.display = 'none';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

backToTopButton.addEventListener('mouseenter', () => {
  backToTopButton.style.transform = 'scale(1.1)';
});

backToTopButton.addEventListener('mouseleave', () => {
  backToTopButton.style.transform = 'scale(1)';
});

// ========================================
// LOG PAGE ANALYTICS (PLACEHOLDER)
// ========================================
function logPageView() {
  console.log('Pagina visitata:', document.title);
  console.log('Timestamp:', new Date().toISOString());
}

logPageView();

// ========================================
// PERFORMANCE MONITORING
// ========================================
if ('PerformanceObserver' in window) {
  try {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Performance:', entry);
      }
    });
    perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  } catch (e) {
    console.log('Performance monitoring non supportato');
  }
}

// ========================================
// UTILITY - RANDOM GENERATOR
// ========================================
function getRandomColor() {
  const colors = ['var(--accent)', 'var(--gold)', 'var(--success)', 'var(--danger)'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ========================================
// INIZIALIZZAZIONE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌊 Waterfall Model - Pagina caricata');
  console.log('📖 Tempo di lettura stimato:', estimateReadingTime() + ' minuti');
});
