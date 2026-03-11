// Security + Responsiveness: mark JS as available so CSS can scope nav hiding
  document.documentElement.classList.add('js');

  // Code quality: copyright year
  document.getElementById('copy-year').textContent = new Date().getFullYear();

  // Security: construct email href at runtime so no address appears in static HTML
  (function() {
    var el = document.getElementById('email-link');
    if (el) {
      el.href = 'mail' + 'to:' + 'hello' + '@' + 'roycetruss.com';
    }
  })();

  // Scroll reveal — IntersectionObserver
  var reveals = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Performance: unobserve once visible to prevent observer staying active
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(function(el) { observer.observe(el); });

  // Nav scroll shadow + sticky CTA — passive listener for scroll performance
  var stickyCta = document.getElementById('sticky-cta');
  var stickyBtn = stickyCta.querySelector('.sticky-btn');
  window.addEventListener('scroll', function() {
    document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 40);
    // UX: sticky CTA trigger changed from 0.4 to 0.65 (after user has seen portfolio)
    var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    var shouldShow = pct > 0.65;
    stickyCta.classList.toggle('visible', shouldShow);
    stickyCta.setAttribute('aria-hidden', String(!shouldShow));
    // Accessibility: tabindex toggled with visibility
    stickyBtn.setAttribute('tabindex', shouldShow ? '0' : '-1');
  }, { passive: true });

  // Mobile menu — Security: was inline onclick, now addEventListener
  // Code quality: uses .nav-open CSS class instead of inline style mutation
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var navLinks = document.getElementById('navLinks');

  function toggleMenu() {
    var isOpen = navLinks.classList.contains('nav-open');
    navLinks.classList.toggle('nav-open', !isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
  }

  hamburgerBtn.addEventListener('click', toggleMenu);

  // Code quality: reset mobile menu state on resize to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      navLinks.classList.remove('nav-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // ─── CONTACT FORM → Formspree ───
  // Replace %%FORMSPREE_FORM_ID%% with your real form ID before deploying.
  var FORM_ENDPOINT = 'https://formspree.io/f/%%FORMSPREE_FORM_ID%%';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearFormErrors() {
    document.querySelectorAll('.field-error').forEach(function(el) {
      el.classList.remove('visible');
      el.textContent = '';
    });
    document.querySelectorAll('#contactFormWrap input, #contactFormWrap select, #contactFormWrap textarea').forEach(function(el) {
      el.classList.remove('invalid');
    });
  }

  function showFieldError(inputId, errId, msg) {
    var input = document.getElementById(inputId);
    var err = document.getElementById(errId);
    if (input) input.classList.add('invalid');
    if (err) { err.textContent = msg; err.classList.add('visible'); }
  }

  // Security: was inline onclick; now addEventListener
  var submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', submitForm);

  async function submitForm() {
    clearFormErrors();

    var name  = document.getElementById('f-name').value.trim();
    var org   = document.getElementById('f-org').value.trim();
    var type  = document.getElementById('f-type').value;
    var email = document.getElementById('f-email').value.trim();
    var msg   = document.getElementById('f-msg').value.trim();

    // Code quality / UX: inline validation; no alert()
    var valid = true;
    if (!name) {
      showFieldError('f-name', 'err-name', 'Please enter your name.');
      valid = false;
    }
    if (!email || !EMAIL_RE.test(email)) {
      showFieldError('f-email', 'err-email', 'Please enter a valid email address.');
      valid = false;
    }
    if (!valid) return;

    var btn = document.getElementById('submitBtn');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      var res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        // Security: honeypot value included; Formspree will discard submissions where _gotcha is filled
        body: JSON.stringify({ name: name, org: org, type: type, email: email, message: msg, _gotcha: '' })
      });

      if (res.ok) {
        document.getElementById('contactFormWrap').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        document.getElementById('formError').style.display = 'block';
      }
    } catch (err) {
      document.getElementById('formError').style.display = 'block';
    } finally {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  }
