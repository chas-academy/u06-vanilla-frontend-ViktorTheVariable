  document.querySelector('.login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('token', data.token);
      } else {
        alert(data.message || 'Wrong username or password.');
      }
    } catch (err) {
      alert('Something went wrong when logging in: ' + err.message);
    }
  });