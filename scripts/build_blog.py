# -*- coding: utf-8 -*-
"""Generate the Cẩm nang (blog) listing + article pages from the workflow output."""
import json, os, html

ROOT = os.environ.get("SITE_ROOT") or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "content", "articles.json")
BLOG = os.path.join(ROOT, "cam-nang")
os.makedirs(BLOG, exist_ok=True)

data = json.load(open(OUT, encoding="utf-8"))
arts = (data.get("articles") or data.get("result") or data) if isinstance(data, dict) else data

SITE = "https://thumuanhaccu.vn"
PUBLISHED = "2026-06-22"
MODIFIED = "2026-06-25"
OG_IMAGE = "https://images.pexels.com/photos/2378209/pexels-photo-2378209.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop"

def a(s):  # attribute escape
    return html.escape(str(s), quote=True)
def t(s):  # text escape
    return html.escape(str(s), quote=False)

NOTE_SVG = ('<svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">'
  '<circle cx="22" cy="22" r="21" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/>'
  '<path d="M18.5 29V14.2l9-1.7V25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
  '<ellipse cx="15.4" cy="29" rx="3.7" ry="3" fill="currentColor"/>'
  '<ellipse cx="24.4" cy="27" rx="3.7" ry="3" fill="currentColor"/></svg>')

SPRITE = ('<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>'
  '<symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>'
  '<symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></symbol>'
  '<symbol id="i-mess" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.3S17.5 2 12 2z"/><path d="m6.6 13.4 3-3.1 2.5 1.8 2.8-2.9-3 3.1-2.6-1.8z"/></symbol>'
  '<symbol id="i-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>'
  '<symbol id="i-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></symbol>'
  '<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></symbol>'
  '<symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></symbol>'
  '<symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>'
  '<symbol id="i-fb" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></symbol>'
  '<symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></symbol>'
  '<symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"/></symbol>'
  '</defs></svg>')

BRAND = ('<a class="brand" href="/" aria-label="Doremi 2000 - Trang chủ"><span class="brand__mark">' + NOTE_SVG +
  '</span><span class="brand__text"><span class="brand__name">Doremi <span class="brand__year">2000</span></span>'
  '<span class="brand__sub"><span class="brand__rule" aria-hidden="true"></span>thumuanhaccu.vn</span></span></a>')

HEADER = ('<header class="site-header" id="header"><div class="container nav">' + BRAND +
  '<nav class="nav__links" aria-label="Điều hướng chính">'
  '<a class="nav__link" href="/">Trang chủ</a><a class="nav__link" href="/#services">Dịch vụ</a>'
  '<a class="nav__link" href="/#pricing">Bảng giá</a><a class="nav__link" href="/cam-nang/">Cẩm nang</a>'
  '<a class="nav__link" href="/#faq">Hỏi đáp</a></nav>'
  '<div class="nav__actions">'
  '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Đổi giao diện sáng / tối"><svg class="theme-toggle__moon"><use href="#i-moon"/></svg><svg class="theme-toggle__sun"><use href="#i-sun"/></svg></button>'
  '<a class="btn btn--gold" href="tel:+84938818871"><svg><use href="#i-phone"/></svg>Gọi 0938 818 871</a>'
  '<button class="nav__toggle" id="navToggle" aria-label="Mở menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>'
  '</div></div></header>'
  '<div class="mobile-menu" id="mobileMenu"><div class="container"><nav class="mobile-menu__links" aria-label="Menu di động">'
  '<a href="/">Trang chủ</a><a href="/#services">Dịch vụ</a><a href="/#pricing">Bảng giá</a><a href="/cam-nang/">Cẩm nang</a><a href="/#faq">Hỏi đáp</a></nav>'
  '<div class="mobile-menu__foot"><a class="btn btn--gold btn--block btn--lg" href="tel:+84938818871"><svg><use href="#i-phone"/></svg>Gọi 0938 818 871</a>'
  '<button class="btn btn--ghost btn--block" type="button" id="themeToggleMobile"><svg class="theme-toggle__moon"><use href="#i-moon"/></svg><svg class="theme-toggle__sun"><use href="#i-sun"/></svg><span>Đổi giao diện sáng / tối</span></button></div></div></div>')

