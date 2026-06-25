# 📋 BÀN GIAO WEBSITE — Doremi 2000

*Tài liệu này tổng hợp đầy đủ thông tin để bàn giao cho khách hàng.*

---

## 1) 🌍 Đường dẫn (gửi khách xem ngay)

| Trang | Link |
|---|---|
| **Trang chính** | https://hntngoctu1.github.io/thumuanhaccu/ |
| **Trang quản trị** | https://hntngoctu1.github.io/thumuanhaccu/admin/ |

Hosting: **GitHub Pages** (miễn phí, HTTPS, tự build). Repo: `hntngoctu1/thumuanhaccu`.

---

## 2) 🔐 TÀI KHOẢN QUẢN TRỊ (cho khách)

> Dùng để đăng nhập **Trang quản trị** xem/quản lý yêu cầu báo giá.

```
Email    : admin@doremi2000.vn
Mật khẩu : Doremi@2000
```

- Đăng nhập tại: https://hntngoctu1.github.io/thumuanhaccu/admin/
- **Đổi mật khẩu:** sửa biến `ACCOUNT` ở đầu file `admin/admin.js` (dòng `const ACCOUNT = {...}`).
- ⚠️ Đây là **đăng nhập phía giao diện (front-end)**, phù hợp để demo/quản lý cơ bản. Để bảo mật thật & nhận yêu cầu từ **mọi thiết bị**, cần nối backend (xem mục 6).

---

## 3) ☎️ THÔNG TIN DOANH NGHIỆP (đang hiển thị trên web)

| Mục | Nội dung | Cần xác nhận? |
|---|---|---|
| Tên | Trung Tâm Âm Nhạc Đô Rê Mi 2000 | |
| Hotline / Zalo | **0938 818 871** (Cô Linh) | |
| Khu vực | TP. Hồ Chí Minh & lân cận | nên thêm địa chỉ cụ thể |
| Giờ làm việc | 08:00 – 20:00, tất cả các ngày | ✅ xác nhận |
| Facebook | *(chưa có link)* | ✅ bổ sung hoặc bỏ |
| Messenger | *(chưa có link m.me)* | ✅ bổ sung hoặc bỏ |
| Ảnh chia sẻ (og-image) | *(chưa có)* | nên thêm `og-image.jpg` |

**Dịch vụ thu mua:** Organ · Piano cơ & điện · Guitar · Trống · Loa/Amply · Dàn karaoke · Âm thanh sân khấu · Tivi.

**Số liệu đang là MẪU (cần khách chốt):** 25+ năm kinh nghiệm · 5.000+ nhạc cụ đã thu mua · báo giá ~60 phút. → sửa trong `index.html` mục `#stats` (thuộc tính `data-count`).

**Bảng giá tham khảo (sửa ở `#pricing` và bảng trong admin):**
Piano cơ 5–60tr · Piano điện 2–25tr · Organ 800K–15tr · Guitar 300K–10tr · Trống 2–30tr · Loa&Amply 500K–40tr · Karaoke 2–50tr · Tivi 500K–15tr.

---

## 4) ✨ TÍNH NĂNG

- **Hero dạng slideshow** 3 slide (piano / nhạc cụ / âm thanh), tự chạy + chấm + mũi tên + vuốt.
- **Song ngữ Việt / Anh** (nút VI⇄EN, nhớ lựa chọn).
- **Giao diện Sáng / Tối** (nút mặt trời/trăng, nhớ lựa chọn).
- **Ảnh thật** ở hero & thư viện, **bảng giá tham khảo**, **đánh giá**, **hỏi đáp**, nút **gọi/Zalo nổi**.
- **Trang quản trị:** tổng quan (KPI + biểu đồ), quản lý yêu cầu báo giá (đổi trạng thái / tìm / lọc / xoá), bảng giá, cài đặt.
- Tối ưu **SEO** (tiêu đề, mô tả, dữ liệu LocalBusiness + FAQ, sitemap, robots) & **mobile**.

---

## 5) 🛠️ HƯỚNG DẪN CẬP NHẬT NHANH

- **Đổi số điện thoại:** tìm-thay trong `index.html`: hiển thị `0938 818 871`; link gọi `tel:+84938818871`; Zalo `zalo.me/0938818871`.
- **Sửa dịch vụ / bảng giá / đánh giá / hỏi đáp:** sửa trong `index.html` ở các mục tương ứng (`#services`, `#pricing`, `#testimonials`, `#faq`).
- **Sửa bản dịch tiếng Anh:** trong `js/i18n.js` (cặp `"Tiếng Việt": "English"`).
- **Đăng bản mới:** `git add -A && git commit -m "..." && git push` → web tự cập nhật sau ~1–2 phút.

---

## 6) 🚀 NÂNG CẤP KHI CẦN

- **Tên miền thật `thumuanhaccu.vn`:** repo → Settings → Pages → Custom domain, rồi trỏ DNS (CNAME → `hntngoctu1.github.io`).
- **Nhận yêu cầu thật từ mọi máy:** nối form với Formspree / Google Sheets / Supabase (hiện form lưu cục bộ trên trình duyệt).
- **Ảnh thật của trung tâm:** thay `src` của `<img class="hero-slide__img">` (hero) và `<img class="gcard__img">` (thư viện), thêm `og-image.jpg` (1200×630).
- **Bảo mật admin thật:** chuyển xác thực sang backend (hiện là demo front-end).

---

*Thiết kế: phong cách "Concert Hall After Dark" — dark luxury, vàng đồng + ngà, song ngữ Việt/Anh. Cập nhật 2026.*
