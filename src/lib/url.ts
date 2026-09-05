export function isHttpUrl(href: string): boolean {
  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    const hostname = url.hostname.toLowerCase();
    const isLoopbackHost =
      hostname === "localhost" ||
      hostname === "::1" ||
      hostname === "127.0.0.1";

    return !isLoopbackHost;
  } catch {
    return false;
  }
}
