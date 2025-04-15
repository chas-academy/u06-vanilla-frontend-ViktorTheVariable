window.addEventListener('DOMContentLoaded', function() {
    const tokenItem = localStorage.getItem('token');
    const loginRegisterLink = document.getElementById('login-register');
    if (tokenItem && loginRegisterLink) {
      const logoutButton = document.createElement('button');
      logoutButton.type = 'button';
      logoutButton.id = 'logout';
      logoutButton.className = loginRegisterLink.className;
      logoutButton.textContent = 'Logout';
  
      loginRegisterLink.parentNode.replaceChild(logoutButton, loginRegisterLink);
  
      logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');
        location.reload();
      });
    }
  });