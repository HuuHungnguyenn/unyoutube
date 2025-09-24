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
      if (u.pathname === '/watch') return u.searchParams.get('v');
      if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2];
    } catch (_) {}
    return null;
  };

  // tránh loop redirect
  const getFlag = (k) => sessionStorage.getItem(k) === '1';
  const setFlag = (k) => sessionStorage.setItem(k, '1');

  const toEmbed = (id) => {
    if (!id || getFlag('did_embed')) return;
    setFlag('did_embed');
    const params = new URLSearchParams({
      autoplay: '1',
      hl: 'vi',
      has_verified: '1',
      bpctr: '9999999999',
      playsinline: '1'
    });
    location.replace(`https://www.youtube.com/embed/${id}?${params.toString()}`);
  };

  const toMobile = (id) => {
    if (!id || getFlag('did_mobile')) return;
    setFlag('did_mobile');
    const params = new URLSearchParams({
      hl: 'vi',
      has_verified: '1',
      bpctr: '9999999999'
    });
    location.replace(`https://m.youtube.com/watch?v=${id}&${params.toString()}`);
  };

  const looksUnavailable = () => {
    if (document.querySelector('.ytp-error')) return true;
    const text = (document.body.innerText || '').toLowerCase();
    if (text.includes('video không có sẵn') || text.includes('video unavailable')) return true;
    return false;
  };

  removeOverlays();

  const tryFallbacks = () => {
    const id = getVideoId();
    if (!id) return;

    // tier 1: embed
    if (!getFlag('did_embed')) {
      toEmbed(id);
      return;
    }
    // tier 2: mobile watch
    if (!getFlag('did_mobile')) {
      toMobile(id);
      return;
    }

    // tier 3: hết cách trong phạm vi chính chủ không login
    if (!getFlag('told_hardblock')) {
      setFlag('told_hardblock');
      alert('Không thể phát video này mà không đăng nhập. Có thể bị chặn nhúng/age-restricted/region. (Lỗi 4)');
    }
  };

  const obs = new MutationObserver(() => {
    removeOverlays();
    if (looksUnavailable()) tryFallbacks();
  });

  obs.observe(document, { childList: true, subtree: true });

  // phòng khi lỗi hiện trễ
  setTimeout(() => {
    if (looksUnavailable()) tryFallbacks();
  }, 1200);
})();
