(() => {
  const lang = document.documentElement.lang || 'zh';
  document.documentElement.dataset.lang = lang;
  document.querySelectorAll('[data-lang-switch]').forEach((switcher) => {
    switcher.addEventListener('click', () => {
      try { localStorage.setItem('preferred-language', switcher.dataset.target || (lang === 'zh' ? 'en' : 'zh')); } catch (_) {}
    });
  });
  document.querySelectorAll('form.demo-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button');
      if (button) button.textContent = lang === 'zh' ? '已收到，謝謝 →' : 'Received, thank you →';
    });
  });
})();
