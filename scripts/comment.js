// Script to dynamically load the comment partial and set up the feedback form
(function() {
  function loadCommentPartial() {
    const placeholder = document.getElementById('comment');
    if (!placeholder) return;
    fetch('partials/comment.html')
      .then(response => response.text())
      .then(html => {
        placeholder.innerHTML = html;
        setupFeedbackForm();
      });
  }

  function setupFeedbackForm() {
    const form = document.getElementById('feedback-form');
    const feedbackList = document.getElementById('feedback-list');
    if (!form) return;

    // Dynamically set hidden fields based on page context
    const page = window.location.pathname.split('/').pop() || 'index.html';
    let category = '';
    let entryId = '';
    const main = document.getElementById('main');
    if (main) {
      category = main.getAttribute('data-category') || '';
      entryId = main.getAttribute('data-entry-id') || '';
    }
    // If entryId is not set, try to get it from the URL (?id=...)
    if (!entryId) {
      const params = new URLSearchParams(window.location.search);
      entryId = params.get('id') || '';
    }
    form.querySelector('#feedback-page').value = page;
    form.querySelector('#feedback-category').value = category;
    form.querySelector('#feedback-entry-id').value = entryId;

    // Fetch and display existing feedback for this entry
    if (feedbackList) {
      fetch(`/api/feedback?page=${encodeURIComponent(page)}&category=${encodeURIComponent(category)}&entryId=${encodeURIComponent(entryId)}`)
        .then(resp => resp.json())
        .then(data => {
          feedbackList.innerHTML = '';
          data.forEach(fb => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'feedback-comment';
            // Format date string in Mountain Time (America/Denver)
            let dateStr = '';
            if (fb.date) {
              const dateObj = new Date(fb.date);
              dateStr = `<span class="feedback-date">${dateObj.toLocaleString('en-US', { timeZone: 'America/Denver', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} MT</span>`;
            }
            commentDiv.innerHTML = `<strong>${escapeHtml(fb.name)}:</strong> ${escapeHtml(fb.text)} ${dateStr}`;
            feedbackList.appendChild(commentDiv);
          });
        });
    }

    form.onsubmit = async function(e) {
      e.preventDefault();
      const name = form.querySelector('#feedback-name').value;
      const text = form.querySelector('#feedback-text').value;
      // Use the same page/category/entryId as above
      // Send feedback to backend
      try {
        const resp = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, text, page, category, entryId })
        });
        if (resp.ok) {
          // Add feedback to the list dynamically
          if (feedbackList) {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'feedback-comment';
            commentDiv.innerHTML = '<strong>' + escapeHtml(name) + ':</strong> ' + escapeHtml(text);
            feedbackList.prepend(commentDiv);
          }
          form.reset();
          alert('Thank you for your feedback!');
        } else {
          alert('Failed to submit feedback. Please try again.');
        }
      } catch (err) {
        alert('Failed to submit feedback. Please try again.');
      }
    };
  }

  // Simple HTML escape to prevent XSS
  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function(tag) {
      const charsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      };
      return charsToReplace[tag] || tag;
    });
  }

  // Expose for dynamic loader if needed
  window.loadCommentPartial = loadCommentPartial;

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCommentPartial);
  } else {
    loadCommentPartial();
  }
  document.addEventListener('content:updated', loadCommentPartial);
})();
