/**
 * contact.js — Contact / Admin Info page
 */

async function renderContact() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const config = await dbGetConfig();
    app.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/home">Home</a>
            <span class="material-icons-round">chevron_right</span>
            <span>Contact</span>
          </div>
          <div class="page-title">
            <span class="material-icons-round">contact_mail</span> Contact & Info
          </div>
          <p class="page-subtitle">Reach out to the portal admin or department for any queries.</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;" class="contact-grid">

          <!-- Admin Contact Card -->
          <div class="card">
            <div class="card-body">
              <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
                <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-dark));display:flex;align-items:center;justify-content:center;">
                  <span class="material-icons-round" style="color:white;font-size:1.75rem;">admin_panel_settings</span>
                </div>
                <div>
                  <div style="font-weight:700;font-size:1rem;color:var(--primary-dark);">Portal Administrator</div>
                  <div style="font-size:0.8rem;color:var(--text-muted);">Manages all portal content</div>
                </div>
              </div>

              <div style="display:flex;flex-direction:column;gap:0.875rem;">
                <div style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem;background:var(--bg);border-radius:var(--r-md);">
                  <span class="material-icons-round" style="color:var(--primary);">email</span>
                  <div>
                    <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Email</div>
                    <div style="font-size:0.875rem;color:var(--text-primary);">${escHtml(config.adminEmail || ADMIN_EMAIL)}</div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem;background:var(--bg);border-radius:var(--r-md);">
                  <span class="material-icons-round" style="color:var(--primary);">school</span>
                  <div>
                    <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Department</div>
                    <div style="font-size:0.875rem;color:var(--text-primary);">${escHtml(config.deptName || SITE_DEFAULTS.deptName)}</div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem;background:var(--bg);border-radius:var(--r-md);">
                  <span class="material-icons-round" style="color:var(--primary);">account_balance</span>
                  <div>
                    <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">University</div>
                    <div style="font-size:0.875rem;color:var(--text-primary);">${escHtml(config.universityName || SITE_DEFAULTS.universityName)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Access & FAQ Card -->
          <div style="display:flex;flex-direction:column;gap:1.25rem;">
            <div class="info-box">
              <span class="material-icons-round">help_outline</span>
              <div>
                <strong>How to get access?</strong><br>
                Register with your university email. Once approved by the admin, you can access all materials.
              </div>
            </div>
            <div class="info-box warning-box">
              <span class="material-icons-round">lock</span>
              <div>
                <strong>Restricted Portal</strong><br>
                This portal is for enrolled students of ${escHtml(config.deptName || '[DEPARTMENT_NAME]')} only. Sharing login credentials or links is strictly prohibited.
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <div style="font-weight:700;color:var(--primary-dark);margin-bottom:1rem;display:flex;align-items:center;gap:8px;">
                  <span class="material-icons-round">quiz</span> Frequently Asked Questions
                </div>
                ${[
                  ['How long does approval take?', 'Usually within 24-48 hours on working days.'],
                  ['I forgot my password. What now?', 'Use the "Forgot Password" option on the login page, or contact admin.'],
                  ['Can I share materials with others?', 'No. Materials are for enrolled students only. Do not share externally.'],
                  ['Why can\'t I open a Drive link?', 'Make sure you\'re signed into your approved Google account.'],
                ].map(([q, a]) => `
                  <div style="margin-bottom:0.875rem;padding-bottom:0.875rem;border-bottom:1px solid var(--border-light);">
                    <div style="font-weight:600;font-size:0.85rem;color:var(--text-primary);margin-bottom:3px;">
                      <span class="material-icons-round" style="font-size:0.9rem;color:var(--primary);vertical-align:middle;">question_answer</span>
                      ${escHtml(q)}
                    </div>
                    <div style="font-size:0.82rem;color:var(--text-secondary);">${escHtml(a)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        @media(max-width:768px){ .contact-grid { grid-template-columns:1fr !important; } }
      </style>
    `;
  } catch (err) {
    app.innerHTML = renderErrorState(err.message);
  }
}
