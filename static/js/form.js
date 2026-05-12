(function(){
  var form = document.getElementById('contactFormWrap');
  var successEl = document.getElementById('formSuccess');
  var errorEl = document.getElementById('formError');
  var submitBtn = document.getElementById('submitBtn');
  var resetBtn = document.getElementById('resetFormBtn');

  if (!form) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var valid = true;
    ['f-name', 'f-email', 'f-type'].forEach(function(id){
      var input = document.getElementById(id);
      var errEl = document.getElementById(id.replace('f-', 'err-'));
      var empty = !input.value.trim();
      var emailBad = id === 'f-email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      if (empty || emailBad) {
        input.classList.add('invalid');
        if (errEl) { errEl.textContent = empty ? 'This field is required.' : 'Please enter a valid email.'; errEl.classList.add('visible'); }
        valid = false;
      } else {
        input.classList.remove('invalid');
        if (errEl) errEl.classList.remove('visible');
      }
    });
    if (!valid) { document.querySelector('.invalid').focus(); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', { method: 'POST', body: new FormData(form) })
      .then(function(){ form.style.display = 'none'; successEl.style.display = 'block'; })
      .catch(function(){ errorEl.style.display = 'block'; submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function(){
      form.reset(); form.style.display = 'block';
      successEl.style.display = 'none'; errorEl.style.display = 'none';
      submitBtn.disabled = false; submitBtn.textContent = 'Send Message';
    });
  }
})();
