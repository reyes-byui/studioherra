// Script to enable the freejournal partial's modal on any page
(function() {
  function setupFreeJournalModal() {
    const getJournalBtn = document.querySelector('#freejournal .get-journal-btn, #get-journal');
    const modal = document.getElementById('journal-modal');
    const form = document.getElementById('journal-form');
    const thankYou = document.getElementById('thank-you');

    if (getJournalBtn && modal && form && thankYou) {
      getJournalBtn.onclick = function() {
        modal.style.display = 'block';
        form.style.display = 'block';
        thankYou.style.display = 'none';
        document.body.style.overflow = 'hidden';
      };
      // Use event delegation for close button
      modal.addEventListener('click', function(event) {
        if (
          event.target.classList.contains('close') ||
          event.target === modal
        ) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
      form.onsubmit = async function(e) {
        e.preventDefault();
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

  window.setupFreeJournalModal = setupFreeJournalModal;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFreeJournalModal);
  } else {
    setupFreeJournalModal();
  }
  document.addEventListener('content:updated', setupFreeJournalModal);
})();
