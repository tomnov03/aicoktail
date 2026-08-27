"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <span className="mb-3 text-6xl">🍹</span>
      <p className="font-display text-sm font-semibold tracking-wide text-accent-strong uppercase">
        AI Coktail
      </p>
      <h1 className="font-display mt-2 text-4xl font-semibold leading-tight tracking-tight">
        Qu&apos;est-ce qu&apos;on
        <br />
        se prépare ?
      </h1>
      <p className="mt-3 max-w-xs text-lg text-muted-foreground">
        Des recettes trouvées pour toi à partir de ce qu&apos;il y a dans ta cave.
      </p>

      <Link
        href="/commencer"
        className="btn-primary mt-8 w-full max-w-xs py-4 text-lg shadow-lg shadow-accent/20"
      >
        🍹 Faire un cocktail
      </Link>
    </div>
  );
}
