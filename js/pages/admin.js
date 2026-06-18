/**
 * admin.js — Full Admin Dashboard
 * Tabs: Overview | Site Settings | Semesters | Subjects & Resources
 *       Books | Software | Tutorials | Notices | Users
 */

// ── Admin Page Entry ─────────────────────────────────────────
async function renderAdmin() {
  if (window.__appRole !== 'admin') {
    document.getElementById('app').innerHTML = `
      <div class="page-container">
        <div class="empty-state">
          <span class="material-icons-round">block</span>
          <h3>Access Denied</h3>
          <p>You don't have permission to access the admin panel.</p>
          <a href="#/home" class="btn btn-primary mt-2">Go Home</a>
        </div>
      </div>`;
    return;
  }

  document.getElementById('app').innerHTML = `
    <div class="admin-layout">
      <!-- Sidebar -->
      <nav class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-section">
          <div class="admin-sidebar-label">Dashboard</div>
          <button class="admin-nav-item active" onclick="adminSwitchTab('overview', this)" data-tab="overview">
            <span class="material-icons-round">dashboard</span> Overview
          </button>
        </div>
        <div class="admin-sidebar-section">
          <div class="admin-sidebar-label">Content</div>
          <button class="admin-nav-item" onclick="adminSwitchTab('settings', this)" data-tab="settings">
            <span class="material-icons-round">settings</span> Site Settings
          </button>
          <button class="admin-nav-item" onclick="adminSwitchTab('semesters', this)" data-tab="semesters">
            <span class="material-icons-round">calendar_today</span> Semesters
          </button>
          <button class="admin-nav-item" onclick="adminSwitchTab('subjects', this)" data-tab="subjects">
            <span class="material-icons-round">class</span> Subjects & Resources
          </button>
          <button class="admin-nav-item" onclick="adminSwitchTab('books', this)" data-tab="books">
            <span class="material-icons-round">menu_book</span> Books
          </button>
          <button class="admin-nav-item" onclick="adminSwitchTab('software', this)" data-tab="software">
            <span class="material-icons-round">computer</span> Software
          </button>
          <button class="admin-nav-item" onclick="adminSwitchTab('tutorials', this)" data-tab="tutorials">
            <span class="material-icons-round">play_circle</span> Tutorials
          </button>
          <button class="admin-nav-item" onclick="adminSwitchTab('notices', this)" data-tab="notices">
            <span class="material-icons-round">notifications</span> Notices
          </button>
        </div>
        <div class="admin-sidebar-section">
          <div class="admin-sidebar-label">Administration</div>
          <button class="admin-nav-item" onclick="adminSwitchTab('users', this)" data-tab="users">
            <span class="material-icons-round">people</span> Users
          </button>
        </div>
        <div style="padding:1rem 1.25rem;margin-top:auto;">
          <a href="#/home" class="btn btn-ghost btn-sm" style="color:rgba(255,255,255,0.6);width:100%;justify-content:flex-start;gap:8px;" onclick="closeMobileMenu()">
            <span class="material-icons-round">arrow_back</span> Back to Site
          </a>
        </div>
      </nav>

      <!-- Content Area -->
      <div class="admin-content">
        <div id="admin-section-overview"  class="admin-section active"></div>
        <div id="admin-section-settings"  class="admin-section"></div>
        <div id="admin-section-semesters" class="admin-section"></div>
        <div id="admin-section-subjects"  class="admin-section"></div>
        <div id="admin-section-books"     class="admin-section"></div>
        <div id="admin-section-software"  class="admin-section"></div>
        <div id="admin-section-tutorials" class="admin-section"></div>
        <div id="admin-section-notices"   class="admin-section"></div>
        <div id="admin-section-users"     class="admin-section"></div>
      </div>
    </div>
  `;

  // Load overview by default
  await adminLoadOverview();
}

function adminSwitchTab(tab, el) {
  // Update nav
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  // Show section
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(`admin-section-${tab}`);
  if (section) section.classList.add('active');
  // Load if not yet loaded
  const loaders = {
    overview:  adminLoadOverview,
    settings:  adminLoadSettings,
    semesters: adminLoadSemesters,
    subjects:  adminLoadSubjects,
    books:     adminLoadBooks,
    software:  adminLoadSoftware,
    tutorials: adminLoadTutorials,
    notices:   adminLoadNotices,
    users:     adminLoadUsers,
  };
  if (loaders[tab]) loaders[tab]();
}

// ── OVERVIEW ─────────────────────────────────────────────────
async function adminLoadOverview() {
  const el = document.getElementById('admin-section-overview');
  el.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const [sems, users, notices] = await Promise.all([
      dbGetSemesters(true),
      dbGetUsers(),
      dbGetNotices(true),
    ]);
    const pending = users.filter(u => !u.approved && !u.banned).length;
    const approved = users.filter(u => u.approved).length;

    el.innerHTML = `
      <div class="admin-section-header">
        <div class="admin-section-title">
          <span class="material-icons-round">dashboard</span> Overview
        </div>
        <button class="btn btn-primary btn-sm" onclick="adminSeedData()">
          <span class="material-icons-round">auto_fix_high</span> Initialize Semesters
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon si-blue"><span class="material-icons-round">calendar_today</span></div>
          <div><div class="stat-value">${sems.length}</div><div class="stat-label">Total Semesters</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon si-green"><span class="material-icons-round">people</span></div>
          <div><div class="stat-value">${approved}</div><div class="stat-label">Approved Users</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon si-orange"><span class="material-icons-round">pending</span></div>
          <div><div class="stat-value">${pending}</div><div class="stat-label">Pending Approval</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon si-purple"><span class="material-icons-round">notifications</span></div>
          <div><div class="stat-value">${notices.length}</div><div class="stat-label">Active Notices</div></div>
        </div>
      </div>

      ${pending > 0 ? `
        <div class="info-box warning-box" style="margin-bottom:1.5rem;">
          <span class="material-icons-round">warning_amber</span>
          <div>
            <strong>${pending} student(s) pending approval.</strong>
            <a href="#" onclick="adminSwitchTab('users', document.querySelector('[data-tab=users]'));return false;" style="margin-left:8px;">Review now →</a>
          </div>
        </div>
      ` : ''}

      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-body">
          <div style="font-weight:700;color:var(--primary-dark);margin-bottom:1rem;display:flex;align-items:center;gap:8px;">
            <span class="material-icons-round">info</span> Quick Start Guide
          </div>
          <ol style="color:var(--text-secondary);font-size:0.875rem;line-height:2;padding-left:1.5rem;">
            <li>Go to <strong>Site Settings</strong> and set your department name, university name, and about text.</li>
            <li>Click <em>Initialize Semesters</em> above to auto-create Semesters 1-8.</li>
            <li>Go to <strong>Subjects & Resources</strong> to add subjects to each semester.</li>
            <li>Add Google Drive links for each subject's resources.</li>
            <li>Add <strong>Books</strong>, <strong>Software</strong>, and <strong>Tutorials</strong> from their sections.</li>
            <li>Go to <strong>Users</strong> and approve waiting students.</li>
            <li>Post <strong>Notices</strong> for announcements, exam schedules, etc.</li>
          </ol>
        </div>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<p class="text-muted" style="padding:1rem;">${err.message}</p>`;
  }
}

