// Script to load content into #content section when a main-nav link is clicked
window.addEventListener('DOMContentLoaded', function() {
    const contentSection = document.getElementById('content');
    // Wait for menu to be loaded dynamically
    function setupNavLinks() {
        const navLinks = document.querySelectorAll('.main-nav a');
        if (!navLinks.length) {
            // Try again shortly if menu hasn't loaded yet
            setTimeout(setupNavLinks, 50);
            return;
        }
        function loadContent(url) {
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    contentSection.innerHTML = html;
                    document.dispatchEvent(new Event('content:updated'));
                })
                .catch(() => {
                    contentSection.innerHTML = '<p>Content could not be loaded.</p>';
                });
        }
        navLinks.forEach(link => {
            link.onclick = function(e) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                const href = this.getAttribute('href');
                if (href === '#home') {
                    loadContent('content/home.html');
                } else if (href === '#workout') {
                    loadContent('content/workout.html');
                } else if (href === '#journal') {
                    loadContent('content/journal.html');
                } else if (href === '#shop') {
                    loadContent('content/shop.html');
                } else if (href === '#about') {
                    loadContent('content/about.html');
                }
            };
        });
        // Optionally, load home.html by default on page load
        loadContent('content/home.html');
    }
    setupNavLinks();
});
