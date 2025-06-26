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
            // Dynamically load and execute hera-bg-video-parallax.js for parallax video effect
            var script = document.createElement('script');
            script.src = '../scripts/hera-bg-video-parallax.js';
            document.body.appendChild(script);
          }, 0);
        }
        // Re-initialize project section scroll after loading projects.html
        if (filePath.includes('projects.html')) {
          setTimeout(() => {
            if (typeof window.initProjectsSectionScroll === 'function') {
              window.initProjectsSectionScroll();
            }
            // Dynamically load and execute latest-works-carousel.js
            var script1 = document.createElement('script');
            script1.src = '../scripts/latest-works-carousel.js';
            script1.onload = function() {
              if (typeof window.initLatestWorksCarousel === 'function') {
                window.initLatestWorksCarousel();
              }
            };
            document.body.appendChild(script1);
            // Dynamically load and execute other-projects-gallery.js
            var script2 = document.createElement('script');
            script2.src = '../scripts/other-projects-gallery.js';
            script2.onload = function() {
              if (typeof window.initOtherProjectsGallery === 'function') {
                window.initOtherProjectsGallery();
              }
            };
            document.body.appendChild(script2);
          }, 0);
        }
        // Dynamically load and execute services-scroll.js for services.html
        if (filePath.includes('services.html')) {
          setTimeout(() => {
            var script = document.createElement('script');
            script.src = '../scripts/services-scroll.js';
            script.onload = function() {
              if (typeof window.initServicesScroll === 'function') {
                window.initServicesScroll();
              }
            };
            document.body.appendChild(script);
          }, 0);
        }
        // Always load and initialize scroll-animations.js for any main content page
        if (filePath.includes('home.html') || filePath.includes('projects.html') || filePath.includes('services.html')) {
          setTimeout(() => {
            var animScript = document.createElement('script');
            animScript.src = '../scripts/scroll-animations.js';
            animScript.onload = function() {
              if (typeof window.initScrollAnimations === 'function') {
                window.initScrollAnimations();
              }
            };
            document.body.appendChild(animScript);
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
