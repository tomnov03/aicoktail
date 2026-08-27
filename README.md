# 🍸 AI Coktail

Application mobile web (PWA) qui aide à préparer des cocktails avec les bouteilles
d'alcool et les condiments que tu as déjà chez toi.

- **Recettes automatiques** : renseigne ta cave, l'appli va chercher sur
  [TheCocktailDB](https://www.thecocktaildb.com/) les cocktails que tu peux réaliser, classés
  par pourcentage de correspondance avec ce que tu possèdes.
- **Suivi de stock** : quand tu prépares un cocktail, la quantité utilisée est
  automatiquement déduite des bouteilles concernées.
- **Génération IA (optionnelle)** : un barman virtuel invente un cocktail original à
  partir de tes ingrédients exacts (y compris les condiments de supermarché que
  TheCocktailDB ne connaît pas).
- **Installable sur téléphone** : icône sur l'écran d'accueil, plein écran, pensée
  mobile-first.

## Stack technique

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS 4
- Stockage **100% local** (`localStorage`) : pas de compte, pas de base de données à
  héberger — ta cave reste sur ton téléphone
- [TheCocktailDB](https://www.thecocktaildb.com/api.php) pour les recettes classiques (appelée
  directement depuis le navigateur, clé de test publique)
- [Claude API (Anthropic)](https://docs.claude.com/) pour la génération de recettes
  originales — appelée uniquement **côté serveur**
- Déployable gratuitement sur [Vercel](https://vercel.com)

## Démarrage en local

```bash
npm install
cp .env.example .env.local   # puis édite .env.local si besoin
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). Sans rien configurer de plus,
l'appli fonctionne déjà en entier (cave, matching de recettes) — seule la génération
IA reste désactivée tant qu'aucune clé Anthropic n'est fournie.

## Variables d'environnement

Voir [`.env.example`](./.env.example) pour la liste complète et les commentaires.
Résumé :

| Variable | Obligatoire | Secret ? | Rôle |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_COCKTAILDB_API_KEY` | non (défaut `1`) | non — clé de test publique | Interroger TheCocktailDB |
| `ANTHROPIC_API_KEY` | non | **oui** | Active la génération IA de recettes |
| `ANTHROPIC_MODEL` | non (défaut `claude-opus-5`) | non | Modèle Claude utilisé pour la génération |

## ⚠️ Sécurité — le repo est public

- **Aucun fichier `.env*` réel n'est commité.** `.gitignore` exclut `.env`,
  `.env.local` et toutes les variantes locales. Seul `.env.example` (sans valeur secrète)
  est versionné, à titre de documentation.
- **`ANTHROPIC_API_KEY` n'est jamais exposée au client.** Elle est lue uniquement dans
  `app/api/generate-recipe/route.ts`, un Route Handler qui s'exécute côté serveur
  (fonction serverless Vercel). Le préfixe `NEXT_PUBLIC_` — qui expose une variable au
  navigateur — n'est volontairement utilisé que pour la clé TheCocktailDB, qui n'est pas
  un secret.
- **Avant tout `git add`**, vérifie qu'aucun fichier sensible n'est mis en zone de
  staging (`git status`). Si tu ajoutes un jour un autre service nécessitant une clé,
  ajoute-la uniquement via les variables d'environnement (locales dans `.env.local`,
  en production dans le dashboard Vercel), jamais en dur dans le code.
- Les données personnelles (cave, historique) ne quittent jamais l'appareil de
  l'utilisateur : aucune base de données côté serveur, donc aucune donnée utilisateur à
  protéger côté infra.

## Déploiement sur Vercel

1. Pousse ce dépôt sur GitHub (déjà fait si tu lis ceci depuis le repo).
2. Sur [vercel.com/new](https://vercel.com/new), importe le dépôt `aicoktail`.
3. Vercel détecte Next.js automatiquement, aucune configuration de build nécessaire.
4. (Optionnel) Dans **Project Settings → Environment Variables**, ajoute
   `ANTHROPIC_API_KEY` (et éventuellement `ANTHROPIC_MODEL`) pour activer la génération
   IA en production. Ne les mets jamais dans le code ou dans un fichier commité.
5. Déploie. L'app est utilisable immédiatement sur mobile ; propose "Ajouter à l'écran
   d'accueil" depuis le navigateur pour l'installer comme une app.

## Structure du projet

```
app/
  page.tsx              Accueil
  cave/                 Gestion de la cave (bouteilles + condiments)
  recettes/              Liste des recettes classées par correspondance
  recettes/[id]/         Détail d'une recette + bouton "j'ai préparé ce cocktail"
  recettes/generer/      Génération de recette par IA
  historique/            Historique des cocktails préparés
  parametres/            Réglages, statut IA, réinitialisation des données
  api/generate-recipe/   Route serveur — appelle Claude avec la clé secrète
  api/config/            Expose si l'IA est activée (sans exposer la clé)
lib/
  types.ts               Modèles de données (Bottle, Recipe, RecipeMatch, ...)
  aliases.ts              Dictionnaire FR/EN de catégories d'alcools et condiments
  units.ts                Parsing des mesures ("45 ml", "1 1/2 oz", ...)
  matching.ts             Algorithme de correspondance recette / cave
  cocktaildb.ts            Intégration TheCocktailDB
hooks/
  useAppData.tsx           Contexte React (localStorage) : cave, historique, décrément de stock
```

## Limites connues (MVP)

- Les données ne sont pas synchronisées entre appareils (stockage local uniquement).
- Le rattachement d'un ingrédient de recette à une catégorie repose sur un dictionnaire
  de mots-clés FR/EN : certains ingrédients rares peuvent ne pas être reconnus.
- La génération IA a un coût d'API à la charge de la personne qui configure
  `ANTHROPIC_API_KEY`.
