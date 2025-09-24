(function() {
  const hideLoginPrompt = () => {
    const selectors = [
      '.yt-upsell-dialog-renderer', // khung popup
      'tp-yt-paper-dialog',        // hộp thoại login
      'ytd-popup-container'        // container overlay
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  };

  // Quan sát DOM, hễ có overlay là xóa liền
  new MutationObserver(hideLoginPrompt).observe(document, {
    childList: true,
    subtree: true
  });
})();