async function adminSeedData() {
  const cfg = await dbGetConfig();
  if (!confirm('This will create Semesters 1–8 if they don\'t exist. Continue?')) return;
  try {
    await dbSeedInitialData(cfg);
    showToast('Semesters initialized successfully!', 'success');
    adminLoadOverview();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

// ── SITE SETTINGS ────────────────────────────────────────────
async function adminLoadSettings() {
  const el = document.getElementById('admin-section-settings');
  el.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const cfg = await dbGetConfig();
    el.innerHTML = `
      <div class="admin-section-header">
        <div class="admin-section-title"><span class="material-icons-round">settings</span> Site Settings</div>
      </div>
      <div class="card">
        <div class="card-body">
          <form onsubmit="adminSaveSettings(event)">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Department Name *</label>
                <input type="text" id="cfg-dept" class="form-control" value="${escHtml(cfg.deptName || '')}" placeholder="e.g. Dept. of Computer Science" required />
              </div>
              <div class="form-group">
                <label class="form-label">University Name *</label>
                <input type="text" id="cfg-uni" class="form-control" value="${escHtml(cfg.universityName || '')}" placeholder="e.g. XYZ University" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Hero Section Title</label>
              <input type="text" id="cfg-hero-title" class="form-control" value="${escHtml(cfg.heroTitle || '')}" placeholder="Welcome to..." />
            </div>
            <div class="form-group">
              <label class="form-label">Hero Subtitle</label>
              <input type="text" id="cfg-hero-sub" class="form-control" value="${escHtml(cfg.heroSubtitle || '')}" placeholder="Short tagline..." />
            </div>
            <div class="form-group">
              <label class="form-label">About Section Title</label>
              <input type="text" id="cfg-about-title" class="form-control" value="${escHtml(cfg.aboutTitle || '')}" placeholder="About Our Department" />
            </div>
            <div class="form-group">
              <label class="form-label">About Section Text</label>
              <textarea id="cfg-about-text" class="form-control" rows="4">${escHtml(cfg.aboutText || '')}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Admin Contact Email</label>
              <input type="email" id="cfg-admin-email" class="form-control" value="${escHtml(cfg.adminEmail || ADMIN_EMAIL)}" />
              <div class="form-hint">Shown on the Contact page.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Footer Note</label>
              <input type="text" id="cfg-footer" class="form-control" value="${escHtml(cfg.footerNote || 'For internal academic use only.')}" />
            </div>
            <div class="form-actions">
              <button type="submit" id="save-settings-btn" class="btn btn-primary">
                <span class="material-icons-round">save</span> Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<p class="text-muted">${err.message}</p>`;
  }
}

async function adminSaveSettings(e) {
  e.preventDefault();
  const btn = document.getElementById('save-settings-btn');
  btn.disabled = true;
  btn.innerHTML = `<span class="material-icons-round spin">sync</span> Saving...`;
  try {
    const data = {
      deptName:       document.getElementById('cfg-dept').value.trim(),
      universityName: document.getElementById('cfg-uni').value.trim(),
      heroTitle:      document.getElementById('cfg-hero-title').value.trim(),
      heroSubtitle:   document.getElementById('cfg-hero-sub').value.trim(),
      aboutTitle:     document.getElementById('cfg-about-title').value.trim(),
      aboutText:      document.getElementById('cfg-about-text').value.trim(),
      adminEmail:     document.getElementById('cfg-admin-email').value.trim(),
      footerNote:     document.getElementById('cfg-footer').value.trim(),
    };
    await dbSetConfig(data);
    // Refresh nav/footer
    if (window.loadSiteConfig) await window.loadSiteConfig();
    showToast('Settings saved!', 'success');
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="material-icons-round">save</span> Save Settings`;
  }
}

// ── SEMESTERS ────────────────────────────────────────────────
async function adminLoadSemesters() {
  const el = document.getElementById('admin-section-semesters');
  el.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const sems = await dbGetSemesters(true);
    el.innerHTML = `
      <div class="admin-section-header">
        <div class="admin-section-title"><span class="material-icons-round">calendar_today</span> Semesters</div>
        <button class="btn btn-primary btn-sm" onclick="adminShowSemesterForm()">
          <span class="material-icons-round">add</span> Add Semester
        </button>
      </div>
      ${sems.length === 0 ? `
        <div class="empty-state">
          <span class="material-icons-round">calendar_today</span>
          <h3>No Semesters</h3>
          <p>Click "Add Semester" or use "Initialize Semesters" from the Overview tab.</p>
        </div>
      ` : `
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>#</th><th>Semester Name</th><th>Description</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              ${sems.map(s => `
                <tr>
                  <td><strong>${s.order}</strong></td>
                  <td><strong>${escHtml(s.name)}</strong></td>
                  <td>${escHtml(s.description || '—')}</td>
                  <td>${s.hidden ? '<span class="badge badge-danger">Hidden</span>' : '<span class="badge badge-success">Visible</span>'}</td>
                  <td style="white-space:nowrap;">
                    <button class="btn btn-ghost btn-sm" onclick="adminShowSemesterForm('${s.id}')">
                      <span class="material-icons-round">edit</span> Edit
                    </button>
                    <button class="btn ${s.hidden ? 'btn-success' : 'btn-warning'} btn-sm" onclick="adminToggleSemVisible('${s.id}', ${s.hidden})">
                      <span class="material-icons-round">${s.hidden ? 'visibility' : 'visibility_off'}</span>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="adminDeleteSemester('${s.id}')">
                      <span class="material-icons-round">delete</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  } catch (err) {
    el.innerHTML = `<p class="text-muted">${err.message}</p>`;
  }
}

async function adminShowSemesterForm(id = null) {
  let sem = {};
  if (id) {
    const snap = await db.collection('semesters').doc(id).get();
    sem = snap.data() || {};
  }
  openModal(id ? 'Edit Semester' : 'Add Semester', `
    <form onsubmit="adminSaveSemester(event, '${id || ''}')">
      <div class="form-group">
        <label class="form-label">Semester Name *</label>
        <input type="text" id="sem-name" class="form-control" value="${escHtml(sem.name || '')}" placeholder="e.g. Semester 1" required />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Order / Number</label>
          <input type="number" id="sem-order" class="form-control" value="${sem.order || ''}" placeholder="1" min="1" />
        </div>
        <div class="form-group">
          <label class="form-label">Short Description</label>
          <input type="text" id="sem-desc" class="form-control" value="${escHtml(sem.description || '')}" placeholder="e.g. Year 1, First Term" />
        </div>
      </div>
      <div class="form-group">
        <label class="toggle">
          <input type="checkbox" id="sem-hidden" ${sem.hidden ? 'checked' : ''}>
          <span class="toggle-track"></span>
          <span class="toggle-label">Hide this semester from students</span>
        </label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">
          <span class="material-icons-round">save</span> ${id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  `);
}

async function adminSaveSemester(e, id) {
  e.preventDefault();
  const data = {
    name:        document.getElementById('sem-name').value.trim(),
    order:       parseInt(document.getElementById('sem-order').value) || 1,
    description: document.getElementById('sem-desc').value.trim(),
    hidden:      document.getElementById('sem-hidden').checked,
  };
  try {
    if (id) { await dbUpdateSemester(id, data); showToast('Semester updated!', 'success'); }
    else     { await dbCreateSemester(data);     showToast('Semester created!', 'success'); }
    closeModal();
    adminLoadSemesters();
    // Refresh nav dropdown
    if (window.populateSemesterDropdown) window.populateSemesterDropdown();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

async function adminToggleSemVisible(id, currentHidden) {
  await dbUpdateSemester(id, { hidden: !currentHidden });
  showToast(`Semester ${currentHidden ? 'made visible' : 'hidden'}.`, 'success');
  adminLoadSemesters();
}

async function adminDeleteSemester(id) {
  const ok = await confirmDialog('Delete this semester and all its subjects and resources? This cannot be undone.');
  if (!ok) return;
  try {
    await dbDeleteSemester(id);
    showToast('Semester deleted.', 'success');
    adminLoadSemesters();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

// ── SUBJECTS & RESOURCES ─────────────────────────────────────
let _adminSelectedSemId = '';

async function adminLoadSubjects() {
  const el = document.getElementById('admin-section-subjects');
  el.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const sems = await dbGetSemesters(true);
    const selected = _adminSelectedSemId || (sems[0] ? sems[0].id : '');
    _adminSelectedSemId = selected;

    let subjects = [];
    if (selected) subjects = await dbGetSubjectsBySemester(selected, true);

    el.innerHTML = `
      <div class="admin-section-header">
        <div class="admin-section-title"><span class="material-icons-round">class</span> Subjects & Resources</div>
      </div>
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
        <div class="form-group" style="margin:0;flex:1;min-width:200px;">
          <label class="form-label">Select Semester</label>
          <select class="form-control" id="admin-sem-select" onchange="adminChangeSemester(this.value)">
            ${sems.map(s => `<option value="${s.id}" ${s.id === selected ? 'selected' : ''}>${escHtml(s.name)}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-primary btn-sm" onclick="adminShowSubjectForm()" style="margin-top:1.3rem;">
          <span class="material-icons-round">add</span> Add Subject
        </button>
      </div>

      <div id="subjects-admin-list">
        ${subjects.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">class</span>
            <h3>No Subjects</h3>
            <p>Add subjects for this semester using the button above.</p>
          </div>
        ` : subjects.map(sub => `
          <div class="card" style="margin-bottom:1rem;" id="sub-admin-${sub.id}">
            <div class="card-body">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:0.75rem;">
                <div>
                  <div style="font-weight:700;color:var(--primary-dark);font-size:0.95rem;">${escHtml(sub.name)}</div>
                  <div style="display:flex;gap:6px;margin-top:4px;">
                    <span class="badge badge-primary">${escHtml(sub.code || 'No Code')}</span>
                    ${sub.hidden ? '<span class="badge badge-danger">Hidden</span>' : '<span class="badge badge-success">Visible</span>'}
                    ${sub.teacherName ? `<span class="badge badge-gray"><span class="material-icons-round" style="font-size:0.75rem;">person</span> ${escHtml(sub.teacherName)}</span>` : ''}
                  </div>
                  ${sub.driveFolderLink ? `
                    <a href="${escHtml(sub.driveFolderLink)}" target="_blank" rel="noopener" style="font-size:0.77rem;color:var(--success);margin-top:4px;display:flex;align-items:center;gap:4px;">
                      <span class="material-icons-round" style="font-size:0.9rem;">folder_open</span> Drive Folder Linked
                    </a>` : ''}
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button class="btn btn-ghost btn-sm" onclick="adminShowResourceForm('${sub.id}', '${escHtml(sub.name)}')">
                    <span class="material-icons-round">add_link</span> Add Resource
                  </button>
                  <button class="btn btn-ghost btn-sm" onclick="adminShowSubjectForm('${sub.id}')">
                    <span class="material-icons-round">edit</span> Edit
                  </button>
                  <button class="btn ${sub.hidden ? 'btn-success' : 'btn-warning'} btn-sm" onclick="adminToggleSubjectVisible('${sub.id}', ${sub.hidden})">
                    <span class="material-icons-round">${sub.hidden ? 'visibility' : 'visibility_off'}</span>
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="adminDeleteSubject('${sub.id}')">
                    <span class="material-icons-round">delete</span>
                  </button>
                </div>
              </div>
              <div id="res-admin-${sub.id}">
                <div class="page-loader" style="min-height:40px;"><div class="spinner" style="width:24px;height:24px;border-width:2px;"></div></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Load resources for each subject
    for (const sub of subjects) {
      adminLoadResources(sub.id);
    }
  } catch (err) {
    el.innerHTML = `<p class="text-muted">${err.message}</p>`;
  }
}

function adminChangeSemester(semId) {
  _adminSelectedSemId = semId;
  adminLoadSubjects();
}

async function adminLoadResources(subId) {
  const container = document.getElementById(`res-admin-${subId}`);
  if (!container) return;
  try {
    const resources = await dbGetResourcesBySubject(subId, true);
    if (resources.length === 0) {
      container.innerHTML = `<p style="font-size:0.8rem;color:var(--text-muted);padding:6px 0;">No resources added yet.</p>`;
      return;
    }
    container.innerHTML = `
      <div class="table-wrap" style="margin-top:8px;">
        <table class="data-table" style="font-size:0.8rem;">
          <thead><tr><th>Type</th><th>Label</th><th>Drive Link</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${resources.map(r => `
              <tr>
                <td><span class="badge badge-info">${escHtml(r.type)}</span></td>
                <td>${escHtml(r.label)}</td>
                <td>
                  <a href="${escHtml(r.driveLink)}" target="_blank" rel="noopener"
                    style="font-size:0.77rem;color:var(--primary);display:flex;align-items:center;gap:3px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    <span class="material-icons-round" style="font-size:0.85rem;flex-shrink:0;">open_in_new</span>
                    ${escHtml(r.driveLink.slice(0, 40))}...
                  </a>
                </td>
                <td>${r.hidden ? '<span class="badge badge-danger">Hidden</span>' : '<span class="badge badge-success">Visible</span>'}</td>
                <td style="white-space:nowrap;">
                  <button class="btn btn-ghost btn-sm" onclick="adminShowResourceForm('${subId}', '', '${r.id}')">
                    <span class="material-icons-round">edit</span>
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="adminDeleteResource('${r.id}', '${subId}')">
                    <span class="material-icons-round">delete</span>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p class="text-muted" style="font-size:0.8rem;">${err.message}</p>`;
  }
}

async function adminShowSubjectForm(id = null) {
  const sems = await dbGetSemesters(true);
  let sub = {};
  if (id) {
    const snap = await db.collection('subjects').doc(id).get();
    sub = snap.data() || {};
  }
  openModal(id ? 'Edit Subject' : 'Add Subject', `
    <form onsubmit="adminSaveSubject(event, '${id || ''}')">
      <div class="form-group">
        <label class="form-label">Semester *</label>
        <select id="sub-semid" class="form-control" required>
          <option value="">-- Select Semester --</option>
          ${sems.map(s => `<option value="${s.id}" ${(sub.semesterId === s.id || s.id === _adminSelectedSemId) && !id ? 'selected' : sub.semesterId === s.id ? 'selected' : ''}>${escHtml(s.name)}</option>`).join('')}
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Subject Name *</label>
          <input type="text" id="sub-name" class="form-control" value="${escHtml(sub.name || '')}" placeholder="e.g. Programming Fundamentals" required />
        </div>
        <div class="form-group">
          <label class="form-label">Course Code</label>
          <input type="text" id="sub-code" class="form-control" value="${escHtml(sub.code || '')}" placeholder="e.g. CSE101" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Teacher Name (optional)</label>
        <input type="text" id="sub-teacher" class="form-control" value="${escHtml(sub.teacherName || '')}" placeholder="Dr. Example Name" />
      </div>
      <div class="form-group">
        <label class="form-label">Google Drive Folder Link (optional)</label>
        <input type="url" id="sub-drive" class="form-control" value="${escHtml(sub.driveFolderLink || '')}" placeholder="https://drive.google.com/drive/folders/..." />
        <div class="form-hint">Main Drive folder for this subject. Students will see an "Open Folder" button.</div>
      </div>
      <div class="form-group">
        <label class="form-label">Order (display position)</label>
        <input type="number" id="sub-order" class="form-control" value="${sub.order || 1}" min="1" />
      </div>
      <div class="form-group">
        <label class="toggle">
          <input type="checkbox" id="sub-hidden" ${sub.hidden ? 'checked' : ''}>
          <span class="toggle-track"></span>
          <span class="toggle-label">Hide subject from students</span>
        </label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary"><span class="material-icons-round">save</span> ${id ? 'Update' : 'Create'}</button>
      </div>
    </form>
  `);
}

async function adminSaveSubject(e, id) {
  e.preventDefault();
  const data = {
    semesterId:     document.getElementById('sub-semid').value,
    name:           document.getElementById('sub-name').value.trim(),
    code:           document.getElementById('sub-code').value.trim(),
    teacherName:    document.getElementById('sub-teacher').value.trim(),
    driveFolderLink:document.getElementById('sub-drive').value.trim(),
    order:          parseInt(document.getElementById('sub-order').value) || 1,
    hidden:         document.getElementById('sub-hidden').checked,
  };
  try {
    if (id) { await dbUpdateSubject(id, data); showToast('Subject updated!', 'success'); }
    else     { await dbCreateSubject(data);     showToast('Subject created!', 'success'); }
    closeModal();
    adminLoadSubjects();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

async function adminToggleSubjectVisible(id, currentHidden) {
  await dbUpdateSubject(id, { hidden: !currentHidden });
  showToast(`Subject ${currentHidden ? 'visible' : 'hidden'}.`, 'success');
  adminLoadSubjects();
}

async function adminDeleteSubject(id) {
  const ok = await confirmDialog('Delete this subject and all its resources?');
  if (!ok) return;
  try {
    await dbDeleteSubject(id);
    showToast('Subject deleted.', 'success');
    adminLoadSubjects();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

// Resources
const RESOURCE_TYPES = [
  { value: 'slides',    label: 'Lecture Slides' },
  { value: 'book',      label: 'Books / PDFs' },
  { value: 'lab',       label: 'Lab Reports' },
  { value: 'assignment',label: 'Assignments' },
  { value: 'questions', label: 'Previous Questions' },
  { value: 'video',     label: 'Recorded Classes' },
  { value: 'extra',     label: 'Extra Resources' },
];

async function adminShowResourceForm(subjectId, subjectName = '', resourceId = '') {
  let res = {};
  if (resourceId) {
    const snap = await db.collection('resources').doc(resourceId).get();
    res = snap.data() || {};
  }
  openModal(resourceId ? 'Edit Resource' : `Add Resource${subjectName ? ' — ' + subjectName : ''}`, `
    <form onsubmit="adminSaveResource(event, '${subjectId}', '${resourceId}')">
      <div class="form-group">
        <label class="form-label">Resource Type *</label>
        <select id="res-type" class="form-control" required>
          ${RESOURCE_TYPES.map(t => `<option value="${t.value}" ${res.type === t.value ? 'selected' : ''}>${t.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Label / Title *</label>
        <input type="text" id="res-label" class="form-control" value="${escHtml(res.label || '')}"
          placeholder="e.g. Lecture Slides - Chapter 1-5" required />
      </div>
      <div class="form-group">
        <label class="form-label">Google Drive / File Link *</label>
        <input type="url" id="res-link" class="form-control" value="${escHtml(res.driveLink || '')}"
          placeholder="https://drive.google.com/..." required />
        <div class="form-hint">⚠️ Remember to set file sharing to "Anyone with link (in org)" in Google Drive.</div>
      </div>
      <div class="form-group">
        <label class="toggle">
          <input type="checkbox" id="res-hidden" ${res.hidden ? 'checked' : ''}>
          <span class="toggle-track"></span>
          <span class="toggle-label">Hide resource from students</span>
        </label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary"><span class="material-icons-round">save</span> ${resourceId ? 'Update' : 'Add Resource'}</button>
      </div>
    </form>
  `);
}

async function adminSaveResource(e, subjectId, resourceId) {
  e.preventDefault();
  const data = {
    subjectId,
    type:      document.getElementById('res-type').value,
    label:     document.getElementById('res-label').value.trim(),
    driveLink: document.getElementById('res-link').value.trim(),
    hidden:    document.getElementById('res-hidden').checked,
  };
  try {
    if (resourceId) { await dbUpdateResource(resourceId, data); showToast('Resource updated!', 'success'); }
    else            { await dbCreateResource(data);             showToast('Resource added!', 'success'); }
    closeModal();
    adminLoadResources(subjectId);
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

async function adminDeleteResource(id, subjectId) {
  const ok = await confirmDialog('Delete this resource?');
  if (!ok) return;
  try {
    await dbDeleteResource(id);
    showToast('Resource deleted.', 'success');
    adminLoadResources(subjectId);
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

// ── BOOKS ADMIN ──────────────────────────────────────────────
async function adminLoadBooks() {
  const el = document.getElementById('admin-section-books');
  el.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const books = await dbGetBooks(true);
    el.innerHTML = `
      <div class="admin-section-header">
        <div class="admin-section-title"><span class="material-icons-round">menu_book</span> Books</div>
        <button class="btn btn-primary btn-sm" onclick="adminShowBookForm()">
          <span class="material-icons-round">add</span> Add Book
        </button>
      </div>
      ${books.length === 0 ? `<div class="empty-state"><span class="material-icons-round">menu_book</span><h3>No Books</h3><p>Add reference books for students.</p></div>` : `
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Title</th><th>Author</th><th>Semester</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${books.map(b => `
                <tr>
                  <td><strong>${escHtml(b.title)}</strong></td>
                  <td>${escHtml(b.author || '—')}</td>
                  <td>${escHtml(b.semester || '—')}</td>
                  <td>${b.hidden ? '<span class="badge badge-danger">Hidden</span>' : '<span class="badge badge-success">Visible</span>'}</td>
                  <td style="white-space:nowrap;">
                    <a href="${escHtml(b.driveLink)}" target="_blank" class="btn btn-ghost btn-sm"><span class="material-icons-round">open_in_new</span></a>
                    <button class="btn btn-ghost btn-sm" onclick="adminShowBookForm('${b.id}')"><span class="material-icons-round">edit</span></button>
                    <button class="btn btn-danger btn-sm" onclick="adminDeleteBook('${b.id}')"><span class="material-icons-round">delete</span></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  } catch (err) { el.innerHTML = `<p class="text-muted">${err.message}</p>`; }
}

async function adminShowBookForm(id = null) {
  let b = {};
  if (id) { const snap = await db.collection('books').doc(id).get(); b = snap.data() || {}; }
  openModal(id ? 'Edit Book' : 'Add Book', `
    <form onsubmit="adminSaveBook(event, '${id || ''}')">
      <div class="form-group"><label class="form-label">Book Title *</label>
        <input type="text" id="book-title" class="form-control" value="${escHtml(b.title || '')}" required placeholder="e.g. Introduction to Algorithms" /></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Author(s)</label>
          <input type="text" id="book-author" class="form-control" value="${escHtml(b.author || '')}" placeholder="e.g. Thomas H. Cormen" /></div>
        <div class="form-group"><label class="form-label">Semester / Course</label>
          <input type="text" id="book-sem" class="form-control" value="${escHtml(b.semester || '')}" placeholder="e.g. Semester 3" /></div>
      </div>
      <div class="form-group"><label class="form-label">Description</label>
        <textarea id="book-desc" class="form-control" rows="2">${escHtml(b.description || '')}</textarea></div>
      <div class="form-group"><label class="form-label">Google Drive / PDF Link *</label>
        <input type="url" id="book-link" class="form-control" value="${escHtml(b.driveLink || '')}" required placeholder="https://drive.google.com/..." /></div>
      <div class="form-group"><label class="form-label">Order</label>
        <input type="number" id="book-order" class="form-control" value="${b.order || 1}" min="1" /></div>
      <div class="form-group"><label class="toggle"><input type="checkbox" id="book-hidden" ${b.hidden ? 'checked' : ''}><span class="toggle-track"></span><span class="toggle-label">Hide from students</span></label></div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary"><span class="material-icons-round">save</span> ${id ? 'Update' : 'Add Book'}</button>
      </div>
    </form>
  `);
}

async function adminSaveBook(e, id) {
  e.preventDefault();
  const data = {
    title: document.getElementById('book-title').value.trim(),
    author: document.getElementById('book-author').value.trim(),
    semester: document.getElementById('book-sem').value.trim(),
    description: document.getElementById('book-desc').value.trim(),
    driveLink: document.getElementById('book-link').value.trim(),
    order: parseInt(document.getElementById('book-order').value) || 1,
    hidden: document.getElementById('book-hidden').checked,
  };
  try {
    if (id) { await dbUpdateBook(id, data); showToast('Book updated!', 'success'); }
    else    { await dbCreateBook(data);     showToast('Book added!', 'success'); }
    closeModal(); adminLoadBooks();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

async function adminDeleteBook(id) {
  const ok = await confirmDialog('Delete this book?');
  if (!ok) return;
  try { await dbDeleteBook(id); showToast('Deleted.', 'success'); adminLoadBooks(); }
  catch (err) { showToast('Error: ' + err.message, 'error'); }
}

// ── SOFTWARE ADMIN ───────────────────────────────────────────
async function adminLoadSoftware() {
  const el = document.getElementById('admin-section-software');
  el.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const sw = await dbGetSoftware(true);
    el.innerHTML = `
      <div class="admin-section-header">
        <div class="admin-section-title"><span class="material-icons-round">computer</span> Software</div>
        <button class="btn btn-primary btn-sm" onclick="adminShowSoftwareForm()"><span class="material-icons-round">add</span> Add Software</button>
      </div>
      ${sw.length === 0 ? `<div class="empty-state"><span class="material-icons-round">computer</span><h3>No Software</h3><p>Add required software for students.</p></div>` : `
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Name</th><th>Version</th><th>Course</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${sw.map(s => `<tr>
                <td><strong>${escHtml(s.name)}</strong></td>
                <td>${escHtml(s.version || '—')}</td>
                <td>${escHtml(s.course || '—')}</td>
                <td>${s.hidden ? '<span class="badge badge-danger">Hidden</span>' : '<span class="badge badge-success">Visible</span>'}</td>
                <td style="white-space:nowrap;">
                  <button class="btn btn-ghost btn-sm" onclick="adminShowSoftwareForm('${s.id}')"><span class="material-icons-round">edit</span></button>
                  <button class="btn btn-danger btn-sm" onclick="adminDeleteSoftware('${s.id}')"><span class="material-icons-round">delete</span></button>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  } catch (err) { el.innerHTML = `<p class="text-muted">${err.message}</p>`; }
}

async function adminShowSoftwareForm(id = null) {
  let s = {};
  if (id) { const snap = await db.collection('software').doc(id).get(); s = snap.data() || {}; }
  openModal(id ? 'Edit Software' : 'Add Software', `
    <form onsubmit="adminSaveSoftware(event, '${id || ''}')">
      <div class="form-row">
        <div class="form-group"><label class="form-label">Software Name *</label>
          <input type="text" id="sw-name" class="form-control" value="${escHtml(s.name || '')}" required placeholder="e.g. MATLAB" /></div>
        <div class="form-group"><label class="form-label">Version</label>
          <input type="text" id="sw-ver" class="form-control" value="${escHtml(s.version || '')}" placeholder="e.g. R2024a" /></div>
      </div>
      <div class="form-group"><label class="form-label">Related Course</label>
        <input type="text" id="sw-course" class="form-control" value="${escHtml(s.course || '')}" placeholder="e.g. EEE201" /></div>
      <div class="form-group"><label class="form-label">Description</label>
        <textarea id="sw-desc" class="form-control" rows="2">${escHtml(s.description || '')}</textarea></div>
      <div class="form-group"><label class="form-label">Download Link *</label>
        <input type="url" id="sw-link" class="form-control" value="${escHtml(s.downloadLink || '')}" required placeholder="https://drive.google.com/..." /></div>
      <div class="form-group"><label class="form-label">Order</label>
        <input type="number" id="sw-order" class="form-control" value="${s.order || 1}" min="1" /></div>
      <div class="form-group"><label class="toggle"><input type="checkbox" id="sw-hidden" ${s.hidden ? 'checked' : ''}><span class="toggle-track"></span><span class="toggle-label">Hide from students</span></label></div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary"><span class="material-icons-round">save</span> ${id ? 'Update' : 'Add Software'}</button>
      </div>
    </form>
  `);
}

async function adminSaveSoftware(e, id) {
  e.preventDefault();
  const data = {
    name: document.getElementById('sw-name').value.trim(),
    version: document.getElementById('sw-ver').value.trim(),
    course: document.getElementById('sw-course').value.trim(),
    description: document.getElementById('sw-desc').value.trim(),
    downloadLink: document.getElementById('sw-link').value.trim(),
    order: parseInt(document.getElementById('sw-order').value) || 1,
    hidden: document.getElementById('sw-hidden').checked,
  };
  try {
    if (id) { await dbUpdateSoftware(id, data); showToast('Updated!', 'success'); }
    else    { await dbCreateSoftware(data);     showToast('Added!', 'success'); }
    closeModal(); adminLoadSoftware();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

async function adminDeleteSoftware(id) {
  const ok = await confirmDialog('Delete this software entry?');
  if (!ok) return;
  try { await dbDeleteSoftware(id); showToast('Deleted.', 'success'); adminLoadSoftware(); }
  catch (err) { showToast('Error: ' + err.message, 'error'); }
}

// ── TUTORIALS ADMIN ──────────────────────────────────────────
async function adminLoadTutorials() {
  const el = document.getElementById('admin-section-tutorials');
  el.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const tutorials = await dbGetTutorials(true);
    el.innerHTML = `
      <div class="admin-section-header">
        <div class="admin-section-title"><span class="material-icons-round">play_circle</span> Tutorials</div>
        <button class="btn btn-primary btn-sm" onclick="adminShowTutorialForm()"><span class="material-icons-round">add</span> Add Tutorial</button>
      </div>
      ${tutorials.length === 0 ? `<div class="empty-state"><span class="material-icons-round">play_circle</span><h3>No Tutorials</h3><p>Add tutorial videos and guides.</p></div>` : `
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Title</th><th>Platform</th><th>Duration</th><th>Course</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${tutorials.map(t => `<tr>
                <td><strong>${escHtml(t.title)}</strong></td>
                <td>${escHtml(t.platform || '—')}</td>
                <td>${escHtml(t.duration || '—')}</td>
                <td>${escHtml(t.course || '—')}</td>
                <td>${t.hidden ? '<span class="badge badge-danger">Hidden</span>' : '<span class="badge badge-success">Visible</span>'}</td>
                <td style="white-space:nowrap;">
                  <a href="${escHtml(t.link)}" target="_blank" class="btn btn-ghost btn-sm"><span class="material-icons-round">open_in_new</span></a>
                  <button class="btn btn-ghost btn-sm" onclick="adminShowTutorialForm('${t.id}')"><span class="material-icons-round">edit</span></button>
                  <button class="btn btn-danger btn-sm" onclick="adminDeleteTutorial('${t.id}')"><span class="material-icons-round">delete</span></button>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  } catch (err) { el.innerHTML = `<p class="text-muted">${err.message}</p>`; }
}

async function adminShowTutorialForm(id = null) {
  let t = {};
  if (id) { const snap = await db.collection('tutorials').doc(id).get(); t = snap.data() || {}; }
  openModal(id ? 'Edit Tutorial' : 'Add Tutorial', `
    <form onsubmit="adminSaveTutorial(event, '${id || ''}')">
      <div class="form-group"><label class="form-label">Title *</label>
        <input type="text" id="tut-title" class="form-control" value="${escHtml(t.title || '')}" required placeholder="e.g. Getting Started with MATLAB" /></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Platform</label>
          <input type="text" id="tut-platform" class="form-control" value="${escHtml(t.platform || '')}" placeholder="e.g. YouTube, Google Drive" /></div>
        <div class="form-group"><label class="form-label">Duration</label>
          <input type="text" id="tut-duration" class="form-control" value="${escHtml(t.duration || '')}" placeholder="e.g. 15 min" /></div>
      </div>
      <div class="form-group"><label class="form-label">Related Course</label>
        <input type="text" id="tut-course" class="form-control" value="${escHtml(t.course || '')}" placeholder="e.g. EEE201" /></div>
      <div class="form-group"><label class="form-label">Description</label>
        <textarea id="tut-desc" class="form-control" rows="2">${escHtml(t.description || '')}</textarea></div>
      <div class="form-group"><label class="form-label">Video / Resource Link *</label>
        <input type="url" id="tut-link" class="form-control" value="${escHtml(t.link || '')}" required placeholder="https://youtube.com/... or https://drive.google.com/..." /></div>
      <div class="form-group"><label class="form-label">Order</label>
        <input type="number" id="tut-order" class="form-control" value="${t.order || 1}" min="1" /></div>
      <div class="form-group"><label class="toggle"><input type="checkbox" id="tut-hidden" ${t.hidden ? 'checked' : ''}><span class="toggle-track"></span><span class="toggle-label">Hide from students</span></label></div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary"><span class="material-icons-round">save</span> ${id ? 'Update' : 'Add Tutorial'}</button>
      </div>
    </form>
  `);
}

async function adminSaveTutorial(e, id) {
  e.preventDefault();
  const data = {
    title: document.getElementById('tut-title').value.trim(),
    platform: document.getElementById('tut-platform').value.trim(),
    duration: document.getElementById('tut-duration').value.trim(),
    course: document.getElementById('tut-course').value.trim(),
    description: document.getElementById('tut-desc').value.trim(),
    link: document.getElementById('tut-link').value.trim(),
    order: parseInt(document.getElementById('tut-order').value) || 1,
    hidden: document.getElementById('tut-hidden').checked,
  };
  try {
    if (id) { await dbUpdateTutorial(id, data); showToast('Updated!', 'success'); }
    else    { await dbCreateTutorial(data);     showToast('Added!', 'success'); }
    closeModal(); adminLoadTutorials();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

async function adminDeleteTutorial(id) {
  const ok = await confirmDialog('Delete this tutorial?');
  if (!ok) return;
  try { await dbDeleteTutorial(id); showToast('Deleted.', 'success'); adminLoadTutorials(); }
  catch (err) { showToast('Error: ' + err.message, 'error'); }
}

// ── NOTICES ADMIN ────────────────────────────────────────────
async function adminLoadNotices() {
  const el = document.getElementById('admin-section-notices');
  el.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const notices = await dbGetNotices(true);
    el.innerHTML = `
      <div class="admin-section-header">
        <div class="admin-section-title"><span class="material-icons-round">notifications</span> Notices</div>
        <button class="btn btn-primary btn-sm" onclick="adminShowNoticeForm()"><span class="material-icons-round">add</span> Post Notice</button>
      </div>
      ${notices.length === 0 ? `<div class="empty-state"><span class="material-icons-round">notifications</span><h3>No Notices</h3><p>Post your first notice to students.</p></div>` : `
        <div style="display:flex;flex-direction:column;gap:0.875rem;">
          ${notices.map(n => `
            <div class="card" style="border-left:4px solid ${n.pinned ? 'var(--warning)' : 'var(--primary)'};">
              <div class="card-body">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
                  <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                      ${n.pinned ? '<span class="badge badge-warning"><span class="material-icons-round" style="font-size:0.75rem;">push_pin</span> Pinned</span>' : ''}
                      ${n.hidden ? '<span class="badge badge-danger">Hidden</span>' : '<span class="badge badge-success">Live</span>'}
                      <span style="font-size:0.75rem;color:var(--text-muted);">${formatDate(n.createdAt)}</span>
                    </div>
                    <div style="font-weight:700;color:var(--text-primary);margin-bottom:4px;">${escHtml(n.title)}</div>
                    <div style="font-size:0.85rem;color:var(--text-secondary);">${escHtml(n.body || '')}</div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button class="btn btn-ghost btn-sm" onclick="adminShowNoticeForm('${n.id}')"><span class="material-icons-round">edit</span></button>
                    <button class="btn btn-danger btn-sm" onclick="adminDeleteNotice('${n.id}')"><span class="material-icons-round">delete</span></button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  } catch (err) { el.innerHTML = `<p class="text-muted">${err.message}</p>`; }
}

async function adminShowNoticeForm(id = null) {
  let n = {};
  if (id) { const snap = await db.collection('notices').doc(id).get(); n = snap.data() || {}; }
  openModal(id ? 'Edit Notice' : 'Post Notice', `
    <form onsubmit="adminSaveNotice(event, '${id || ''}')">
      <div class="form-group"><label class="form-label">Notice Title *</label>
        <input type="text" id="notice-title" class="form-control" value="${escHtml(n.title || '')}" required placeholder="e.g. Midterm Exam Schedule" /></div>
      <div class="form-group"><label class="form-label">Notice Body</label>
        <textarea id="notice-body" class="form-control" rows="4" placeholder="Full notice text...">${escHtml(n.body || '')}</textarea></div>
      <div class="form-group">
        <label class="toggle" style="margin-bottom:8px;">
          <input type="checkbox" id="notice-pinned" ${n.pinned ? 'checked' : ''}><span class="toggle-track"></span>
          <span class="toggle-label">Pin this notice (shows at top)</span>
        </label>
        <label class="toggle">
          <input type="checkbox" id="notice-hidden" ${n.hidden ? 'checked' : ''}><span class="toggle-track"></span>
          <span class="toggle-label">Hide from students</span>
        </label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary"><span class="material-icons-round">send</span> ${id ? 'Update' : 'Post Notice'}</button>
      </div>
    </form>
  `);
}

async function adminSaveNotice(e, id) {
  e.preventDefault();
  const data = {
    title:  document.getElementById('notice-title').value.trim(),
    body:   document.getElementById('notice-body').value.trim(),
    pinned: document.getElementById('notice-pinned').checked,
    hidden: document.getElementById('notice-hidden').checked,
  };
  try {
    if (id) { await dbUpdateNotice(id, data); showToast('Notice updated!', 'success'); }
    else    { await dbCreateNotice(data);     showToast('Notice posted!', 'success'); }
    closeModal(); adminLoadNotices();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

async function adminDeleteNotice(id) {
  const ok = await confirmDialog('Delete this notice?');
  if (!ok) return;
  try { await dbDeleteNotice(id); showToast('Deleted.', 'success'); adminLoadNotices(); }
  catch (err) { showToast('Error: ' + err.message, 'error'); }
}

// ── USERS ADMIN ──────────────────────────────────────────────
async function adminLoadUsers() {
  const el = document.getElementById('admin-section-users');
  el.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const users = await dbGetUsers();
    const pending  = users.filter(u => !u.approved && !u.banned);
    const approved = users.filter(u => u.approved);
    const banned   = users.filter(u => u.banned);

    el.innerHTML = `
      <div class="admin-section-header">
        <div class="admin-section-title"><span class="material-icons-round">people</span> Users</div>
        <div style="display:flex;gap:8px;">
          <span class="badge badge-warning">${pending.length} Pending</span>
          <span class="badge badge-success">${approved.length} Approved</span>
          <span class="badge badge-danger">${banned.length} Banned</span>
        </div>
      </div>

      ${pending.length > 0 ? `
        <div style="margin-bottom:2rem;">
          <div style="font-weight:700;color:var(--warning);margin-bottom:0.75rem;display:flex;align-items:center;gap:6px;">
            <span class="material-icons-round">pending</span> Pending Approval (${pending.length})
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Student ID</th><th>Registered</th><th>Actions</th></tr></thead>
              <tbody>
                ${pending.map(u => `<tr>
                  <td><strong>${escHtml(u.name || '—')}</strong></td>
                  <td>${escHtml(u.email)}</td>
                  <td>${escHtml(u.studentId || '—')}</td>
                  <td>${formatDate(u.registeredAt)}</td>
                  <td style="white-space:nowrap;">
                    <button class="btn btn-success btn-sm" onclick="adminApproveUser('${u.id}')">
                      <span class="material-icons-round">check_circle</span> Approve
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="adminBanUser('${u.id}')">
                      <span class="material-icons-round">block</span> Ban
                    </button>
                  </td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <div style="font-weight:700;color:var(--primary-dark);margin-bottom:0.75rem;display:flex;align-items:center;gap:6px;">
        <span class="material-icons-round">people</span> All Users (${users.length})
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead>
          <tbody>
            ${users.map(u => `<tr>
              <td><strong>${escHtml(u.name || '—')}</strong></td>
              <td style="font-size:0.8rem;">${escHtml(u.email)}</td>
              <td><span class="badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}">${escHtml(u.role || 'student')}</span></td>
              <td>${u.banned ? '<span class="badge badge-danger">Banned</span>' : u.approved ? '<span class="badge badge-success">Approved</span>' : '<span class="badge badge-warning">Pending</span>'}</td>
              <td style="font-size:0.78rem;">${formatDate(u.registeredAt)}</td>
              <td style="white-space:nowrap;">
                ${!u.approved && !u.banned ? `<button class="btn btn-success btn-sm" onclick="adminApproveUser('${u.id}')"><span class="material-icons-round">check</span></button>` : ''}
                ${u.approved && u.role !== 'admin' ? `<button class="btn btn-ghost btn-sm" onclick="adminMakeAdmin('${u.id}')" title="Make Admin"><span class="material-icons-round">admin_panel_settings</span></button>` : ''}
                ${u.role === 'admin' && u.id !== auth.currentUser?.uid ? `<button class="btn btn-warning btn-sm" onclick="adminRevokeAdmin('${u.id}')" title="Revoke Admin"><span class="material-icons-round">remove_moderator</span></button>` : ''}
                ${!u.banned ? `<button class="btn btn-danger btn-sm" onclick="adminBanUser('${u.id}')" title="Ban User"><span class="material-icons-round">block</span></button>` :
                  `<button class="btn btn-success btn-sm" onclick="adminUnbanUser('${u.id}')" title="Unban"><span class="material-icons-round">lock_open</span></button>`}
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) { el.innerHTML = `<p class="text-muted">${err.message}</p>`; }
}

async function adminApproveUser(uid) {
  try { await dbApproveUser(uid); showToast('User approved!', 'success'); adminLoadUsers(); }
  catch (err) { showToast('Error: ' + err.message, 'error'); }
}
async function adminBanUser(uid) {
  const ok = await confirmDialog('Ban this user? They won\'t be able to access any content.');
  if (!ok) return;
  try { await dbBanUser(uid); showToast('User banned.', 'success'); adminLoadUsers(); }
  catch (err) { showToast('Error: ' + err.message, 'error'); }
}
async function adminUnbanUser(uid) {
  try { await dbUnbanUser(uid); showToast('User unbanned.', 'success'); adminLoadUsers(); }
  catch (err) { showToast('Error: ' + err.message, 'error'); }
}
async function adminMakeAdmin(uid) {
  const ok = await confirmDialog('Grant admin privileges to this user?');
  if (!ok) return;
  try { await dbMakeAdmin(uid); showToast('Admin role granted!', 'success'); adminLoadUsers(); }
  catch (err) { showToast('Error: ' + err.message, 'error'); }
}
async function adminRevokeAdmin(uid) {
  const ok = await confirmDialog('Revoke admin role from this user?');
  if (!ok) return;
  try { await dbRevokeAdmin(uid); showToast('Admin role revoked.', 'success'); adminLoadUsers(); }
  catch (err) { showToast('Error: ' + err.message, 'error'); }
}
