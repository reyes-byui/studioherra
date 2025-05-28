// js/journal-entry.js
// Loads the selected journal entry details from sessionStorage and displays them on journal-entry.html

document.addEventListener('DOMContentLoaded', function() {
    // Debug: log sessionStorage
    console.log('journalEntryDetails:', sessionStorage.getItem('journalEntryDetails'));
    const details = sessionStorage.getItem('journalEntryDetails');
    const page = document.getElementById('journal-content');
    if (!details) {
        if (page) page.innerHTML = '<p>No entry details found in sessionStorage.</p>';
        return;
    }
    let entry;
    try {
        entry = JSON.parse(details);
    } catch (e) {
        if (page) page.innerHTML = '<p>Could not parse entry details.</p>';
        return;
    }
    if (!page) return;
    page.innerHTML = `
        <h1>${entry.title || ''}</h1>
        <div class="entry-meta">
            <span>${entry['date-published'] || ''}</span> ― by <span>${entry.author || ''}</span>
        </div>
        <div class="entry-images">
            ${entry['image-url'] ? `<img src="${entry['image-url']}" alt="${entry.title || ''}" style="max-width:100%;">` : ''}
        </div>
        <div class="entry-description">
            <p>${entry['meta-description'] || ''}</p>
        </div>
        <div class="entry-introduction">
            <h3>Introduction</h3>
            <p>${entry.introduction || ''}</p>
        </div>
        <blockquote>${entry.quote || ''}</blockquote>
        <div class="entry-body">
            <h3>Body</h3>
            <p>${entry.body || ''}</p>
        </div>
        <div class="entry-conclusion">
            <h3>Conclusion</h3>
            <p>${entry.conclusion || ''}</p>
        </div>
        <div class="entry-meta-keywords">
            <strong>Keywords:</strong> ${(Array.isArray(entry['meta-keywords']) ? entry['meta-keywords'].join(', ') : '')}
        </div>
        <div class="entry-video">
            ${entry['video-url'] ? `<a href="${entry['video-url']}" target="_blank">Watch Video</a>` : ''}
        </div>
        <div class="entry-related-articles">
            <h4>Related Articles</h4>
            <ul>
                ${(Array.isArray(entry['related-articles']) ? entry['related-articles'].map(a => `<li>${a}</li>`).join('') : '')}
            </ul>
        </div>
    `;
});
