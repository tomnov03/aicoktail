"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppData } from "@/hooks/useAppData";
import { useToast } from "@/components/Toast";
import { lookupDrink } from "@/lib/cocktaildb";
import { matchRecipe } from "@/lib/matching";
import { categoryLabel } from "@/lib/aliases";
import type { Recipe } from "@/lib/types";

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const router = useRouter();
  const toast = useToast();
  const { hydrated, ownedAlcoholCategories, ownedCondimentCategories, getRecipeById, prepareCocktail } =
    useAppData();

  const [recipe, setRecipe] = useState<Recipe | null | undefined>(undefined);
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (id.startsWith("ai-")) {
      setRecipe(getRecipeById(id) ?? null);
      return;
    }
    if (id.startsWith("cdb-")) {
      let cancelled = false;
      lookupDrink(id.slice(4)).then((r) => {
        if (!cancelled) setRecipe(r);
      });
      return () => {
        cancelled = true;
      };
    }
    setRecipe(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, id]);

  if (!hydrated || recipe === undefined) return null;

  if (recipe === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
        <span className="text-3xl">😕</span>
        <p className="font-semibold">Recette introuvable</p>
        <Link href="/recettes" className="btn-secondary">
          Retour aux recettes
        </Link>
      </div>
    );
  }

  const match = matchRecipe(recipe, ownedAlcoholCategories, ownedCondimentCategories);

  async function handlePrepare() {
    if (!recipe) return;
    setPreparing(true);
    const result = prepareCocktail(recipe);
    setPreparing(false);
    if (result.ok) {
      toast.show(`🍹 ${recipe.name} préparé — ta cave a été mise à jour.`, "success");
      router.push("/historique");
    } else {
      toast.show(result.reason, "error");
    }
  }

  return (
    <div className="flex flex-1 flex-col pb-6">
      <div className="relative">
        <div className="flex h-48 w-full items-center justify-center bg-surface-muted">
          {recipe.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={recipe.imageUrl} alt={recipe.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-6xl">🍹</span>
          )}
        </div>
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
          aria-label="Retour"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="px-5 pt-5">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {match.canMakeNow ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
              ✓ Réalisable maintenant
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-strong">
              Il te manque {match.missingAlcohol.length + match.missingCondiments.length} ingrédient(s)
            </span>
          )}
          {recipe.source === "ai" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              ✨ Création IA
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{recipe.name}</h1>
        {recipe.glass && <p className="mt-0.5 text-sm text-muted-foreground">Servi dans : {recipe.glass}</p>}

        <section className="mt-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Ingrédients
          </h2>
          <ul className="flex flex-col gap-2">
            {recipe.ingredients.map((ing, i) => {
              const owned = ing.isAlcohol
                ? !match.missingAlcohol.includes(ing)
                : !ing.category || !match.missingCondiments.includes(ing);
              return (
                <li key={i} className="card flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-medium ${!owned ? "text-danger" : ""}`}>
                      {ing.rawName}
                    </p>
                    {ing.category && (
                      <p className="text-xs text-muted-foreground">{categoryLabel(ing.category)}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {ing.measureRaw && (
                      <span className="text-xs text-muted-foreground">{ing.measureRaw}</span>
                    )}
                    <span className={owned ? "text-success" : "text-danger"}>{owned ? "✓" : "✕"}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Préparation
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed">{recipe.instructions}</p>
        </section>

        <button
          onClick={handlePrepare}
          disabled={preparing}
          className="btn-primary mt-6 w-full py-4 text-base"
        >
          {preparing ? "…" : "J'ai préparé ce cocktail 🍸"}
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Le stock des bouteilles utilisées sera automatiquement mis à jour.
        </p>
      </div>
    </div>
  );
}
