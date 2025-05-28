// js/workout-session.js
// Loads the selected workout details into #workout-page

function getJsonPath(category) {
    const safeCategory = category.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return 'json/' + safeCategory + '.json';
}

function renderWorkoutDetails(entry) {
    // Extract YouTube video ID if possible (support youtu.be and youtube.com)
    let videoEmbed = '';
    let videoId = '';
    if (entry['video-url']) {
        if (entry['video-url'].includes('youtube.com/watch?v=')) {
            videoId = entry['video-url'].split('v=')[1].split('&')[0];
        } else if (entry['video-url'].includes('youtu.be/')) {
            videoId = entry['video-url'].split('youtu.be/')[1].split(/[?&]/)[0];
        }
        if (videoId) {
            videoEmbed = `<div class="workout-video"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`;
        } else {
            videoEmbed = `<p><a href="${entry['video-url']}" target="_blank">Watch Video</a></p>`;
        }
    }
    return (
        `<div class="workout-session-details">
            <h2>${entry.title}</h2>
            <p><strong>Date:</strong> ${entry['date-published']}</p>
            <p><strong>― by</strong> ${entry.author}</p>
            ${videoEmbed}
            <p><strong>Description:</strong> ${entry['meta-description']}</p>
            <p><strong>Duration:</strong> ${entry.duration}</p>
            <p><strong>Intensity:</strong> ${entry.intensity}</p>
            <p><strong>Equipment:</strong> ${Array.isArray(entry.equipment) ? entry.equipment.join(', ') : entry.equipment}</p>
            <p><strong>Target Muscles:</strong> ${Array.isArray(entry['target-muscles']) ? entry['target-muscles'].join(', ') : entry['target-muscles']}</p>
            <p><strong>Notes:</strong> ${entry.notes}</p>
            <p><strong>Dietary Tips:</strong> ${entry['dietary-tips']}</p>
            <p><strong>Related Workouts:</strong> ${Array.isArray(entry['related-workouts']) ? entry['related-workouts'].join(', ') : entry['related-workouts']}</p>
            <p><strong>User Rating:</strong> ${entry['user-rating']}</p>
        </div>`
    );
}

window.addEventListener('DOMContentLoaded', function() {
    const details = sessionStorage.getItem('workoutDetails');
    if (!details) return;
    const { category, title } = JSON.parse(details);
    const jsonPath = getJsonPath(category);
    fetch(jsonPath)
        .then(res => res.json())
        .then(data => {
            // Find the entry by title
            const entry = data.find(e => e.title === title);
            if (entry) {
                document.getElementById('workout-page').innerHTML = renderWorkoutDetails(entry);
            } else {
                document.getElementById('workout-page').innerHTML = '<p>Workout not found.</p>';
            }
        })
        .catch(() => {
            document.getElementById('workout-page').innerHTML = '<p>Could not load workout details.</p>';
        });
});
