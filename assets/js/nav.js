(() => {
  const toggle = document.querySelector('.menu-toggle');
  const mobile = document.querySelector('#mobile-nav');
  if (!toggle || !mobile) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    mobile.hidden = open;
    toggle.textContent = open ? 'Menu' : 'Close';
  });
  mobile.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    mobile.hidden = true;
    toggle.textContent = 'Menu';
  }));
})();
