"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AlcoholCategoryId,
  Bottle,
  Condiment,
  CondimentCategoryId,
  HistoryEntry,
  Recipe,
} from "@/lib/types";
import { loadJson, newId, saveJson } from "@/lib/storage";

interface AppData {
  bottles: Bottle[];
  condiments: Condiment[];
  history: HistoryEntry[];
  customRecipes: Recipe[];
  hydrated: boolean;
  addBottle: (input: Omit<Bottle, "id" | "createdAt">) => void;
  updateBottle: (id: string, patch: Partial<Bottle>) => void;
  removeBottle: (id: string) => void;
  addCondiment: (input: Omit<Condiment, "id" | "createdAt">) => void;
  removeCondiment: (id: string) => void;
  ownedAlcoholCategories: Set<AlcoholCategoryId>;
  ownedCondimentCategories: Set<CondimentCategoryId>;
  saveCustomRecipe: (recipe: Recipe) => void;
  getRecipeById: (id: string) => Recipe | undefined;
  prepareCocktail: (recipe: Recipe) => { ok: true } | { ok: false; reason: string };
}

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [condiments, setCondiments] = useState<Condiment[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBottles(loadJson("bottles", []));
    setCondiments(loadJson("condiments", []));
    setHistory(loadJson("history", []));
    setCustomRecipes(loadJson("customRecipes", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveJson("bottles", bottles);
  }, [bottles, hydrated]);
  useEffect(() => {
    if (hydrated) saveJson("condiments", condiments);
  }, [condiments, hydrated]);
  useEffect(() => {
    if (hydrated) saveJson("history", history);
  }, [history, hydrated]);
  useEffect(() => {
    if (hydrated) saveJson("customRecipes", customRecipes);
  }, [customRecipes, hydrated]);

  const addBottle = useCallback((input: Omit<Bottle, "id" | "createdAt">) => {
    setBottles((prev) => [...prev, { ...input, id: newId(), createdAt: new Date().toISOString() }]);
  }, []);

  const updateBottle = useCallback((id: string, patch: Partial<Bottle>) => {
    setBottles((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  const removeBottle = useCallback((id: string) => {
    setBottles((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addCondiment = useCallback((input: Omit<Condiment, "id" | "createdAt">) => {
    setCondiments((prev) => [...prev, { ...input, id: newId(), createdAt: new Date().toISOString() }]);
  }, []);

  const removeCondiment = useCallback((id: string) => {
    setCondiments((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const ownedAlcoholCategories = useMemo(
    () => new Set(bottles.filter((b) => b.remainingMl > 0).map((b) => b.category)),
    [bottles],
  );
  const ownedCondimentCategories = useMemo(
    () => new Set(condiments.map((c) => c.category)),
    [condiments],
  );

  const saveCustomRecipe = useCallback((recipe: Recipe) => {
    setCustomRecipes((prev) => [recipe, ...prev.filter((r) => r.id !== recipe.id)]);
  }, []);

  const getRecipeById = useCallback(
    (id: string) => customRecipes.find((r) => r.id === id),
    [customRecipes],
  );

  const prepareCocktail = useCallback(
    (recipe: Recipe): { ok: true } | { ok: false; reason: string } => {
      const alcoholIngredients = recipe.ingredients.filter((i) => i.isAlcohol);
      const consumption: { bottleId: string; bottleName: string; ml: number }[] = [];

      for (const ing of alcoholIngredients) {
        if (!ing.category) continue;
        const candidate = bottles
          .filter((b) => b.category === ing.category && b.remainingMl > 0)
          .sort((a, b) => a.remainingMl - b.remainingMl)[0];
        if (!candidate) {
          return { ok: false, reason: `Aucune bouteille disponible pour "${ing.rawName}".` };
        }
        const amount = ing.measureMl ?? 30;
        consumption.push({ bottleId: candidate.id, bottleName: candidate.name, ml: amount });
      }

      setBottles((prev) => {
        const next = [...prev];
        for (const c of consumption) {
          const idx = next.findIndex((b) => b.id === c.bottleId);
          if (idx !== -1) {
            next[idx] = { ...next[idx], remainingMl: Math.max(0, next[idx].remainingMl - c.ml) };
          }
        }
        return next;
      });

      setHistory((prev) => [
        {
          id: newId(),
          recipeId: recipe.id,
          recipeName: recipe.name,
          imageUrl: recipe.imageUrl,
          madeAt: new Date().toISOString(),
          consumedMl: consumption,
        },
        ...prev,
      ]);

      return { ok: true };
    },
    [bottles],
  );

  const value: AppData = {
    bottles,
    condiments,
    history,
    customRecipes,
    hydrated,
    addBottle,
    updateBottle,
    removeBottle,
    addCondiment,
    removeCondiment,
    ownedAlcoholCategories,
    ownedCondimentCategories,
    saveCustomRecipe,
    getRecipeById,
    prepareCocktail,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData doit être utilisé dans <AppDataProvider>");
  return ctx;
}
