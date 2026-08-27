"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { useAiEnabled } from "@/hooks/useAiEnabled";
import type { Recipe } from "@/lib/types";

export default function GenererPage() {
  const { bottles, condiments, hydrated, saveCustomRecipe } = useAppData();
  const aiEnabled = useAiEnabled();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recipe | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bottles: bottles.map((b) => b.name),
          condiments: condiments.map((c) => c.name),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "La génération a échoué.");
        return;
      }
      setResult(data.recipe as Recipe);
      saveCustomRecipe(data.recipe as Recipe);
    } catch {
      setErrorMsg("Impossible de contacter le serveur. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) return null;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Génération IA" subtitle="Un cocktail inventé rien que pour ta cave" />

      <div className="flex-1 px-5 pb-6">
        {aiEnabled === false ? (
          <div className="card flex flex-col items-center gap-3 py-8 text-center">
            <span className="text-3xl">🔒</span>
            <p className="font-semibold">Fonction IA non configurée</p>
            <p className="text-base text-muted-foreground">
              L&apos;administrateur du déploiement doit ajouter la variable d&apos;environnement{" "}
              <code className="rounded bg-surface-muted px-1 py-0.5 text-sm">ANTHROPIC_API_KEY</code> côté serveur
              (jamais dans le code, voir le README) pour activer la génération de recettes originales.
            </p>
            <Link href="/recettes" className="btn-secondary mt-1 w-full">
              Voir les recettes classiques
            </Link>
          </div>
        ) : bottles.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-8 text-center">
            <span className="text-3xl">🧊</span>
            <p className="font-semibold">Ajoute d&apos;abord une bouteille</p>
            <p className="text-base text-muted-foreground">
              L&apos;IA a besoin de connaître au moins un alcool de ta cave pour inventer une recette.
            </p>
            <Link href="/cave" className="btn-primary mt-1 w-full">
              Aller à ma cave
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-base text-muted-foreground">
              L&apos;IA va inventer un cocktail original à partir de tes {bottles.length} bouteille
              {bottles.length > 1 ? "s" : ""} et {condiments.length} condiment{condiments.length > 1 ? "s" : ""}.
            </p>
            <button onClick={generate} disabled={loading} className="btn-primary w-full py-4 text-base">
              {loading ? "Le barman réfléchit…" : result ? "Générer une autre idée" : "✨ Générer une recette"}
            </button>

            {errorMsg && (
              <p className="mt-3 rounded-xl bg-danger/10 px-3 py-2 text-base text-danger">{errorMsg}</p>
            )}

            {result && (
              <div className="card mt-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-sm font-semibold text-muted-foreground">
                    ✨ Création IA
                  </span>
                </div>
                <h2 className="font-display text-2xl font-semibold">{result.name}</h2>
                {result.glass && <p className="text-base text-muted-foreground">Servi dans : {result.glass}</p>}

                <h3 className="font-display mb-1.5 mt-4 text-base font-semibold uppercase tracking-wide text-muted-foreground">
                  Ingrédients
                </h3>
                <ul className="flex flex-col gap-1 text-lg">
                  {result.ingredients.map((ing, i) => (
                    <li key={i} className="flex justify-between gap-2">
                      <span>{ing.rawName}</span>
                      {ing.measureRaw && <span className="text-muted-foreground">{ing.measureRaw}</span>}
                    </li>
                  ))}
                </ul>

                <h3 className="font-display mb-1.5 mt-4 text-base font-semibold uppercase tracking-wide text-muted-foreground">
                  Préparation
                </h3>
                <p className="whitespace-pre-line text-lg leading-relaxed">{result.instructions}</p>

                <Link href={`/recettes/${result.id}`} className="btn-primary mt-4 w-full">
                  Voir la fiche complète
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
