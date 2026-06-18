/**
 * notices.js — Full Notices Board
 */

async function renderNotices() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const notices = await dbGetNotices();
    const pinned  = notices.filter(n => n.pinned);
    const regular = notices.filter(n => !n.pinned);

    app.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/home">Home</a>
            <span class="material-icons-round">chevron_right</span>
            <span>Notices</span>
          </div>
          <div class="page-title">
            <span class="material-icons-round">notifications_active</span> Notice Board
          </div>
          <p class="page-subtitle">Important announcements, exam schedules, and department updates.</p>
        </div>

        ${notices.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">notifications_none</span>
            <h3>No Notices Yet</h3>
            <p>Department notices will appear here.</p>
          </div>
        ` : `
          ${pinned.length > 0 ? `
            <div style="margin-bottom:2rem;">
              <div class="section-title" style="margin-bottom:6px;">
                <span class="material-icons-round" style="color:#E65100;">push_pin</span> Pinned Notices
              </div>
              <div class="title-underline"></div>
              <div class="notice-strip">
                ${pinned.map(n => renderNoticeCard(n)).join('')}
              </div>
            </div>
          ` : ''}
          ${regular.length > 0 ? `
            <div>
              <div class="section-title" style="margin-bottom:6px;">
                <span class="material-icons-round">notifications</span> All Notices
              </div>
              <div class="title-underline"></div>
              <div class="notice-strip">
                ${regular.map(n => renderNoticeCard(n)).join('')}
              </div>
            </div>
          ` : ''}
        `}
      </div>
    `;
  } catch (err) {
    app.innerHTML = renderErrorState(err.message);
  }
}
