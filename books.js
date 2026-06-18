/**
 * books.js — Books section
 */

const BOOK_BANNERS = [
  { bg: 'linear-gradient(135deg,#1565C0,#0D47A1)', icon: 'menu_book' },
  { bg: 'linear-gradient(135deg,#2E7D32,#1B5E20)', icon: 'auto_stories' },
  { bg: 'linear-gradient(135deg,#6A1BDB,#4A148C)', icon: 'book' },
  { bg: 'linear-gradient(135deg,#C62828,#870000)', icon: 'library_books' },
  { bg: 'linear-gradient(135deg,#E65100,#BF360C)', icon: 'picture_as_pdf' },
  { bg: 'linear-gradient(135deg,#0087A8,#006064)', icon: 'bookmark' },
];

async function renderBooks() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
  try {
    const books = await dbGetBooks();
    app.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/home">Home</a>
            <span class="material-icons-round">chevron_right</span>
            <span>Books</span>
          </div>
          <div class="page-title">
            <span class="material-icons-round">menu_book</span> Reference Books
          </div>
          <p class="page-subtitle">PDF books and reference materials for all courses.</p>
        </div>

        ${books.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">menu_book</span>
            <h3>No Books Yet</h3>
            <p>Admin hasn't added any books. Check back soon!</p>
          </div>
        ` : `
          <div class="item-grid">
            ${books.map((b, i) => {
              const style = BOOK_BANNERS[i % BOOK_BANNERS.length];
              return `
                <div class="item-card">
                  <div class="item-card-banner" style="background:${style.bg};">
                    <span class="material-icons-round" style="color:rgba(255,255,255,0.85);font-size:3.5rem;">${style.icon}</span>
                  </div>
                  <div class="item-card-body">
                    <div class="item-card-title">${escHtml(b.title)}</div>
                    <div class="item-card-sub">${escHtml(b.author || '')}</div>
                    <div class="item-card-desc">${escHtml(b.description || 'A reference book for department students.')}</div>
                    ${b.semester ? `<span class="badge badge-primary" style="margin-bottom:8px;">${escHtml(b.semester)}</span>` : ''}
                  </div>
                  <div class="item-card-footer">
                    <a href="${escHtml(b.driveLink)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="width:100%;">
                      <span class="material-icons-round">picture_as_pdf</span> Open / Download
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
