// Script to load left and right column partials into the main sections
window.addEventListener('DOMContentLoaded', function() {
    fetch('partials/leftcolumn.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('left-column').innerHTML = data;
        })
        .catch(error => console.error('Error loading left column:', error));

    fetch('partials/rightcolumn.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('right-column').innerHTML = data;
        })
        .catch(error => console.error('Error loading right column:', error));
});
