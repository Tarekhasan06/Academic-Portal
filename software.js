/**
 * software.js — Software section
 */

const SW_BANNERS = [
  { bg: 'linear-gradient(135deg,#1565C0,#0D47A1)',  icon: 'computer'          },
  { bg: 'linear-gradient(135deg,#6A1BDB,#4A148C)',  icon: 'code'              },
  { bg: 'linear-gradient(135deg,#00695C,#004D40)',  icon: 'terminal'          },
  { bg: 'linear-gradient(135deg,#E65100,#BF360C)',  icon: 'settings'          },
  { bg: 'linear-gradient(135deg,#37474F,#263238)',  icon: 'developer_mode'    },
  { bg: 'linear-gradient(135deg,#0277BD,#01579B)',  icon: 'cloud_download'    },
];

async function renderSoftware() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const software = await dbGetSoftware();
    app.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/home">Home</a>
            <span class="material-icons-round">chevron_right</span>
            <span>Software</span>
          </div>
          <div class="page-title">
            <span class="material-icons-round">computer</span> Academic Software
          </div>
          <p class="page-subtitle">Download and install course-required software and tools.</p>
        </div>

        <div class="info-box mb-4">
          <span class="material-icons-round">info</span>
          All links lead to official or admin-provided sources. Always verify software authenticity before installation.
        </div>

        ${software.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">computer</span>
            <h3>No Software Listed Yet</h3>
            <p>Admin will add required software soon.</p>
          </div>
        ` : `
          <div class="item-grid">
            ${software.map((sw, i) => {
              const style = SW_BANNERS[i % SW_BANNERS.length];
              return `
                <div class="item-card">
                  <div class="item-card-banner" style="background:${style.bg};">
                    <span class="material-icons-round" style="color:rgba(255,255,255,0.85);font-size:3.5rem;">${style.icon}</span>
                  </div>
                  <div class="item-card-body">
                    <div class="item-card-title">${escHtml(sw.name)}</div>
                    <div class="item-card-sub">${escHtml(sw.version ? `Version ${sw.version}` : '')}</div>
                    <div class="item-card-desc">${escHtml(sw.description || 'Required software for department courses.')}</div>
                    ${sw.course ? `<span class="badge badge-primary" style="margin-bottom:8px;">${escHtml(sw.course)}</span>` : ''}
                  </div>
                  <div class="item-card-footer">
                    <a href="${escHtml(sw.downloadLink)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="width:100%;">
                      <span class="material-icons-round">cloud_download</span> Download
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
