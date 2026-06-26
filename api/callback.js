// GitHub OAuth — step 2: exchange the code for a token and hand it back to Decap CMS.
// Requires env vars OAUTH_GITHUB_CLIENT_ID and OAUTH_GITHUB_CLIENT_SECRET (set in Vercel).
module.exports = async (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.end("Thiếu OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET trong Vercel.");
    return;
  }
  // Vercel parses the query string onto req.query
  const code = (req.query && req.query.code) ||
    new URL(req.url, "http://x").searchParams.get("code");

  const send = (status, payload) => {
    const content = `authorization:github:${status}:${JSON.stringify(payload)}`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(
      `<!doctype html><html><body><p>Đang hoàn tất đăng nhập…</p><script>
  (function () {
    function receiveMessage(e) {
      window.opener && window.opener.postMessage(${JSON.stringify(content)}, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener && window.opener.postMessage("authorizing:github", "*");
  })();
</script></body></html>`
    );
  };

  try {
    const r = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await r.json();
    if (data.access_token) {
      send("success", { token: data.access_token, provider: "github" });
    } else {
      send("error", { message: data.error_description || "Không lấy được token" });
    }
  } catch (e) {
    send("error", { message: String((e && e.message) || e) });
  }
};
