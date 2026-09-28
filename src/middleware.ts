// host 層級 301：www.loveriver.org → loveriver.org
// 僅作為 Cloudflare Redirect Rule 失效時的程式內兜底。
// 注意：本中介層只有在 www.loveriver.org 已被加為 Worker 的 Custom Domain（或路由）後才會被執行。
export function onRequest(context: any, next: () => Promise<Response>): Promise<Response> | Response {
  const url = context.url;
  if (url.host.toLowerCase().startsWith("www.")) {
    const target = new URL(url.pathname + url.search, "https://loveriver.org");
    return new Response(null, {
      status: 301,
      headers: { Location: target.toString() },
    });
  }
  return next();
}
