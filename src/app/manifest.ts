import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aprire Tutto",
    short_name: "Aprire",
    description: "Comprendre. Pratiquer. Retenir.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f1",
    theme_color: "#f7f7f1",
    lang: "fr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
