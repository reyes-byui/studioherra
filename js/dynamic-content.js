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
        navLinks.forEach(link => {
            link.onclick = function(e) {
                e.preventDefault();
                window.location.hash = this.getAttribute('href');
                // Do not load content directly here; let the hashchange handler do it
            };
        });
    }
    setupNavLinks();

    function loadContentByHash() {
        const hash = window.location.hash || '#home';
        let url = '';
        if (hash === '#home') url = 'content/home.html';
        else if (hash === '#workout') url = 'content/workout.html';
        else if (hash === '#journal') url = 'content/journal.html';
        else if (hash === '#shop') url = 'content/shop.html';
        else if (hash === '#about') url = 'content/about.html';
        else url = 'content/home.html';
        const contentSection = document.getElementById('content');
        if (!contentSection) {
            console.error('No #content element found in DOM!');
            return;
        }
        console.log('Loading content for hash:', hash, 'from', url);
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

    // Initial content load
    loadContentByHash();

    // Load content when hash changes
    window.addEventListener('hashchange', loadContentByHash);
});
