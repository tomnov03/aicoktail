import type { ReactElement } from "react";

/** Glyphe vectoriel (verre à cocktail) utilisé pour générer les icônes PWA via next/og ImageResponse. */
export function CocktailIcon({ size }: { size: number }): ReactElement {
  const cupWidth = size * 0.62;
  const cupHeight = size * 0.42;
  const stemHeight = size * 0.18;
  const baseWidth = size * 0.38;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f2874a 0%, #c8501e 100%)",
        borderRadius: size * 0.22,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: size * 0.1,
            height: size * 0.1,
            borderRadius: "50%",
            background: "#2f8f5b",
            marginBottom: -size * 0.03,
          }}
        />
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${cupWidth / 2}px solid transparent`,
            borderRight: `${cupWidth / 2}px solid transparent`,
            borderTop: `${cupHeight}px solid #fff7ef`,
          }}
        />
        <div
          style={{
            width: size * 0.045,
            height: stemHeight,
            background: "#fff7ef",
          }}
        />
        <div
          style={{
            width: baseWidth,
            height: size * 0.05,
            background: "#fff7ef",
            borderRadius: size * 0.02,
          }}
        />
      </div>
    </div>
  );
}
