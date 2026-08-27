import Link from "next/link";
import type { RecipeMatch } from "@/lib/types";

export function RecipeCard({ match }: { match: RecipeMatch }) {
  const { recipe, canMakeNow, missingAlcohol, missingCondiments } = match;
  const missingCount = missingAlcohol.length + missingCondiments.length;

  return (
    <Link
      href={`/recettes/${recipe.id}`}
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-transform active:scale-[0.98]"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
        {recipe.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={recipe.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">🍹</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{recipe.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {recipe.glass || (recipe.source === "ai" ? "Création IA" : "Cocktail")}
        </p>
        <div className="mt-1.5">
          {canMakeNow ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
              ✓ Réalisable maintenant
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-strong">
              {missingCount} ingrédient{missingCount > 1 ? "s" : ""} manquant{missingCount > 1 ? "s" : ""}
            </span>
          )}
          {recipe.source === "ai" && (
            <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              ✨ IA
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
