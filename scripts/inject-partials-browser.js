// scripts/inject-partials-browser.js
// Browser-based script to inject header and footer partials into index.html

document.addEventListener('DOMContentLoaded', function () {
  // Helper to fetch and inject partial
  function injectPartial(selector, partialPath) {
    fetch(partialPath)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(html => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = html;
      })
      .catch(error => {
        console.error('Error loading partial:', partialPath, error);
      });
  }

  injectPartial('#header-hera', '../partials/header-hera.html');
  injectPartial('#footer-hera', '../partials/footer-hera.html');
});
