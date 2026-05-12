(function(){
  var yearEl = document.getElementById('copy-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var _e = atob('Y29ubmVjdEByb3ljZXRydXNzLmNvbQ==');
  var _p = atob('KzkxIDg0MDc5IDc5Nzg5');
  var _ph = atob('KzkxODQwNzk3OTc4OQ==');
  var _wa = atob('aHR0cHM6Ly93YS5tZS85MTg0MDc5Nzk3ODk=');
  var _wal = atob('V2hhdHNBcHA6ICs5MSA4NDA3OSA3OTc4OQ==');

  document.querySelectorAll('.js-email').forEach(function(el){ el.href = 'mailto:' + _e; el.textContent = _e; });
  document.querySelectorAll('.js-phone').forEach(function(el){ el.href = 'tel:' + _ph; el.textContent = _p; });
  document.querySelectorAll('.js-wa').forEach(function(el){ el.href = _wa; el.textContent = _wal; });

  var emailEl = document.getElementById('email-link');
  if (emailEl) { emailEl.href = 'mailto:' + _e; emailEl.textContent = _e; }
  var emailFb = document.getElementById('email-link-fallback');
  if (emailFb) { emailFb.href = 'mailto:' + _e; emailFb.textContent = _e; }
  var phoneEl = document.getElementById('phone-link');
  if (phoneEl) { phoneEl.href = 'tel:' + _ph; phoneEl.textContent = _p; }
  var waEl = document.getElementById('wa-link');
  if (waEl) { waEl.href = _wa; waEl.textContent = _wal; }

  var nav = document.getElementById('mainNav');
  var stickyCTA = document.getElementById('sticky-cta');
  if (nav) {
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 20);
      if (stickyCTA) {
        var show = window.scrollY > 400;
        stickyCTA.classList.toggle('visible', show);
        stickyCTA.setAttribute('aria-hidden', show ? 'false' : 'true');
        var a = stickyCTA.querySelector('a');
        if (a) a.tabIndex = show ? 0 : -1;
      }
    }, { passive: true });
  }

  var btn = document.getElementById('hamburgerBtn');
  var links = document.getElementById('navLinks');

  function closeMenu() {
    links.classList.remove('nav-open');
    btn.classList.remove('nav-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  if (btn && links && nav) {
    btn.addEventListener('click', function(){
      var open = links.classList.toggle('nav-open');
      btn.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open);
    });

    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && links.classList.contains('nav-open')) {
        closeMenu();
        btn.focus();
      }
    });

    document.addEventListener('click', function(e){
      if (!nav.contains(e.target)) closeMenu();
    });
  }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('visible'); });
  }
})();
