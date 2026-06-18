/**
 * semester.js — Semester page & Content overview renderer
 */

// ── Content Page (all semesters overview) ───────────────────
async function renderContent() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const semesters = await dbGetSemesters();
    app.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/home">Home</a>
            <span class="material-icons-round">chevron_right</span>
            <span>Content</span>
          </div>
          <div class="page-title">
            <span class="material-icons-round">library_books</span> All Study Materials
          </div>
          <p class="page-subtitle">Select a semester to browse subjects and resources.</p>
        </div>

        ${semesters.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">folder_off</span>
            <h3>No Semesters Available</h3>
            <p>Admin hasn't added any semesters yet.</p>
          </div>
        ` : `
          <div class="sem-overview-grid">
            ${semesters.map(s => `
              <a href="#/semester/${s.id}" class="sem-card sem-c-${((s.order - 1) % 8) + 1}" onclick="closeMobileMenu()">
                <span class="material-icons-round">class</span>
                <h3>${escHtml(s.name)}</h3>
                <span class="sub-count">${escHtml(s.description || '')}</span>
              </a>
            `).join('')}
          </div>
        `}
      </div>
    `;
  } catch (err) {
    app.innerHTML = renderErrorState(err.message);
  }
}

// ── Semester Detail Page ─────────────────────────────────────
async function renderSemester(semId) {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const [semSnap, subjects] = await Promise.all([
      db.collection('semesters').doc(semId).get(),
      dbGetSubjectsBySemester(semId)
    ]);

    if (!semSnap.exists) {
      app.innerHTML = renderErrorState('Semester not found.');
      return;
    }
    const sem = { id: semSnap.id, ...semSnap.data() };

    app.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/home">Home</a>
            <span class="material-icons-round">chevron_right</span>
            <a href="#/content">Content</a>
            <span class="material-icons-round">chevron_right</span>
            <span>${escHtml(sem.name)}</span>
          </div>
          <div class="page-title">
            <span class="material-icons-round">class</span>
            ${escHtml(sem.name)}
          </div>
          <p class="page-subtitle">${escHtml(sem.description || '')}</p>
        </div>

        ${subjects.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">folder_open</span>
            <h3>No Subjects Yet</h3>
            <p>Admin hasn't added subjects for this semester yet.</p>
          </div>
        ` : `
          <div class="subjects-grid" id="subjects-grid">
            ${subjects.map(sub => renderSubjectCardShell(sub)).join('')}
          </div>
        `}
      </div>
    `;

    // Lazy-expand first card
    if (subjects.length > 0) {
      // Leave all collapsed initially — user clicks to expand
    }
  } catch (err) {
    app.innerHTML = renderErrorState(err.message);
  }
}

function renderSubjectCardShell(sub) {
  return `
    <div class="subject-card" id="sub-card-${sub.id}">
      <div class="subject-card-header" onclick="toggleSubject('${sub.id}')">
        <div class="subject-card-info">
          <div class="subject-name">${escHtml(sub.name)}</div>
          <div class="subject-metas">
            <span class="badge badge-primary">${escHtml(sub.code || '')}</span>
            ${sub.teacherName ? `
              <span class="subject-teacher">
                <span class="material-icons-round">person</span>
                ${escHtml(sub.teacherName)}
              </span>` : ''}
          </div>
        </div>
        <button class="subject-toggle-btn" aria-label="Toggle subject resources">
          <span class="material-icons-round">expand_more</span>
        </button>
      </div>
      <div class="subject-card-body" id="sub-body-${sub.id}">
        <div class="page-loader" style="min-height:80px;"><div class="spinner" style="width:28px;height:28px;border-width:2px;"></div></div>
      </div>
    </div>
  `;
}

