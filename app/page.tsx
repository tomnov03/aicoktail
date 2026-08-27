"use client";

import Link from "next/link";
import { useAppData } from "@/hooks/useAppData";
import { useAiEnabled } from "@/hooks/useAiEnabled";

export default function Home() {
  const { bottles, condiments, history, hydrated } = useAppData();
  const aiEnabled = useAiEnabled();

  if (!hydrated) return null;

  const hasBottles = bottles.length > 0;

  return (
    <div className="flex flex-1 flex-col px-5 pt-8">
      <div className="mb-6">
        <p className="text-sm font-medium text-accent-strong">🍸 AI Coktail</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Qu&apos;est-ce qu&apos;on{"  "}
          <br />
          se prépare aujourd&apos;hui ?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Des recettes trouvées automatiquement à partir de ta cave à alcools.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatTile value={bottles.length} label="bouteilles" />
        <StatTile value={condiments.length} label="condiments" />
        <StatTile value={history.length} label="cocktails faits" />
      </div>

      {!hasBottles ? (
        <div className="card mb-6 flex flex-col items-center gap-3 py-8 text-center">
          <span className="text-4xl">🧊</span>
          <p className="font-semibold">Ta cave est vide</p>
          <p className="text-sm text-muted-foreground">
            Ajoute les bouteilles que tu as chez toi pour découvrir ce que tu peux préparer.
          </p>
          <Link href="/cave" className="btn-primary mt-2 w-full">
            Ajouter mes bouteilles
          </Link>
        </div>
      ) : (
        <Link
          href="/recettes"
          className="btn-primary mb-3 w-full py-4 text-base"
        >
          Voir les cocktails que je peux faire
        </Link>
      )}

      <Link href="/recettes/generer" className="btn-secondary mb-3 w-full">
        ✨ Générer une recette IA sur-mesure
        {aiEnabled === false && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">(à configurer)</span>
        )}
      </Link>

      <Link href="/cave" className="btn-secondary w-full">
        Gérer ma cave
      </Link>
    </div>
  );
}

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="card flex flex-col items-center py-4">
      <span className="text-2xl font-bold text-accent-strong">{value}</span>
      <span className="mt-0.5 text-center text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
