// js/workout-session.js
// Loads the selected workout details into #workout-page

function getJsonPath(category) {
    const safeCategory = category.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return 'json/' + safeCategory + '.json';
}

window.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const entryId = params.get('id');
    if (!entryId) {
        document.getElementById('workout-page').innerHTML = '<p>No workout specified.</p>';
        return;
    }
    // List of all workout JSON files
    const jsonFiles = [
        'Abs.json', 'Arm.json', 'Booty.json', 'Cardio.json', 'Full-Body.json', 'Stretch.json', 'Thigh.json'
    ];
    let found = false;
    let loaded = 0;
    jsonFiles.forEach(file => {
        fetch('json/' + file)
            .then(res => res.json())
            .then(entries => {
                const entry = Array.isArray(entries) ? entries.find(e => (e['data-id'] || e.id) === entryId) : null;
                if (entry && !found) {
                    found = true;
                    document.getElementById('workout-page').innerHTML = renderWorkoutDetails(entry);
                }
                loaded++;
                if (loaded === jsonFiles.length && !found) {
                    document.getElementById('workout-page').innerHTML = '<p>Workout not found.</p>';
                }
            })
            .catch(() => {
                loaded++;
                if (loaded === jsonFiles.length && !found) {
                    document.getElementById('workout-page').innerHTML = '<p>Could not load workout details.</p>';
                }
            });
    });
});

function renderWorkoutDetails(entry) {
    let videoEmbed = '';
    let videoId = '';
    if (entry['video-url']) {
        if (entry['video-url'].includes('youtube.com/watch?v=')) {
            videoId = entry['video-url'].split('v=')[1].split('&')[0];
            videoEmbed = `<div class="responsive-video"><iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`;
        } else if (entry['video-url'].includes('youtu.be/')) {
            videoId = entry['video-url'].split('youtu.be/')[1].split(/[?&]/)[0];
            videoEmbed = `<div class="responsive-video"><iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`;
        } else {
            // Embed non-YouTube video URLs as well
            videoEmbed = `<div class="responsive-video"><iframe src="${entry['video-url']}" allowfullscreen></iframe></div>`;
        }
    }
    return (
        `<div class="workout-session-details">
            <h2>${entry.title}</h2>
            <div class="workout-meta">
                <span class="workout-date">${entry['date-published'] || ''}</span> ― 
                <span class="workout-author">${entry.author || ''}</span>
            </div>
            ${videoEmbed}
            <p><strong>Description:</strong> ${entry['meta-description'] || ''}</p>
            <p><strong>Duration:</strong> ${entry.duration || ''}</p>
            <p><strong>Intensity:</strong> ${entry.intensity || ''}</p>
            <p><strong>Equipment:</strong> ${(entry.equipment || []).join(', ')}</p>
            <p><strong>Target Muscles:</strong> ${(entry['target-muscles'] || []).join(', ')}</p>
            <p><strong>Notes:</strong> ${entry.notes || ''}</p>
            <p><strong>Dietary Tips:</strong> ${entry['dietary-tips'] || ''}</p>
            <p><strong>Related Workouts:</strong> ${(entry['related-workouts'] || []).join(', ')}</p>
            <p><strong>User Rating:</strong> ${entry['user-rating'] || ''}</p>
        </div>`
    );
}
