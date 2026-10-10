"use client";

import dynamic from "next/dynamic";

/** three.js and the map are only needed in the browser, so keep them out of the server render. */
export const VisitGlobeLoader = dynamic(() => import("./VisitGlobe").then((m) => m.VisitGlobe), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-[300] bg-page-bg" />,
});
