// scroll-animations.js
// Activates slide-in animations for headings, paragraphs, and links when they enter the viewport

function initScrollAnimations() {
    const animatedSelectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'a'
    ];
    // Only select elements inside #main-hera
    const main = document.getElementById('main-hera');
    if (!main) return;
    const elements = main.querySelectorAll(animatedSelectors.join(','));

    const observer = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Add appropriate animation class
                if (/^H[1-6]$/.test(el.tagName)) {
                    el.classList.add('slide-in-left');
                } else if (el.tagName === 'P' || el.tagName === 'A') {
                    el.classList.add('slide-in-right');
                }
                obs.unobserve(el); // Only animate once
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% visible
    });

    elements.forEach(el => {
        // Remove animation classes initially
        el.classList.remove('slide-in-left', 'slide-in-right');
        observer.observe(el);
    });
}

// Export for dynamic-main-content.js or other entry point
window.initScrollAnimations = initScrollAnimations;
