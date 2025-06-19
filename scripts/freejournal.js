// Dynamically load the freejournal partial into #freejournal if present
(function() {
  function loadFreeJournalPartial() {
    const ctaDiv = document.getElementById('freejournal');
    if (ctaDiv) {
      fetch('partials/freejournal.html')
        .then(res => res.text())
        .then(html => {
          ctaDiv.outerHTML = html;
          // After loading, re-initialize the modal script if present
          if (typeof setupFreeJournalModal === 'function') {
            setupFreeJournalModal();
          } else if (window.setupFreeJournalModal) {
            window.setupFreeJournalModal();
          }
        });
    }
  }
  // Run on DOMContentLoaded and after dynamic content loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFreeJournalPartial);
  } else {
    loadFreeJournalPartial();
  }
  document.addEventListener('content:updated', loadFreeJournalPartial);
})();
