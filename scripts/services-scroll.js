// Scroll to #services-content when #services-below-button is clicked
window.initServicesScroll = function() {
  var btn = document.getElementById('services-below-button');
  var content = document.getElementById('services-content');
  if (btn && content) {
    btn.addEventListener('click', function() {
      content.scrollIntoView({ behavior: 'smooth' });
    });
  }
};
// Auto-initialize if loaded directly
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  window.initServicesScroll();
} else {
  window.addEventListener('DOMContentLoaded', window.initServicesScroll);
}
