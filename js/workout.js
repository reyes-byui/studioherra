// workout.js - Handles loading and displaying workout cards by category

// Optimized and refactored workout.js
function getJsonPath(category) {
    const safeCategory = String(category).replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return 'json/' + safeCategory + '.json';
}

function createWorkoutCard(entry, category) {
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.innerHTML = `
        <img src="${entry['meta-image'] || 'images/image.jpg'}" alt="${entry.title || 'Workout'}">
        <h4>${entry.title || ''}</h4>
        <p><strong>Duration:</strong> ${entry.duration || ''}</p>
        <p><strong>Intensity:</strong> ${entry.intensity || ''}</p>
        <p><strong>Equipment:</strong> ${Array.isArray(entry.equipment) ? entry.equipment.join(', ') : (entry.equipment || '')}</p>
    `;
    card.style.cursor = 'pointer';
    card.setAttribute('data-id', entry['data-id'] || entry.id || '');
    card.tabIndex = 0; // Accessibility: make card focusable
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', entry.title || 'Workout');
    card.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.setItem('workoutDetails', JSON.stringify({category, title: entry.title}));
        if (entry['data-id']) {
            window.location.href = `workout-session.html?id=${encodeURIComponent(entry['data-id'])}`;
        } else if (entry.id) {
            window.location.href = `workout-session.html?id=${encodeURIComponent(entry.id)}`;
        } else {
            window.location.href = 'workout-session.html';
        }
    });
    // Keyboard accessibility
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
    return card;
}

// Pagination state
let workoutPagination = {
    currentPage: 1,
    cardsPerPage: 4,
    data: [],
    category: null
};

function renderWorkoutCardsPage() {
    const cardsContainer = document.getElementById('workout-cards');
    if (!cardsContainer) return;
    const { currentPage, cardsPerPage, data } = workoutPagination;
    cardsContainer.innerHTML = '';
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    data.slice(start, end).forEach(entry => {
        cardsContainer.appendChild(createWorkoutCard(entry, workoutPagination.category));
    });
    renderWorkoutPaginationControls();
}

function renderWorkoutPaginationControls() {
    const cardsContainer = document.getElementById('workout-cards');
    if (!cardsContainer) return;
    let controls = document.getElementById('workout-pagination');
    if (!controls) {
        controls = document.createElement('div');
        controls.id = 'workout-pagination';
        controls.style.display = 'flex';
        controls.style.justifyContent = 'center';
        controls.style.gap = '2em';
        controls.style.margin = '1em 0';
        cardsContainer.parentNode.appendChild(controls);
    }
    const { currentPage, cardsPerPage, data } = workoutPagination;
    const totalPages = Math.ceil(data.length / cardsPerPage);
    controls.innerHTML = '';
    if (totalPages > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '< Previous';
        prevBtn.className = 'pagination-btn'; // Unified class for shared CSS
        prevBtn.disabled = currentPage === 1;
        prevBtn.setAttribute('aria-label', 'Previous page');
        prevBtn.onclick = () => {
            workoutPagination.currentPage--;
            renderWorkoutCardsPage();
        };
        controls.appendChild(prevBtn);
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        controls.appendChild(pageInfo);
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next >';
        nextBtn.className = 'pagination-btn'; // Unified class for shared CSS
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.setAttribute('aria-label', 'Next page');
        nextBtn.onclick = () => {
            workoutPagination.currentPage++;
            renderWorkoutCardsPage();
        };
        controls.appendChild(nextBtn);
    }
}

function loadWorkoutCards(category) {
    const cardsContainer = document.getElementById('workout-cards');
    if (!cardsContainer) return;
    const jsonPath = getJsonPath(category);
    fetch(jsonPath)
        .then(res => res.json())
        .then(data => {
            workoutPagination = {
                currentPage: 1,
                cardsPerPage: 4,
                data,
                category
            };
            renderWorkoutCardsPage();
        })
        .catch(() => {
            cardsContainer.innerHTML = '<p>Could not load workouts for this category.</p>';
            const controls = document.getElementById('workout-pagination');
            if (controls) controls.remove();
        });
}

function setupWorkoutCategoryNav() {
    const workoutCategory = document.getElementById('workout-category');
    if (!workoutCategory) return;
    workoutCategory.addEventListener('click', function(e) {
        const link = e.target.closest('a[data-category]');
        if (link) {
            e.preventDefault();
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
