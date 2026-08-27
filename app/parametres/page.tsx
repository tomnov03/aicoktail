"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useAiEnabled } from "@/hooks/useAiEnabled";
import { useToast } from "@/components/Toast";

export default function ParametresPage() {
  const aiEnabled = useAiEnabled();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);

  function resetAll() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("aicoktail:bottles");
    window.localStorage.removeItem("aicoktail:condiments");
    window.localStorage.removeItem("aicoktail:history");
    window.localStorage.removeItem("aicoktail:customRecipes");
    toast.show("Toutes tes données locales ont été effacées.", "success");
    setConfirming(false);
    window.location.href = "/";
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Réglages" subtitle="À propos de l'application" />

      <div className="flex-1 space-y-4 px-5 pb-6">
        <div className="card">
          <h2 className="mb-1 font-semibold">Stockage des données</h2>
          <p className="text-sm text-muted-foreground">
            Ta cave, tes condiments et ton historique sont stockés uniquement sur cet appareil
            (localStorage du navigateur). Rien n&apos;est envoyé à un serveur. Si tu changes de
            téléphone ou vides le cache, ces données sont perdues.
          </p>
        </div>

        <div className="card">
          <h2 className="mb-1 font-semibold">Génération IA</h2>
          <p className="text-sm text-muted-foreground">
            Statut :{" "}
            {aiEnabled === null ? (
              "vérification…"
            ) : aiEnabled ? (
              <span className="font-medium text-success">activée</span>
            ) : (
              <span className="font-medium text-danger">désactivée</span>
            )}
          </p>
          {aiEnabled === false && (
            <p className="mt-2 text-sm text-muted-foreground">
              Pour l&apos;activer, ajoute la variable d&apos;environnement{" "}
              <code className="rounded bg-surface-muted px-1 py-0.5 text-xs">ANTHROPIC_API_KEY</code>{" "}
              dans les paramètres de ton projet Vercel (jamais dans le code source). Voir le README du
              dépôt.
            </p>
          )}
        </div>

        <div className="card">
          <h2 className="mb-1 font-semibold">Recettes classiques</h2>
          <p className="text-sm text-muted-foreground">
            Les recettes classiques proviennent de{" "}
            <a
              href="https://www.thecocktaildb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-strong underline"
            >
              TheCocktailDB
            </a>
            , une base de données ouverte de cocktails.
          </p>
        </div>

        <div className="card">
          <h2 className="mb-1 font-semibold text-danger">Zone de danger</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Efface ta cave, tes condiments et ton historique de cet appareil.
          </p>
          {confirming ? (
            <div className="flex gap-2">
              <button onClick={resetAll} className="btn-primary flex-1 bg-danger!">
                Confirmer l&apos;effacement
              </button>
              <button onClick={() => setConfirming(false)} className="btn-secondary flex-1">
                Annuler
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="btn-secondary w-full text-danger">
              Réinitialiser mes données
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
