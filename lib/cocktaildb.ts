import type { Recipe, RecipeIngredient } from "./types";
import { guessCategory, isAlcoholCategory, cocktailDbNamesForCategory } from "./aliases";
import type { AlcoholCategoryId } from "./types";
import { parseMeasureToMl } from "./units";

const API_KEY = process.env.NEXT_PUBLIC_COCKTAILDB_API_KEY || "1";
const BASE_URL = `https://www.thecocktaildb.com/api/json/v1/${API_KEY}`;

interface RawDrink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string | null;
  strGlass: string | null;
  strInstructions: string | null;
  strCategory: string | null;
  strAlcoholic: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

interface DrinksResponse {
  drinks: RawDrink[] | null;
}

function normalizeIngredient(rawName: string, measureRaw: string | null): RecipeIngredient {
  const category = guessCategory(rawName);
  return {
    rawName,
    measureRaw: measureRaw?.trim() || null,
    measureMl: parseMeasureToMl(measureRaw),
    isAlcohol: isAlcoholCategory(category),
    category,
  };
}

export function normalizeDrink(raw: RawDrink): Recipe {
  const ingredients: RecipeIngredient[] = [];
  for (let i = 1; i <= 15; i++) {
    const name = raw[`strIngredient${i}`];
    if (!name || !name.trim()) continue;
    const measure = raw[`strMeasure${i}`] ?? null;
    ingredients.push(normalizeIngredient(name.trim(), measure));
  }
  return {
    id: `cdb-${raw.idDrink}`,
    source: "cocktaildb",
    name: raw.strDrink,
    imageUrl: raw.strDrinkThumb ? `${raw.strDrinkThumb}/preview` : null,
    glass: raw.strGlass,
    instructions: raw.strInstructions || "",
    ingredients,
    tags: [raw.strCategory, raw.strAlcoholic].filter((t): t is string => !!t),
  };
}

async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Retourne les identifiants + noms de cocktails contenant l'ingrédient donné (recherche légère, pas de détail). */
export async function filterByIngredient(
  ingredientName: string,
): Promise<{ id: string; name: string; thumb: string | null }[]> {
  const data = await safeFetchJson<DrinksResponse>(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredientName)}`,
  );
  if (!data?.drinks) return [];
  return data.drinks.map((d) => ({ id: d.idDrink, name: d.strDrink, thumb: d.strDrinkThumb }));
}

export async function lookupDrink(id: string): Promise<Recipe | null> {
  const data = await safeFetchJson<DrinksResponse>(`${BASE_URL}/lookup.php?i=${id}`);
  const raw = data?.drinks?.[0];
  return raw ? normalizeDrink(raw) : null;
}

export async function searchDrinkByName(name: string): Promise<Recipe[]> {
  const data = await safeFetchJson<DrinksResponse>(
    `${BASE_URL}/search.php?s=${encodeURIComponent(name)}`,
  );
  if (!data?.drinks) return [];
  return data.drinks.map(normalizeDrink);
}

export async function randomDrink(): Promise<Recipe | null> {
  const data = await safeFetchJson<DrinksResponse>(`${BASE_URL}/random.php`);
  const raw = data?.drinks?.[0];
  return raw ? normalizeDrink(raw) : null;
}

/**
 * Cherche des recettes candidates pour un ensemble de catégories d'alcools possédées.
 * Interroge filter.php pour chaque nom TheCocktailDB associé à ces catégories, dé-duplique,
 * puis récupère le détail complet des cocktails les plus fréquemment trouvés.
 */
export async function findCandidateRecipesForCategories(
  categories: AlcoholCategoryId[],
  maxDetailed = 40,
): Promise<Recipe[]> {
  const ingredientNames = Array.from(
    new Set(categories.flatMap((c) => cocktailDbNamesForCategory(c))),
  );
  if (ingredientNames.length === 0) return [];

  const hitCounts = new Map<string, number>();
  const thumbs = new Map<string, string | null>();
  const results = await Promise.all(ingredientNames.map((n) => filterByIngredient(n)));
  for (const list of results) {
    for (const drink of list) {
      hitCounts.set(drink.id, (hitCounts.get(drink.id) || 0) + 1);
      thumbs.set(drink.id, drink.thumb);
    }
  }

  const orderedIds = Array.from(hitCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxDetailed)
    .map(([id]) => id);

  const CONCURRENCY = 8;
  const recipes: Recipe[] = [];
  for (let i = 0; i < orderedIds.length; i += CONCURRENCY) {
    const batch = orderedIds.slice(i, i + CONCURRENCY);
    const detailed = await Promise.all(batch.map((id) => lookupDrink(id)));
    for (const r of detailed) if (r) recipes.push(r);
  }
  return recipes;
}
