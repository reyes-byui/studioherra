// Simple password protection for the whole site
(function() {
  var allowed = sessionStorage.getItem('isAuthenticated');
  var isLoginPage = window.location.pathname.endsWith('login.html');
  if (!allowed && !isLoginPage) {
    window.location.href = 'login.html';
  }
  if (isLoginPage) {
    document.addEventListener('DOMContentLoaded', function() {
      var form = document.getElementById('login-form');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          var pw = document.getElementById('password').value;
          if (pw === 'donotenter') { // Change password here
            sessionStorage.setItem('isAuthenticated', 'true');
            window.location.href = 'index.html';
          } else {
            document.getElementById('login-error').textContent = 'Incorrect password.';
          }
        });
      }
    });
  }
})();
