document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page reload

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await login(email, password);
  });
});

async function login(email, password) {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // IMPORTANT (cookies)
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Login failed');
      return;
    }

    // Save token (if using JWT)
    //localStorage.setItem('token', data.token);

    // Redirect
    window.location.href = '/api/v1/auth/dashboard';

  } catch (err) {
    console.error(err);
    alert('Server error');
  }
}
