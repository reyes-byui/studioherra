window.setupInquireModal = function() {
  const openBtn = document.getElementById('inquire-here');
  const modal = document.getElementById('inquiry-modal');
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('inqiury-form');
  const thankYou = document.getElementById('thank-you');

  if (!openBtn || !modal || !closeBtn || !form) return;

  // Open modal
  openBtn.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'block';
    if (thankYou) thankYou.style.display = 'none';
    form.style.display = 'block';
  });

  // Close modal
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside modal content
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
      email: form.email.value,
      fname: form.fname.value,
      lname: form.lname.value,
      message: form.message.value
    };
    fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(async res => {
      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: 'Invalid server response' };
      }
      if (res.ok && data.success) {
        form.style.display = 'none';
        if (thankYou) thankYou.style.display = 'block';
      } else {
        alert('There was an error submitting your inquiry.' + (data.details ? '\n' + data.details : (data.error ? '\n' + data.error : '')));
      }
    })
    .catch((err) => {
      alert('There was an error submitting your inquiry. ' + (err && err.message ? err.message : ''));
    });
  });
};