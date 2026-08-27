import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { guessCategory, isAlcoholCategory } from "@/lib/aliases";
import { parseMeasureToMl } from "@/lib/units";
import type { Recipe, RecipeIngredient } from "@/lib/types";

export const runtime = "nodejs";

const RequestSchema = z.object({
  bottles: z.array(z.string()).max(60),
  condiments: z.array(z.string()).max(60),
});

const GeneratedRecipeSchema = z.object({
  name: z.string(),
  glass: z.string(),
  instructions: z.array(z.string()).min(1),
  ingredients: z
    .array(
      z.object({
        name: z.string(),
        measure: z.string(),
        isAlcohol: z.boolean(),
      }),
    )
    .min(1),
  notes: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  // La génération IA est optionnelle : si aucune clé n'est configurée côté serveur,
  // on répond proprement plutôt que de planter. La clé n'est JAMAIS exposée au client
  // (pas de préfixe NEXT_PUBLIC_) : voir .env.example / README pour sa configuration.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "ai_disabled",
        message:
          "La génération IA n'est pas configurée sur ce déploiement (ANTHROPIC_API_KEY absente).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "JSON invalide." }, { status: 400 });
  }

  const parsedBody = RequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "bad_request", message: "bottles et condiments doivent être des tableaux de chaînes." },
      { status: 400 },
    );
  }
  const { bottles, condiments } = parsedBody.data;
  if (bottles.length === 0) {
    return NextResponse.json(
      { error: "bad_request", message: "Ajoute au moins une bouteille dans ta cave avant de générer une recette." },
      { status: 400 },
    );
  }

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-5";

  try {
    const response = await client.messages.parse({
      model,
      max_tokens: 2000,
      system:
        "Tu es un barman créatif francophone. Invente un cocktail ORIGINAL et réalisable, " +
        "en utilisant STRICTEMENT les ingrédients fournis par l'utilisateur (bouteilles d'alcool et condiments). " +
        "N'invente jamais un alcool qui n'est pas dans la liste fournie. Tu peux supposer que l'utilisateur a toujours " +
        "à disposition : glaçons, eau, sucre et sel, même s'ils ne sont pas listés. Tu n'es pas obligé d'utiliser tous " +
        "les ingrédients. Donne des mesures réalistes (ex: '45 ml', '2 dashes', '1 trait'). Réponds uniquement en français.",
      messages: [
        {
          role: "user",
          content: `Bouteilles d'alcool disponibles : ${bottles.join(", ")}.\nCondiments disponibles : ${
            condiments.length ? condiments.join(", ") : "aucun listé"
          }.\nPropose un cocktail original avec un nom accrocheur.`,
        },
      ],
      output_config: {
        format: zodOutputFormat(GeneratedRecipeSchema),
      },
    });

    const parsed = response.parsed_output;
    if (!parsed) {
      return NextResponse.json(
        { error: "generation_failed", message: "La génération n'a pas produit de résultat exploitable." },
        { status: 502 },
      );
    }

    const ingredients: RecipeIngredient[] = parsed.ingredients.map((ing) => {
      const category = guessCategory(ing.name);
      return {
        rawName: ing.name,
        measureRaw: ing.measure,
        measureMl: parseMeasureToMl(ing.measure),
        isAlcohol: ing.isAlcohol || isAlcoholCategory(category),
        category,
      };
    });

    const recipe: Recipe = {
      id: `ai-${crypto.randomUUID()}`,
      source: "ai",
      name: parsed.name,
      imageUrl: null,
      glass: parsed.glass,
      instructions: parsed.instructions.map((s, i) => `${i + 1}. ${s}`).join("\n"),
      ingredients,
      tags: parsed.notes ? [parsed.notes] : ["Créé par l'IA"],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ recipe });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "rate_limited", message: "Trop de demandes, réessaie dans quelques instants." },
        { status: 429 },
      );
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "auth_error", message: "Clé ANTHROPIC_API_KEY invalide côté serveur." },
        { status: 500 },
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: "api_error", message: `Erreur API (${err.status}).` },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { error: "unknown_error", message: "Erreur inattendue lors de la génération." },
      { status: 500 },
    );
  }
}
