import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LowKeyCooking",
    short_name: "LowKeyCooking",
    description:
      "Easy homemade recipes for home cooks of every skill level. Simple ingredients, clear steps, and dishes that always deliver.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#c2501f",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
