/* ============================================================
   Doremi 2000 — In-admin content manager
   Edits content/*.json in GitHub via the API (token pasted by the
   owner, stored only in this browser). A GitHub Action then rebuilds
   the HTML and Vercel auto-deploys. No separate CMS page needed.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const view = $("#view-content");
  if (!view) return;

  const REPO = "hntngoctu1/thumuanhaccu";
  const BRANCH = "main";
  const API = "https://api.github.com";
  const TOKEN_KEY = "doremi-cms-token";
  const GALLERY_PATH = "content/gallery.json";
  const ARTICLES_PATH = "content/articles.json";
  const CATEGORIES = ["Hướng dẫn", "Kinh nghiệm", "Tư vấn chọn mua", "Định giá", "Bảo quản"];

  const getToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; } };
  const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch (e) {} };

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const b64encode = (str) => btoa(unescape(encodeURIComponent(str)));
  const b64decode = (b64) => decodeURIComponent(escape(atob(String(b64 || "").replace(/\s/g, ""))));
  const slugify = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  function msg(sel, text, kind) {
    const el = $(sel); if (!el) return;
    el.textContent = text || "";
    el.className = "cms-msg" + (kind ? " is-" + kind : "");
  }

  /* ---------- GitHub API ---------- */
  async function gh(method, path, body, accept) {
    const token = getToken();
    if (!token) throw new Error("Chưa kết nối. Hãy dán token ở tab “Kết nối”.");
    const res = await fetch(API + path, {
      method,
      headers: {
        Authorization: "Bearer " + token,
        Accept: accept || "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) throw new Error("Token không hợp lệ hoặc đã hết hạn (401).");
    if (res.status === 403) throw new Error("Token thiếu quyền (403). Cần quyền “Contents: Read and write” cho repo này.");
    if (res.status === 404) throw new Error("Không tìm thấy (404). Kiểm tra token có quyền vào repo " + REPO + " không.");
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error((data && data.message) || ("Lỗi mạng " + res.status));
    return data;
  }
  const cpath = (p) => "/repos/" + REPO + "/contents/" + p;
  async function getFile(path) {
    const d = await gh("GET", cpath(path) + "?ref=" + encodeURIComponent(BRANCH));
    return { json: JSON.parse(b64decode(d.content)), sha: d.sha };
  }
  async function putFile(path, obj, sha, message) {
    return gh("PUT", cpath(path), {
      message, branch: BRANCH, sha: sha || undefined,
      content: b64encode(JSON.stringify(obj, null, 2) + "\n"),
    });
  }
  async function uploadImage(file) {
    const b64 = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result).split(",")[1]);
      fr.onerror = () => reject(new Error("Không đọc được tệp ảnh."));
      fr.readAsDataURL(file);
    });
    const ext = (file.name.match(/\.[a-z0-9]+$/i) || [".jpg"])[0].toLowerCase();
    const base = slugify(file.name.replace(/\.[a-z0-9]+$/i, "")) || "anh";
    const path = "img/uploads/" + Date.now() + "-" + base + ext;
    await gh("PUT", cpath(path), { message: "Tải ảnh: " + path, branch: BRANCH, content: b64 });
    return { path: "/" + path, preview: "data:" + (file.type || "image/jpeg") + ";base64," + b64 };
  }

  /* ---------- State ---------- */
  const gallery = { items: [], sha: null, loaded: false, dirty: false };
  const arts = { list: [], sha: null, loaded: false, dirty: false, editing: -1 };

  /* ---------- Tabs ---------- */
  $$(".cms-tab", view).forEach((t) => t.addEventListener("click", () => {
    $$(".cms-tab", view).forEach((x) => x.classList.toggle("is-active", x === t));
    const k = t.dataset.cms;
    $$(".cms-pane", view).forEach((p) => p.classList.toggle("is-active", p.id === "cms-" + k));
    if (k === "gallery" && !gallery.loaded && getToken()) loadGallery();
    if (k === "articles" && !arts.loaded && getToken()) loadArticles();
  }));

  /* ---------- Connection ---------- */
  function reflectConn() {
    const ok = !!getToken();
    $("#cmsConnState").textContent = ok ? "✅ Đã kết nối" : "Chưa kết nối";
    $("#cmsToken").value = ok ? "" : "";
    $("#cmsToken").placeholder = ok ? "•••••••• (đã lưu, dán mới để thay)" : "github_pat_...";
  }
  $("#cmsConnect").addEventListener("click", async () => {
    const val = $("#cmsToken").value.trim();
    if (val) setToken(val);
    if (!getToken()) { msg("#cmsConnMsg", "Hãy dán token trước.", "err"); return; }
    msg("#cmsConnMsg", "Đang kiểm tra kết nối…");
    try {
      const repo = await gh("GET", "/repos/" + REPO);
      msg("#cmsConnMsg", "✅ Kết nối thành công với " + repo.full_name + ". Mở tab “Ảnh trang chủ” hoặc “Cẩm nang” để sửa.", "ok");
      reflectConn();
    } catch (e) { msg("#cmsConnMsg", "❌ " + e.message, "err"); }
  });
  $("#cmsDisconnect").addEventListener("click", () => {
    if (!confirm("Xoá token khỏi máy này?")) return;
    setToken(""); gallery.loaded = arts.loaded = false; reflectConn();
    msg("#cmsConnMsg", "Đã xoá token khỏi trình duyệt này.", "");
  });

  /* ---------- Gallery editor ---------- */
  async function loadGallery() {
    msg("#galMsg", "Đang tải ảnh…");
    try {
      const { json, sha } = await getFile(GALLERY_PATH);
      gallery.items = (json && json.items) || [];
      gallery.sha = sha; gallery.loaded = true; gallery.dirty = false;
      renderGallery(); msg("#galMsg", "");
    } catch (e) { msg("#galMsg", "❌ " + e.message, "err"); }
  }
  function galleryCard(it, i) {
    return '<div class="cms-card" data-i="' + i + '">' +
      '<div class="cms-card__media"><img src="' + esc(it._preview || it.src) + '" alt="" loading="lazy" onerror="this.classList.add(\'is-broken\')"/></div>' +
      '<div class="cms-card__body">' +
      '<label class="cms-f">Ảnh (link hoặc tải lên)<span class="cms-imgrow"><input data-f="src" type="text" value="' + esc(it.src) + '"/>' +
      '<button class="btn btn--ghost cms-upload" type="button">Tải ảnh ⬆</button></span></label>' +
      '<label class="cms-f">Tên hiển thị<input data-f="title" type="text" value="' + esc(it.title) + '"/></label>' +
      '<label class="cms-f">Mô tả ảnh (alt — SEO)<input data-f="alt" type="text" value="' + esc(it.alt) + '"/></label>' +
      '<label class="cms-f">Thương hiệu<input data-f="brands" type="text" value="' + esc(it.brands || "") + '"/></label>' +
      '</div>' +
      '<div class="cms-card__act"><button class="icon-btn cms-up" title="Lên" type="button">▲</button>' +
      '<button class="icon-btn cms-down" title="Xuống" type="button">▼</button>' +
      '<button class="icon-btn cms-del" title="Xoá" type="button"><svg><use href="#i-trash"/></svg></button></div>' +
      '</div>';
  }
  function renderGallery() {
    const wrap = $("#cmsGallery");
    if (!gallery.loaded) { wrap.innerHTML = '<p class="muted">Hãy kết nối rồi bấm “Tải lại”.</p>'; return; }
    wrap.innerHTML = gallery.items.map(galleryCard).join("") || '<p class="muted">Chưa có ảnh. Bấm “+ Thêm ảnh”.</p>';
    $("#galSave").disabled = !gallery.dirty;
    $("#galDirty").style.display = gallery.dirty ? "inline" : "none";
  }
  function galDirty() { gallery.dirty = true; $("#galSave").disabled = false; $("#galDirty").style.display = "inline"; }

  $("#cmsGallery").addEventListener("input", (e) => {
    const card = e.target.closest(".cms-card"); if (!card) return;
    const i = +card.dataset.i, f = e.target.dataset.f; if (f == null) return;
    gallery.items[i][f] = e.target.value; galDirty();
  });
  $("#cmsGallery").addEventListener("click", async (e) => {
    const card = e.target.closest(".cms-card"); if (!card) return;
    const i = +card.dataset.i;
    if (e.target.closest(".cms-del")) {
      if (!confirm("Xoá ảnh này?")) return;
      gallery.items.splice(i, 1); galDirty(); renderGallery();
    } else if (e.target.closest(".cms-up") && i > 0) {
      [gallery.items[i - 1], gallery.items[i]] = [gallery.items[i], gallery.items[i - 1]]; galDirty(); renderGallery();
    } else if (e.target.closest(".cms-down") && i < gallery.items.length - 1) {
      [gallery.items[i + 1], gallery.items[i]] = [gallery.items[i], gallery.items[i + 1]]; galDirty(); renderGallery();
    } else if (e.target.closest(".cms-upload")) {
      pickImage(async (file) => {
        msg("#galMsg", "Đang tải ảnh lên…");
        try { const up = await uploadImage(file); gallery.items[i].src = up.path; gallery.items[i]._preview = up.preview; galDirty(); renderGallery(); msg("#galMsg", "✅ Đã tải ảnh lên.", "ok"); }
        catch (err) { msg("#galMsg", "❌ " + err.message, "err"); }
      });
    }
  });
  $("#galAdd").addEventListener("click", () => {
    if (!gallery.loaded) { msg("#galMsg", "Hãy bấm “Tải lại” trước.", "err"); return; }
    gallery.items.push({ src: "", title: "Nhạc cụ mới", alt: "", brands: "" }); galDirty(); renderGallery();
    const cards = $$(".cms-card", $("#cmsGallery")); if (cards.length) cards[cards.length - 1].scrollIntoView({ block: "center" });
  });
  $("#galReload").addEventListener("click", () => {
    if (gallery.dirty && !confirm("Tải lại sẽ bỏ các thay đổi chưa lưu. Tiếp tục?")) return;
    loadGallery();
  });
  $("#galSave").addEventListener("click", async () => {
    for (const it of gallery.items) { if (!it.src) { msg("#galMsg", "❌ Có ảnh chưa có link/chưa tải lên.", "err"); return; } }
    msg("#galMsg", "Đang lưu lên web…");
    try {
      const cleanItems = gallery.items.map((it) => ({ src: it.src, title: it.title, alt: it.alt, brands: it.brands || "" }));
      const r = await putFile(GALLERY_PATH, { items: cleanItems }, gallery.sha, "Cập nhật ảnh trang chủ (Admin)");
      gallery.sha = r.content.sha; gallery.dirty = false; renderGallery();
      msg("#galMsg", "✅ Đã lưu! Website sẽ tự cập nhật sau khoảng 1–2 phút.", "ok");
    } catch (e) { msg("#galMsg", "❌ " + e.message, "err"); }
  });

  /* ---------- Articles editor ---------- */
  async function loadArticles() {
    msg("#artMsg", "Đang tải bài viết…");
    try {
      const { json, sha } = await getFile(ARTICLES_PATH);
      arts.list = (json && json.articles) || [];
      arts.sha = sha; arts.loaded = true; arts.dirty = false; arts.editing = -1;
      renderArticleList(); closeEditor(); msg("#artMsg", "");
    } catch (e) { msg("#artMsg", "❌ " + e.message, "err"); }
  }
  function renderArticleList() {
    const wrap = $("#cmsArticles");
    if (!arts.loaded) { wrap.innerHTML = '<p class="muted">Hãy kết nối rồi bấm “Tải lại”.</p>'; return; }
    wrap.innerHTML = arts.list.map((a, i) =>
      '<div class="cms-row" data-i="' + i + '"><div class="cms-row__main"><strong>' + esc(a.title || "(chưa có tiêu đề)") + '</strong>' +
      '<span class="cms-row__sub">' + esc(a.category || "") + " · /" + esc(a.slug || "") + '</span></div>' +
      '<div class="cms-row__act"><button class="icon-btn art-up" title="Lên" type="button">▲</button>' +
      '<button class="icon-btn art-down" title="Xuống" type="button">▼</button>' +
      '<button class="btn btn--ghost art-edit" type="button">Sửa</button>' +
      '<button class="icon-btn art-del" title="Xoá" type="button"><svg><use href="#i-trash"/></svg></button></div></div>'
    ).join("") || '<p class="muted">Chưa có bài. Bấm “+ Thêm bài”.</p>';
    $("#artSave").disabled = !arts.dirty;
    $("#artDirty").style.display = arts.dirty ? "inline" : "none";
  }
  function artDirty() { arts.dirty = true; $("#artSave").disabled = false; $("#artDirty").style.display = "inline"; }

  function faqRows(faq) {
    return (faq || []).map((f, j) =>
      '<div class="cms-faq" data-j="' + j + '"><input data-ff="q" type="text" value="' + esc(f.q) + '" placeholder="Câu hỏi"/>' +
      '<textarea data-ff="a" rows="2" placeholder="Trả lời">' + esc(f.a) + '</textarea>' +
      '<button class="icon-btn faq-del" title="Xoá câu hỏi" type="button"><svg><use href="#i-trash"/></svg></button></div>'
    ).join("");
  }
  function openEditor(i) {
    arts.editing = i;
    const a = arts.list[i];
    const wrap = $("#cmsArticleEditorWrap"); wrap.hidden = false;
    $("#artEditorTitle").textContent = "Sửa: " + (a.title || "bài mới");
    $("#cmsArticleEditor").innerHTML =
      '<label class="cms-f">Tiêu đề (H1)<input data-a="title" type="text" value="' + esc(a.title) + '"/></label>' +
      '<label class="cms-f">Đường dẫn (slug)<input data-a="slug" type="text" value="' + esc(a.slug) + '" placeholder="vd: bao-quan-dan-piano"/></label>' +
      '<label class="cms-f">Tiêu đề SEO<input data-a="metaTitle" type="text" value="' + esc(a.metaTitle) + '"/></label>' +
      '<label class="cms-f">Mô tả SEO (120–160 ký tự)<textarea data-a="metaDescription" rows="2">' + esc(a.metaDescription) + '</textarea></label>' +
      '<label class="cms-f">Tóm tắt (thẻ bài viết)<textarea data-a="excerpt" rows="2">' + esc(a.excerpt) + '</textarea></label>' +
      '<label class="cms-f">Chuyên mục<select data-a="category">' + CATEGORIES.map((c) => '<option' + (c === a.category ? " selected" : "") + ">" + esc(c) + "</option>").join("") + '</select></label>' +
      '<label class="cms-f">Thời gian đọc<input data-a="readingTime" type="text" value="' + esc(a.readingTime || "7 phút đọc") + '"/></label>' +
      '<label class="cms-f">Nội dung (HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;)<textarea data-a="bodyHtml" rows="16" class="cms-code">' + esc(a.bodyHtml) + '</textarea></label>' +
      '<div class="cms-f"><div class="cms-faq-head">Câu hỏi thường gặp (FAQ)<button class="btn btn--ghost" id="faqAdd" type="button">+ Thêm câu hỏi</button></div><div id="faqList">' + faqRows(a.faq) + '</div></div>';
    wrap.scrollIntoView({ block: "start", behavior: "smooth" });
  }
  function closeEditor() { $("#cmsArticleEditorWrap").hidden = true; arts.editing = -1; }

  $("#cmsArticles").addEventListener("click", (e) => {
    const row = e.target.closest(".cms-row"); if (!row) return;
    const i = +row.dataset.i;
    if (e.target.closest(".art-edit")) openEditor(i);
    else if (e.target.closest(".art-del")) {
      if (!confirm("Xoá bài “" + (arts.list[i].title || "") + "”?")) return;
      arts.list.splice(i, 1); if (arts.editing === i) closeEditor(); artDirty(); renderArticleList();
    } else if (e.target.closest(".art-up") && i > 0) {
      [arts.list[i - 1], arts.list[i]] = [arts.list[i], arts.list[i - 1]]; artDirty(); renderArticleList();
    } else if (e.target.closest(".art-down") && i < arts.list.length - 1) {
      [arts.list[i + 1], arts.list[i]] = [arts.list[i], arts.list[i + 1]]; artDirty(); renderArticleList();
    }
  });
  $("#cmsArticleEditor").addEventListener("input", (e) => {
    if (arts.editing < 0) return;
    const a = arts.list[arts.editing];
    const af = e.target.dataset.a;
    if (af) {
      a[af] = e.target.value;
      if (af === "title") $("#artEditorTitle").textContent = "Sửa: " + (e.target.value || "bài mới");
      artDirty();
      if (af === "title" || af === "category") renderArticleList();
      return;
    }
    const ff = e.target.dataset.ff;
    if (ff) {
      const row = e.target.closest(".cms-faq"); const j = +row.dataset.j;
      a.faq = a.faq || []; a.faq[j][ff] = e.target.value; artDirty();
    }
  });
  $("#cmsArticleEditor").addEventListener("click", (e) => {
    if (arts.editing < 0) return;
    const a = arts.list[arts.editing];
    if (e.target.id === "faqAdd") { a.faq = a.faq || []; a.faq.push({ q: "", a: "" }); artDirty(); $("#faqList").innerHTML = faqRows(a.faq); }
    else if (e.target.closest(".faq-del")) { const row = e.target.closest(".cms-faq"); a.faq.splice(+row.dataset.j, 1); artDirty(); $("#faqList").innerHTML = faqRows(a.faq); }
  });
  // auto-slug from title when slug empty
  $("#cmsArticleEditor").addEventListener("blur", (e) => {
    if (arts.editing < 0 || e.target.dataset.a !== "title") return;
    const a = arts.list[arts.editing];
    if (!a.slug) {
      a.slug = slugify(a.title);
      const slugInput = $('[data-a="slug"]', $("#cmsArticleEditor"));
      if (slugInput) slugInput.value = a.slug;
      renderArticleList();
    }
  }, true);

  $("#artClose").addEventListener("click", closeEditor);
  $("#artAdd").addEventListener("click", () => {
    if (!arts.loaded) { msg("#artMsg", "Hãy bấm “Tải lại” trước.", "err"); return; }
    arts.list.unshift({ slug: "", title: "Bài viết mới", metaTitle: "", metaDescription: "", excerpt: "", category: CATEGORIES[0], readingTime: "7 phút đọc", bodyHtml: "<h2>Mục đầu tiên</h2>\n<p>Nội dung…</p>", faq: [] });
    artDirty(); renderArticleList(); openEditor(0);
  });
  $("#artReload").addEventListener("click", () => {
    if (arts.dirty && !confirm("Tải lại sẽ bỏ các thay đổi chưa lưu. Tiếp tục?")) return;
    loadArticles();
  });
  $("#artSave").addEventListener("click", async () => {
    for (const a of arts.list) {
      if (!a.slug || !/^[a-z0-9-]+$/.test(a.slug)) { msg("#artMsg", "❌ Bài “" + (a.title || "") + "” có slug trống/không hợp lệ (chỉ chữ thường, số, dấu -).", "err"); return; }
      if (!a.title) { msg("#artMsg", "❌ Có bài chưa có tiêu đề.", "err"); return; }
    }
    const slugs = arts.list.map((a) => a.slug);
    const dup = slugs.find((s, i) => slugs.indexOf(s) !== i);
    if (dup) { msg("#artMsg", "❌ Trùng slug: " + dup, "err"); return; }
    msg("#artMsg", "Đang lưu lên web…");
    try {
      const clean = arts.list.map((a) => ({
        slug: a.slug, title: a.title, metaTitle: a.metaTitle || a.title, metaDescription: a.metaDescription || "",
        excerpt: a.excerpt || "", category: a.category || CATEGORIES[0], readingTime: a.readingTime || "7 phút đọc",
        bodyHtml: a.bodyHtml || "", faq: (a.faq || []).filter((f) => f.q),
      }));
      const r = await putFile(ARTICLES_PATH, { articles: clean }, arts.sha, "Cập nhật bài Cẩm nang (Admin)");
      arts.sha = r.content.sha; arts.dirty = false; renderArticleList();
      msg("#artMsg", "✅ Đã lưu! Bài viết sẽ lên web sau khoảng 1–2 phút.", "ok");
    } catch (e) { msg("#artMsg", "❌ " + e.message, "err"); }
  });

  /* ---------- image picker ---------- */
  function pickImage(cb) {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*";
    inp.onchange = () => { if (inp.files && inp.files[0]) cb(inp.files[0]); };
    inp.click();
  }

  /* ---------- warn on unsaved leave ---------- */
  window.addEventListener("beforeunload", (e) => {
    if (gallery.dirty || arts.dirty) { e.preventDefault(); e.returnValue = ""; }
  });

  reflectConn();
  renderGallery(); renderArticleList();
  // auto-load when entering the content view with a token
  document.addEventListener("click", (e) => {
    const it = e.target.closest('[data-view="content"]');
    if (it && getToken()) { if (!gallery.loaded) loadGallery(); if (!arts.loaded) loadArticles(); }
  });
})();
