# Doremi 2000 — Website thu mua nhạc cụ cũ

Thiết kế lại trang **thumuanhaccu.vn** theo phong cách **dark luxury "phòng hòa nhạc về đêm"** — sang trọng, hiện đại, đúng chủ đề âm nhạc. Mục tiêu chính của trang: khiến khách **gọi điện / nhắn Zalo để được định giá**.

Trang web là **tĩnh (static)** — chỉ gồm HTML/CSS/JS thuần, **không cần build**, mở được ngay và deploy ở bất kỳ đâu.

---

## 1. Cấu trúc thư mục

```
thumuanhaccu/
├── index.html            # Trang chính (1 trang cuộn dài)
├── css/
│   ├── tokens.css        # Design system: màu, font, khoảng cách + BẢNG MÀU LIGHT/DARK
│   ├── base.css          # Reset, typography nền, grain, skip-link, tiện ích
│   ├── layout.css        # Header, menu, footer, theme toggle, responsive
│   ├── components.css    # Nút, thẻ, form, marquee, accordion, nút nổi, theme toggle
│   └── sections.css      # Style từng khu vực (hero, dịch vụ, thư viện, quy trình...)
├── js/
│   └── main.js           # Tương tác: theme, menu, cuộn, đếm số, accordion, form, lưu lead
├── admin/                # 🔐 TRANG QUẢN TRỊ
│   ├── index.html        # Đăng nhập + bảng điều khiển
│   ├── admin.css         # Giao diện dashboard (dùng chung tokens.css)
│   └── admin.js          # Đăng nhập, KPI, biểu đồ, quản lý yêu cầu báo giá
├── favicon.svg           # Icon nốt nhạc
├── robots.txt · sitemap.xml
├── .claude/launch.json   # Cấu hình server xem thử local (không ảnh hưởng deploy)
└── README.md
```

> Muốn đổi **tông màu / font / khoảng cách** toàn trang (cả light & dark) → sửa duy nhất `css/tokens.css`.

---

## 🌓 Giao diện Sáng / Tối (Light / Dark mode)

- Mặc định là **Dark** ("phòng hòa nhạc về đêm"); nút **mặt trăng/mặt trời** trên header (và trong menu di động) để đổi sang **Light** ("Atelier ấm" — nền ngà, gỗ, đồng).
- Lựa chọn được **ghi nhớ** trong trình duyệt (localStorage) và **dùng chung** cho cả trang chính và trang quản trị.
- Muốn đổi mặc định sang Light: sửa `'dark'` thành `'light'` trong đoạn script nhỏ ở đầu `<head>` của `index.html` và `admin/index.html`.

## 🌐 Song ngữ Việt / Anh (VI ⇄ EN)

- Nút **VI / EN** trên header (và trong menu di động) chuyển toàn bộ trang chủ giữa **tiếng Việt** và **tiếng Anh** — gồm cả `<title>`, mô tả SEO, `<html lang>`, placeholder form và thông báo sau khi gửi form. Lựa chọn được **ghi nhớ** (localStorage).
- Bản dịch nằm trong `js/i18n.js`:
  - Hầu hết câu dịch theo **đúng chuỗi tiếng Việt** trong từ điển `DICT` (`"tiếng Việt": "English"`). Muốn sửa/î thêm câu, chỉ cần thêm cặp vào `DICT`.
  - 6 tiêu đề/đoạn mở đầu của hero (có chữ vàng/đậm bên trong) dùng `data-i18n` + `HTML_DICT`.
- **Mặc định: tiếng Việt.** Đổi mặc định sang EN: sửa `localStorage.getItem('doremi-lang')||'vi'` thành `'en'` (ở `i18n.js` và đoạn script đầu `<head>`).
- *Trang quản trị (`/admin`) hiện để tiếng Việt (nội bộ) — có thể thêm song ngữ tương tự nếu cần.*

## 🎞️ Hero dạng slide (carousel)

Phần đầu trang giờ là **slideshow 3 slide** tự chạy (piano → nhạc cụ/guitar → âm thanh), mỗi slide có ảnh điện ảnh riêng + tiêu đề riêng:
- Tự động chuyển sau ~6 giây, **dừng khi rê chuột / focus**, có **chấm điều hướng** + **mũi tên**, hỗ trợ **bàn phím (←/→)** và **vuốt trên điện thoại**.
- Tôn trọng `prefers-reduced-motion` (tắt tự chạy nếu người dùng tắt hiệu ứng).
- Hero luôn nền tối (kể cả ở Light mode) để chữ luôn rõ và mang cảm giác "phòng hòa nhạc".
- **Sửa slide:** mỗi `<article class="hero-slide">` trong `index.html` — đổi `src` của `<img class="hero-slide__img">`, sửa `<h1>`, `.eyebrow`, `.hero__lead`. Thêm/bớt slide: thêm 1 khối `hero-slide` và 1 nút `hero-dot` tương ứng.

