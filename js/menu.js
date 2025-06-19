// Dynamically load the menu partial into the header
window.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    if (header) {
        fetch('partials/menu.html')
            .then(resp => resp.text())
            .then(html => {
                // Insert menu at the top of the header
                header.insertAdjacentHTML('afterbegin', html);
            });
    }
});
