// Toggle journal-category menu for mobile
(function() {
  let lastHandler = null;
  let lastToggleBtn = null;
  let lastCatDiv = null;
  let resizeHandlerSet = false;
  let outsideClickHandler = null;

  function checkMobile(catDiv, toggleBtn) {
    if (window.innerWidth <= 768) {
      catDiv.classList.add('collapsed');
      toggleBtn.style.display = 'block';
    } else {
      catDiv.classList.remove('collapsed');
      toggleBtn.style.display = 'none';
    }
  }

  function closeMenuOnOutsideClick(catDiv, toggleBtn) {
    if (outsideClickHandler) document.removeEventListener('mousedown', outsideClickHandler);
    outsideClickHandler = function(e) {
      if (!catDiv.classList.contains('collapsed')) {
        if (!catDiv.contains(e.target) && !toggleBtn.contains(e.target)) {
          catDiv.classList.add('collapsed');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    };
    document.addEventListener('mousedown', outsideClickHandler);
  }

  function toggleJournalCategory() {
    const toggleBtn = document.getElementById('journal-category-toggle');
    const catDiv = document.getElementById('journal-category');
    if (!toggleBtn || !catDiv) return;
    // Remove previous click handler if any
    if (lastToggleBtn && lastHandler) lastToggleBtn.removeEventListener('click', lastHandler);
    lastHandler = function(e) {
      catDiv.classList.toggle('collapsed');
      const expanded = !catDiv.classList.contains('collapsed');
      toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (expanded) {
        closeMenuOnOutsideClick(catDiv, toggleBtn);
      }
    };
    toggleBtn.addEventListener('click', lastHandler);
    lastToggleBtn = toggleBtn;
    lastCatDiv = catDiv;
    checkMobile(catDiv, toggleBtn);
    if (!resizeHandlerSet) {
      window.addEventListener('resize', function() {
        // Always re-query in case DOM changed
        const btn = document.getElementById('journal-category-toggle');
        const div = document.getElementById('journal-category');
        if (btn && div) checkMobile(div, btn);
      });
      resizeHandlerSet = true;
    }
    closeMenuOnOutsideClick(catDiv, toggleBtn);
  }
  document.addEventListener('DOMContentLoaded', toggleJournalCategory);
  document.addEventListener('content:updated', toggleJournalCategory);
})();
