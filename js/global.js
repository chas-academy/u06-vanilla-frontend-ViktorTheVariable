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

  function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');