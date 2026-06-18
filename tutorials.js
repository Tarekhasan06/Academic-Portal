/**
 * tutorials.js — Tutorials section
 */

const TUT_BANNERS = [
  { bg: 'linear-gradient(135deg,#C62828,#870000)', icon: 'smart_display'  },
  { bg: 'linear-gradient(135deg,#1565C0,#0D47A1)', icon: 'play_circle'   },
  { bg: 'linear-gradient(135deg,#E65100,#BF360C)', icon: 'video_library' },
  { bg: 'linear-gradient(135deg,#2E7D32,#1B5E20)', icon: 'school'        },
  { bg: 'linear-gradient(135deg,#6A1BDB,#4A148C)', icon: 'cast_for_education' },
  { bg: 'linear-gradient(135deg,#00695C,#004D40)', icon: 'ondemand_video' },
];

async function renderTutorials() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const tutorials = await dbGetTutorials();
    app.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/home">Home</a>
            <span class="material-icons-round">chevron_right</span>
            <span>Tutorials</span>
          </div>
          <div class="page-title">
            <span class="material-icons-round">play_circle</span> Software Tutorials
          </div>
          <p class="page-subtitle">Step-by-step video guides and how-to resources for department tools.</p>
        </div>

        ${tutorials.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">play_circle</span>
            <h3>No Tutorials Yet</h3>
            <p>Video tutorials will be added here by the admin soon.</p>
          </div>
        ` : `
          <div class="item-grid">
            ${tutorials.map((t, i) => {
              const style = TUT_BANNERS[i % TUT_BANNERS.length];
              return `
                <div class="item-card">
                  <div class="item-card-banner" style="background:${style.bg};position:relative;">
                    <span class="material-icons-round" style="color:rgba(255,255,255,0.85);font-size:3.5rem;">${style.icon}</span>
                    <div style="position:absolute;bottom:8px;right:8px;">
                      ${t.duration ? `<span class="badge" style="background:rgba(0,0,0,0.5);color:white;">${escHtml(t.duration)}</span>` : ''}
                    </div>
                  </div>
                  <div class="item-card-body">
                    <div class="item-card-title">${escHtml(t.title)}</div>
                    <div class="item-card-sub">${escHtml(t.platform || '')}</div>
                    <div class="item-card-desc">${escHtml(t.description || 'A tutorial resource for department students.')}</div>
                    ${t.course ? `<span class="badge badge-primary" style="margin-bottom:8px;">${escHtml(t.course)}</span>` : ''}
                  </div>
                  <div class="item-card-footer">
                    <a href="${escHtml(t.link)}" target="_blank" rel="noopener" class="btn btn-danger btn-sm" style="width:100%;">
                      <span class="material-icons-round">smart_display</span> Watch Tutorial
                    </a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  } catch (err) {
    app.innerHTML = renderErrorState(err.message);
  }
}
