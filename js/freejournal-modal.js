// Script to enable the freejournal partial's modal on any page
(function() {
  function setupFreeJournalModal() {
    // Find the button and modal in the DOM (works if partial is loaded dynamically or statically)
    var getJournalBtn = document.querySelector('#freejournal .get-journal-btn, #get-journal');
    var modal = document.getElementById('journal-modal');
    var closeModal = document.getElementById('close-modal');
    var form = document.getElementById('journal-form');
    var thankYou = document.getElementById('thank-you');

    if (getJournalBtn && modal && closeModal && form && thankYou) {
      getJournalBtn.onclick = function() {
        modal.style.display = 'block';
        form.style.display = 'block';
        thankYou.style.display = 'none';
        document.body.style.overflow = 'hidden';
      };
      closeModal.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      };
      modal.onclick = function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      };
      form.onsubmit = async function(e) {
        e.preventDefault();
        // Send form data to backend
        const payload = {
          email: form.email.value,
          name: form.name.value,
          message: form.message.value
        };
        try {
          const resp = await fetch('/api/freejournal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (resp.ok) {
            form.style.display = 'none';
            thankYou.style.display = 'block';
            setTimeout(function() {
              modal.style.display = 'none';
              document.body.style.overflow = '';
            }, 2000);
            form.reset();
          } else {
            // Log error details for debugging
            let errorMsg = await resp.text();
            console.error('Submission failed:', resp.status, errorMsg);
            alert('Failed to submit. Please try again.');
          }
        } catch (err) {
          console.error('Network or JS error:', err);
          alert('Failed to submit. Please try again.');
        }
      };
    }
  }

  // Expose for dynamic loader
  window.setupFreeJournalModal = setupFreeJournalModal;

  // Run on DOMContentLoaded and after dynamic content loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFreeJournalModal);
  } else {
    setupFreeJournalModal();
  }
  document.addEventListener('content:updated', setupFreeJournalModal);
})();
