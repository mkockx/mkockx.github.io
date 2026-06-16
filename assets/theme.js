/* Theme toggle: default to the browser/OS preference; let the user override.
   - No stored choice  -> follow prefers-color-scheme (no data-theme attribute).
   - Stored choice      -> force light/dark via [data-theme] on <html>.
   Applied as early as possible to avoid a flash. */
(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  function current() {
    var attr = root.getAttribute('data-theme');
    if (attr) return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  window.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });

  // reading progress bar (articles only)
  window.addEventListener('DOMContentLoaded', function () {
    var bar = document.getElementById('progress');
    if (!bar) return;
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max * 100) : 0) + '%';
    }
    document.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  });
})();
