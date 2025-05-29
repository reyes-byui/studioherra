// Script for Get Journal Modal
(function() {
  function setupJournalModal() {
    var getJournalBtn = document.getElementById('get-journal');
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

      form.onsubmit = function(e) {
        e.preventDefault();
        form.style.display = 'none';
        thankYou.style.display = 'block';

        setTimeout(function() {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }, 2000);

        form.reset();
      };
    }
  }

  setupJournalModal();
  document.addEventListener('content:updated', setupJournalModal);
})();
