// Toggle journal-category menu for mobile
(function() {
  function toggleJournalCategory() {
    var toggleBtn = document.getElementById('journal-category-toggle');
    var catDiv = document.getElementById('journal-category');
    if (!toggleBtn || !catDiv) return;
    toggleBtn.addEventListener('click', function() {
      var isCollapsed = catDiv.classList.toggle('collapsed');
      toggleBtn.setAttribute('aria-expanded', !isCollapsed);
    });
    // By default, collapse on mobile
    function checkMobile() {
      if (window.innerWidth <= 600) {
        catDiv.classList.add('collapsed');
        toggleBtn.style.display = 'block';
      } else {
        catDiv.classList.remove('collapsed');
        toggleBtn.style.display = 'none';
      }
    }
    window.addEventListener('resize', checkMobile);
    checkMobile();
  }
  document.addEventListener('DOMContentLoaded', toggleJournalCategory);
  document.addEventListener('content:updated', toggleJournalCategory);
})();
