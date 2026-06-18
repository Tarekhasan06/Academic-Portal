/**
 * auth.js — Login, Register, Pending pages
 */

// ── Login Page ───────────────────────────────────────────────
function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="auth-card-header">
          <span class="material-icons-round">lock</span>
          <h2>Sign In to StudyHub</h2>
          <p>Access is restricted to enrolled department students</p>
        </div>
        <div class="auth-card-body">
          <form id="login-form" onsubmit="handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="login-email" class="form-control"
                placeholder="your.email@example.com" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="login-password" class="form-control"
                placeholder="Enter your password" required autocomplete="current-password" />
            </div>
            <button type="submit" id="login-btn" class="btn btn-primary btn-full">
              <span class="material-icons-round">login</span> Sign In
            </button>
          </form>

          <div class="auth-divider">or continue with</div>

          <button class="btn-google" onclick="handleGoogleSignIn()">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google
          </button>

          <div class="auth-footer-text">
            Don't have an account?
            <a href="#/register" onclick="closeMobileMenu()">Register here</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.innerHTML = `<span class="material-icons-round spin">sync</span> Signing in...`;
  try {
    await auth.signInWithEmailAndPassword(email, password);
    showToast('Signed in successfully!', 'success');
    // Auth state change will handle redirect
  } catch (err) {
    showToast(friendlyAuthError(err.code), 'error');
    btn.disabled = false;
    btn.innerHTML = `<span class="material-icons-round">login</span> Sign In`;
  }
}

async function handleGoogleSignIn() {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
    // Check if user doc exists; if not, create it
    const userDoc = await dbGetUser(user.uid);
    if (!userDoc) {
      const isAdmin = user.email === ADMIN_EMAIL;
      await dbCreateUser(user.uid, {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || '',
        approved: isAdmin,
        role: isAdmin ? 'admin' : 'student'
      });
      if (isAdmin) {
        showToast('Welcome, Admin!', 'success');
      } else {
        showToast('Account created! Awaiting admin approval.', 'info');
      }
    } else {
      showToast(`Welcome back, ${user.displayName || 'User'}!`, 'success');
    }
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showToast(friendlyAuthError(err.code), 'error');
    }
  }
}

// ── Register Page ────────────────────────────────────────────
function renderRegister() {
  document.getElementById('app').innerHTML = `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="auth-card-header">
          <span class="material-icons-round">person_add</span>
          <h2>Create Account</h2>
          <p>Register to access department study materials. Your account requires admin approval.</p>
        </div>
        <div class="auth-card-body">
          <div class="info-box mb-2">
            <span class="material-icons-round">info</span>
            After registration, please wait for the admin to approve your account before you can access materials.
          </div>

          <form id="register-form" onsubmit="handleRegister(event)">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">First Name *</label>
                <input type="text" id="reg-fname" class="form-control" placeholder="First name" required />
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" id="reg-lname" class="form-control" placeholder="Last name" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" id="reg-email" class="form-control"
                placeholder="your.email@example.com" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="form-label">Student ID (optional)</label>
              <input type="text" id="reg-studentid" class="form-control" placeholder="e.g. 2021-CSE-001" />
            </div>
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input type="password" id="reg-password" class="form-control"
                placeholder="Minimum 6 characters" required />
            </div>
            <div class="form-group">
              <label class="form-label">Confirm Password *</label>
              <input type="password" id="reg-confirm" class="form-control"
                placeholder="Repeat password" required />
            </div>
            <button type="submit" id="register-btn" class="btn btn-primary btn-full">
              <span class="material-icons-round">person_add</span> Create Account
            </button>
          </form>

          <div class="auth-divider">or</div>
          <button class="btn-google" onclick="handleGoogleSignIn()">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div class="auth-footer-text">
            Already have an account? <a href="#/login" onclick="closeMobileMenu()">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function handleRegister(e) {
  e.preventDefault();
  const fname    = document.getElementById('reg-fname').value.trim();
  const lname    = document.getElementById('reg-lname').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const sid      = document.getElementById('reg-studentid').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;
  const btn      = document.getElementById('register-btn');

  if (password !== confirm) {
    showToast('Passwords do not match!', 'error');
    return;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span class="material-icons-round spin">sync</span> Creating account...`;

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const user = cred.user;
    await user.updateProfile({ displayName: `${fname} ${lname}`.trim() });

    const isAdmin = email === ADMIN_EMAIL;
    await dbCreateUser(user.uid, {
      email,
      name: `${fname} ${lname}`.trim(),
      studentId: sid,
      approved: isAdmin,
      role: isAdmin ? 'admin' : 'student'
    });

    showToast(
      isAdmin ? 'Admin account created! Welcome.' : 'Account created! Awaiting admin approval.',
      'success'
    );
  } catch (err) {
    showToast(friendlyAuthError(err.code), 'error');
    btn.disabled = false;
    btn.innerHTML = `<span class="material-icons-round">person_add</span> Create Account`;
  }
}

// ── Pending Approval Page ────────────────────────────────────
function renderPending() {
  const user = auth.currentUser;
  document.getElementById('app').innerHTML = `
    <div class="pending-wrap">
      <div class="pending-icon">
        <span class="material-icons-round">hourglass_top</span>
      </div>
      <h2 class="pending-title">Account Pending Approval</h2>
      <p class="pending-desc">
        Hi <strong>${escHtml(user?.displayName || user?.email || 'there')}</strong>!<br>
        Your account has been created and is awaiting admin approval.<br>
        Please contact the department admin or wait for an email confirmation.
      </p>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">
        <a href="#/contact" class="btn btn-primary" onclick="closeMobileMenu()">
          <span class="material-icons-round">contact_mail</span> Contact Admin
        </a>
        <button class="btn btn-secondary" onclick="handleSignOut()">
          <span class="material-icons-round">logout</span> Sign Out
        </button>
      </div>
    </div>
  `;
}

// ── Auth Error Messages ──────────────────────────────────────
function friendlyAuthError(code) {
  const map = {
    'auth/user-not-found':      'No account found with this email.',
    'auth/wrong-password':      'Incorrect password. Try again.',
    'auth/email-already-in-use':'This email is already registered.',
    'auth/invalid-email':       'Please enter a valid email address.',
    'auth/weak-password':       'Password must be at least 6 characters.',
    'auth/too-many-requests':   'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential':  'Invalid email or password.',
  };
  return map[code] || 'An error occurred. Please try again.';
}
