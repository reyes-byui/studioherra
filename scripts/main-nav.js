// Scroll to #content when a main-nav link is clicked, after loading content

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(e) {
        // Main nav logic
        const navLink = e.target.closest('#main-nav a[href^="#"]');
        if (navLink) {
            e.preventDefault();
            const hash = navLink.getAttribute('href');
            // If not on index.html, redirect to index.html with hash
            if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                window.location.href = 'index.html' + hash;
            } else {
                window.location.hash = hash;
                window.dispatchEvent(new HashChangeEvent("hashchange"));
            }
            return; // Prevent further handling if main-nav link
        }
        // Workout category logic (restore this block)
        const workoutCatLink = e.target.closest('#workout-category a[data-category]');
        if (workoutCatLink) {
            e.preventDefault();
            // Remove active from all
            document.querySelectorAll('#workout-category a').forEach(a => a.classList.remove('active'));
            workoutCatLink.classList.add('active');
            if (typeof loadWorkoutCards === 'function') {
                loadWorkoutCards(workoutCatLink.getAttribute('data-category'));
            }
        }
    });
});