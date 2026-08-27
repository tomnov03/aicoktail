import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Coktail — ton assistant cocktails",
    short_name: "AI Coktail",
    description:
      "Trouve des recettes de cocktails avec les bouteilles que tu as déjà chez toi.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7f2",
    theme_color: "#e8703a",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
