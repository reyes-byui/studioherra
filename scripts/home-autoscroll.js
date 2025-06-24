// home-autoscroll.js
// Handles smooth scrolling to content sections when home page buttons are clicked
function initHomeAutoscroll() {
  const buttons = document.querySelectorAll(".home-buttons button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const contentId = button.id + "-content";
      const target = document.getElementById(contentId);

      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Optionally auto-initialize if content is present at load
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".home-buttons button")) {
    initHomeAutoscroll();
  }
});
