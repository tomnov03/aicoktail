import type {
  AlcoholCategoryId,
  CondimentCategoryId,
  Recipe,
  RecipeIngredient,
  RecipeMatch,
} from "./types";

/** Éléments qu'on suppose toujours disponibles dans une cuisine (pour ne pas pénaliser inutilement les recettes). */
const ASSUME_AVAILABLE: CondimentCategoryId[] = ["glacons", "eau_gazeuse", "sel", "sucre"];

export function matchRecipe(
  recipe: Recipe,
  ownedAlcohol: Set<AlcoholCategoryId>,
  ownedCondiments: Set<CondimentCategoryId>,
): RecipeMatch {
  const alcoholIngredients = recipe.ingredients.filter((i) => i.isAlcohol);
  const condimentIngredients = recipe.ingredients.filter(
    (i) => !i.isAlcohol && i.category !== null,
  );

  const isOwnedAlcohol = (ing: RecipeIngredient) =>
    !!ing.category && ownedAlcohol.has(ing.category as AlcoholCategoryId);
  const isOwnedCondiment = (ing: RecipeIngredient) =>
    !!ing.category &&
    (ASSUME_AVAILABLE.includes(ing.category as CondimentCategoryId) ||
      ownedCondiments.has(ing.category as CondimentCategoryId));

  const missingAlcohol = alcoholIngredients.filter((i) => !isOwnedAlcohol(i));
  const missingCondiments = condimentIngredients.filter((i) => !isOwnedCondiment(i));

  const ownedAlcoholCount = alcoholIngredients.length - missingAlcohol.length;
  const ownedCondimentCount = condimentIngredients.length - missingCondiments.length;

  const alcoholRatio = alcoholIngredients.length
    ? ownedAlcoholCount / alcoholIngredients.length
    : 1;
  const condimentRatio = condimentIngredients.length
    ? ownedCondimentCount / condimentIngredients.length
    : 1;

  const score = alcoholRatio * 0.75 + condimentRatio * 0.25;

  return {
    recipe,
    score,
    ownedAlcoholCount,
    totalAlcoholCount: alcoholIngredients.length,
    missingAlcohol,
    ownedCondimentCount,
    totalCondimentCount: condimentIngredients.length,
    missingCondiments,
    canMakeNow: missingAlcohol.length === 0 && missingCondiments.length === 0,
  };
}

export function rankRecipes(
  recipes: Recipe[],
  ownedAlcohol: Set<AlcoholCategoryId>,
  ownedCondiments: Set<CondimentCategoryId>,
): RecipeMatch[] {
  return recipes
    .map((r) => matchRecipe(r, ownedAlcohol, ownedCondiments))
    .sort((a, b) => {
      if (a.canMakeNow !== b.canMakeNow) return a.canMakeNow ? -1 : 1;
      if (b.score !== a.score) return b.score - a.score;
      return a.missingAlcohol.length + a.missingCondiments.length >
        b.missingAlcohol.length + b.missingCondiments.length
        ? 1
        : -1;
    });
}
