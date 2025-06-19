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
        switch (hash) {
            case '#home': url = 'content/home.html'; break;
            case '#workout': url = 'content/workout.html'; break;
            case '#journal': url = 'content/journal.html'; break;
            case '#shop': url = 'content/shop.html'; break;
            case '#about': url = 'content/about.html'; break;
            default: url = 'content/home.html'; break;
        }
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
                // Removed dynamic nav insertion for journal page
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

document.addEventListener('content:updated', function() {
    // Populate latest 2 Self-Development cards on about page
    const aboutSection = document.getElementById('about');
    const selfdevCardsContainer = document.getElementById('latest-selfdev-cards');
    if (aboutSection && selfdevCardsContainer) {
        fetch('json/Self-Development.json')
            .then(resp => resp.json())
            .then(data => {
                // Sort by date-published descending (latest first)
                data.sort((a, b) => new Date(b['date-published']) - new Date(a['date-published']));
                const latestTwo = data.slice(0, 2);
                let html = '<div class="selfdev-cards-grid">';
                latestTwo.forEach(card => {
                    html += `
                    <div class="selfdev-card" tabindex="0" role="button" style="cursor:pointer" data-id="${card['data-id']}">
                        <img src="${card['meta-image']}" alt="${card.title}">
                        <h4>${card.title}</h4>
                        <p>${card['meta-description']}</p>
                    </div>`;
                });
                html += '</div>';
                selfdevCardsContainer.innerHTML = html;
                // Add click event listeners to open journal-entry.html with the card's id
                selfdevCardsContainer.querySelectorAll('.selfdev-card').forEach(cardEl => {
                    cardEl.addEventListener('click', function() {
                        window.location.href = `journal-entry.html?id=${this.getAttribute('data-id')}`;
                    });
                    cardEl.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            window.location.href = `journal-entry.html?id=${this.getAttribute('data-id')}`;
                        }
                    });
                });
            });
    }
});