async function toggleSubject(subId) {
  const card = document.getElementById(`sub-card-${subId}`);
  const body = document.getElementById(`sub-body-${subId}`);
  if (!card || !body) return;

  const isExpanded = card.classList.contains('expanded');

  if (isExpanded) {
    card.classList.remove('expanded');
    return;
  }

  card.classList.add('expanded');

  // Load resources if not yet loaded
  if (!body.dataset.loaded) {
    body.dataset.loaded = 'true';
    try {
      const sub = await db.collection('subjects').doc(subId).get();
      const subData = sub.data();
      const resources = await dbGetResourcesBySubject(subId);

      const types = [
        { key: 'slides',    icon: 'description',     label: 'Lecture Slides',   cls: 'ri-slides'   },
        { key: 'book',      icon: 'menu_book',        label: 'Books/PDFs',       cls: 'ri-book'     },
        { key: 'lab',       icon: 'science',          label: 'Lab Reports',      cls: 'ri-lab'      },
        { key: 'assignment',icon: 'assignment',       label: 'Assignments',      cls: 'ri-assign'   },
        { key: 'questions', icon: 'quiz',             label: 'Previous Questions',cls: 'ri-question'},
        { key: 'video',     icon: 'video_library',    label: 'Recorded Classes', cls: 'ri-video'    },
        { key: 'extra',     icon: 'folder_special',   label: 'Extra Resources',  cls: 'ri-extra'    },
      ];

      const grouped = {};
      types.forEach(t => grouped[t.key] = []);
      resources.forEach(r => {
        if (grouped[r.type] !== undefined) grouped[r.type].push(r);
        else { if (!grouped['extra']) grouped['extra'] = []; grouped['extra'].push(r); }
      });

      const availableTypes = types.filter(t => grouped[t.key] && grouped[t.key].length > 0);

      let html = '';

      // Drive folder link
      if (subData && subData.driveFolderLink) {
        html += `
          <a href="${escHtml(subData.driveFolderLink)}" target="_blank" rel="noopener" class="subject-drive-link">
            <span class="material-icons-round">folder_open</span>
            Open Google Drive Folder
            <span class="material-icons-round" style="margin-left:auto;">open_in_new</span>
          </a>`;
      }

      if (availableTypes.length === 0) {
        html += `<div class="no-resources"><span class="material-icons-round" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:8px;">folder_off</span>No resources uploaded yet.</div>`;
      } else {
        // Type tabs
        html += `<div class="resource-type-tabs">
          <span class="rtab active" data-type="all" onclick="filterResources('${subId}', 'all', this)">
            <span class="material-icons-round">apps</span> All
          </span>
          ${availableTypes.map(t => `
            <span class="rtab" data-type="${t.key}" onclick="filterResources('${subId}', '${t.key}', this)">
              <span class="material-icons-round">${t.icon}</span> ${t.label}
            </span>
          `).join('')}
        </div>`;

        html += `<div class="resource-list" id="res-list-${subId}">`;
        availableTypes.forEach(t => {
          grouped[t.key].forEach(r => {
            html += `
              <a href="${escHtml(r.driveLink)}" target="_blank" rel="noopener"
                class="resource-item" data-type="${t.key}">
                <div class="resource-icon ${t.cls}">
                  <span class="material-icons-round">${t.icon}</span>
                </div>
                <span class="resource-label">${escHtml(r.label)}</span>
                <span class="resource-action">
                  Open <span class="material-icons-round">open_in_new</span>
                </span>
              </a>`;
          });
        });
        html += `</div>`;
      }

      body.innerHTML = html;
    } catch (err) {
      body.innerHTML = `<p class="text-muted" style="padding:1rem;">Failed to load resources: ${err.message}</p>`;
    }
  }
}

function filterResources(subId, type, el) {
  // Update active tab
  el.closest('.resource-type-tabs').querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  // Filter resource items
  const list = document.getElementById(`res-list-${subId}`);
  if (!list) return;
  list.querySelectorAll('.resource-item').forEach(item => {
    if (type === 'all' || item.dataset.type === type) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

function renderErrorState(msg) {
  return `
    <div class="page-container">
      <div class="empty-state">
        <span class="material-icons-round">error_outline</span>
        <h3>Something Went Wrong</h3>
        <p>${escHtml(msg)}</p>
        <a href="#/home" class="btn btn-primary mt-2">Go Home</a>
      </div>
    </div>`;
}
