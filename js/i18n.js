/* ============================================================
   Doremi 2000 — Bilingual (VI / EN) i18n
   Strategy: translate by exact Vietnamese text via a TreeWalker,
   except the few hero elements with inline markup which carry a
   data-i18n key and swap innerHTML.
   ============================================================ */
(function () {
  "use strict";
  var KEY = "doremi-lang";

  /* ---- Page meta ---- */
  var TITLE = {
    vi: "Thu Mua Nhạc Cụ Cũ Giá Cao Tận Nơi TP.HCM | Doremi 2000",
    en: "Buy Used Musical Instruments at Top Prices in HCMC | Doremi 2000",
  };
  var DESC = {
    vi: "Thu mua nhạc cụ & thiết bị âm thanh cũ giá cao tận nơi TP.HCM: organ, piano, guitar, trống, loa, amply. Định giá nhanh qua Zalo, trả tiền ngay — 0938 818 871.",
    en: "We buy used instruments & audio gear at top prices, on-site in HCMC: organ, piano, guitar, drums, speakers, amps. Fast quote via Zalo, instant cash — 0938 818 871.",
  };

  /* ---- Hero elements with inline markup (data-i18n) → EN innerHTML ---- */
  var HTML_DICT = {
    "hero-h1": 'We buy used instruments at <span class="text-gold serif-italic">top prices</span> — on-site, free valuation',
    "hero-lead1": 'Organ, acoustic &amp; digital piano, guitar, drums and audio equipment — every brand, any condition. Our experts come to you and <strong>pay cash the same day</strong>.',
    "hero-h2": 'Every instrument, every brand — <span class="text-gold serif-italic">we buy on-site</span>',
    "hero-lead2": 'Old, new, display or pre-owned — we <strong>value it at its true worth</strong> and buy it right at your home.',
    "hero-h3": 'Clearing out audio gear — <span class="text-gold serif-italic">top price, hassle-free</span>',
    "hero-lead3": 'Speakers, amplifiers, mixers, karaoke systems, TVs… <strong>any quantity accepted</strong>, with completely free transport.',
    "areas-note": 'Don\'t see your area? <a href="https://zalo.me/0938818871" target="_blank" rel="noopener">Message Zalo 0938 818 871</a> — we still come to you.',
  };

  /* ---- Suffix map for animated stats ---- */
  var SUFFIX = { " phút": " min" };

  /* ---- Exact Vietnamese text → English ---- */
  var DICT = {
    // Nav + brand + buttons
    "Dịch vụ": "Services",
    "Thư viện": "Gallery",
    "Quy trình": "Process",
    "Bảng giá": "Pricing",
    "Ưu điểm": "Why Us",
    "Cam kết": "Commitments",
    "Hỏi đáp": "FAQ",
    "Thu mua nhạc cụ": "We buy instruments",
    "Định giá miễn phí": "Free valuation",
    "Định giá ngay": "Get a Quote Now",
    "Nhận báo giá ngay": "Get a Quote Now",
    "Gọi 0938 818 871": "Call 0938 818 871",
    "Đổi giao diện sáng / tối": "Toggle light / dark theme",
    // Hero eyebrows / CTAs / trust
    "Đồng hành cùng người yêu nhạc từ năm 2000": "Serving music lovers since 2000",
    "Organ · Guitar · Trống · Piano": "Organ · Guitar · Drums · Piano",
    "Loa · Amply · Karaoke · Âm thanh sân khấu": "Speakers · Amplifiers · Karaoke · Stage Audio",
    "Báo giá qua Zalo": "Quote via Zalo",
    "Định giá nhanh qua Zalo": "Fast quote via Zalo",
    "Thanh toán tiền mặt ngay": "Instant cash payment",
    "Thu mua mọi tình trạng": "Any condition accepted",
    "Thẩm định tận nơi": "On-site appraisal",
    "Giá đúng giá trị": "Fair value",
    "Nhận mọi số lượng": "Any quantity",
    "Thanh lý nhanh gọn": "Fast clearance",
    "Vận chuyển miễn phí": "Free transport",
    "Tiền mặt ngay": "Instant cash",
    // Stats
    "Năm kinh nghiệm": "Years of experience",
    "Nhạc cụ đã thu mua": "Instruments bought",
    "Nhóm nhạc cụ & thiết bị": "Instrument & gear categories",
    "Báo giá nhanh": "Fast quote",
    "60 phút": "60 min",
    // Services
    "Dịch vụ thu mua": "Our buying services",
    "Chúng tôi thu mua những gì?": "What we buy",
    "Từ cây đàn gia đình đến nguyên dàn âm thanh sân khấu — định giá minh bạch, thu mua tận nơi.": "From a family piano to a full stage sound system — transparent valuation, on-site buying.",
    "Đàn Piano": "Piano",
    "Piano cơ & Piano điện": "Acoustic & Digital Piano",
    "Thu mua piano cơ (Upright & Grand) và piano điện mọi đời máy, định giá theo đúng giá trị thật của cây đàn.": "We buy acoustic pianos (upright & grand) and digital pianos of any age, valued at their true worth.",
    "Đàn Organ": "Organ",
    "Organ & Keyboard": "Organ & Keyboard",
    "Đàn organ điện tử mọi dòng, từ phổ thông đến cao cấp, hàng nội địa hay xách tay.": "Electronic organs of every line, from entry-level to high-end, domestic or imported.",
    "Trống & Guitar": "Drums & Guitar",
    "Bộ trống jazz, guitar acoustic, classic và electric — kiểm tra kỹ thuật tận nơi.": "Jazz drum kits, acoustic, classical and electric guitars — inspected on-site.",
    "Thiết bị âm thanh": "Audio Equipment",
    "Loa, Amply, Dàn karaoke & Tivi": "Speakers, Amplifiers, Karaoke & TVs",
    "Thu mua & thanh lý loa, amply, dàn âm thanh sân khấu, dàn DJ, karaoke gia đình và tivi LCD/LED — số lượng bao nhiêu cũng nhận.": "We buy & clear speakers, amplifiers, stage sound systems, DJ rigs, home karaoke and LCD/LED TVs — any quantity accepted.",
    // Paths
    "Lựa chọn linh hoạt": "Flexible options",
    "Ba cách để bạn an tâm": "Three ways to sell with confidence",
    "Bán đứt": "Outright sale",
    "Nhận tiền mặt ngay, dứt điểm trong ngày. Phù hợp khi bạn muốn thanh lý nhanh, gọn.": "Get cash immediately, settled the same day. Ideal when you want a quick, clean sale.",
    "Phổ biến nhất": "Most popular",
    "Thu đổi": "Trade-in",
    "Đổi nhạc cụ cũ lấy nhạc cụ mới hơn, chỉ bù phần chênh lệch — nâng cấp dễ dàng.": "Trade your old instrument for a newer one and pay only the difference — upgrade with ease.",
    "Ký gửi": "Consignment",
    "Để chúng tôi bán hộ với mạng lưới khách sẵn có, tối ưu giá trị cây đàn của bạn.": "Let us sell it through our ready network of buyers to maximize your instrument's value.",
    // Process
    "Bán nhạc cụ chỉ với 4 bước": "Sell your instrument in just 4 steps",
    "Minh bạch từ đầu đến cuối — không phí ẩn, không ép giá.": "Transparent from start to finish — no hidden fees, no lowballing.",
    "Liên hệ": "Contact",
    "Gọi hoặc gửi ảnh, clip nhạc cụ qua Zalo cho chúng tôi.": "Call or send photos/clips of your instrument via Zalo.",
    "Định giá": "Valuation",
    "Nhận báo giá sơ bộ nhanh chóng, rõ ràng, đúng giá trị.": "Get a quick, clear preliminary quote at fair value.",
    "Kiểm tra tận nơi": "On-site check",
    "Chuyên viên đến tận nhà thẩm định miễn phí, không ngại xa.": "Our expert visits for a free appraisal, no matter the distance.",
    "Thanh toán ngay": "Instant payment",
    "Chốt giá, nhận tiền mặt liền tay, vận chuyển hoàn toàn miễn phí.": "Agree the price, get cash on the spot, with completely free transport.",
    // Pricing
    "Bảng giá tham khảo": "Reference pricing",
    "Giá thu mua minh bạch, không ép giá": "Transparent buying prices, no lowballing",
    "Khoảng giá tham khảo theo từng nhóm — mức cụ thể tùy tình trạng, đời máy & thương hiệu. Gọi để nhận báo giá chính xác trong vài phút.": "Reference price ranges by category — exact figures depend on condition, age & brand. Call for an accurate quote in minutes.",
    "Piano cơ": "Acoustic Piano",
    "Piano điện": "Digital Piano",
    "Bộ trống": "Drum Kit",
    "Loa & Amply": "Speakers & Amps",
    "Dàn karaoke": "Karaoke System",
    "Tivi LCD/LED": "LCD/LED TVs",
    "5 – 60 triệu": "5 – 60M ₫",
    "2 – 25 triệu": "2 – 25M ₫",
    "800K – 15 triệu": "800K – 15M ₫",
    "300K – 10 triệu": "300K – 10M ₫",
    "2 – 30 triệu": "2 – 30M ₫",
    "500K – 40 triệu": "500K – 40M ₫",
    "2 – 50 triệu": "2 – 50M ₫",
    "500K – 15 triệu": "500K – 15M ₫",
    "Nhạc cụ của bạn chưa có trong danh sách? Chúng tôi vẫn thu mua — cứ gọi để được tư vấn.": "Don't see your instrument listed? We still buy it — just call for advice.",
    "Gọi nhận báo giá chính xác": "Call for an exact quote",
    // Why
    "Vì sao chọn Doremi 2000": "Why choose Doremi 2000",
    "Uy tín tạo nên khác biệt": "Trust makes the difference",
    "Cam kết giá cạnh tranh": "Competitive price guarantee",
    "Định giá sát thị trường, đảm bảo mức thu mua tốt & có lợi cho bạn.": "Market-based valuation that ensures a strong, favorable offer for you.",
    "Chốt giá là nhận tiền liền tay, không hẹn lần, không giữ hàng.": "Agree the price and get paid on the spot — no delays, no holding your goods.",
    "Hàng cũ, mới, hàng bãi, thậm chí hư hỏng — chúng tôi đều nhận.": "Old, new, salvage, even faulty — we accept it all.",
    "Định giá & vận chuyển miễn phí": "Free valuation & transport",
    "Đội ngũ đến tận nơi, lo trọn khâu tháo lắp và vận chuyển.": "Our team comes to you and handles all the dismantling and transport.",
    "Chuyên viên giàu kinh nghiệm": "Experienced specialists",
    "Thẩm định chính xác từng dòng đàn, từng thiết bị âm thanh.": "Accurate appraisal of every instrument line and audio device.",
    "Hoa hồng cho người giới thiệu": "Referral commission",
    "Giới thiệu khách bán nhạc cụ cho chúng tôi — nhận hoa hồng hấp dẫn.": "Refer someone who sells to us — earn an attractive commission.",
    // Gallery
    "Nhạc cụ & thiết bị tiêu biểu": "Featured instruments & equipment",
    "Một số dòng nhạc cụ và thiết bị âm thanh chúng tôi thu mua mỗi ngày — đa dạng thương hiệu, mọi tầm giá.": "A selection of instruments and audio gear we buy every day — many brands, every price range.",
    "Thu mua giá cao": "Top price",
    "Piano Upright & Điện": "Upright & Digital Piano",
    "Bộ Trống": "Drum Kit",
    "Piano Yamaha": "Yamaha Piano",
    "Guitar Điện": "Electric Guitar",
    "Guitar Bass": "Bass Guitar",
    "Bàn Mixer": "Mixing Console",
    "Micro & Karaoke": "Microphones & Karaoke",
    "Phòng thu & Dàn âm thanh": "Studio & Sound Systems",
    // Brands
    "Thu mua mọi thương hiệu": "We buy every brand",
    // Blog teaser
    "Cẩm nang": "Guides",
    "Chia sẻ kiến thức nhạc cụ": "Instrument knowledge & tips",
    "Kinh nghiệm kiểm tra, định giá & mua bán nhạc cụ cũ — giúp bạn không bị thiệt.": "Tips on inspecting, valuing & trading used instruments — so you never lose out.",
    "Đọc tiếp": "Read more",
    "Xem tất cả bài viết": "View all articles",
    // Quote
    "Nhận báo giá": "Get a quote",
    "Định giá miễn phí trong 60 phút": "Free valuation within 60 minutes",
    "Để lại vài thông tin, chúng tôi gọi lại báo giá ngay — hoặc gửi ảnh trực tiếp qua Zalo để định giá nhanh nhất.": "Leave a few details and we'll call you back with a quote — or send photos via Zalo for the fastest valuation.",
    "Không mất phí định giá, không ràng buộc.": "Free valuation, no obligation.",
    "Chuyên viên đến tận nơi tại TP.HCM & lân cận.": "Experts visit you across HCMC & nearby areas.",
    "Bảo mật thông tin của bạn tuyệt đối.": "Your information is kept strictly confidential.",
    "Yêu cầu báo giá": "Request a quote",
    "Phản hồi nhanh trong giờ làm việc.": "Quick response during business hours.",
    "Loại nhạc cụ": "Instrument type",
    "Chọn loại": "Select type",
    "Trống": "Drums",
    "Loa / Amply": "Speakers / Amps",
    "Tivi": "TV",
    "Khác": "Other",
    "Tình trạng": "Condition",
    "Chọn tình trạng": "Select condition",
    "Như mới": "Like new",
    "Còn tốt": "Good",
    "Trung bình": "Fair",
    "Cũ / Hư": "Old / Faulty",
    "Số điện thoại": "Phone number",
    "Hoặc": "Or",
    "gửi ảnh qua Zalo 0938 818 871": "send photos via Zalo 0938 818 871",
    "để định giá trong 5 phút.": "for a valuation in 5 minutes.",
    // Commitments (replaces placeholder testimonials)
    "Cam kết với người bán": "Our promise to sellers",
    "Vì sao người bán chọn Doremi 2000": "Why sellers choose Doremi 2000",
    "Định giá sát thị trường, báo giá minh bạch — bạn luôn biết vì sao cây đàn được trả mức đó, không ép giá.": "Market-rate valuation and transparent quotes — you always know why your instrument is priced that way, no lowballing.",
    "Giá minh bạch": "Transparent pricing",
    "Cam kết Doremi 2000": "Doremi 2000 promise",
    "Chốt giá là thanh toán tiền mặt ngay; đội ngũ đến tận nơi, lo trọn khâu tháo lắp và vận chuyển.": "Agree on a price and get paid in cash on the spot; our team comes to you and handles disassembly and transport.",
    "Nhận tiền ngay": "Paid on the spot",
    "Thu mua mọi tình trạng — cũ, hư, hàng bãi; mọi thương hiệu, số lượng bao nhiêu cũng nhận.": "We buy any condition — used, broken, bulk stock; every brand, any quantity.",
    "Mọi tình trạng": "Any condition",
    // FAQ
    "Hỏi & đáp": "Q & A",
    "Những câu hỏi thường gặp": "Frequently asked questions",
    "Chưa tìm thấy câu trả lời? Gọi trực tiếp để được tư vấn miễn phí.": "Didn't find your answer? Call us directly for free advice.",
    "0938 818 871 (Cô Linh)": "0938 818 871 (Ms. Linh)",
    "Trung tâm thu mua những loại nhạc cụ nào?": "What types of instruments do you buy?",
    "Chúng tôi thu mua đàn organ, piano cơ & piano điện, guitar, trống và toàn bộ thiết bị âm thanh: loa, amply, dàn karaoke, âm thanh sân khấu/DJ và tivi LCD/LED — mọi thương hiệu.": "We buy organs, acoustic & digital pianos, guitars, drums and all audio equipment: speakers, amplifiers, karaoke systems, stage/DJ sound and LCD/LED TVs — every brand.",
    "Nhạc cụ cũ hoặc bị hư có thu mua không?": "Do you buy old or faulty instruments?",
    "Có. Chúng tôi nhận hàng cũ, mới, hàng bãi và cả hàng hư hỏng với số lượng bao nhiêu cũng được. Tình trạng sẽ được phản ánh đúng trong mức định giá.": "Yes. We accept old, new, salvage and even faulty items in any quantity. The condition is reflected fairly in the valuation.",
    "Định giá có mất phí không?": "Is the valuation free?",
    "Hoàn toàn miễn phí. Bạn có thể gửi ảnh qua Zalo để nhận báo giá sơ bộ, hoặc hẹn chuyên viên đến tận nơi thẩm định mà không tốn bất kỳ chi phí nào.": "Completely free. You can send photos via Zalo for a preliminary quote, or book an on-site appraisal at no cost whatsoever.",
    "Bao lâu thì tôi nhận được tiền?": "How soon do I get paid?",
    "Ngay sau khi hai bên chốt giá, chúng tôi thanh toán tiền mặt liền tay và lo phần vận chuyển — thường gọn trong cùng ngày.": "As soon as both sides agree the price, we pay cash on the spot and handle transport — usually all within the same day.",
    "Có nhận thu mua số lượng lớn / thanh lý không?": "Do you buy in bulk / handle clearances?",
    "Có. Chúng tôi nhận thanh lý nguyên dàn âm thanh cho quán cà phê, nhà hàng, quán bar, phòng karaoke, sân khấu và sự kiện.": "Yes. We clear entire sound systems for cafés, restaurants, bars, karaoke rooms, stages and events.",
    "Khu vực thu mua ở đâu?": "What areas do you cover?",
    "Chúng tôi phục vụ toàn TP.HCM và các khu vực lân cận, đến tận nơi không ngại xa.": "We serve all of HCMC and surrounding areas, coming to you no matter the distance.",
    // Final CTA
    "Sẵn sàng bán nhạc cụ của bạn?": "Ready to sell your instrument?",
    "Định giá miễn phí — nhận tiền ngay hôm nay": "Free valuation — get paid today",
    "Một cuộc gọi là đủ. Đội ngũ Doremi 2000 sẽ đến tận nơi, định giá minh bạch và thanh toán liền tay.": "One call is all it takes. The Doremi 2000 team comes to you, values it transparently and pays on the spot.",
    "Gọi ngay": "Call now",
    "Nhắn Zalo": "Message Zalo",
    // Footer
    "Trung Tâm Âm Nhạc Đô Rê Mi 2000 — chuyên thu mua nhạc cụ & thiết bị âm thanh cũ giá cao tận nơi tại TP.HCM từ năm 2000.": "Doremi 2000 Music Center — buying used instruments & audio equipment at top prices, on-site across HCMC since 2000.",
    "Liên kết": "Links",
    "Thu mua Piano": "Buy Piano",
    "Thu mua Organ": "Buy Organ",
    "Thu mua Trống & Guitar": "Buy Drums & Guitar",
    "Thu mua Âm thanh": "Buy Audio",
    "Vì sao chọn chúng tôi": "Why choose us",
    "Hotline / Zalo — Cô Linh": "Hotline / Zalo — Ms. Linh",
    "TP. Hồ Chí Minh": "Ho Chi Minh City",
    "& các khu vực lân cận": "& surrounding areas",
    "Tất cả các ngày trong tuần": "Every day of the week",
    "Trung Tâm Âm Nhạc Đô Rê Mi 2000. Bảo lưu mọi quyền.": "Doremi 2000 Music Center. All rights reserved.",
    "Trang quản trị": "Admin",
    "Về đầu trang ↑": "Back to top ↑",
    // Dock
    "Chat Zalo": "Chat Zalo",
    // Service-area section
    "Khu vực phục vụ": "Service areas",
    "Thu mua tận nơi khắp TP.HCM & lân cận": "On-site buying across HCMC & nearby provinces",
    "Đội ngũ Doremi 2000 đến tận nhà định giá & thu mua nhạc cụ, thiết bị âm thanh cũ — nhanh trong ngày, không ngại xa.": "The Doremi 2000 team comes to your home to value & buy used instruments and audio gear — often same-day, no matter the distance.",
    "Các quận / huyện TP.HCM": "HCMC districts",
    "Tỉnh lân cận": "Nearby provinces",
  };

  function setLang(lang) {
    document.documentElement.setAttribute("lang", lang);

    // 1) HTML elements with inline markup
    var tagged = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < tagged.length; i++) {
      var el = tagged[i];
      if (el.__vihtml === undefined) el.__vihtml = el.innerHTML;
      var en = HTML_DICT[el.getAttribute("data-i18n")];
      el.innerHTML = lang === "en" && en ? en : el.__vihtml;
    }

    // 2) Plain text nodes
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = node.parentElement;
        if (!p || p.closest("script,style,noscript,svg,[data-i18n],#scrollProgress,[data-count]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var n, list = [];
    while ((n = walker.nextNode())) list.push(n);
    list.forEach(function (node) {
      var base = node.__vi !== undefined ? node.__vi : node.nodeValue;
      var trimmed = base.trim();
      var en = DICT[trimmed];
      if (en === undefined) return;
      if (node.__vi === undefined) node.__vi = base;
      node.nodeValue = lang === "en" ? base.replace(trimmed, function () { return en; }) : base;
    });

    // 3) Animated stats: keep suffix + counted display in sync
    document.querySelectorAll("[data-count]").forEach(function (el) {
      if (el.dataset.viSuffix === undefined) el.dataset.viSuffix = el.dataset.suffix || "";
      var viSuf = el.dataset.viSuffix;
      var suf = lang === "en" && SUFFIX[viSuf] !== undefined ? SUFFIX[viSuf] : viSuf;
      el.dataset.suffix = suf;
      var txt = el.textContent;
      if (/\d/.test(txt) && txt !== "0") {
        var numPart = txt.replace(/[^\d.,]/g, "");
        el.textContent = numPart + suf;
      }
    });

    // 4) Attributes + meta
    var ph = document.getElementById("qPhone");
    if (ph) ph.setAttribute("placeholder", lang === "en" ? "e.g. 0938 818 871" : "VD: 0938 818 871");
    document.title = TITLE[lang] || TITLE.vi;
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", DESC[lang] || DESC.vi);
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  var current;
  try { current = localStorage.getItem(KEY) || "vi"; } catch (e) { current = "vi"; }
  setLang(current);

  function toggle() {
    current = current === "en" ? "vi" : "en";
    setLang(current);
  }
  ["#langToggle", "#langToggleMobile"].forEach(function (s) {
    var el = document.querySelector(s);
    if (el) el.addEventListener("click", toggle);
  });
})();
