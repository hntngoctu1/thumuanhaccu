/* ============================================================
   Doremi 2000 — Admin dashboard logic (front-end demo)
   Data persisted in localStorage; no backend.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const LEADS_KEY = "doremi-leads";
  const THEME_KEY = "doremi-theme";
  const AUTH_KEY = "doremi-admin-auth";
  const STATUSES = ["Mới", "Đang xử lý", "Đã chốt", "Hủy"];
  const STCLASS = { "Mới": "moi", "Đang xử lý": "xu-ly", "Đã chốt": "chot", "Hủy": "huy" };
  const GOLD = "#c9a24b";

  let leads = [];

  /* ---------- Theme ---------- */
  const metaTheme = $('meta[name="theme-color"]');
  const applyTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    if (metaTheme) metaTheme.setAttribute("content", t === "light" ? "#f4eee1" : "#0a0a0c");
  };
  applyTheme(document.documentElement.getAttribute("data-theme") || "dark");
  const toggleTheme = () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  };
  ["#themeToggle", "#themeToggle2"].forEach((s) => { const el = $(s); if (el) el.addEventListener("click", toggleTheme); });

  /* ---------- Data ---------- */
  const load = () => {
    try { leads = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]"); }
    catch (e) { leads = []; }
    if (!Array.isArray(leads) || leads.length === 0) { leads = seed(); save(); }
  };
  const save = () => { try { localStorage.setItem(LEADS_KEY, JSON.stringify(leads)); } catch (e) {} };

  function seed() {
    const now = Date.now(), DAY = 86400000;
    const names = ["Anh Tuấn","Chị Hương","Cô Mai","Anh Dũng","Chị Lan","Thầy Phong","Anh Bình","Chị Thu","Cô Hạnh","Anh Khoa","Chị Yến","Anh Nam","Chị Trang","Anh Hải","Cô Vân","Anh Sơn","Chị Diệp","Anh Phát"];
    const types = ["Piano cơ","Piano điện","Đàn Organ","Guitar","Trống","Loa / Amply","Dàn karaoke","Tivi"];
    const conds = ["Như mới","Còn tốt","Trung bình","Cũ / Hư"];
    const sources = ["Website","Zalo","Gọi điện","Giới thiệu"];
    const dist = ["Mới","Mới","Mới","Đang xử lý","Đang xử lý","Đã chốt","Đã chốt","Đã chốt","Hủy"];
    const pre = ["0903","0907","0912","0938","0976","0986","0931","0945","0978"];
    const rnd = (n) => Math.floor(Math.random() * n);
    const out = [];
    for (let i = 0; i < 18; i++) {
      const status = dist[rnd(dist.length)];
      const created = now - rnd(14) * DAY - rnd(DAY);
      out.push({
        id: "S" + (created) + i,
        name: names[rnd(names.length)],
        phone: pre[rnd(pre.length)] + (100 + rnd(900)) + (1000 + rnd(9000)),
        type: types[rnd(types.length)],
        condition: conds[rnd(conds.length)],
        status: status,
        value: status === "Đã chốt" ? (2 + rnd(38)) * 1000000 : 0,
        source: sources[rnd(sources.length)],
        createdAt: created,
      });
    }
    return out.sort((a, b) => b.createdAt - a.createdAt);
  }

  /* ---------- Helpers ---------- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const vnd = (n) => n.toLocaleString("vi-VN");
  const milli = (n) => Math.round(n / 1000000);
  const timeAgo = (ts) => {
    const m = Math.floor((Date.now() - ts) / 60000);
    if (m < 1) return "Vừa xong";
    if (m < 60) return m + " phút trước";
    const h = Math.floor(m / 60);
    if (h < 24) return h + " giờ trước";
    const d = Math.floor(h / 24);
    if (d < 7) return d + " ngày trước";
    const dt = new Date(ts);
    return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
  };
  const statusPill = (s) => '<span class="status status--' + (STCLASS[s] || "") + '">' + esc(s) + "</span>";
  const custCell = (l) => '<div class="cell-main">' + esc(l.name || "Khách lẻ") + '</div><div class="cell-sub">' + esc(l.phone) + "</div>";

  /* ---------- Render: KPIs ---------- */
  function renderKPIs() {
    const total = leads.length;
    const fresh = leads.filter((l) => l.status === "Mới").length;
    const closed = leads.filter((l) => l.status === "Đã chốt");
    const revenue = closed.reduce((a, l) => a + (l.value || 0), 0);
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayNew = leads.filter((l) => l.createdAt >= todayStart.getTime()).length;
    const cards = [
      { icon: "i-inbox", num: fresh, label: "Yêu cầu mới chờ xử lý", trend: todayNew ? "+" + todayNew + " hôm nay" : "" },
      { icon: "i-users", num: total, label: "Tổng yêu cầu", trend: "" },
      { icon: "i-check", num: closed.length, label: "Đã chốt thành công", trend: "" },
      { icon: "i-cash", num: milli(revenue) + " tr", label: "Doanh thu ước tính", trend: "" },
    ];
    $("#kpis").innerHTML = cards.map((c) =>
      '<div class="kpi"><div class="kpi__icon"><svg><use href="#' + c.icon + '"/></svg></div>' +
      (c.trend ? '<span class="kpi__trend"><svg><use href="#i-trend"/></svg>' + c.trend + "</span>" : "") +
      '<div class="kpi__num">' + c.num + '</div><div class="kpi__label">' + c.label + "</div></div>"
    ).join("");
  }

  /* ---------- Render: chart (last 7 days) ---------- */
  function renderChart() {
    const svg = $("#chart");
    if (!svg || $("#appView").hidden) return;
    const w = svg.clientWidth || 520, h = svg.clientHeight || 210;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    const days = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i); days.push(d); }
    const counts = days.map((d) => {
      const a = d.getTime(), b = a + 86400000;
      return leads.filter((l) => l.createdAt >= a && l.createdAt < b).length;
    });
    const max = Math.max(1, Math.max.apply(null, counts));
    const padX = 14, padTop = 18, padBot = 14, iw = w - padX * 2, ih = h - padTop - padBot, base = h - padBot;
    const pts = counts.map((c, i) => [padX + iw * (i / 6), padTop + ih * (1 - c / max)]);
    const linePath = "M " + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ");
    const areaPath = "M " + padX + " " + base + " L " + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ") + " L " + (padX + iw) + " " + base + " Z";
    svg.innerHTML =
      '<defs><linearGradient id="cf" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0" stop-color="' + GOLD + '" stop-opacity="0.32"/>' +
      '<stop offset="1" stop-color="' + GOLD + '" stop-opacity="0"/></linearGradient></defs>' +
      '<line class="axis" x1="' + padX + '" y1="' + base + '" x2="' + (padX + iw) + '" y2="' + base + '"/>' +
      '<path class="area" d="' + areaPath + '" fill="url(#cf)"/>' +
      '<path class="line" d="' + linePath + '"/>' +
      pts.map((p) => '<circle class="pt" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5"/>').join("");
    $("#chartX").innerHTML = days.map((d) => "<span>" + d.getDate() + "/" + (d.getMonth() + 1) + "</span>").join("");
    $("#chartTotal").textContent = counts.reduce((a, b) => a + b, 0) + " yêu cầu";
  }

  /* ---------- Render: breakdown by type ---------- */
  function renderBreakdown() {
    const map = {};
    leads.forEach((l) => { map[l.type] = (map[l.type] || 0) + 1; });
    const rows = Object.keys(map).map((k) => [k, map[k]]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const max = Math.max(1, Math.max.apply(null, rows.map((r) => r[1])));
    $("#breakdown").innerHTML = rows.map((r) =>
      '<div class="bar__row"><span>' + esc(r[0]) + '</span>' +
      '<div class="bar__track"><div class="bar__fill" style="width:' + (r[1] / max * 100) + '%"></div></div>' +
      '<span class="bar__val">' + r[1] + "</span></div>"
    ).join("");
  }

  /* ---------- Render: recent (overview) ---------- */
  function renderRecent() {
    const rows = leads.slice(0, 5);
    $("#recentLeads").innerHTML = rows.map((l) =>
      "<tr><td>" + custCell(l) + "</td><td>" + esc(l.type) + '</td><td class="cell-sub">' + esc(l.condition) +
      "</td><td class=\"cell-sub\">" + timeAgo(l.createdAt) + "</td><td>" + statusPill(l.status) + "</td></tr>"
    ).join("") || emptyRow(5);
  }

  /* ---------- Render: full leads table ---------- */
  function renderLeads() {
    const q = ($("#leadSearch").value || "").toLowerCase().trim();
    const sf = $("#statusFilter").value;
    const rows = leads.filter((l) => {
      const okQ = !q || (l.phone + " " + (l.name || "") + " " + l.type).toLowerCase().indexOf(q) > -1;
      const okS = !sf || l.status === sf;
      return okQ && okS;
    });
    const body = $("#leadsBody");
    if (!rows.length) { body.innerHTML = emptyRow(7); return; }
    body.innerHTML = rows.map((l) =>
      "<tr><td>" + custCell(l) + "</td><td>" + esc(l.type) + '</td><td class="cell-sub">' + esc(l.condition) +
      '</td><td class="cell-sub">' + esc(l.source || "—") + '</td><td class="cell-sub">' + timeAgo(l.createdAt) + "</td>" +
      '<td><select class="status-select" data-id="' + esc(l.id) + '">' +
        STATUSES.map((s) => "<option" + (s === l.status ? " selected" : "") + ">" + esc(s) + "</option>").join("") +
      "</select></td>" +
      '<td><div class="row-actions"><button class="icon-btn" data-del="' + esc(l.id) + '" title="Xóa" aria-label="Xóa"><svg><use href="#i-trash"/></svg></button></div></td></tr>'
    ).join("");
  }

  const emptyRow = (cols) => '<tr><td colspan="' + cols + '"><div class="empty"><svg><use href="#i-inbox"/></svg><div>Chưa có yêu cầu nào.</div></div></td></tr>';

  function renderAll() {
    renderKPIs(); renderChart(); renderBreakdown(); renderRecent(); renderLeads();
    const fresh = leads.filter((l) => l.status === "Mới").length;
    const badge = $("#leadBadge");
    badge.textContent = fresh; badge.style.display = fresh ? "grid" : "none";
  }

  /* ---------- Events: leads table (delegation) ---------- */
  $("#leadsBody").addEventListener("change", (e) => {
    const sel = e.target.closest(".status-select");
    if (!sel) return;
    const lead = leads.find((l) => l.id === sel.dataset.id);
    if (lead) {
      lead.status = sel.value;
      if (lead.status === "Đã chốt" && !lead.value) lead.value = (2 + Math.floor(Math.random() * 28)) * 1000000;
      save(); renderKPIs(); renderBreakdown(); renderRecent();
      const badge = $("#leadBadge"); const fresh = leads.filter((l) => l.status === "Mới").length;
      badge.textContent = fresh; badge.style.display = fresh ? "grid" : "none";
    }
  });
  $("#leadsBody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-del]");
    if (!btn) return;
    if (!confirm("Xóa yêu cầu này?")) return;
    leads = leads.filter((l) => l.id !== btn.dataset.del);
    save(); renderAll();
  });
  $("#leadSearch").addEventListener("input", renderLeads);
  $("#statusFilter").addEventListener("change", renderLeads);

  /* ---------- View routing ---------- */
  const titles = { overview: "Tổng quan", leads: "Yêu cầu báo giá", instruments: "Bảng giá nhạc cụ", settings: "Cài đặt" };
  function go(view) {
    $$(".view").forEach((v) => v.classList.toggle("is-active", v.id === "view-" + view));
    $$(".nav-item").forEach((n) => n.classList.toggle("is-active", n.dataset.view === view));
    $("#pageTitle").textContent = titles[view] || "";
    closeSidebar();
    if (view === "overview") renderChart();
  }
  document.addEventListener("click", (e) => {
    const item = e.target.closest("[data-view]");
    if (item) { go(item.dataset.view); }
  });

  /* ---------- Mobile sidebar ---------- */
  const sidebar = $("#sidebar"), scrim = $("#scrim");
  const openSidebar = () => { sidebar.classList.add("is-open"); scrim.classList.add("is-open"); };
  const closeSidebar = () => { sidebar.classList.remove("is-open"); scrim.classList.remove("is-open"); };
  $("#menuBtn").addEventListener("click", openSidebar);
  scrim.addEventListener("click", closeSidebar);

  /* ---------- Topbar global search ---------- */
  $("#globalSearch").addEventListener("input", (e) => {
    $("#leadSearch").value = e.target.value;
    go("leads"); renderLeads();
  });

  /* ---------- Greeting ---------- */
  function greet() {
    const h = new Date().getHours();
    const g = h < 11 ? "Chào buổi sáng" : h < 14 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối";
    $("#greeting").textContent = g + ", Cô Linh 👋";
  }

  /* ---------- Auth ---------- */
  const loginView = $("#loginView"), appView = $("#appView");
  function showApp() {
    loginView.hidden = true; appView.hidden = false;
    load(); greet(); renderAll();
    requestAnimationFrame(renderChart);
  }
  function showLogin() { appView.hidden = true; loginView.hidden = false; }

  // Client admin account (front-end demo — for real multi-device security, move auth to a backend)
  const ACCOUNT = { email: "admin@doremi2000.vn", pass: "Doremi@2000" };
  $("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = ($("#email").value || "").trim().toLowerCase();
    const pass = $("#pass").value || "";
    const err = $("#loginError");
    if (email === ACCOUNT.email && pass === ACCOUNT.pass) {
      try { sessionStorage.setItem(AUTH_KEY, "1"); } catch (e2) {}
      if (err) err.style.display = "none";
      showApp();
    } else if (err) {
      err.textContent = "Email hoặc mật khẩu chưa đúng. Vui lòng kiểm tra lại.";
      err.style.display = "block";
    }
  });
  $("#logoutBtn").addEventListener("click", () => {
    try { sessionStorage.removeItem(AUTH_KEY); } catch (err) {}
    showLogin();
  });
  $("#reseedBtn").addEventListener("click", () => {
    if (!confirm("Khôi phục dữ liệu mẫu? Dữ liệu hiện tại sẽ bị thay thế.")) return;
    leads = seed(); save(); renderAll();
  });

  /* ---------- Resize (redraw chart) ---------- */
  let rT;
  window.addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(renderChart, 160); }, { passive: true });

  /* ---------- Boot ---------- */
  let authed = false;
  try { authed = sessionStorage.getItem(AUTH_KEY) === "1"; } catch (e) {}
  if (authed) showApp(); else showLogin();
})();
