// js/search.js
window.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const query = (params.get('q') || '').trim().toLowerCase();
  if (!query) {
    document.getElementById('search-results').innerHTML = '<p>No search query provided.</p>';
    return;
  }
  const jsonFiles = [
    'Health.json', 'Leisure.json', 'Self-Development.json', 'Abs.json', 'Cardio.json', 'Full-Body.json', 'Stretch.json', 'Booty.json', 'Arm.json', 'Thigh.json', 'Outdoors.json'
  ];
  let results = [];
  let loaded = 0;
  jsonFiles.forEach(file => {
    fetch('json/' + file)
      .then(res => res.json())
      .then(entries => {
        if (Array.isArray(entries)) {
          results = results.concat(
            entries.filter(entry =>
              (entry.title && entry.title.toLowerCase().includes(query)) ||
              (entry['meta-description'] && entry['meta-description'].toLowerCase().includes(query)) ||
              (entry.body && entry.body.toLowerCase().includes(query))
            ).map(entry => ({...entry, category: file.replace('.json','')}))
          );
        }
        loaded++;
        if (loaded === jsonFiles.length) showResults(results, query);
      })
      .catch(() => {
        loaded++;
        if (loaded === jsonFiles.length) showResults(results, query);
      });
  });

  function showResults(results, query) {
    const container = document.getElementById('search-results');
    if (!results.length) {
      container.innerHTML = `<p>No results found for "<strong>${query}</strong>".</p>`;
      return;
    }
    container.innerHTML = `<h2>Results for "<strong>${query}</strong>":</h2>
      <div class="search-cards">${results.map(entry => {
        if (entry.isStatic) {
          // Static HTML page result
          return `<div class="journal-card">
            <div class="journal-card-content">
              <h4>${entry.title || ''}</h4>
              <p class="journal-card-description">${entry.description || ''}</p>
              <a href="${entry.url}" class="view-entry">Go to page</a>
            </div>
          </div>`;
        } else {
          // Determine if this is a workout or journal entry by category/file
          const workoutCategories = ['Abs', 'Arm', 'Booty', 'Cardio', 'Full-Body', 'Stretch', 'Thigh'];
          const isWorkout = workoutCategories.includes(entry.category);
          const detailPage = isWorkout ? 'workout-session.html' : 'journal-entry.html';
          return `<div class="journal-card">
            <div class="journal-card-image">
              ${entry['meta-image'] ? `<img src="${entry['meta-image']}" alt="${entry.title || ''}">` : ''}
            </div>
            <div class="journal-card-content">
              <h4>${entry.title || ''}</h4>
              <p class="journal-card-meta">
                <span class="journal-card-date">${entry['date-published'] || ''}</span> ― by 
                <span class="journal-card-author">${entry.author || ''}</span>
              </p>
              <p class="journal-card-description">${entry['meta-description'] || ''}</p>
              <a href="${detailPage}?id=${encodeURIComponent(entry['data-id'] || entry.id)}" class="view-entry">View</a>
            </div>
          </div>`;
        }
      }).join('')}</div>`;
  }
});
