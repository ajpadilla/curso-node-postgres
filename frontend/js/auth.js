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
  const errorDiv = document.getElementById('loginError');
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';

  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Show error in the page
      errorDiv.textContent = data.message || 'Login failed';
      errorDiv.style.display = 'block';
      return;
    }

    // Success → redirect
    window.location.href = '/api/v1/dashboard';
  } catch (err) {
    errorDiv.textContent = 'Server error. Try again later.';
    errorDiv.style.display = 'block';
  }
}
