// projects-section-scroll.js
// Links .project-buttons to their content sections with smooth scrolling

// Expose an init function for dynamic re-initialization
function initProjectsSectionScroll() {
    const buttonToContent = {
        'latest-works': 'latest-works-content',
        'experience': 'experience-content',
        'education': 'education-content',
        'other-projects': 'other-projects-content'
    };

    Object.keys(buttonToContent).forEach(buttonId => {
        const btn = document.getElementById(buttonId);
        const contentId = buttonToContent[buttonId];
        const content = document.getElementById(contentId);
        if (btn && content) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                content.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    });
}

// Expose for dynamic content
window.initProjectsSectionScroll = initProjectsSectionScroll;

document.addEventListener('DOMContentLoaded', initProjectsSectionScroll);
