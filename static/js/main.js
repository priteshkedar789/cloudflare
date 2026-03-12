/*
FIX [CODE/MAJOR]: Entire script wrapped in IIFE to prevent all variables
leaking to the global window scope.
classList.add('js') has been moved to an inline <script> in <head>.
*/
(function () {
'use strict';

/* ── Copyright year ─────────────────────────────────────────── */
document.getElementById('copy-year').textContent = new Date().getFullYear();

/* ── Email link ─────────────────────────────────────────────── */
/*
  FIX [SEC/MAJOR]: JS is now sole source of the email href AND textContent.
  The CF-obfuscated span was removed from HTML.
*/
(function () {
  var el = document.getElementById('email-link');
  if (el) {
    var addr = 'hello' + '@' + 'roycetruss.com';
    el.href = 'mailto:' + addr;
    el.textContent = addr;
  }
}());

/* ── Scroll reveal — IntersectionObserver ───────────────────── */
var reveals = document.querySelectorAll('.reveal');
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      /* Performance: unobserve once visible */
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(function (el) { revealObserver.observe(el); });

/* ── Nav scroll shadow + sticky CTA ────────────────────────── */
var stickyCta  = document.getElementById('sticky-cta');
var stickyBtn  = stickyCta.querySelector('.sticky-btn');
var mainNav    = document.getElementById('mainNav');

/*
  FIX [A11y/CRITICAL]: aria-hidden initialised via JS (not static HTML) so
  AT state is always JS-controlled and never parser-dependent.
*/
stickyCta.setAttribute('aria-hidden', 'true');

window.addEventListener('scroll', function () {
  mainNav.classList.toggle('scrolled', window.scrollY > 40);

  /*
    FIX [UX/MAJOR]: Threshold lowered from 0.65 to 0.35 so the persistent
    CTA becomes visible after the About section, not the Portfolio section.
  */
  var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  var shouldShow = pct > 0.35;
  stickyCta.classList.toggle('visible', shouldShow);
  stickyCta.setAttribute('aria-hidden', String(!shouldShow));
  stickyBtn.setAttribute('tabindex', shouldShow ? '0' : '-1');
}, { passive: true });

/* ── Mobile menu ────────────────────────────────────────────── */
var hamburgerBtn = document.getElementById('hamburgerBtn');
var navLinks     = document.getElementById('navLinks');

function toggleMenu() {
  var isOpen = navLinks.classList.contains('nav-open');
  navLinks.classList.toggle('nav-open', !isOpen);
  hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
}

hamburgerBtn.addEventListener('click', toggleMenu);

window.addEventListener('resize', function () {
  if (window.innerWidth > 768) {
    navLinks.classList.remove('nav-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});

/* ── Contact form → Google Sheets via Apps Script ───────────── */
var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwEt7DglGeDUwd9HaeGGNjeAP5baiLVJvdBLrKqcYry9htz6d2FGkDXOczx35un1qWhmg/exec';
var EMAIL_RE      = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
  FIX [CODE/MINOR]: Field NodeList cached once at initialisation rather
  than being recalculated on every form submission.
*/
var formFields = document.querySelectorAll(
  '#contactFormWrap input, #contactFormWrap select, #contactFormWrap textarea'
);

function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(function (el) {
    el.classList.remove('visible');
    el.textContent = '';
  });
  formFields.forEach(function (el) {
    el.classList.remove('invalid');
  });
}

function showFieldError(inputId, errId, msg) {
  var input = document.getElementById(inputId);
  var err   = document.getElementById(errId);
  if (input) { input.classList.add('invalid'); }
  if (err)   { err.textContent = msg; err.classList.add('visible'); }
}

/*
  FIX [SEC/MAJOR]: Basic client-side sanitization strips HTML tags from
  user input before submission.
*/
function sanitize(str) {
  return str.replace(/<[^>]*>/g, '');
}

async function submitForm() {
  clearFormErrors();

  var name  = document.getElementById('f-name').value.trim();
  var org   = document.getElementById('f-org').value.trim();
  var type  = document.getElementById('f-type').value;
  var email = document.getElementById('f-email').value.trim();
  var msg   = sanitize(document.getElementById('f-msg').value.trim());

  var valid = true;
  if (!name) {
    showFieldError('f-name', 'err-name', 'Please enter your name.');
    valid = false;
  }
  if (!email || !EMAIL_RE.test(email)) {
    showFieldError('f-email', 'err-email', 'Please enter a valid email address.');
    valid = false;
  }
  if (!valid) { return; }

  var btn = document.getElementById('submitBtn');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    var formData = new FormData();
    formData.append('name',    name);
    formData.append('org',     org);
    formData.append('type',    type);
    formData.append('email',   email);
    formData.append('message', msg);

    await fetch(FORM_ENDPOINT, {
      method: 'POST',
      mode:   'no-cors',  /* Skips CORS preflight — Apps Script limitation */
      body:   formData
    });

    /* no-cors returns opaque response (status 0) — reaching here means
       the request was dispatched successfully; treat as success */
    document.getElementById('contactFormWrap').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';

  } catch (err) {
    document.getElementById('formError').style.display = 'block';
  } finally {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }
}

/*
  FIX [CODE/MAJOR + UX/MAJOR]: Form submit event replaces button click,
  enabling native Enter-to-submit behaviour.
  FIX [CODE/CRITICAL]: Unhandled Promise rejection caught explicitly.
*/
var contactForm = document.getElementById('contactFormWrap');
contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  submitForm().catch(function () {
    document.getElementById('formError').style.display = 'block';
  });
});

/* FIX [UX/MINOR]: "Send another message" resets the form to initial state */
var resetFormBtn = document.getElementById('resetFormBtn');
if (resetFormBtn) {
  resetFormBtn.addEventListener('click', function () {
    var form = document.getElementById('contactFormWrap');
    form.reset();
    form.style.display = '';
    clearFormErrors();
    document.getElementById('formSuccess').style.display = 'none';
    document.getElementById('formError').style.display  = 'none';
  });
}

}());
