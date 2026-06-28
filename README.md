# Doremi 2000 — Website thu mua nhạc cụ cũ

Website cho **Trung Tâm Âm Nhạc Đô Rê Mi 2000** (TP.HCM) — chuyên **thu mua nhạc cụ & thiết bị âm thanh cũ** giá cao tận nơi. Phong cách **dark-luxury "phòng hòa nhạc về đêm"**, song ngữ Việt/Anh, sáng/tối. Mục tiêu: khách **gọi / nhắn Zalo để được định giá**.

| | |
|---|---|
| **Trang chính** | https://thumuanhaccu.vercel.app |
| **Cẩm nang (blog SEO)** | https://thumuanhaccu.vercel.app/cam-nang/ |
| **Trang quản trị** | https://thumuanhaccu.vercel.app/admin/ |
| **Hosting** | Vercel (static, HTTPS, miễn phí) — repo `hntngoctu1/thumuanhaccu` |
| **Hotline / Zalo** | 0938 818 871 (Cô Linh) |

---

## 1. Công nghệ

Trang **tĩnh (static)** — HTML/CSS/JS thuần, **không framework**. HTML cho phần nội dung động (bài Cẩm nang, ảnh trang chủ) được **sinh ra từ dữ liệu JSON** bằng script Python; mọi thứ khác viết tay.

- **Design system:** CSS custom properties trong `css/tokens.css` (đổi 1 chỗ → đổi cả light & dark).
- **Song ngữ VI/EN** (`js/i18n.js`), **sáng/tối** (nhớ lựa chọn trong localStorage).
- **Hero carousel**, **Cẩm nang** 11 bài chuẩn SEO (JSON-LD Article/FAQ/Breadcrumb), **18 ảnh thật** (Pexels), mục **Khu vực** (SEO local).
- **SEO/bảo mật:** JSON-LD (LocalBusiness/WebSite/FAQ), sitemap, security headers + Content-Security-Policy (`vercel.json`), self-host GSAP.
- **Trợ năng:** WCAG 2.2 AA (tương phản, nút tạm dừng slideshow, landmark, reduced-motion).

---

## 2. Cấu trúc thư mục

```
thumuanhaccu/
├── index.html              # Trang chính (one-page)
├── css/                    # tokens · base · layout · components · sections · article
├── js/
│   ├── main.js             # Tương tác: theme, carousel, menu, form, reveal…
│   └── i18n.js             # Song ngữ VI/EN
├── content/                # ★ NGUỒN nội dung (CMS sửa file này)
│   ├── articles.json       #   Bài Cẩm nang
│   └── gallery.json        #   Ảnh trang chủ (mục Thư viện)
├── scripts/                # Build sinh HTML từ content/
│   ├── build_blog.py       #   content/articles.json → cam-nang/*.html + sitemap.xml
│   └── build_home.py       #   content/gallery.json  → mục Thư viện trong index.html
├── cam-nang/               # (sinh tự động) trang Cẩm nang + 11 bài
├── admin/                  # 🔐 Trang quản trị + CMS sửa nội dung
│   ├── index.html · admin.css · admin.js
│   └── cms.js · cms.css    #   CMS: sửa ảnh trang chủ + CRUD Cẩm nang qua GitHub API
├── .github/workflows/      # Action tự build lại HTML khi content/ thay đổi
├── vercel.json             # Security headers + CSP
├── robots.txt · sitemap.xml · favicon.svg
└── README.md
```

> Đổi tông màu/font/spacing toàn trang → sửa duy nhất `css/tokens.css`.

---

## 3. Luồng nội dung (content pipeline)

```
Sửa content/*.json  ──►  GitHub Action chạy scripts/build_*.py  ──►  commit HTML  ──►  Vercel deploy
   (qua CMS hoặc tay)         (sinh cam-nang/, index gallery, sitemap)
```

Chạy build thủ công khi cần:

```bash
python scripts/build_blog.py   # dựng lại Cẩm nang + sitemap
python scripts/build_home.py   # dựng lại mục Thư viện
```

---

## 4. Trang quản trị & CMS

- **Đăng nhập:** `admin@doremi2000.vn` / `Doremi@2000` *(đăng nhập phía front-end — phù hợp demo/quản lý cơ bản; bảo mật thật cần backend, xem mục 6)*.
- **Bảng điều khiển:** KPI, biểu đồ, danh sách yêu cầu báo giá. **Số liệu trung thực** — mặc định trống, chỉ hiện yêu cầu thật từ form; có nút "Nạp demo" để xem thử giao diện.
- **Nội dung web (CMS):** mục **"Nội dung web"** cho phép **sửa ảnh trang chủ** + **CRUD bài Cẩm nang** rồi **Lưu lên web** (ghi vào `content/*.json` qua GitHub API → Action build → Vercel deploy). Cần dán **GitHub fine-grained token** (lưu trên máy, quyền *Contents: Read & write*).

---

## 5. Chạy thử & deploy

```bash
# Local (server không cache, luôn thấy bản mới)
python .claude/serve_nocache.py        # http://localhost:4322

# Deploy production
npx vercel --prod
```

Hoặc **Vercel → Settings → Git → Connect** repo để tự deploy mỗi khi push (khuyến nghị — cần cho CMS tự cập nhật).

---

## 6. Còn lại cho bản hoàn chỉnh (cần tài sản/tài khoản của doanh nghiệp)

- **Bảo mật admin thật:** bật Vercel Deployment Protection cho `/admin`, hoặc nối backend xác thực.
- **Nhận lead về email:** điền **Web3Forms access key** (miễn phí) vào `LEAD_FORM_KEY` trong `js/main.js`.
- **Tên miền** `thumuanhaccu.vn` (Vercel → Settings → Domains).
- **Ảnh thật** của trung tâm, **đánh giá khách thật**, link **Facebook/Google Business**, `og-image.jpg` (1200×630).

---

*Thiết kế 2026 — phong cách "Concert Hall After Dark".*
