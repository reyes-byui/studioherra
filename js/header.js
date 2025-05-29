// Script to load the header partial into the page
window.addEventListener('DOMContentLoaded', function() {
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            const headerContainer = document.createElement('div');
            headerContainer.innerHTML = data;
            document.body.insertBefore(headerContainer, document.body.firstChild);
            // After header is loaded, load journalnav.html into the header if not already included
            const headerEl = headerContainer.querySelector('#header');
            if (headerEl && !headerEl.querySelector('.journal-categories')) {
                fetch('partials/journalnav.html')
                    .then(res => res.text())
                    .then(journalNavHtml => {
                        headerEl.insertAdjacentHTML('afterbegin', journalNavHtml);
                    });
            }
            // --- Light/Dark mode logic ---
            function setMode(mode) {
                if (mode === 'dark') {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('color-mode', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('color-mode', 'light');
                }
                // Also add/remove dark-mode class on <main> and <footer>
                var main = document.querySelector('main');
                var footer = document.querySelector('footer');
                if (main) {
                  if (mode === 'dark') main.classList.add('dark-mode');
                  else main.classList.remove('dark-mode');
                }
                if (footer) {
                  if (mode === 'dark') footer.classList.add('dark-mode');
                  else footer.classList.remove('dark-mode');
                }
            }
            // Initial mode from localStorage
            const saved = localStorage.getItem('color-mode');
            if (saved === 'dark') setMode('dark');
            else setMode('light');
            // Attach event listeners to icons
            const lightIcon = document.querySelector('.light-dark-mode .light-mode');
            const darkIcon = document.querySelector('.light-dark-mode .dark-mode');
            if (lightIcon) {
                lightIcon.addEventListener('click', function() { setMode('light'); });
            }
            if (darkIcon) {
                darkIcon.addEventListener('click', function() { setMode('dark'); });
            }
            // --- End Light/Dark mode logic ---
        })
        .catch(error => console.error('Error loading header:', error));
});
// Script to load the menu partial into the #main-nav div in the header
window.addEventListener('DOMContentLoaded', function() {
    fetch('partials/menu.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-nav').innerHTML = html;
        })
        .catch(() => {
            document.getElementById('main-nav').innerHTML = '<p>Menu could not be loaded.</p>';
        });
});
// Script to load the journalnav partial into the #journalnav div in the header
window.addEventListener('DOMContentLoaded', function() {
    fetch('partials/journalnav.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('journalnav').innerHTML = html;
        })
        .catch(() => {
            document.getElementById('journalnav').innerHTML = '<p>Categories could not be loaded.</p>';
        });
});
document.addEventListener('DOMContentLoaded', function() {
    // Activate main nav 'journal' when a category link is clicked
    document.body.addEventListener('click', function(e) {
        const catLink = e.target.closest('#journal-category a');
        if (catLink) {
            e.preventDefault();
            // Determine which file to load based on the category link
            let fileToLoad = 'content/journal.html';
            let navToActivate = '#journal';
            if (catLink.getAttribute('href') === '#workout') {
                fileToLoad = 'content/workout.html';
                navToActivate = '#workout';
            }
            // Activate the correct nav link
            const navLinks = document.querySelectorAll('.main-nav a');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === navToActivate) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            // Load the correct file into #content
            fetch(fileToLoad)
                .then(res => res.text())
                .then(html => {
                    document.getElementById('content').innerHTML = html;
                    setTimeout(() => {
                        // If loading journal.html, set the category name and scroll
                        if (fileToLoad === 'content/journal.html') {
                            const catName = catLink.textContent.trim();
                            const catHeader = document.querySelector('#content .categoryname');
                            if (catHeader) catHeader.textContent = catName;
                            const journalSection = document.getElementById('journal');
                            if (journalSection) {
                                journalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        } else if (fileToLoad === 'content/workout.html') {
                            // For workout, scroll to the #shop or #workout section if present
                            const workoutSection = document.getElementById('workout');
                            if (workoutSection) {
                                workoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    }, 50);
                });
        }
    });
    // Slide-in widget logic
    document.body.addEventListener('click', function(e) {
        const widgetLink = e.target.closest('a[href="partials/widget.html"]');
        if (widgetLink) {
            e.preventDefault();
            // If widget already exists, just show it
            let widgetPanel = document.getElementById('slide-widget-panel');
            if (!widgetPanel) {
                widgetPanel = document.createElement('div');
                widgetPanel.id = 'slide-widget-panel';
                widgetPanel.innerHTML = '<div class="slide-widget-content"></div><button class="close-widget" aria-label="Close widget">&times;</button>';
                document.body.appendChild(widgetPanel);
            }
            // Load widget.html into the panel
            fetch('partials/widget.html')
                .then(res => res.text())
                .then(html => {
                    widgetPanel.querySelector('.slide-widget-content').innerHTML = html;
                    widgetPanel.classList.add('open');
                });
        }
        // Close widget logic
        if (e.target.classList.contains('close-widget')) {
            const widgetPanel = document.getElementById('slide-widget-panel');
            if (widgetPanel) widgetPanel.classList.remove('open');
        }
    });
});

// Ensure main-nav active class is set after menu is loaded
function activateMainNavByHash() {
    const hash = window.location.hash || '#home';
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
// Run after menu is loaded
window.addEventListener('DOMContentLoaded', function() {
    // Wait for menu to be loaded
    function waitForMenuAndActivate() {
        if (document.querySelectorAll('.main-nav a').length) {
            activateMainNavByHash();
            window.addEventListener('hashchange', activateMainNavByHash);
        } else {
            setTimeout(waitForMenuAndActivate, 50);
        }
    }
    waitForMenuAndActivate();
});
