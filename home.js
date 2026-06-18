/**
 * home.js — Homepage renderer
 */

async function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;

  try {
    const [config, notices, semesters] = await Promise.all([
      dbGetConfig(),
      dbGetNotices(),
      dbGetSemesters()
    ]);

    const pinnedNotices = notices.filter(n => n.pinned).slice(0, 3);
    const latestNotices = notices.slice(0, 3);
    const displayNotices = pinnedNotices.length > 0 ? pinnedNotices : latestNotices;

    app.innerHTML = `
      <!-- ── HERO ── -->
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="material-icons-round">verified</span>
              Academic Resource Portal
            </div>
            <h1>
              Welcome to<br>
              <span class="highlight">${escHtml(config.deptName || SITE_DEFAULTS.deptName)}</span>
            </h1>
            <p class="hero-subtitle">${escHtml(config.heroSubtitle || SITE_DEFAULTS.heroSubtitle)}</p>
            <div class="hero-actions">
              <a href="#/content" class="btn btn-white btn-lg" onclick="closeMobileMenu()">
                <span class="material-icons-round">library_books</span> Browse All Materials
              </a>
              <a href="#/notices" class="btn btn-outline-white btn-lg" onclick="closeMobileMenu()">
                <span class="material-icons-round">notifications</span> View Notices
              </a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-stat-card">
              <div class="hero-stat-num">${semesters.length}</div>
              <div class="hero-stat-label">Semesters</div>
            </div>
            <div class="hero-stat-card">
              <div class="hero-stat-num">100+</div>
              <div class="hero-stat-label">Resources</div>
            </div>
            <div class="hero-stat-card">
              <div class="hero-stat-num">24/7</div>
              <div class="hero-stat-label">Access</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── QUICK ACCESS ── -->
      <div class="page-container">
        <div class="section-title" style="margin-bottom:6px;">
          <span class="material-icons-round">apps</span> Quick Access
        </div>
        <div class="title-underline"></div>

        <div class="quick-cards">
          <a href="#/content" class="quick-card" onclick="closeMobileMenu()">
            <div class="qc-icon blue"><span class="material-icons-round">library_books</span></div>
            <div class="qc-label">Materials</div>
            <div class="qc-desc">Study notes & lecture sheets</div>
          </a>
          <a href="#/books" class="quick-card" onclick="closeMobileMenu()">
            <div class="qc-icon green"><span class="material-icons-round">menu_book</span></div>
            <div class="qc-label">Books</div>
            <div class="qc-desc">Reference books & PDFs</div>
          </a>
          <a href="#/software" class="quick-card" onclick="closeMobileMenu()">
            <div class="qc-icon purple"><span class="material-icons-round">computer</span></div>
            <div class="qc-label">Software</div>
            <div class="qc-desc">Tools & academic software</div>
          </a>
          <a href="#/tutorials" class="quick-card" onclick="closeMobileMenu()">
            <div class="qc-icon orange"><span class="material-icons-round">play_circle</span></div>
            <div class="qc-label">Tutorials</div>
            <div class="qc-desc">Video guides & how-tos</div>
          </a>
          <a href="#/notices" class="quick-card" onclick="closeMobileMenu()">
            <div class="qc-icon red"><span class="material-icons-round">notifications_active</span></div>
            <div class="qc-label">Notices</div>
            <div class="qc-desc">Announcements & updates</div>
          </a>
        </div>

        <!-- ── ABOUT ── -->
        <div class="section">
          <div class="about-section">
            <div class="about-grid">
              <div class="about-text">
                <h2>${escHtml(config.aboutTitle || SITE_DEFAULTS.aboutTitle)}</h2>
                <p>${escHtml(config.aboutText || SITE_DEFAULTS.aboutText)}</p>
                <a href="#/contact" class="btn btn-primary" onclick="closeMobileMenu()">
                  <span class="material-icons-round">contact_mail</span> Contact Us
                </a>
              </div>
              <div class="about-icons">
                <div class="about-icon-bubble grad-blue">
                  <span class="material-icons-round">school</span>
                </div>
                <div class="about-icon-bubble grad-teal">
                  <span class="material-icons-round">science</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── NOTICES ── -->
        ${displayNotices.length > 0 ? `
        <div class="section">
          <div class="section-header">
            <div>
              <div class="section-title">
                <span class="material-icons-round">notifications</span> Latest Notices
              </div>
              <div class="title-underline"></div>
            </div>
            <a href="#/notices" class="btn btn-ghost btn-sm" onclick="closeMobileMenu()">
              View All <span class="material-icons-round">arrow_forward</span>
            </a>
          </div>
          <div class="notice-strip">
            ${displayNotices.map(n => renderNoticeCard(n)).join('')}
          </div>
        </div>
        ` : ''}

        <!-- ── SEMESTERS STRIP ── -->
        ${semesters.length > 0 ? `
        <div class="section">
          <div class="section-header">
            <div>
              <div class="section-title">
                <span class="material-icons-round">calendar_today</span> Semester Materials
              </div>
              <div class="title-underline"></div>
            </div>
            <a href="#/content" class="btn btn-ghost btn-sm" onclick="closeMobileMenu()">
              View All <span class="material-icons-round">arrow_forward</span>
            </a>
          </div>
          <div class="sem-overview-grid">
            ${semesters.map(s => `
              <a href="#/semester/${s.id}" class="sem-card sem-c-${((s.order - 1) % 8) + 1}" onclick="closeMobileMenu()">
                <span class="material-icons-round">class</span>
                <h3>${escHtml(s.name)}</h3>
                <span class="sub-count">${escHtml(s.description || '')}</span>
              </a>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  } catch (err) {
    console.error('Home render error:', err);
    app.innerHTML = `
      <div class="page-container">
        <div class="empty-state">
          <span class="material-icons-round">error_outline</span>
          <h3>Could Not Load Content</h3>
          <p>${err.message}</p>
        </div>
      </div>`;
  }
}

function renderNoticeCard(n) {
  const isPinned = n.pinned;
  const dateStr = n.createdAt ? formatDate(n.createdAt) : '';
  return `
    <div class="notice-card ${isPinned ? 'pinned' : ''}">
      <div class="notice-icon ${isPinned ? 'pinned-icon' : 'normal'}">
        <span class="material-icons-round">${isPinned ? 'push_pin' : 'notifications'}</span>
      </div>
      <div class="notice-content">
        <div class="notice-title">${escHtml(n.title)}</div>
        <div class="notice-body">${escHtml(n.body || '')}</div>
        ${dateStr ? `<div class="notice-meta"><span class="material-icons-round">schedule</span> ${dateStr}</div>` : ''}
      </div>
      ${isPinned ? '<span class="badge badge-warning">Pinned</span>' : ''}
    </div>
  `;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
