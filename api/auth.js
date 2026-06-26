// GitHub OAuth — step 1: redirect the CMS login popup to GitHub's authorize page.
// Requires env var OAUTH_GITHUB_CLIENT_ID (set in Vercel project settings).
module.exports = (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.end("Thiếu OAUTH_GITHUB_CLIENT_ID. Hãy thêm biến môi trường này trong Vercel.");
    return;
  }
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const redirectUri = `${proto}://${host}/api/callback`;
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
    state,
    allow_signup: "false",
  });
  res.writeHead(302, { Location: `https://github.com/login/oauth/authorize?${params.toString()}` });
  res.end();
};
