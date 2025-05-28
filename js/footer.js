// Script to load the footer partial into the page
window.addEventListener('DOMContentLoaded', function() {
    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
            // Call setFooterYear after loading the footer
            setFooterYear();
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Separate function to set the year in the footer
function setFooterYear() {
    var yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