FOOTER = ('<footer class="site-footer"><div class="container"><div class="footer-grid">'
  '<div class="footer-brand">' + BRAND.replace('aria-label="Doremi 2000 - Trang chủ"', '') +
  '<p>Trung Tâm Âm Nhạc Đô Rê Mi 2000 — chuyên thu mua nhạc cụ &amp; thiết bị âm thanh cũ giá cao tận nơi tại TP.HCM từ năm 2000.</p>'
  '<div class="footer-social"><a href="https://zalo.me/0938818871" target="_blank" rel="noopener" aria-label="Zalo"><svg><use href="#i-chat"/></svg></a>'
  '<a href="tel:+84938818871" aria-label="Gọi điện"><svg><use href="#i-phone"/></svg></a></div></div>'
  '<div class="footer-col"><h3>Liên kết</h3><ul><li><a href="/">Trang chủ</a></li><li><a href="/#services">Dịch vụ</a></li>'
  '<li><a href="/#pricing">Bảng giá</a></li><li><a href="/cam-nang/">Cẩm nang</a></li><li><a href="/#faq">Hỏi đáp</a></li></ul></div>'
  '<div class="footer-col"><h3>Liên hệ</h3>'
  '<div class="footer-contact-item"><svg><use href="#i-phone"/></svg><div><strong>0938 818 871</strong><span>Hotline / Zalo — Cô Linh</span></div></div>'
  '<div class="footer-contact-item"><svg><use href="#i-pin"/></svg><div><strong>TP. Hồ Chí Minh</strong><span>&amp; các khu vực lân cận</span></div></div>'
  '<div class="footer-contact-item"><svg><use href="#i-clock"/></svg><div><strong>08:00 – 20:00</strong><span>Tất cả các ngày trong tuần</span></div></div></div>'
  '</div><div class="footer-bottom"><span>© 2026 Trung Tâm Âm Nhạc Đô Rê Mi 2000. Bảo lưu mọi quyền.</span>'
  '<a href="/">Về trang chủ ↑</a></div></div></footer>')

DOCK = ('<nav class="dock" aria-label="Liên hệ nhanh"><a class="dock__btn dock__btn--call" href="tel:+84938818871" aria-label="Gọi điện"><span class="dock__label">Gọi ngay</span><svg><use href="#i-phone"/></svg></a>'
  '<a class="dock__btn dock__btn--zalo" href="https://zalo.me/0938818871" target="_blank" rel="noopener" aria-label="Chat Zalo"><span class="dock__label">Chat Zalo</span><svg><use href="#i-chat"/></svg></a></nav>'
  '<button class="to-top" id="toTop" aria-label="Về đầu trang"><svg><use href="#i-up"/></svg></button>')

HEAD_INLINE = ("<script>(function(){try{document.documentElement.setAttribute('data-theme',localStorage.getItem('doremi-theme')||'dark');}"
  "catch(e){document.documentElement.setAttribute('data-theme','dark');}})();</script>")

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>'
  '<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/>'
  '<noscript><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet"/></noscript>')
CSS = ''.join('<link rel="stylesheet" href="/css/%s.css"/>' % n for n in ["tokens","base","layout","components","article"])
SCRIPTS = '<script src="/js/main.js" defer></script>'
CTA = ('<div class="article-cta"><h3>Cần định giá nhạc cụ của bạn?</h3>'
  '<p>Doremi 2000 nhận định giá <strong>miễn phí tận nơi</strong> tại TP.HCM &amp; thanh toán tiền mặt ngay. Gọi để được báo giá nhanh.</p>'
  '<div class="btn-row"><a class="btn btn--gold btn--lg" href="tel:+84938818871"><svg><use href="#i-phone"/></svg>Gọi 0938 818 871</a>'
  '<a class="btn btn--ghost btn--lg" href="https://zalo.me/0938818871" target="_blank" rel="noopener"><svg><use href="#i-chat"/></svg>Nhắn Zalo</a></div>'
  '<p class="article-cta__note">Xem thêm <a href="/#services">dịch vụ thu mua</a> &amp; <a href="/#pricing">bảng giá tham khảo</a> của Doremi 2000.</p></div>')

