// workout.js - Handles loading and displaying workout cards by category

function getJsonPath(category) {
    // Map category to JSON filename
    const safeCategory = category.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    // Always relative to root (json/...) for main site
    // For subfolders, adjust as needed
    let jsonPath = 'json/' + safeCategory + '.json';
    if (window.location.pathname.includes('workout_lists')) {
        jsonPath = '../json/' + safeCategory + '.json';
    }
    return jsonPath;
}

function createWorkoutCard(entry, category) {
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.innerHTML = `
        <img src="${entry['meta-image']}" alt="${entry.title}">
        <h4>${entry.title}</h4>
        <p><strong>Duration:</strong> ${entry.duration}</p>
        <p><strong>Intensity:</strong> ${entry.intensity}</p>
        <p><strong>Equipment:</strong> ${Array.isArray(entry.equipment) ? entry.equipment.join(', ') : entry.equipment}</p>
    `;
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.setItem('workoutDetails', JSON.stringify({category, title: entry.title}));
        window.open('workout-session.html', '_blank');
    });
    return card;
}

function loadWorkoutCards(category) {
    const cardsContainer = document.getElementById('workout-cards');
    if (!cardsContainer) return;
    const jsonPath = getJsonPath(category);
    fetch(jsonPath)
        .then(res => res.json())
        .then(data => {
            cardsContainer.innerHTML = '';
            data.forEach(entry => {
                cardsContainer.appendChild(createWorkoutCard(entry, category));
            });
        })
        .catch(() => {
            cardsContainer.innerHTML = '<p>Could not load workouts for this category.</p>';
        });
}

function setupWorkoutCategoryNav() {
    const workoutCategory = document.getElementById('workout-category');
    if (!workoutCategory) return;
    workoutCategory.addEventListener('click', function(e) {
        const link = e.target.closest('a[data-category]');
        if (link) {
            e.preventDefault();
            // Remove active from all
            workoutCategory.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            loadWorkoutCards(link.getAttribute('data-category'));
        }
    });
    // Load first category by default
    const firstLink = workoutCategory.querySelector('a[data-category]');
    if (firstLink) {
        firstLink.classList.add('active');
        loadWorkoutCards(firstLink.getAttribute('data-category'));
    }
}

// Run setup on DOMContentLoaded and when content is loaded dynamically
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupWorkoutCategoryNav);
} else {
    setupWorkoutCategoryNav();
}
document.addEventListener('content:updated', setupWorkoutCategoryNav);
