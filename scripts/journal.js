// journal.js
// Handles loading and populating #journal-cards with JSON data based on journal category clicks

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(e) {
        const catLink = e.target.closest('#journal-category a[data-category]');
        if (catLink) {
            e.preventDefault();
            // Load journal.html into #content
            fetch('content/journal.html')
                .then(res => res.text())
                .then(html => {
                    document.getElementById('content').innerHTML = html;
                    // After journal.html is loaded, fetch and populate the correct JSON
                    const dataCategory = catLink.getAttribute('data-category');
                    if (dataCategory) {
                        fetch(`json/${dataCategory}.json`)
                            .then(res => res.json())
                            .then(data => {
                                populateJournalCards(data);
                            });
                    }
                });
        }
    });
});

let journalCurrentPage = 1;
const journalPageSize = 4;
let journalData = [];

function renderJournalPagination(totalPages) {
    const container = document.getElementById('journal-pagination');
    if (!container) return;
    container.innerHTML = '';
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = journalCurrentPage === 1;
    prevBtn.setAttribute('aria-label', 'Previous page');
    prevBtn.addEventListener('click', function() {
        if (journalCurrentPage > 1) {
            journalCurrentPage--;
            populateJournalCards(journalData);
        }
    });
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = journalCurrentPage === totalPages;
    nextBtn.setAttribute('aria-label', 'Next page');
    nextBtn.addEventListener('click', function() {
        if (journalCurrentPage < totalPages) {
            journalCurrentPage++;
            populateJournalCards(journalData);
        }
    });
    container.appendChild(prevBtn);
    const pageInfo = document.createElement('span');
    pageInfo.textContent = ` Page ${journalCurrentPage} of ${totalPages} `;
    container.appendChild(pageInfo);
    container.appendChild(nextBtn);
}

function populateJournalCards(data) {
    journalData = data;
    const cardsContainer = document.getElementById('journal-cards');
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';
    if (!Array.isArray(data)) return;
    const totalPages = Math.ceil(data.length / journalPageSize) || 1;
    const startIdx = (journalCurrentPage - 1) * journalPageSize;
    const endIdx = startIdx + journalPageSize;
    const pageData = data.slice(startIdx, endIdx);
    pageData.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'journal-card';
        card.innerHTML =
            '<div class="journal-card-image">' +
                (entry['meta-image'] ? `<img src="${entry['meta-image']}" alt="${entry.title || ''}">` : '') +
            '</div>' +
            '<div class="journal-card-content">' +
                `<h4>${entry.title || ''}</h4>` +
                '<p class="journal-card-meta">' +
                    `<span class="journal-card-date">${entry['date-published'] || ''}</span> ― by ` +
                    `<span class="journal-card-author">${entry.author || ''}</span>` +
                '</p>' +
                `<p class="journal-card-description">${entry['meta-description'] || ''}</p>` +
            '</div>';
        card.style.cursor = 'pointer';
        card.setAttribute('data-id', entry['data-id'] || entry.id || '');
        card.addEventListener('click', function(e) {
            e.preventDefault();
            if (entry['data-id']) {
                window.location.href = `journal-entry.html?id=${encodeURIComponent(entry['data-id'])}`;
            } else if (entry.id) {
                window.location.href = `journal-entry.html?id=${encodeURIComponent(entry.id)}`;
            } else {
                window.location.href = 'journal-entry.html';
            }
        });
        cardsContainer.appendChild(card);
    });
    // Render pagination controls
    let paginationContainer = document.getElementById('journal-pagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'journal-pagination';
        paginationContainer.className = 'pagination-container';
        // Place directly after the cards
        cardsContainer.after(paginationContainer);
    }
    renderJournalPagination(totalPages);
}
