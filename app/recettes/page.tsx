"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { RecipeCard } from "@/components/RecipeCard";
import { useAppData } from "@/hooks/useAppData";
import { findCandidateRecipesForCategories, searchDrinkByName } from "@/lib/cocktaildb";
import { rankRecipes } from "@/lib/matching";
import type { AlcoholCategoryId, Recipe } from "@/lib/types";

export default function RecettesPage() {
  const { bottles, ownedAlcoholCategories, ownedCondimentCategories, customRecipes, hydrated } =
    useAppData();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [onlyMakeable, setOnlyMakeable] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Recipe[] | null>(null);
  const [searching, setSearching] = useState(false);

  const categories = useMemo(
    () => Array.from(ownedAlcoholCategories) as AlcoholCategoryId[],
    [ownedAlcoholCategories],
  );

  useEffect(() => {
    if (!hydrated) return;
    if (categories.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setErrored(false);
    findCandidateRecipesForCategories(categories)
      .then((r) => {
        if (!cancelled) setRecipes(r);
      })
      .catch(() => {
        if (!cancelled) setErrored(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, categories.join(",")]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchResults(null);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timeout = setTimeout(() => {
      searchDrinkByName(trimmed)
        .then((r) => {
          if (!cancelled) setSearchResults(r);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  const ranked = useMemo(
    () =>
      rankRecipes(
        searchResults ?? [...recipes, ...customRecipes],
        ownedAlcoholCategories,
        ownedCondimentCategories,
      ),
    [searchResults, recipes, customRecipes, ownedAlcoholCategories, ownedCondimentCategories],
  );
  const visible = onlyMakeable ? ranked.filter((m) => m.canMakeNow) : ranked;

  if (!hydrated) return null;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Recettes" subtitle="Classées selon ce que tu as déjà" />

      <div className="px-5">
        <input
          className="field-input mb-3"
          placeholder="Chercher un cocktail précis (ex : Mojito)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {!searchResults && (
          <label className="mb-4 flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={onlyMakeable}
              onChange={(e) => setOnlyMakeable(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Seulement les cocktails réalisables maintenant
          </label>
        )}
      </div>

      <div className="flex-1 px-5 pb-6">
        {bottles.length === 0 && !searchResults ? (
          <div className="card flex flex-col items-center gap-3 py-10 text-center">
            <span className="text-3xl">🍾</span>
            <p className="font-semibold">Ajoute d&apos;abord tes bouteilles</p>
            <p className="text-sm text-muted-foreground">
              On te proposera des recettes dès que ta cave contient au moins un alcool.
            </p>
            <Link href="/cave" className="btn-primary mt-1 w-full">
              Aller à ma cave
            </Link>
          </div>
        ) : loading || searching ? (
          <div className="flex flex-col items-center gap-2 py-16 text-sm text-muted-foreground">
            <Spinner />
            Recherche des recettes en cours…
          </div>
        ) : errored ? (
          <div className="card py-8 text-center text-sm text-muted-foreground">
            Impossible de contacter TheCocktailDB pour le moment. Réessaie un peu plus tard.
          </div>
        ) : visible.length === 0 ? (
          <div className="card py-8 text-center text-sm text-muted-foreground">
            Aucun résultat pour le moment. Essaie de décocher le filtre, ou ajoute d&apos;autres
            bouteilles à ta cave.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {visible.map((m) => (
              <li key={m.recipe.id}>
                <RecipeCard match={m} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-6 w-6 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
