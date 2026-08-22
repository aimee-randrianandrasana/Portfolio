(function () {
  'use strict';

  var sections = document.querySelectorAll('.scroll-page');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var navToggle = document.getElementById('navToggle');
  var navLinksContainer = document.getElementById('navLinks');
  var navbar = document.getElementById('navbar');
  var toast = document.getElementById('toast');

  // Navbar shadow on scroll 
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  // Active nav link on scrol
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) { observer.observe(section); });

  // Mobile nav
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinksContainer.classList.remove('open');
    });
  });

  navToggle.addEventListener('click', function () {
    navLinksContainer.classList.toggle('open');
  });

  document.addEventListener('click', function (e) {
    if (!navLinksContainer.contains(e.target) && !navToggle.contains(e.target)) {
      navLinksContainer.classList.remove('open');
    }
  });

  // Scroll animation
  var animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.anim-fade-up, .anim-pop').forEach(function (el) {
    animObserver.observe(el);
  });

  // Voir plus / moins projet
  var worksGrid = document.getElementById('worksGrid');
  var allCards = worksGrid.querySelectorAll('.work-card');
  var voirPlusBtn = document.getElementById('voirPlusBtn');
  var showingAll = false;

  // Hide all but last 3
  allCards.forEach(function (card, i) {
    if (i < allCards.length - 3) {
      card.classList.add('hidden');
    }
  });

  voirPlusBtn.addEventListener('click', function () {
    showingAll = !showingAll;
    allCards.forEach(function (card, i) {
      if (showingAll) {
        card.classList.remove('hidden');
        card.classList.add('show');
      } else {
        if (i < allCards.length - 3) {
          card.classList.add('hidden');
          card.classList.remove('show');
        }
      }
    });
    voirPlusBtn.innerHTML = showingAll
      ? '<i class="fas fa-eye-slash"></i> Voir moins'
      : '<i class="fas fa-eye"></i> Voir plus';
  });

  // Toas
  function showToast(message, duration, isError) {
    duration = duration || 3000;
    var icon = isError ? 'fa-times-circle' : 'fa-check-circle';
    toast.innerHTML = '<i class="fas ' + icon + '"></i> ' + message;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, duration);
  }

  // Contact form (FormSubmit.co)
  var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/randrianandrasanajeanaimee@gmail.com';
  var contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.disabled = true;
    var payload = {};
    new FormData(contactForm).forEach(function (value, key) {
      payload[key] = value;
    });
    fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (res) {
        if (!res.ok || res.data.error) {
          throw new Error(res.data.error || 'Erreur HTTP');
        }
        showToast('Message envoyé avec succès !');
        contactForm.reset();
      })
      .catch(function () {
        showToast("Erreur lors de l'envoi du message. Réessayez.", 4000, true);
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });

})();
