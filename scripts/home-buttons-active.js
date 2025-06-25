// home-buttons-active.js
// Adds active style to home-buttons buttons on click

function initHomeButtonsActive() {
  const container = document.querySelector('.home-buttons');
  if (!container) return;
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function () {
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

window.initHomeButtonsActive = initHomeButtonsActive;

document.addEventListener('DOMContentLoaded', () => {
  initHomeButtonsActive();
});