def page(title, desc, canonical, body, jsonld_list, og_type="website"):
    ld = "".join('<script type="application/ld+json">%s</script>' % json.dumps(j, ensure_ascii=False) for j in jsonld_list)
    og = ('<meta property="og:type" content="%s"/><meta property="og:locale" content="vi_VN"/>'
          '<meta property="og:site_name" content="Doremi 2000"/><meta property="og:title" content="%s"/>'
          '<meta property="og:description" content="%s"/><meta property="og:url" content="%s"/>'
          '<meta property="og:image" content="https://images.pexels.com/photos/2378209/pexels-photo-2378209.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200&amp;h=630&amp;fit=crop"/>'
          '<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>' % (og_type, a(title), a(desc), a(canonical)))
    return ('<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/>'
      '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>' + HEAD_INLINE +
      '<title>%s</title><meta name="description" content="%s"/><meta name="theme-color" content="#0a0a0c"/>'
      '<link rel="canonical" href="%s"/><link rel="icon" type="image/svg+xml" href="/favicon.svg"/>'
      % (a(title), a(desc), a(canonical)) + og + FONTS + CSS + ld +
      '</head><body><a class="skip-link" href="#main">Bỏ qua tới nội dung</a>'
      '<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>'
      + SPRITE + HEADER + '<main id="main">' + body + '</main>' + FOOTER + DOCK + SCRIPTS + '</body></html>')

# ---- Validate slugs (defense-in-depth: don't trust input paths) ----
import re as _re
_seen = set()
for _a in arts:
    _s = _a.get("slug", "")
    if not _re.fullmatch(r"[a-z0-9-]+", _s):
        raise SystemExit("Slug không hợp lệ (chỉ a-z, 0-9, dấu -): %r" % _s)
    if _s in _seen:
        raise SystemExit("Trùng slug: %r" % _s)
    _seen.add(_s)

# ---- Article pages ----
for i, art in enumerate(arts):
    slug = art["slug"]; canonical = "%s/cam-nang/%s.html" % (SITE, slug)
    title = art["title"]; metaTitle = "%s | Doremi 2000" % art["metaTitle"]
    related = [x for x in arts if x["slug"] != slug][:3]
    rel_html = "".join('<li><a href="/cam-nang/%s.html"><svg><use href="#i-arr"/></svg>%s</a></li>' % (x["slug"], t(x["title"])) for x in related)
    faq_html = "".join('<div class="faq-q"><h3>%s</h3><p>%s</p></div>' % (t(f["q"]), t(f["a"])) for f in art["faq"])
    crumbs = ('<div class="crumbs"><a href="/">Trang chủ</a><span>›</span><a href="/cam-nang/">Cẩm nang</a><span>›</span>%s</div>' % t(title))
    body = ('<article class="article"><div class="container"><div class="article__head">' + crumbs +
      '<p class="article__cat">%s</p><h1>%s</h1>' % (t(art["category"]), t(title)) +
      '<div class="article__meta"><span>%s</span><span class="dot"></span><span>Doremi 2000</span></div></div></div>' % t(art["readingTime"]) +
      '<div class="container"><hr class="rule article__rule"/></div>' +
      '<div class="container"><div class="prose">' + art["bodyHtml"] + '</div></div>' +
      '<div class="container">' + CTA + '</div>' +
      '<div class="container"><div class="article-faq"><h2>Câu hỏi thường gặp</h2>' + faq_html + '</div></div>' +
      '<div class="container"><div class="related"><h2>Bài viết liên quan</h2><ul>' + rel_html + '</ul></div></div></article>')
    ld_article = {"@context":"https://schema.org","@type":"BlogPosting","headline":title,
      "description":art["metaDescription"],"inLanguage":"vi-VN","datePublished":PUBLISHED,"dateModified":MODIFIED,
      "image":OG_IMAGE,
      "author":{"@type":"Organization","name":"Doremi 2000"},
      "publisher":{"@type":"Organization","name":"Trung Tâm Âm Nhạc Đô Rê Mi 2000"},
      "mainEntityOfPage":{"@type":"WebPage","@id":canonical},
      "articleSection":art["category"]}
    ld_crumb = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Trang chủ","item":SITE+"/"},
      {"@type":"ListItem","position":2,"name":"Cẩm nang","item":SITE+"/cam-nang/"},
      {"@type":"ListItem","position":3,"name":title,"item":canonical}]}
    ld_faq = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":f["q"],"acceptedAnswer":{"@type":"Answer","text":f["a"]}} for f in art["faq"]]}
    open(os.path.join(BLOG, slug + ".html"), "w", encoding="utf-8").write(
      page(metaTitle, art["metaDescription"], canonical, body, [ld_article, ld_crumb, ld_faq], "article"))
    print("wrote", slug + ".html")

