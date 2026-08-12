(function () {
  const PER_PAGE = 9;
  const grid = document.getElementById("recent-posts-grid");
  const pager = document.getElementById("recent-posts-pager");
  if (!grid || typeof POSTS === "undefined") return;

  const sorted = POSTS.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  let currentPage = 1;

  function fallbackInitial(title) {
    return (title || "").slice(0, 1);
  }

  function renderPage(page) {
    currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * PER_PAGE;
    const pagePosts = sorted.slice(start, start + PER_PAGE);

    grid.innerHTML = pagePosts.map(function (post) {
      const thumb = post.thumb
        ? '<img src="' + post.thumb + '" alt="">'
        : '<span class="post-card-thumb-fallback">' + fallbackInitial(post.title) + '</span>';
      const dateLabel = post.date.replace(/-/g, ".");
      return (
        '<li>' +
          '<a class="post-card" href="' + post.url + '">' +
            '<div class="post-card-thumb">' + thumb + '</div>' +
            '<div class="post-card-body">' +
              '<span class="post-card-category">' + post.category + '</span>' +
              '<h3 class="post-card-title">' + post.title + '</h3>' +
              '<p class="post-card-excerpt">' + post.excerpt + '</p>' +
              '<span class="post-card-date">' + dateLabel + '</span>' +
            '</div>' +
          '</a>' +
        '</li>'
      );
    }).join("");

    renderPager();
  }

  function renderPager() {
    if (totalPages <= 1) {
      pager.innerHTML = "";
      return;
    }
    let html = '<button type="button" class="pager-btn" data-page="' + (currentPage - 1) + '"' + (currentPage === 1 ? " disabled" : "") + '>&laquo;</button>';
    for (let i = 1; i <= totalPages; i++) {
      html += '<button type="button" class="pager-btn' + (i === currentPage ? " active" : "") + '" data-page="' + i + '">' + i + '</button>';
    }
    html += '<button type="button" class="pager-btn" data-page="' + (currentPage + 1) + '"' + (currentPage === totalPages ? " disabled" : "") + '>&raquo;</button>';
    pager.innerHTML = html;
  }

  pager.addEventListener("click", function (e) {
    const btn = e.target.closest(".pager-btn");
    if (!btn || btn.disabled) return;
    renderPage(parseInt(btn.dataset.page, 10));
    grid.closest("section").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderPage(1);
})();
