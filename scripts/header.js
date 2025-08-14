// Optimized and refactored header.js
function applySavedMode() {
    const saved = localStorage.getItem('color-mode');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function loadHeaderAndMenu() {
    // Remove any existing header to avoid duplicates
    const oldHeader = document.getElementById('header');
    if (oldHeader) oldHeader.remove();

    // Create a new header container
    const headerContainer = document.createElement('header');
    headerContainer.id = 'header';
    document.body.insertBefore(headerContainer, document.body.firstChild);

    // Load header partial
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            headerContainer.innerHTML = data;
            // Load menu partial into #main-nav
            const nav = headerContainer.querySelector('#main-nav');
            if (nav) {
                fetch('partials/menu.html')
                    .then(resp => resp.text())
                    .then(menuHtml => {
                        nav.innerHTML = menuHtml;
                        applySavedMode(); // Always apply mode after header/menu load
                        setTimeout(() => {
                            const lightIcon = document.querySelector('.light-dark-mode .light-mode');
                            const darkIcon = document.querySelector('.light-dark-mode .dark-mode');
                            if (lightIcon) lightIcon.addEventListener('click', () => {
                                document.body.classList.remove('dark-mode');
                                localStorage.setItem('color-mode', 'light');
                            });
                            if (darkIcon) darkIcon.addEventListener('click', () => {
                                document.body.classList.add('dark-mode');
                                localStorage.setItem('color-mode', 'dark');
                            });
                            activateMainNavByHash(); // Ensure active nav is set after menu loads
                        }, 100);
                    });
            } else {
                applySavedMode();
            }
        });
}

window.addEventListener('DOMContentLoaded', loadHeaderAndMenu);
window.addEventListener('hashchange', loadHeaderAndMenu);

// Hide .home-hero on all pages except index.html (homepage)
function updateHomeHeroVisibility() {
    var hero = document.querySelector('.home-hero');
    // Check if #content contains content/home.html (assume loaded via AJAX)
    var content = document.getElementById('content');
    if (!hero) return;
    if (content && content.innerHTML.includes('id="home"')) {
        hero.style.display = '';
    } else {
        hero.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', updateHomeHeroVisibility);
window.addEventListener('hashchange', updateHomeHeroVisibility);
document.addEventListener('content:updated', updateHomeHeroVisibility);

// Light/Dark mode logic
function setMode(mode) {
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('color-mode', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('color-mode', 'light');
    }
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    if (main) main.classList.toggle('dark-mode', mode === 'dark');
    if (footer) footer.classList.toggle('dark-mode', mode === 'dark');
}
const saved = localStorage.getItem('color-mode');
setMode(saved === 'dark' ? 'dark' : 'light');
// Attach event listeners to icons
setTimeout(() => {
    const lightIcon = document.querySelector('.light-dark-mode .light-mode');
    const darkIcon = document.querySelector('.light-dark-mode .dark-mode');
    if (lightIcon) lightIcon.addEventListener('click', () => setMode('light'));
    if (darkIcon) darkIcon.addEventListener('click', () => setMode('dark'));
}, 100);

// Load journalnav partial
fetch('partials/journalnav.html')
    .then(response => response.text())
    .then(html => {
        const journalNav = document.getElementById('journalnav');
        if (journalNav) journalNav.innerHTML = html;
    })
    .catch(() => {
        const journalNav = document.getElementById('journalnav');
        if (journalNav) journalNav.innerHTML = '<p>Categories could not be loaded.</p>';
    });

// Event delegation for category links and widget
document.body.addEventListener('click', function(e) {
    // Category navigation
    const catLink = e.target.closest('#journal-category a');
    if (catLink) {
        e.preventDefault();
        let fileToLoad = 'content/journal.html';
        let navToActivate = '#journal';
        if (catLink.getAttribute('href') === '#workout') {
            fileToLoad = 'content/workout.html';
            navToActivate = '#workout';
        }
        // Activate nav link
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === navToActivate);
        });
        // Load content
        fetch(fileToLoad)
            .then(res => res.text())
            .then(html => {
                const content = document.getElementById('content');
                if (content) content.innerHTML = html;
                setTimeout(() => {
                    if (fileToLoad === 'content/journal.html') {
                        const catName = catLink.textContent.trim();
                        const catHeader = document.querySelector('#content .categoryname');
                        if (catHeader) catHeader.textContent = catName;
                        const journalSection = document.getElementById('journal');
                        if (journalSection) journalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else if (fileToLoad === 'content/workout.html') {
                        const workoutSection = document.getElementById('workout');
                        if (workoutSection) workoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Automatically select Full-Body category
                        setTimeout(() => {
                            const fullBodyLink = document.querySelector('#workout-category a[data-category="Full-Body"]');
                            if (fullBodyLink) {
                                fullBodyLink.click();
                            }
                        }, 100);
                    }
                }, 50);
            });
    }
    // Slide-in widget logic
    const widgetLink = e.target.closest('a[href="partials/widget.html"]');
    if (widgetLink) {
        e.preventDefault();
        let widgetPanel = document.getElementById('slide-widget-panel');
        if (!widgetPanel) {
            widgetPanel = document.createElement('div');
            widgetPanel.id = 'slide-widget-panel';
            widgetPanel.innerHTML = '<div class="slide-widget-content"></div><button class="close-widget" aria-label="Close widget">&times;</button>';
            document.body.appendChild(widgetPanel);
        }
        fetch('partials/widget.html')
            .then(res => res.text())
            .then(html => {
                widgetPanel.querySelector('.slide-widget-content').innerHTML = html;
                widgetPanel.classList.add('open');
                enableWidgetAutoClose(widgetPanel);
            });
    }
    // Close widget
    if (e.target.classList.contains('close-widget')) {
        const widgetPanel = document.getElementById('slide-widget-panel');
        if (widgetPanel) widgetPanel.classList.remove('open');
    }
});

