// [Abstract] toggles on the research page
document.querySelectorAll('.paper button[data-abs]').forEach(function (btn) {
  var paper = btn.closest('.paper'), body = paper.querySelector('.abs');
  btn.addEventListener('click', function () {
    var open = paper.classList.contains('open');
    if (open) {
      body.style.height = body.offsetHeight + 'px';
      paper.classList.remove('open');
      requestAnimationFrame(function () { body.style.height = '0px'; });
      btn.setAttribute('aria-expanded', 'false');
    } else {
      paper.classList.add('open');
      body.style.height = 'auto';
      var h = body.scrollHeight;
      body.style.height = '0px';
      requestAnimationFrame(function () { body.style.height = h + 'px'; });
      body.addEventListener('transitionend', function done() { body.style.height = 'auto'; body.removeEventListener('transitionend', done); });
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});
