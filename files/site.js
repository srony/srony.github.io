// Animated abstract open/close
document.querySelectorAll('.abs').forEach(function (abs) {
  var btn = abs.querySelector('button'), body = abs.querySelector('.body');
  btn.addEventListener('click', function () {
    var open = abs.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.style.height = (open ? body.scrollHeight : body.offsetHeight) + 'px';
    if (!open) {
      requestAnimationFrame(function () { body.style.height = '0px'; });
    } else {
      body.addEventListener('transitionend', function h() {
        body.style.height = 'auto';
        body.removeEventListener('transitionend', h);
      });
    }
  });
});

// Highlight the section in view in the top bar
var navLinks = document.querySelectorAll('nav a[data-sec]');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        navLinks.forEach(function (l) { l.classList.toggle('active', l.dataset.sec === e.target.id); });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section').forEach(function (s) { io.observe(s); });
}
