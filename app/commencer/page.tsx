"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { findCandidateRecipesForCategories, randomDrink } from "@/lib/cocktaildb";
import { rankRecipes } from "@/lib/matching";
import type { AlcoholCategoryId } from "@/lib/types";

export default function CommencerPage() {
  const router = useRouter();
  const { bottles, ownedAlcoholCategories, ownedCondimentCategories, hydrated } = useAppData();
  const [surprising, setSurprising] = useState(false);

  async function surpriseMe() {
    setSurprising(true);
    try {
      const categories = Array.from(ownedAlcoholCategories) as AlcoholCategoryId[];
      if (categories.length > 0) {
        const candidates = await findCandidateRecipesForCategories(categories, 25);
        if (candidates.length > 0) {
          const ranked = rankRecipes(candidates, ownedAlcoholCategories, ownedCondimentCategories);
          const makeable = ranked.filter((m) => m.canMakeNow);
          const pool = makeable.length > 0 ? makeable : ranked;
          const pick = pool[Math.floor(Math.random() * pool.length)];
          router.push(`/recettes/${pick.recipe.id}`);
          return;
        }
      }
      const random = await randomDrink();
      if (random) {
        router.push(`/recettes/${random.id}`);
        return;
      }
      router.push("/recettes");
    } finally {
      setSurprising(false);
    }
  }

  if (!hydrated) return null;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Comment tu veux choisir ?" subtitle="Trois façons de trouver ton cocktail" />

      <div className="flex flex-1 flex-col gap-3 px-5 pb-6">
        {bottles.length === 0 ? (
          <Link href="/cave" className="card flex items-center gap-4 border-accent/30 bg-accent-soft">
            <span className="text-3xl">🧊</span>
            <div className="flex-1">
              <p className="font-display font-semibold">Ajoute tes bouteilles</p>
              <p className="text-base text-muted-foreground">
                Il faut d&apos;abord savoir ce que tu as pour te proposer des recettes.
              </p>
            </div>
            <Arrow />
          </Link>
        ) : (
          <Link href="/recettes" className="card flex items-center gap-4 border-accent/30 bg-accent-soft">
            <span className="text-3xl">🍹</span>
            <div className="flex-1">
              <p className="font-display font-semibold">Cocktails avec ma cave</p>
              <p className="text-base text-muted-foreground">
                Classés selon ce que tu as déjà chez toi ({bottles.length} bouteille
                {bottles.length > 1 ? "s" : ""}).
              </p>
            </div>
            <Arrow />
          </Link>
        )}

        <button
          onClick={surpriseMe}
          disabled={surprising}
          className="card flex items-center gap-4 text-left disabled:opacity-60"
        >
          <span className="text-3xl">🎲</span>
          <div className="flex-1">
            <p className="font-display font-semibold">Surprends-moi</p>
            <p className="text-base text-muted-foreground">
              {surprising ? "On te trouve quelque chose…" : "Un cocktail choisi au hasard pour toi"}
            </p>
          </div>
          <Arrow />
        </button>

        <Link href="/cave" className="card flex items-center gap-4">
          <span className="text-3xl">🧺</span>
          <div className="flex-1">
            <p className="font-display font-semibold">Gérer ma cave</p>
            <p className="text-base text-muted-foreground">Ajoute ou modifie tes bouteilles et condiments.</p>
          </div>
          <Arrow />
        </Link>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="shrink-0 text-muted-foreground">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
