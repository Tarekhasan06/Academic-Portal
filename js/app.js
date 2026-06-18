/**
 * app.js — Main application: Auth state, SPA Router, Nav, Global Helpers
 */

// ── Global App State ─────────────────────────────────────────
window.__appUser     = null;
window.__appRole     = null;
window.__appApproved = false;
window.__appConfig   = { ...SITE_DEFAULTS };

// ── Init: only run Firebase logic if configured ───────────────
if (_isConfigured) {
  // ── Auth State Listener ────────────────────────────────────
  auth.onAuthStateChanged(async (firebaseUser) => {
    try {
      if (firebaseUser) {
        window.__appUser = firebaseUser;

        let userData = await dbGetUser(firebaseUser.uid);

        if (!userData) {
          const isAdmin = firebaseUser.email === ADMIN_EMAIL;
          await dbCreateUser(firebaseUser.uid, {
            email:    firebaseUser.email,
            name:     firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL || '',
            approved: isAdmin,
            role:     isAdmin ? 'admin' : 'student',
          });
          userData = await dbGetUser(firebaseUser.uid);
        }

        window.__appRole     = userData?.role || 'student';
        window.__appApproved = userData?.approved === true || window.__appRole === 'admin';

        await loadSiteConfig();
        renderNavAuth();
        await populateSemesterDropdown();
        updateFooter();
        hideLoading();

        if (userData?.banned) { renderBannedPage(); return; }
        if (!window.__appApproved) { renderPending(); return; }

        const hash = window.location.hash || '#/home';
        navigate(hash.replace(/^#/, ''), true);

      } else {
        window.__appUser     = null;
        window.__appRole     = null;
        window.__appApproved = false;

        renderNavAuth();
        updateFooter();
        hideLoading();

        const hash = window.location.hash || '';
        navigate(hash.startsWith('#/register') ? '/register' : '/login', true);
      }
    } catch (err) {
      console.error('Auth state error:', err);
      hideLoading();
      navigate('/login', true);
    }
  });

  // ── Hash Change Handler ────────────────────────────────────
  window.addEventListener('hashchange', () => {
    const path = window.location.hash.replace(/^#/, '') || '/home';
    const isPublic = ['/login', '/register', '/pending'].some(r => path === r);
    if (!window.__appUser && !isPublic) return;
    navigate(path, true);
  });

} else {
  // ── Not configured: show setup screen, hide loader ─────────
  hideLoading();
  updateFooter(); // still update with SITE_DEFAULTS branding
  renderNavAuth();

  // Show setup screen in #app
  const appEl = document.getElementById('app');
  if (appEl) appEl.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:80vh;padding:2rem;">
      <div style="background:white;border-radius:16px;box-shadow:0 8px 32px rgba(13,27,75,0.15);
                  max-width:560px;width:100%;overflow:hidden;border-top:5px solid #E65100;">
        <div style="background:linear-gradient(135deg,#0D1B4B,#1565C0);padding:2rem;color:white;text-align:center;">
          <div style="font-size:3rem;margin-bottom:0.5rem;">⚙️</div>
          <h2 style="font-family:Poppins,sans-serif;font-size:1.4rem;margin:0 0 0.25rem;">Firebase Setup Required</h2>
          <p style="opacity:0.75;font-size:0.85rem;margin:0;">The site is not connected to a database yet</p>
        </div>
        <div style="padding:2rem;">
          <p style="color:#37474F;font-size:0.9rem;line-height:1.7;margin-bottom:1.5rem;">
            The <strong>Firebase config keys</strong> in
            <code style="background:#F0F4FF;padding:2px 6px;border-radius:4px;">js/firebase-config.js</code>
            are still placeholders. Replace them with your real Firebase project keys.
          </p>
          <div style="background:#FFF3E0;border-left:4px solid #E65100;border-radius:4px;padding:1rem 1.25rem;margin-bottom:1.5rem;">
            <strong style="color:#E65100;display:block;margin-bottom:0.5rem;">📋 Steps to fix:</strong>
            <ol style="padding-left:1.25rem;color:#BF360C;font-size:0.85rem;line-height:2.2;margin:0;">
              <li>Go to <a href="https://console.firebase.google.com" target="_blank" style="color:#1565C0;font-weight:600;">console.firebase.google.com</a></li>
              <li>Create a project → Add a <strong>Web App</strong></li>
              <li>Copy the <code>firebaseConfig</code> values shown</li>
              <li>Paste them into <strong>js/firebase-config.js</strong></li>
              <li>Enable <strong>Authentication</strong> (Email/Password + Google)</li>
              <li>Create a <strong>Firestore Database</strong></li>
              <li>Refresh this page ✅</li>
            </ol>
          </div>
          <a href="https://console.firebase.google.com" target="_blank"
             style="display:inline-flex;align-items:center;gap:8px;
                    background:linear-gradient(135deg,#1565C0,#0D47A1);
                    color:white;padding:0.75rem 1.5rem;border-radius:10px;
                    font-weight:600;font-size:0.9rem;text-decoration:none;
                    box-shadow:0 4px 12px rgba(21,101,192,0.3);">
            🔥 Open Firebase Console
          </a>
          <p style="margin-top:1rem;font-size:0.75rem;color:#78909C;">
            Full guide is in <strong>README.md</strong> in your project folder.
          </p>
        </div>
      </div>
    </div>
  `;

  // Nav links still work — they show the setup screen on every page
  window.addEventListener('hashchange', () => {
    const appEl2 = document.getElementById('app');
    // Keep showing the setup screen; clicking nav does nothing harmful
    if (appEl2 && !appEl2.innerHTML.includes('Firebase Setup Required')) {
      navigate(window.location.hash.replace(/^#/, '') || '/login', true);
    }
  });
}

// ── Router ────────────────────────────────────────────────────
async function navigate(path, skipAuthCheck = false) {
  if (!_isConfigured) return; // safety guard

  const publicRoutes = ['/login', '/register', '/pending'];
  const isPublic = publicRoutes.some(r => path === r || path.startsWith(r));

  if (!isPublic && !skipAuthCheck && !window.__appUser) {
    window.location.hash = '#/login';
    renderLogin();
    return;
  }
  if (window.__appUser && !window.__appApproved && window.__appRole !== 'admin') {
    if (!isPublic) { renderPending(); return; }
  }

  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setActiveNavLink(path);

  if (path === '/' || path === '/home' || path === '') {
    await renderHome();
  } else if (path === '/content') {
    await renderContent();
  } else if (path.startsWith('/semester/')) {
    const semId = path.split('/semester/')[1];
    await renderSemester(semId);
  } else if (path === '/books') {
    await renderBooks();
  } else if (path === '/software') {
    await renderSoftware();
  } else if (path === '/tutorials') {
    await renderTutorials();
  } else if (path === '/notices') {
    await renderNotices();
  } else if (path === '/contact') {
    await renderContact();
  } else if (path === '/admin' || path.startsWith('/admin')) {
    await renderAdmin();
  } else if (path === '/login') {
    renderLogin();
  } else if (path === '/register') {
    renderRegister();
  } else if (path === '/pending') {
    renderPending();
  } else {
    document.getElementById('app').innerHTML = `
      <div class="page-container" style="text-align:center;padding-top:5rem;">
        <div class="empty-state">
          <span class="material-icons-round" style="font-size:5rem;color:var(--primary);opacity:0.3;">search_off</span>
          <h3>Page Not Found</h3>
          <p>The page <code>${escHtml(path)}</code> doesn't exist.</p>
          <a href="#/home" class="btn btn-primary mt-2">Go Home</a>
        </div>
      </div>
    `;
  }
}

// ── Site Config Loader ────────────────────────────────────────
window.loadSiteConfig = async function () {
  try {
    window.__appConfig = await dbGetConfig();
  } catch (_) {
    window.__appConfig = { ...SITE_DEFAULTS };
  }
  updateFooter();
  updateNavSubtitle();
};

function updateNavSubtitle() {
  const el = document.getElementById('nav-dept-subtitle');
  if (el) el.textContent = window.__appConfig.deptName || SITE_DEFAULTS.deptName;
}

function updateFooter() {
  const cfg = window.__appConfig;
  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setTxt('footer-dept-name',    cfg.deptName       || SITE_DEFAULTS.deptName);
  setTxt('footer-uni-name',     cfg.universityName  || SITE_DEFAULTS.universityName);
  setTxt('footer-copyright',    `© ${new Date().getFullYear()} ${cfg.universityName || ''} — ${cfg.deptName || ''}`);
  setTxt('footer-internal-note',cfg.footerNote      || SITE_DEFAULTS.footerNote);
}

// ── Semester Dropdown ─────────────────────────────────────────
window.populateSemesterDropdown = async function () {
  try {
    const sems = await dbGetSemesters();
    const menu = document.getElementById('semester-dropdown-menu');
    const footerList = document.getElementById('footer-semesters');
    if (menu) {
      menu.innerHTML = sems.length === 0
        ? `<div class="dropdown-loading">No semesters yet</div>`
        : sems.map(s => `
            <a href="#/semester/${s.id}" class="dropdown-item" onclick="closeMobileMenu()">
              <span class="material-icons-round">class</span> ${escHtml(s.name)}
            </a>
          `).join('');
    }
    if (footerList) {
      footerList.innerHTML = sems.slice(0, 6).map(s =>
        `<li><a href="#/semester/${s.id}">${escHtml(s.name)}</a></li>`
      ).join('');
    }
  } catch (_) {}
};

// ── Nav Auth Rendering ────────────────────────────────────────
function renderNavAuth() {
  const container = document.getElementById('nav-auth');
  if (!container) return;

  if (window.__appUser) {
    const name = window.__appUser.displayName || window.__appUser.email?.split('@')[0] || 'User';
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    container.innerHTML = `
      ${window.__appRole === 'admin' ? `
        <a href="#/admin" class="nav-link" style="color:rgba(255,255,255,0.9);" onclick="closeMobileMenu()">
          <span class="material-icons-round">admin_panel_settings</span> Admin
        </a>
      ` : ''}
      <div class="nav-avatar" title="${escHtml(name)}">${initials}</div>
      <button class="btn btn-outline-white btn-sm" onclick="handleSignOut()">
        <span class="material-icons-round">logout</span>
      </button>
    `;
  } else {
    container.innerHTML = `
      <a href="#/login" class="btn btn-outline-white btn-sm" onclick="closeMobileMenu()">
        <span class="material-icons-round">login</span> Sign In
      </a>
      <a href="#/register" class="btn btn-white btn-sm" onclick="closeMobileMenu()">
        <span class="material-icons-round">person_add</span> Register
      </a>
    `;
  }
}

// ── Sign Out ──────────────────────────────────────────────────
async function handleSignOut() {
  try {
    await auth.signOut();
    showToast('Signed out successfully.', 'success');
    window.location.hash = '#/login';
  } catch (err) {
    showToast('Error signing out: ' + err.message, 'error');
  }
}

// ── Banned Page ───────────────────────────────────────────────
function renderBannedPage() {
  document.getElementById('app').innerHTML = `
    <div class="pending-wrap">
      <div class="pending-icon" style="background:var(--danger-bg);border-color:rgba(198,40,40,0.2);">
        <span class="material-icons-round" style="color:var(--danger);">block</span>
      </div>
      <h2 class="pending-title">Account Suspended</h2>
      <p class="pending-desc">Your account has been suspended. Please contact the admin if you believe this is a mistake.</p>
      <button class="btn btn-secondary" onclick="handleSignOut()">
        <span class="material-icons-round">logout</span> Sign Out
      </button>
    </div>
  `;
}

// ── Active Nav Link ───────────────────────────────────────────
function setActiveNavLink(path) {
  document.querySelectorAll('.nav-link[data-route]').forEach(a => {
    a.classList.remove('active');
    const route = a.dataset.route;
    if (
      (route === 'home'      && (path === '/home' || path === '/')) ||
      (route === 'content'   && path.startsWith('/content'))        ||
      (route === 'books'     && path === '/books')                  ||
      (route === 'software'  && path === '/software')               ||
      (route === 'tutorials' && path === '/tutorials')              ||
      (route === 'notices'   && path === '/notices')                ||
      (route === 'contact'   && path === '/contact')
    ) {
      a.classList.add('active');
    }
  });
}

// ── Mobile Menu ───────────────────────────────────────────────
function toggleMobileMenu() {
  const links = document.getElementById('nav-links');
  const burger = document.getElementById('hamburger');
  if (links) links.classList.toggle('open');
  if (burger) burger.classList.toggle('active');
}

function closeMobileMenu() {
  const links  = document.getElementById('nav-links');
  const burger = document.getElementById('hamburger');
  if (links)  links.classList.remove('open');
  if (burger) burger.classList.remove('active');
  document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
}

// ── Dropdown ──────────────────────────────────────────────────
function toggleNavDropdown(dropdownId) {
  const dd = document.getElementById(dropdownId);
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  }
});

// ── Modal ─────────────────────────────────────────────────────
function openModal(title, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function handleModalOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ── Confirm Dialog ────────────────────────────────────────────
let _confirmResolve = null;

function confirmDialog(message) {
  return new Promise((resolve) => {
    _confirmResolve = resolve;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-overlay').classList.remove('hidden');
  });
}

function resolveConfirm(value) {
  document.getElementById('confirm-overlay').classList.add('hidden');
  if (_confirmResolve) { _confirmResolve(value); _confirmResolve = null; }
}

// ── Toast ─────────────────────────────────────────────────────
const TOAST_ICONS = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="material-icons-round">${TOAST_ICONS[type] || 'info'}</span>
    <span>${escHtml(message)}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ── Loading Screen ────────────────────────────────────────────
function hideLoading() {
  const screen = document.getElementById('loading-screen');
  if (screen) {
    screen.classList.add('gone');
    setTimeout(() => screen.remove(), 600);
  }
}

// ── Keyboard Shortcuts ────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    resolveConfirm(false);
    closeMobileMenu();
  }
});
