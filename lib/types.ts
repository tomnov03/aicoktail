export type AlcoholCategoryId =
  | "rhum_blanc"
  | "rhum_ambre"
  | "vodka"
  | "gin"
  | "tequila"
  | "whisky"
  | "cognac_brandy"
  | "triple_sec"
  | "vermouth_rouge"
  | "vermouth_sec"
  | "liqueur_cafe"
  | "amaretto"
  | "liqueur_menthe"
  | "liqueur_cassis"
  | "malibu"
  | "limoncello"
  | "aperol_campari"
  | "champagne_mousseux"
  | "vin_blanc"
  | "vin_rouge"
  | "biere"
  | "absinthe_pastis"
  | "autre_alcool";

export type CondimentCategoryId =
  | "jus_citron_vert"
  | "jus_citron"
  | "jus_orange"
  | "jus_ananas"
  | "jus_cranberry"
  | "jus_pamplemousse"
  | "jus_tomate"
  | "sirop_sucre"
  | "grenadine"
  | "sucre"
  | "sel"
  | "soda"
  | "tonic"
  | "ginger_beer"
  | "cola"
  | "citron_vert_frais"
  | "citron_frais"
  | "menthe_fraiche"
  | "angostura"
  | "oeuf"
  | "creme"
  | "lait_coco"
  | "glacons"
  | "eau_gazeuse"
  | "autre_condiment";

export interface Bottle {
  id: string;
  name: string;
  category: AlcoholCategoryId;
  volumeMl: number;
  remainingMl: number;
  createdAt: string;
}

export interface Condiment {
  id: string;
  name: string;
  category: CondimentCategoryId;
  createdAt: string;
}

export type RecipeSource = "cocktaildb" | "ai";

export interface RecipeIngredient {
  rawName: string;
  measureRaw: string | null;
  measureMl: number | null;
  isAlcohol: boolean;
  category: AlcoholCategoryId | CondimentCategoryId | null;
}

export interface Recipe {
  id: string;
  source: RecipeSource;
  name: string;
  imageUrl: string | null;
  glass: string | null;
  instructions: string;
  ingredients: RecipeIngredient[];
  tags: string[];
  createdAt?: string;
}

export interface RecipeMatch {
  recipe: Recipe;
  score: number;
  ownedAlcoholCount: number;
  totalAlcoholCount: number;
  missingAlcohol: RecipeIngredient[];
  ownedCondimentCount: number;
  totalCondimentCount: number;
  missingCondiments: RecipeIngredient[];
  canMakeNow: boolean;
}

export interface HistoryEntry {
  id: string;
  recipeId: string;
  recipeName: string;
  imageUrl: string | null;
  madeAt: string;
  consumedMl: { bottleId: string; bottleName: string; ml: number }[];
}
