/**
 * Cloudflare Worker：靜態網站＋聯絡表單 API。
 *
 * - 所有非 /api/* 的請求 → 由 dist/public 的靜態資源回應（SPA fallback 照 wrangler.jsonc）。
 * - POST /api/contact → 轉寄到 Resend 寄信給站長。
 *   需要在 Cloudflare dashboard（Workers → Settings → Variables）設定：
 *     RESEND_API_KEY：Resend 的 API key（https://resend.com 免費申請）
 *     CONTACT_TO：收件信箱（例如教授本人的信箱）
 *     CONTACT_FROM（選填）：寄件者，預設 website@resend.dev（正式用請換成自己的網域）
 *   沒設定時回 501，前端會自動降級顯示「直接寫信」按鈕，不會壞掉。
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return Response.json({ error: "method_not_allowed" }, { status: 405 });
      }
      let body: Record<string, unknown>;
      try {
        body = (await request.json()) as Record<string, unknown>;
      } catch {
        return Response.json({ error: "invalid_json" }, { status: 400 });
      }
      const name = String(body.name || "").trim().slice(0, 100);
      const email = String(body.email || "").trim().slice(0, 200);
      const message = String(body.message || "").trim().slice(0, 5000);
      if (!name || !message || !EMAIL_RE.test(email)) {
        return Response.json({ error: "invalid_fields" }, { status: 400 });
      }
      if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
        // 尚未設定寄信服務：前端降級為 mailto，不視為錯誤
        return Response.json({ error: "not_configured" }, { status: 501 });
      }
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM || "website@resend.dev",
          to: env.CONTACT_TO,
          reply_to: email,
          subject: `網站聯絡表單：${name}`,
          text: `姓名：${name}\n信箱：${email}\n\n${message}`,
        }),
      });
      if (!res.ok) {
        return Response.json({ error: "send_failed" }, { status: 502 });
      }
      return Response.json({ ok: true });
    }

    return env.ASSETS.fetch(request);
  },
};
