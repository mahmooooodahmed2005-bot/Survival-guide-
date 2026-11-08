import { getStore } from "@netlify/blobs";

// عدّاد «شكراً» المشترك بين كل الزوار (يُخزَّن في Netlify Blobs)
export default async (req) => {
  const url = new URL(req.url);
  const key = (url.searchParams.get("key") || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 40);
  const action = url.searchParams.get("action") || "get";
  const headers = { "content-type": "application/json", "cache-control": "no-store" };
  if (!key) return new Response(JSON.stringify({ value: 0 }), { headers });
  const store = getStore({ name: "thanks", consistency: "strong" });
  let n = Number(await store.get(key)) || 0;
  if (action === "hit") {
    n += 1;
    await store.set(key, String(n));
  }
  return new Response(JSON.stringify({ value: n }), { headers });
};
