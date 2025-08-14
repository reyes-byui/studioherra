// latest-works-carousel.js
// Handles the zoom-out background effect for the latest-works-carousel slides

(function () {
    function initLatestWorksCarousel() {
        const thumbnails = document.querySelectorAll('.carousel-thumbnail');
        const slides = document.querySelectorAll('.carousel-slide');
        const carousel = document.querySelector('.latest-works-carousel');
        if (!carousel) return;
        let bgDiv = document.querySelector('.carousel-bg-zoom');

        // Create background div if not present
        if (!bgDiv) {
            bgDiv = document.createElement('div');
            bgDiv.className = 'carousel-bg-zoom';
            carousel.prepend(bgDiv);
        }

        // Set Grandya (slide-0) as active by default
        slides.forEach(slide => {
            if (slide.id === 'slide-1') {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        const activeSlide = document.getElementById('slide-1');
        // Set background image from slide's data-bg attribute
        const bgUrl = activeSlide ? activeSlide.getAttribute('data-bg') : '';
        if (bgUrl) {
            bgDiv.style.backgroundImage = `url('${bgUrl}')`;
        } else {
            bgDiv.style.backgroundImage = '';
        }
        bgDiv.classList.add('show');
        bgDiv.style.zIndex = '1';
        // Bring slides above background
        carousel.querySelector('.carousel-slides').style.zIndex = '2';
        // Thumbnails always on top
        carousel.querySelector('.carousel-thumbnails').style.zIndex = '3';

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function () {
                const slideIndex = this.getAttribute('data-slide');
                // Remove active from all slides
                slides.forEach(slide => slide.classList.remove('active'));
                // Add active to the selected slide
                const activeSlide = document.getElementById('slide-' + slideIndex);
                if (activeSlide) activeSlide.classList.add('active');

                // Set background image from slide's data-bg attribute
                const bgUrl = activeSlide ? activeSlide.getAttribute('data-bg') : '';
                if (bgUrl) {
                    bgDiv.style.backgroundImage = `url('${bgUrl}')`;
                } else {
                    bgDiv.style.backgroundImage = '';
                }
                bgDiv.classList.add('show');
                bgDiv.style.zIndex = '1';
                // Bring slides above background
                carousel.querySelector('.carousel-slides').style.zIndex = '2';
                // Thumbnails always on top
                carousel.querySelector('.carousel-thumbnails').style.zIndex = '3';
            });
        });

        // Optional: click background to close zoom
        bgDiv.addEventListener('click', function () {
            bgDiv.classList.remove('show');
            bgDiv.style.backgroundImage = '';
        });
    }

    // Expose for dynamic loader
    window.initLatestWorksCarousel = initLatestWorksCarousel;

    // Run immediately if DOM is ready, else on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLatestWorksCarousel);
    } else {
        setTimeout(initLatestWorksCarousel, 0);
    }
})();
