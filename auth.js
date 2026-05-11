// auth.js - Fully browser-based auth (no backend needed)
// Uses localStorage to store users — works on GitHub Pages / file:// 

function toggleForm() {
  const login = document.getElementById('loginForm');
  const reg = document.getElementById('registerForm');
  const isLoginVisible = login.style.display !== 'none';
  login.style.display = isLoginVisible ? 'none' : 'block';
  reg.style.display = isLoginVisible ? 'block' : 'none';
  document.getElementById('authMessage').textContent = '';
  document.getElementById('authMessage').className = 'message';
}

function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!name || !email || !password) {
    showMessage('Please fill all fields.', 'error');
    return;
  }

  if (!email.includes('@')) {
    showMessage('Please enter a valid email.', 'error');
    return;
  }

  if (password.length < 4) {
    showMessage('Password must be at least 4 characters.', 'error');
    return;
  }

  // Get existing users from localStorage
  const users = JSON.parse(localStorage.getItem('edu_users') || '[]');

  // Check if email already exists
  const exists = users.find(u => u.email === email);
  if (exists) {
    showMessage('Email already registered. Please login.', 'error');
    return;
  }

  // Save new user
  users.push({ name, email, password });
  localStorage.setItem('edu_users', JSON.stringify(users));

  showMessage('✅ Registered successfully! Please login.', 'success');

  // Clear fields and switch to login after 1.5s
  document.getElementById('regName').value = '';
  document.getElementById('regEmail').value = '';
  document.getElementById('regPassword').value = '';
  setTimeout(toggleForm, 1500);
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showMessage('Please fill all fields.', 'error');
    return;
  }

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('edu_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Save logged in user
    localStorage.setItem('current_user', JSON.stringify({ name: user.name, email: user.email }));
    showMessage('✅ Login successful! Redirecting...', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
  } else {
    // Demo fallback — allow any login if no users registered yet
    if (users.length === 0) {
      localStorage.setItem('current_user', JSON.stringify({ name: 'Student', email }));
      showMessage('✅ Demo login successful!', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
    } else {
      showMessage('❌ Invalid email or password.', 'error');
    }
  }
}

function logout() {
  localStorage.removeItem('current_user');
  window.location.href = 'index.html';
}

function showMessage(text, type) {
  const el = document.getElementById('authMessage');
  el.textContent = text;
  el.className = `message ${type}`;
}
