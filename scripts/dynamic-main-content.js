// scripts/dynamic-main-content.js
// Dynamically loads content into <main id="main-hera"> based on header nav clicks

document.addEventListener('DOMContentLoaded', function () {
  // Map nav link text to HTML file
  const navMap = {
    'Hera': '../hera/home.html',
    'Latest Works': '../hera/projects.html',
    'Services': '../hera/services.html'
  };

  // Helper to load content
  function loadMainContent(filePath) {
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(html => {
        document.getElementById('main-hera').innerHTML = html;
        // Always re-initialize feedback modal after loading home.html
        if (filePath.includes('home.html')) {
          setTimeout(() => {
            if (typeof window.initFeedbackModal === 'function') {
              window.initFeedbackModal();
            }
            // Initialize home autoscroll after home.html is loaded
            if (typeof window.initHomeAutoscroll === 'function') {
              window.initHomeAutoscroll();
            }
          }, 0);
        }
      })
      .catch(error => {
        document.getElementById('main-hera').innerHTML = '<p>Content failed to load.</p>';
        console.error('Error loading main content:', filePath, error);
      });
  }

  // Attach event listeners to nav links
  const header = document.getElementById('header-hera');
  if (header) {
    header.addEventListener('click', function (e) {
      const target = e.target;
      if (target.tagName === 'A' && navMap[target.textContent.trim()]) {
        e.preventDefault();
        loadMainContent(navMap[target.textContent.trim()]);
        // Set active class
        header.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        target.classList.add('active');
      }
    });
  }

  // Optionally, load home.html by default
  loadMainContent('../hera/home.html');
});