// Close widget when a .column-title h2 is clicked
// (delegated event handler)
document.body.addEventListener('click', function(e) {
    const h2 = e.target.closest('.column-title h2');
    if (h2) {
        const widgetPanel = document.getElementById('slide-widget-panel');
        if (widgetPanel && widgetPanel.classList.contains('open')) {
            widgetPanel.classList.remove('open');
        }
    }
});

// Automatically close widget when clicking outside
function enableWidgetAutoClose(widgetPanel) {
    function handleOutsideClick(event) {
        // If click is outside widgetPanel, not the open link, and not a .column-title a
        if (
            widgetPanel.classList.contains('open') &&
            !widgetPanel.contains(event.target) &&
            !event.target.closest('a[href="partials/widget.html"]') &&
            !event.target.closest('.column-title a')
        ) {
            widgetPanel.classList.remove('open');
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }
    setTimeout(() => {
        document.addEventListener('mousedown', handleOutsideClick);
    }, 0);
}

// Activate main nav by hash
function activateMainNavByHash() {
    const hash = window.location.hash || '#home';
    document.querySelectorAll('.main-nav a').forEach(link => {
        const isActive = link.getAttribute('href') === hash;
        link.classList.toggle('active', isActive);
        if (isActive) {
            console.log('[NAV ACTIVE]', link.getAttribute('href'), 'set as active');
        }
    });
}
// Wait for menu to load before activating nav
function waitForMenuAndActivate() {
    const navLinks = document.querySelectorAll('.main-nav a');
    if (navLinks.length) {
        activateMainNavByHash();
        window.addEventListener('hashchange', activateMainNavByHash);
    } else {
        setTimeout(waitForMenuAndActivate, 50);
    }
}
waitForMenuAndActivate();

// Auto-open widget on homepage load
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    window.addEventListener('DOMContentLoaded', function() {
        // Simulate click on the widget arrow link if it exists
        setTimeout(function() {
            let widgetPanel = document.getElementById('slide-widget-panel');
            if (!widgetPanel) {
                widgetPanel = document.createElement('div');
                widgetPanel.id = 'slide-widget-panel';
                widgetPanel.innerHTML = '<div class="slide-widget-content"></div><button class="close-widget" aria-label="Close widget">&times;</button>';
                document.body.appendChild(widgetPanel);
            }
            fetch('partials/widget.html')
                .then(res => res.text())
                .then(html => {
                    widgetPanel.querySelector('.slide-widget-content').innerHTML = html;
                    widgetPanel.classList.add('open');
                    enableWidgetAutoClose(widgetPanel);
                });
        }, 400); // delay to ensure DOM is ready
    });
}