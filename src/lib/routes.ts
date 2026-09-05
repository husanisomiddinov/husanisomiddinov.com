export function isRouteActive(href: string, currentPath: string): boolean {
  const current = currentPath.split("#")[0];
  const base = href.split("#")[0];
  if (base === "/") return current === "/";
  return current === base || current.startsWith(`${base}/`);
}
