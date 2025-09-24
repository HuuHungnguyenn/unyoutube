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
      // watch?v=ID
      if (u.pathname === '/watch') {
        const v = u.searchParams.get('v');
        if (v) return v;
      }
      // shorts/ID
      if (u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/')[2];
      }
      // youtu.be/ID (Edge đôi khi mở qua redirect)
      // (Trường hợp này thường không match vì chỉ chạy trên youtube.com,
      //  nhưng để dành nếu sau này mở rộng host_permissions)
      if (u.hostname === 'youtu.be') {
        return u.pathname.slice(1);
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
      // bpctr hack cũ: giữ lại phòng trường hợp cần
      bpctr: '9999999999',
      playsinline: '1'
    });
    location.replace(`https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`);
  };

  const looksUnavailable = () => {
    // Dấu hiệu player lỗi/blocked
    if (document.querySelector('.ytp-error')) return true;
    // Dòng chữ “Video không có sẵn”/“Video unavailable”
    const text = document.body.innerText || '';
    if (/Video không có sẵn|Video unavailable/i.test(text)) return true;
    // Player khởi tạo nhưng bị che/stop
    const player = document.querySelector('#movie_player');
    if (player && player.classList.contains('ytp-error')) return true;
    return false;
  };

  // 1) Dọn overlay ngay từ đầu
  removeOverlays();

  // 2) Quan sát DOM liên tục: hễ overlay bật lại thì xóa, nếu thấy lỗi → nhảy embed
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

  // 3) Thêm timeout phòng trường hợp error xuất hiện trễ
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
