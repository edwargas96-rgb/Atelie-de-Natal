// Função serverless (Vercel/Netlify-compatível) para a API de Conversões da Meta.
// Variáveis de ambiente: META_PIXEL_ID, META_CAPI_TOKEN, (opcional) META_TEST_EVENT_CODE
const ALLOWED = ["PageView", "ViewContent", "InitiateCheckout", "Purchase", "GiftOpened", "VSLPlay", "VSL50", "VSLComplete"];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { META_PIXEL_ID, META_CAPI_TOKEN, META_TEST_EVENT_CODE } = process.env;
  if (!META_PIXEL_ID || !META_CAPI_TOKEN) return res.status(500).json({ error: "CAPI não configurada" });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { return res.status(400).end(); } }
  if (!b || !ALLOWED.includes(b.event_name)) return res.status(400).end();

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const payload = {
    data: [{
      event_name: b.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: String(b.event_id || ""),
      event_source_url: String(b.event_source_url || ""),
      action_source: "website",
      user_data: {
        client_ip_address: ip || undefined,
        client_user_agent: req.headers["user-agent"],
        fbp: b.fbp || undefined,
        fbc: b.fbc || undefined
      },
      custom_data: b.custom_data && typeof b.custom_data === "object" ? b.custom_data : {}
    }]
  };
  if (META_TEST_EVENT_CODE) payload.test_event_code = META_TEST_EVENT_CODE;

  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    return res.status(r.ok ? 204 : 502).end();
  } catch (e) { return res.status(502).end(); }
};