# ---- Listing page ----
cards = ""
for art in arts:
    cards += ('<article class="post-card"><a class="post-card__link" href="/cam-nang/%s.html" aria-label="%s"></a>'
      '<span class="post-card__cat">%s</span><h2>%s</h2><p class="post-card__excerpt">%s</p>'
      '<div class="post-card__meta"><span>%s</span></div>'
      '<span class="post-card__more">Đọc tiếp<svg><use href="#i-arr"/></svg></span></article>'
      % (art["slug"], a(art["title"]), t(art["category"]), t(art["title"]), t(art["excerpt"]), t(art["readingTime"])))
listing_body = ('<section class="page-head"><div class="container container--narrow"><span class="eyebrow eyebrow--center">Cẩm nang</span>'
  '<h1>Cẩm nang nhạc cụ &amp; âm thanh</h1>'
  '<p>Kiến thức, kinh nghiệm kiểm tra, định giá và mua bán nhạc cụ cũ — chia sẻ từ đội ngũ Doremi 2000.</p></div></section>'
  '<section class="section" style="padding-top:0"><div class="container"><div class="post-grid">' + cards + '</div></div></section>')
ld_list = {"@context":"https://schema.org","@type":"CollectionPage","name":"Cẩm nang nhạc cụ & âm thanh — Doremi 2000",
  "inLanguage":"vi-VN","url":SITE+"/cam-nang/"}
ld_lcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Trang chủ","item":SITE+"/"},
  {"@type":"ListItem","position":2,"name":"Cẩm nang","item":SITE+"/cam-nang/"}]}
open(os.path.join(BLOG, "index.html"), "w", encoding="utf-8").write(
  page("Cẩm nang nhạc cụ & âm thanh | Doremi 2000",
       "Cẩm nang chia sẻ kiến thức kiểm tra, định giá và mua bán nhạc cụ cũ: đàn organ, piano, guitar, trống và thiết bị âm thanh — từ Doremi 2000.",
       SITE+"/cam-nang/", listing_body, [ld_list, ld_lcrumb], "website"))
print("wrote index.html ; total", len(arts), "articles")

# ---- sitemap.xml (kept in sync with articles) ----
sm = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <url><loc>%s/</loc><lastmod>%s</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>' % (SITE, MODIFIED),
      '  <url><loc>%s/cam-nang/</loc><lastmod>%s</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>' % (SITE, MODIFIED)]
for art in arts:
    sm.append('  <url><loc>%s/cam-nang/%s.html</loc><lastmod>%s</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>' % (SITE, art["slug"], MODIFIED))
sm.append('</urlset>')
open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write("\n".join(sm) + "\n")
print("wrote sitemap.xml with", len(arts) + 2, "urls")
