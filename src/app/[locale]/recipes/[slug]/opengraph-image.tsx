import { ImageResponse } from "next/og";
import { getRecipeBySlug } from "@/lib/recipes";

export const runtime = "nodejs";
export const alt = "Recipe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const metaLabels = locale === "es"
    ? { prep: "Preparación", cook: "Cocción", servings: "Porciones" }
    : { prep: "Prep", cook: "Cook", servings: "Servings" };

  let recipe;
  try {
    recipe = await getRecipeBySlug(slug, locale);
  } catch {
    return new ImageResponse(
      <div
        style={{
          background: "#1c1917",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#e7e5e4", fontSize: 48, fontWeight: 700 }}>
          LowKeyCooking
        </span>
      </div>,
      { ...size },
    );
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#1c1917",
      }}
    >
      {/* Background image */}
      {recipe.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.image}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.45,
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "48px 60px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Site badge */}
        <span
          style={{
            color: "#fca5a5",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          LowKeyCooking
        </span>

        {/* Recipe title */}
        <span
          style={{
            color: "#ffffff",
            fontSize: recipe.title.length > 40 ? 52 : 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {recipe.title}
        </span>

        {/* Meta row */}
        <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
          {recipe.prep_time && (
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 24 }}>
              ⏱ {recipe.prep_time} {metaLabels.prep}
            </span>
          )}
          {recipe.cook_time && (
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 24 }}>
              🔥 {recipe.cook_time} {metaLabels.cook}
            </span>
          )}
          {recipe.servings && (
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 24 }}>
              👥 {recipe.servings} {metaLabels.servings}
            </span>
          )}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
