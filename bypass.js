(function() {
  const SELECTORS = [
    '.yt-upsell-dialog-renderer',
    'tp-yt-paper-dialog',
    'ytd-popup-container'
  ];

  const removeOverlays = () => {
    SELECTORS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  };

  const getVideoId = () => {
    try {
      const u = new URL(location.href);
      if (u.pathname === '/watch') {
        return u.searchParams.get('v');
      }
      if (u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/')[2];
      }
    } catch (e) {}
    return null;
  };

  const toEmbed = (id) => {
    if (!id) return;
    const params = new URLSearchParams({
      autoplay: '1',
      hl: 'vi',
      has_verified: '1',
      bpctr: '9999999999',
      playsinline: '1'
    });
    location.replace(`https://www.youtube.com/embed/${id}?${params.toString()}`);
  };

  const looksUnavailable = () => {
    if (document.querySelector('.ytp-error')) return true;
    const text = document.body.innerText || '';
    if (/Video không có sẵn|Video unavailable/i.test(text)) return true;
    return false;
  };

  removeOverlays();

  const obs = new MutationObserver(() => {
    removeOverlays();
    if (looksUnavailable()) {
      const id = getVideoId();
      if (id) {
        obs.disconnect();
        toEmbed(id);
      }
    }
  });

  obs.observe(document, { childList: true, subtree: true });

  setTimeout(() => {
    if (looksUnavailable()) {
      const id = getVideoId();
      if (id) {
        obs.disconnect();
        toEmbed(id);
      }
    }
  }, 1500);
})();
