import type { AlcoholCategoryId, CondimentCategoryId } from "./types";

interface CategoryDef {
  id: AlcoholCategoryId | CondimentCategoryId;
  label: string;
  /** Mots-clés (FR + EN) utilisés pour reconnaître la catégorie dans un nom libre */
  keywords: string[];
  /** Nom(s) d'ingrédient tel qu'utilisés par TheCocktailDB pour l'endpoint filter.php?i= */
  cocktailDbNames?: string[];
}

export const ALCOHOL_CATEGORIES: CategoryDef[] = [
  {
    id: "rhum_blanc",
    label: "Rhum blanc",
    keywords: ["rhum blanc", "rhum leger", "white rum", "light rum", "rhum"],
    cocktailDbNames: ["Light rum", "White rum", "Rum"],
  },
  {
    id: "rhum_ambre",
    label: "Rhum ambré / brun",
    keywords: [
      "rhum ambre",
      "rhum ambré",
      "rhum brun",
      "rhum epice",
      "rhum vieux",
      "dark rum",
      "spiced rum",
      "gold rum",
    ],
    cocktailDbNames: ["Dark rum", "Spiced rum", "Gold rum"],
  },
  {
    id: "vodka",
    label: "Vodka",
    keywords: ["vodka"],
    cocktailDbNames: ["Vodka"],
  },
  {
    id: "gin",
    label: "Gin",
    keywords: ["gin"],
    cocktailDbNames: ["Gin"],
  },
  {
    id: "tequila",
    label: "Tequila",
    keywords: ["tequila", "téquila"],
    cocktailDbNames: ["Tequila"],
  },
  {
    id: "whisky",
    label: "Whisky / Bourbon",
    keywords: ["whisky", "whiskey", "bourbon", "scotch", "rye"],
    cocktailDbNames: ["Whiskey", "Bourbon", "Scotch"],
  },
  {
    id: "cognac_brandy",
    label: "Cognac / Brandy",
    keywords: ["cognac", "brandy", "armagnac"],
    cocktailDbNames: ["Brandy", "Cognac"],
  },
  {
    id: "triple_sec",
    label: "Triple sec / Curaçao",
    keywords: ["triple sec", "cointreau", "curacao", "curaçao", "orange liqueur", "grand marnier"],
    cocktailDbNames: ["Triple sec", "Cointreau", "Blue Curacao", "Grand Marnier"],
  },
  {
    id: "vermouth_rouge",
    label: "Vermouth rouge",
    keywords: ["vermouth rouge", "sweet vermouth", "martini rosso"],
    cocktailDbNames: ["Sweet Vermouth", "Red Vermouth"],
  },
  {
    id: "vermouth_sec",
    label: "Vermouth sec",
    keywords: ["vermouth sec", "dry vermouth", "martini extra dry"],
    cocktailDbNames: ["Dry Vermouth"],
  },
  {
    id: "liqueur_cafe",
    label: "Liqueur de café",
    keywords: ["kahlua", "liqueur de café", "liqueur de cafe", "coffee liqueur", "tia maria"],
    cocktailDbNames: ["Coffee Liqueur", "Kahlua", "Tia Maria"],
  },
  {
    id: "amaretto",
    label: "Amaretto",
    keywords: ["amaretto"],
    cocktailDbNames: ["Amaretto"],
  },
  {
    id: "liqueur_menthe",
    label: "Crème de menthe",
    keywords: ["creme de menthe", "crème de menthe", "peppermint liqueur"],
    cocktailDbNames: ["Creme de Menthe"],
  },
  {
    id: "liqueur_cassis",
    label: "Crème de cassis",
    keywords: ["creme de cassis", "crème de cassis", "cassis liqueur"],
    cocktailDbNames: ["Creme de Cassis"],
  },
  {
    id: "malibu",
    label: "Rhum coco (Malibu)",
    keywords: ["malibu", "rhum coco", "coconut rum"],
    cocktailDbNames: ["Malibu rum", "Coconut Rum"],
  },
  {
    id: "limoncello",
    label: "Limoncello",
    keywords: ["limoncello"],
    cocktailDbNames: ["Limoncello"],
  },
  {
    id: "aperol_campari",
    label: "Apéritif italien (Aperol / Campari)",
    keywords: ["aperol", "campari"],
    cocktailDbNames: ["Aperol", "Campari"],
  },
  {
    id: "champagne_mousseux",
    label: "Champagne / vin mousseux",
    keywords: ["champagne", "prosecco", "vin mousseux", "cava", "sparkling wine"],
    cocktailDbNames: ["Champagne", "Prosecco", "Cava"],
  },
  {
    id: "vin_blanc",
    label: "Vin blanc",
    keywords: ["vin blanc", "white wine"],
    cocktailDbNames: ["White wine"],
  },
  {
    id: "vin_rouge",
    label: "Vin rouge",
    keywords: ["vin rouge", "red wine"],
    cocktailDbNames: ["Red wine"],
  },
  {
    id: "biere",
    label: "Bière",
    keywords: ["biere", "bière", "beer", "lager", "ale"],
    cocktailDbNames: ["Beer"],
  },
  {
    id: "absinthe_pastis",
    label: "Absinthe / Pastis",
    keywords: ["absinthe", "pastis", "anisette", "ouzo", "sambuca"],
    cocktailDbNames: ["Absinthe", "Sambuca"],
  },
  {
    id: "autre_alcool",
    label: "Autre alcool",
    keywords: [],
  },
];

