// js/journal-entry.js
// Loads the selected journal entry details from sessionStorage and displays them on journal-entry.html

window.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const entryId = params.get('id');
    const journalContent = document.getElementById('journal-content');
    if (!entryId) {
        if (journalContent) journalContent.innerHTML = '<p>No entry specified.</p>';
        return;
    }
    const jsonFiles = [
        'Health.json', 'Leisure.json', 'Self-Development.json', 'Abs.json', 'Cardio.json', 'Full-Body.json', 'Stretch.json', 'Booty.json', 'Arm.json', 'Thigh.json', 'Outdoors.json'
    ];
    let found = false;
    let loaded = 0;
    jsonFiles.forEach(file => {
        fetch('json/' + file)
            .then(res => res.json())
            .then(entries => {
                if (found) return; // Early exit if already found
                const entry = Array.isArray(entries) ? entries.find(e => (e['data-id'] || e.id) === entryId) : null;
                if (entry) {
                    found = true;
                    if (journalContent) journalContent.innerHTML = `
                        <h2>${entry.title || 'Untitled'}</h2>
                        <div class="journal-meta">
                            <span class="journal-date">${entry['date-published'] || ''}</span> ― 
                            <span class="journal-author">${entry.author || ''}</span>
                        </div>
                        <p class="journal-description">${entry['meta-description'] || ''}</p>
                        <div class="journal-image">${entry['meta-image'] ? `<img src="${entry['meta-image']}" alt="${entry.title || 'Journal image'}">` : ''}</div>
                        <div class="journal-image-url">${entry['image-url'] ? `<img src="${entry['image-url']}" alt="${entry.title || 'Journal image'}">` : ''}</div>
                        <div class="journal-intro">${entry.introduction ? `<h3>Introduction</h3><p>${entry.introduction}</p>` : ''}</div>
                        <div class="journal-quote">${entry.quote ? `<blockquote>${entry.quote}</blockquote>` : ''}</div>
                        <div class="journal-body">${entry.body ? `<h3>Body</h3><p>${entry.body}</p>` : ''}</div>
                        <div class="journal-conclusion">${entry.conclusion ? `<h3>Conclusion</h3><p>${entry.conclusion}</p>` : ''}</div>
                        <div class="journal-video">
                            ${entry['video-url']
                              ? (entry['video-url'].includes('youtube.com/watch?v=')
                                  ? `<div class="responsive-video"><iframe src="https://www.youtube.com/embed/${entry['video-url'].split('v=')[1].split('&')[0]}" allowfullscreen></iframe></div>`
                                  : (entry['video-url'].includes('youtu.be/')
                                      ? `<div class="responsive-video"><iframe src="https://www.youtube.com/embed/${entry['video-url'].split('youtu.be/')[1].split(/[?&]/)[0]}" allowfullscreen></iframe></div>`
                                      : `<div class="responsive-video"><iframe src="${entry['video-url']}" allowfullscreen></iframe></div>`))
                              : ''}
                        </div>
                        <ul class="journal-details">
                            <li><strong>Keywords:</strong> ${(entry['meta-keywords'] || []).join(', ')}</li>
                        </ul>
                        <div class="journal-related-articles">
                            ${entry['related-articles'] ? `<h4>Related Articles</h4><ul>${entry['related-articles'].map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
                        </div>
                    `;
                }
                loaded++;
                if (loaded === jsonFiles.length && !found && journalContent) {
                    journalContent.innerHTML = '<p>Entry not found.</p>';
                }
            })
            .catch(() => {
                loaded++;
                if (loaded === jsonFiles.length && !found && journalContent) {
                    journalContent.innerHTML = '<p>Entry not found.</p>';
                }
            });
    });
});