## 💰 Bảng giá tham khảo (mục #pricing)

- Khu **"Bảng giá tham khảo"** trên trang chủ: 8 nhóm nhạc cụ/thiết bị kèm **khoảng giá thu mua tham khảo** (thẻ "Piano cơ" được làm nổi bật). Tăng độ tin cậy + tốt cho SEO.
- **Sửa giá:** mỗi `<article class="price-card">` trong mục `#pricing` — đổi tên nhóm (`<h3>`), khoảng giá (`.price-card__range`), thương hiệu (`.price-card__brands`). Giá đồng bộ với bảng giá trong trang quản trị.
- Có thanh **tiến trình cuộn** (vạch vàng trên cùng) cho cảm giác cao cấp.

## 🖼️ Hình ảnh thật (hero + thư viện)

- **Hero** (3 slide) và khu **Thư viện** (`#gallery`) dùng **ảnh chụp thật** — nguồn [Pexels](https://www.pexels.com), **miễn phí cho mục đích thương mại, không cần ghi nguồn**. Ảnh nạp trực tiếp từ CDN Pexels (`images.pexels.com`) nên không chiếm dung lượng dự án; ảnh hero slide 1 ưu tiên tải, còn lại `loading="lazy"`.
- **Đổi sang ảnh của chính trung tâm** (khuyến nghị — tăng độ tin cậy nhất): chụp ảnh nhạc cụ/cửa hàng thật, bỏ vào `assets/images/`, rồi thay thuộc tính `src` của:
  - Hero: 3 thẻ `<img class="hero-slide__img">` trong mục `#hero`.
  - Thư viện: 6 thẻ `<img class="gcard__img">` trong mục `#gallery`.
  - Nhớ cập nhật `alt` cho đúng nội dung ảnh.
- **Về việc "AI tạo ảnh":** phiên làm việc này **không có công cụ tạo ảnh AI** được kết nối, nên tôi dùng ảnh chụp thật có bản quyền hợp lệ thay vì ảnh AI. Nếu sau này muốn ảnh AI riêng theo phong cách thương hiệu, có thể kết nối một dịch vụ tạo ảnh (vd. fal.ai/Flux) rồi thay vào các vị trí `src` ở trên.

## 🔐 Trang quản trị — `admin/index.html`

Bảng điều khiển quản lý **yêu cầu báo giá** của khách, có:
- **Đăng nhập demo:** `admin@doremi.vn` / `doremi2000` (hoặc nhập gì cũng vào — đây là demo front-end).
- **Tổng quan:** thẻ KPI (yêu cầu mới, tổng, đã chốt, doanh thu ước tính), biểu đồ 7 ngày, phân loại theo nhạc cụ, yêu cầu gần đây.
- **Yêu cầu báo giá:** bảng đầy đủ — đổi trạng thái (Mới → Đang xử lý → Đã chốt / Hủy), tìm kiếm, lọc, xoá.
- **Bảng giá nhạc cụ:** khoảng giá thu mua tham khảo theo nhóm.
- **Cài đặt:** thông tin doanh nghiệp, đổi giao diện, khôi phục dữ liệu mẫu.

**Quan trọng — dữ liệu hiện là DEMO:** lưu cục bộ trong trình duyệt (`localStorage`), kèm 18 yêu cầu mẫu. Yêu cầu khách gửi từ form trang chính cũng được lưu vào đây **(nhưng chỉ trên cùng một trình duyệt)**. Để nhận & quản lý yêu cầu thật từ mọi thiết bị, cần kết nối với backend:
- Nhanh nhất: **Formspree / Web3Forms / Google Sheets** (lưu mục 6 bên dưới) — sau đó trang quản trị đọc dữ liệu từ đó.
- Đầy đủ hơn: **Supabase / Firebase** (có đăng nhập thật + cơ sở dữ liệu).

> ⚠️ Phần đăng nhập là demo, **chưa bảo mật**. Đừng để dữ liệu thật/nhạy cảm cho tới khi nối backend có xác thực thật.

---

## 2. Xem thử trên máy (local)

Mở terminal trong thư mục dự án và chạy một trong các lệnh:

```bash
python -m http.server 4321
# hoặc
npx serve
```

Rồi mở trình duyệt: `http://localhost:4321`

(Có thể mở trực tiếp `index.html` bằng trình duyệt, nhưng chạy qua server sẽ chuẩn hơn.)

> 💡 **Mẹo khi chỉnh sửa:** trình duyệt hay **cache** file CSS/JS, nên sau khi sửa code nhớ **hard refresh** (`Ctrl + F5`). Hoặc chạy server **không cache** kèm sẵn: `python .claude/serve_nocache.py` rồi mở `http://localhost:4322` — luôn thấy bản mới nhất.

---

## 3. Đưa lên Internet (deploy)

Vì là trang tĩnh, cách nhanh nhất là kéo-thả cả thư mục lên một trong các dịch vụ **miễn phí**:

- **Netlify** — vào https://app.netlify.com/drop → kéo thả thư mục.
- **Cloudflare Pages** — tốc độ rất tốt tại Việt Nam.
- **Vercel** — `vercel deploy`.

Sau đó trỏ tên miền `thumuanhaccu.vn` về dịch vụ đã chọn. Nên bật **chuyển hướng `www` → không `www`** (hoặc ngược lại) để thống nhất một địa chỉ chuẩn (canonical).

---

## 4. ✅ CẦN KIỂM TRA / THAY TRƯỚC KHI CHẠY THẬT

Những nội dung dưới đây hiện đang là **số liệu mẫu / placeholder** — hãy xác nhận đúng sự thật rồi chỉnh trong `index.html`:

| Vị trí | Nội dung hiện tại | Việc cần làm |
|---|---|---|
| Khu **"Số liệu"** (stats) | `24+` năm, `5.000+` nhạc cụ, `60 phút` | Sửa lại đúng con số thật (`data-count` và `data-suffix`). Nếu không chắc, nên xóa con số chưa kiểm chứng. |
| **Giờ làm việc** | `08:00 – 20:00` mỗi ngày | Xác nhận giờ thật (sửa ở footer + JSON-LD). |
| **Địa chỉ** | Mới ghi "TP. Hồ Chí Minh" | Thêm địa chỉ cụ thể nếu muốn (footer + JSON-LD `address`). |
| **Facebook** | Link `#` (chưa có) | Thay bằng link fanpage thật, hoặc bỏ icon đi. |
| **Messenger** (nút nổi) | `https://m.me/` | Thay bằng `https://m.me/<tên-trang-fanpage>`, hoặc bỏ nút nếu không dùng Messenger. |
| **Đánh giá khách hàng** | 3 nhận xét mẫu | Thay bằng nhận xét thật (kèm tên/khu vực thật càng tốt). |
| `og-image.jpg` | Chưa có ảnh | Thêm 1 ảnh chia sẻ (1200×630) tên `og-image.jpg` vào thư mục gốc để khi gửi link Zalo/Facebook hiển thị đẹp. |
| **Favicon** | Chưa có | Thêm `favicon.ico` / `favicon.svg` (logo nốt nhạc) và khai báo trong `<head>`. |

**Hotline đã dùng đúng số thật:** `0938 818 871` (Cô Linh) — đã gắn cho nút Gọi (`tel:`), Zalo (`https://zalo.me/0938818871`) và dữ liệu SEO.

---

## 5. Sửa nội dung thường gặp

- **Đổi số điện thoại:** tìm-thay toàn bộ trong `index.html`:
  - hiển thị: `0938 818 871`
  - link gọi: `tel:+84938818871`
  - link Zalo: `https://zalo.me/0938818871`
- **Thêm/bớt dịch vụ:** sửa các thẻ `<article class="card svc ...">` trong khu `#services`.
- **Thêm câu hỏi (FAQ):** copy một khối `<div class="acc-item">` trong `#faqAcc`.
- **Đổi thương hiệu chạy ngang (marquee):** sửa danh sách `.marquee__item` (nhớ giữ **2 bản giống nhau** liền nhau để hiệu ứng cuộn liền mạch).

---

## 6. Form "Nhận báo giá"

Trang tĩnh **không có máy chủ** nên form hiện **không tự gửi dữ liệu đi đâu** — sau khi bấm gửi, nó hiện thông báo và hướng khách **gọi/nhắn Zalo** (kênh chuyển đổi chính).

Nếu muốn form **thực sự gửi về email/điện thoại**, có thể nối nhanh với một dịch vụ miễn phí (không cần code backend):
- **Formspree** (`https://formspree.io`) hoặc **Web3Forms** — chỉ cần đổi thẻ `<form>` thành `action="<endpoint>"` `method="POST"`.
- Hoặc nối **Google Sheets** qua Google Apps Script.

---

## 7. Ghi chú thiết kế & kỹ thuật

- **Font:** Playfair Display (tiêu đề) + Be Vietnam Pro (nội dung) — đều hỗ trợ đầy đủ dấu tiếng Việt, tải từ Google Fonts.
- **Hiệu ứng cuộn:** dùng IntersectionObserver (chạy được kể cả khi không tải được GSAP). GSAP chỉ thêm hiệu ứng parallax nhẹ ở hero.
- **Tôn trọng `prefers-reduced-motion`:** người dùng tắt hiệu ứng sẽ thấy trang tĩnh, không chuyển động.
- **Hiệu năng:** không ảnh nặng, gần như không chặn render → điểm Lighthouse cao, tải nhanh (tốt cho SEO).
- **Khi có ảnh thật:** các khu dịch vụ/hero có thể thay hình minh họa SVG bằng ảnh nhạc cụ chất lượng cao để tăng độ tin cậy.

---

*Thiết kế lại 2026 — phong cách "Concert Hall After Dark".*