export const CONDIMENT_CATEGORIES: CategoryDef[] = [
  {
    id: "jus_citron_vert",
    label: "Jus de citron vert",
    keywords: ["jus de citron vert", "lime juice", "citron vert"],
    cocktailDbNames: ["Lime juice", "Lime"],
  },
  {
    id: "jus_citron",
    label: "Jus de citron jaune",
    keywords: ["jus de citron", "lemon juice"],
    cocktailDbNames: ["Lemon juice", "Lemon"],
  },
  {
    id: "jus_orange",
    label: "Jus d'orange",
    keywords: ["jus d'orange", "jus orange", "orange juice"],
    cocktailDbNames: ["Orange juice"],
  },
  {
    id: "jus_ananas",
    label: "Jus d'ananas",
    keywords: ["jus d'ananas", "jus ananas", "pineapple juice"],
    cocktailDbNames: ["Pineapple juice"],
  },
  {
    id: "jus_cranberry",
    label: "Jus de cranberry",
    keywords: ["cranberry", "canneberge"],
    cocktailDbNames: ["Cranberry juice"],
  },
  {
    id: "jus_pamplemousse",
    label: "Jus de pamplemousse",
    keywords: ["pamplemousse", "grapefruit"],
    cocktailDbNames: ["Grapefruit juice"],
  },
  {
    id: "jus_tomate",
    label: "Jus de tomate",
    keywords: ["jus de tomate", "tomato juice"],
    cocktailDbNames: ["Tomato juice"],
  },
  {
    id: "sirop_sucre",
    label: "Sirop de sucre de canne",
    keywords: ["sirop de sucre", "sirop de canne", "simple syrup", "sugar syrup", "gomme"],
    cocktailDbNames: ["Simple syrup", "Sugar syrup"],
  },
  {
    id: "grenadine",
    label: "Grenadine",
    keywords: ["grenadine"],
    cocktailDbNames: ["Grenadine"],
  },
  {
    id: "sucre",
    label: "Sucre",
    keywords: ["sucre", "sugar"],
    cocktailDbNames: ["Sugar"],
  },
  {
    id: "sel",
    label: "Sel",
    keywords: ["sel", "salt"],
    cocktailDbNames: ["Salt"],
  },
  {
    id: "soda",
    label: "Eau gazeuse / soda water",
    keywords: ["soda", "club soda", "eau gazeuse", "soda water"],
    cocktailDbNames: ["Soda water", "Club soda"],
  },
  {
    id: "tonic",
    label: "Tonic",
    keywords: ["tonic"],
    cocktailDbNames: ["Tonic water"],
  },
  {
    id: "ginger_beer",
    label: "Ginger beer / ginger ale",
    keywords: ["ginger beer", "ginger ale", "gingembre"],
    cocktailDbNames: ["Ginger beer", "Ginger ale"],
  },
  {
    id: "cola",
    label: "Cola",
    keywords: ["cola", "coca"],
    cocktailDbNames: ["Coca-Cola", "Cola"],
  },
  {
    id: "citron_vert_frais",
    label: "Citron vert frais",
    keywords: ["citron vert frais", "lime wedge", "fresh lime"],
  },
  {
    id: "citron_frais",
    label: "Citron frais",
    keywords: ["citron frais", "lemon wedge", "fresh lemon"],
  },
  {
    id: "menthe_fraiche",
    label: "Menthe fraîche",
    keywords: ["menthe", "mint"],
    cocktailDbNames: ["Mint"],
  },
  {
    id: "angostura",
    label: "Angostura / bitters",
    keywords: ["angostura", "bitters"],
    cocktailDbNames: ["Angostura bitters", "Bitters"],
  },
  {
    id: "oeuf",
    label: "Œuf (blanc)",
    keywords: ["oeuf", "œuf", "egg"],
    cocktailDbNames: ["Egg White", "Egg"],
  },
  {
    id: "creme",
    label: "Crème / lait",
    keywords: ["creme", "crème", "cream", "lait", "milk"],
    cocktailDbNames: ["Cream", "Milk"],
  },
  {
    id: "lait_coco",
    label: "Lait / crème de coco",
    keywords: ["lait de coco", "creme de coco", "coconut cream", "coconut milk", "coco lopez"],
    cocktailDbNames: ["Coconut cream", "Coconut milk", "Cream of Coconut"],
  },
  {
    id: "glacons",
    label: "Glaçons",
    keywords: ["glacon", "glaçon", "ice"],
    cocktailDbNames: ["Ice"],
  },
  {
    id: "eau_gazeuse",
    label: "Eau",
    keywords: ["eau plate", "eau", "water"],
    cocktailDbNames: ["Water"],
  },
  {
    id: "autre_condiment",
    label: "Autre condiment",
    keywords: [],
  },
];

