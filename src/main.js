/**
 * Nebrixa Key — Core Script (Native Edition)
 * Полный функционал: Анимация Hero, Параллакс, Reveal-эффекты,
 * Мобильное меню, Валидация формы, Cookie Popup.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (LUCIDE) ---
  if (window.lucide) {
      lucide.createIcons();
  }

  // --- 2. УЛУЧШЕННОЕ РАСЩЕПЛЕНИЕ ТЕКСТА (HERO) ---
  // Предотвращает разрыв слов при переносе строки
  const splitElements = document.querySelectorAll('.js-split');

  splitElements.forEach(el => {
      const text = el.textContent.trim();
      const words = text.split(' ');
      el.textContent = ''; // Очистка

      words.forEach((word, wordIndex) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'word'; // См. стили white-space: nowrap в CSS

          [...word].forEach((char) => {
              const charSpan = document.createElement('span');
              charSpan.textContent = char;
              charSpan.className = 'char';
              wordSpan.appendChild(charSpan);
          });

          el.appendChild(wordSpan);

          // Добавляем пробел между словами
          if (wordIndex < words.length - 1) {
              el.appendChild(document.createTextNode(' '));
          }
      });

      // Назначаем задержку анимации для каждого символа по порядку
      const allChars = el.querySelectorAll('.char');
      allChars.forEach((char, i) => {
          char.style.transitionDelay = `${i * 0.02}s`;
      });
  });

  // Активация Hero при полной загрузке
  window.addEventListener('load', () => {
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          heroSection.classList.add('is-visible');
      }
  });


  // --- 3. МОБИЛЬНОЕ МЕНЮ ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');

  const toggleMenu = () => {
      if (!burger || !nav) return;
      burger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
  };

  if (burger) burger.addEventListener('click', toggleMenu);
  navLinks.forEach(link => link.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) toggleMenu();
  }));


  // --- 4. СКРОЛЛ ХЕДЕРА ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
      if (header) {
          header.classList.toggle('header--scrolled', window.scrollY > 50);
      }
  });


  // --- 5. НАТИВНЫЙ ПАРАЛЛАКС (MOUSE MOVE) ---
  let mouseX = 0, mouseY = 0;
  const parallaxElements = document.querySelectorAll('.parallax-element');

  document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - window.innerWidth / 2);
      mouseY = (e.clientY - window.innerHeight / 2);
  });

  function updateParallax() {
      parallaxElements.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-speed')) || 0.05;
          const x = mouseX * speed;
          const y = mouseY * speed;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      requestAnimationFrame(updateParallax);
  }

  if (parallaxElements.length > 0) updateParallax();


  // --- 6. REVEAL ON SCROLL (INTERSECTION OBSERVER) ---
  const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('active');
              revealObserver.unobserve(entry.target);
          }
      });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  // --- 7. КОНТАКТНАЯ ФОРМА И КАПЧА ---
  const careerForm = document.getElementById('career-form');
  const captchaLabel = document.getElementById('captcha-question');
  const phoneInput = document.getElementById('phone');
  let captchaResult;

  const generateCaptcha = () => {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      captchaResult = a + b;
      if (captchaLabel) captchaLabel.innerText = `${a} + ${b} = ?`;
  };

  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^\d]/g, ''); // Только цифры
      });
  }

  if (careerForm) {
      generateCaptcha();
      careerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const userAnswer = parseInt(document.getElementById('captcha-answer').value);
          const successMsg = document.getElementById('form-success');
          const errorMsg = document.getElementById('form-error');
          const btn = careerForm.querySelector('.form__submit');

          if (userAnswer !== captchaResult) {
              errorMsg.style.display = 'flex';
              setTimeout(() => errorMsg.style.display = 'none', 3000);
              generateCaptcha();
              return;
          }

          btn.disabled = true;
          const originalBtnHtml = btn.innerHTML;
          btn.innerText = 'Отправка...';

          setTimeout(() => {
              careerForm.reset();
              generateCaptcha();
              btn.disabled = false;
              btn.innerHTML = originalBtnHtml;
              if (window.lucide) lucide.createIcons();
              successMsg.style.display = 'flex';
              setTimeout(() => successMsg.style.display = 'none', 5000);
          }, 1500);
      });
  }


  // --- 8. COOKIE POPUP ---
  const cookiePopup = document.getElementById('cookie-popup');
  const acceptBtn = document.getElementById('accept-cookies');

  if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => cookiePopup.classList.add('show'), 2000);
  }

  if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'true');
          cookiePopup.classList.remove('show');
      });
  }
});