(function() {
  function loadInquirePartial() {
    const ctaDiv = document.getElementById('inquire');
    if (ctaDiv) {
      fetch('partials/inquire.html')
        .then(res => res.text())
        .then(html => {
          ctaDiv.outerHTML = html;
          // Wait for DOM update before calling setupInquireModal
          setTimeout(() => {
            if (typeof setupInquireModal === 'function') {
              setupInquireModal();
            } else if (window.setupInquireModal) {
              window.setupInquireModal();
            }
          }, 0);
        });
    }
  }
  // Run on DOMContentLoaded and after dynamic content loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInquirePartial);
  } else {
    loadInquirePartial();
  }
  document.addEventListener('content:updated', loadInquirePartial);
})();