export const ALL_CATEGORIES = [...ALCOHOL_CATEGORIES, ...CONDIMENT_CATEGORIES];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/** Devine la catégorie canonique la plus probable pour un nom libre (bouteille, condiment ou ingrédient de recette). */
export function guessCategory(
  rawName: string,
): AlcoholCategoryId | CondimentCategoryId | null {
  const normalized = normalize(rawName);
  let best: { id: AlcoholCategoryId | CondimentCategoryId; len: number } | null = null;
  for (const def of ALL_CATEGORIES) {
    for (const kw of def.keywords) {
      const nkw = normalize(kw);
      if (nkw && normalized.includes(nkw)) {
        if (!best || nkw.length > best.len) {
          best = { id: def.id, len: nkw.length };
        }
      }
    }
  }
  return best?.id ?? null;
}

export function isAlcoholCategory(
  id: AlcoholCategoryId | CondimentCategoryId | null,
): id is AlcoholCategoryId {
  return !!id && ALCOHOL_CATEGORIES.some((c) => c.id === id);
}

export function categoryLabel(id: AlcoholCategoryId | CondimentCategoryId): string {
  return ALL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/** Pour interroger TheCocktailDB filter.php?i=<name> à partir d'une catégorie possédée. */
export function cocktailDbNamesForCategory(id: AlcoholCategoryId): string[] {
  return ALCOHOL_CATEGORIES.find((c) => c.id === id)?.cocktailDbNames ?? [];
}

const CATEGORY_EMOJI: Partial<Record<AlcoholCategoryId | CondimentCategoryId, string>> = {
  rhum_blanc: "🥃",
  rhum_ambre: "🥃",
  vodka: "🍸",
  gin: "🍸",
  tequila: "🌵",
  whisky: "🥃",
  cognac_brandy: "🥃",
  triple_sec: "🍊",
  vermouth_rouge: "🍷",
  vermouth_sec: "🍷",
  liqueur_cafe: "☕",
  amaretto: "🌰",
  liqueur_menthe: "🌿",
  liqueur_cassis: "🍇",
  malibu: "🥥",
  limoncello: "🍋",
  aperol_campari: "🧡",
  champagne_mousseux: "🥂",
  vin_blanc: "🍾",
  vin_rouge: "🍷",
  biere: "🍺",
  absinthe_pastis: "🌿",
  autre_alcool: "🍾",
  jus_citron_vert: "🟢",
  jus_citron: "🍋",
  jus_orange: "🍊",
  jus_ananas: "🍍",
  jus_cranberry: "🔴",
  jus_pamplemousse: "🍊",
  jus_tomate: "🍅",
  sirop_sucre: "🍯",
  grenadine: "🍒",
  sucre: "🧊",
  sel: "🧂",
  soda: "🫧",
  tonic: "🫧",
  ginger_beer: "🫚",
  cola: "🥤",
  citron_vert_frais: "🟢",
  citron_frais: "🍋",
  menthe_fraiche: "🌿",
  angostura: "💧",
  oeuf: "🥚",
  creme: "🥛",
  lait_coco: "🥥",
  glacons: "🧊",
  eau_gazeuse: "💧",
  autre_condiment: "🧺",
};

export function categoryEmoji(id: AlcoholCategoryId | CondimentCategoryId): string {
  return CATEGORY_EMOJI[id] ?? "🍹";
}
