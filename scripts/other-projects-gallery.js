// other-projects-gallery.js
// Simple slideshow for .other-projects-gallery

function initOtherProjectsGallery() {
    const gallery = document.querySelector('.other-projects-gallery');
    if (!gallery) return;
    const slides = Array.from(gallery.querySelectorAll('.project-details'));
    const leftBtn = gallery.querySelector('.other-projects-arrow.left');
    const rightBtn = gallery.querySelector('.other-projects-arrow.right');
    let current = slides.findIndex(slide => slide.classList.contains('active'));
    if (current === -1) current = 0;

    function showSlide(idx) {
        slides.forEach((slide, i) => {
            if (i === idx) {
                slide.classList.add('active');
                slide.style.display = 'flex';
            } else {
                slide.classList.remove('active');
                slide.style.display = 'none';
            }
        });
        current = idx;
    }

    leftBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let idx = (current - 1 + slides.length) % slides.length;
        showSlide(idx);
    });
    rightBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let idx = (current + 1) % slides.length;
        showSlide(idx);
    });

    // Ensure only the first slide is visible on load
    showSlide(current);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOtherProjectsGallery);
} else {
    setTimeout(initOtherProjectsGallery, 0);
}
