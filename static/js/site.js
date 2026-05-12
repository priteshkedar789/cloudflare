(function(){
  var yearEl = document.getElementById('copy-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var emailEl = document.getElementById('email-link');
  if (emailEl) { var e = 'connect' + '@' + 'roycetruss.com'; emailEl.href = 'mailto:' + e; emailEl.textContent = e; }

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
