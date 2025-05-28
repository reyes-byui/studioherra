// js/autoscroll-content.js
// Scrolls to #content when a main-nav link is clicked (for workout-session.html)
document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(e) {
        const navLink = e.target.closest('.main-nav a');
        if (navLink) {
            setTimeout(() => {
                const content = document.getElementById('content');
                if (content) {
                    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        }
    });
});
