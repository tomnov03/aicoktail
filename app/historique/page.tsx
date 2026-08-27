"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default function HistoriquePage() {
  const { history, hydrated } = useAppData();

  if (!hydrated) return null;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Historique" subtitle="Tous les cocktails que tu as préparés" />

      <div className="flex-1 px-5 pb-6">
        {history.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-10 text-center">
            <span className="text-3xl">📖</span>
            <p className="font-semibold">Rien préparé pour l&apos;instant</p>
            <p className="text-base text-muted-foreground">
              Chaque cocktail que tu prépares apparaîtra ici, avec la mise à jour de ta cave.
            </p>
            <Link href="/recettes" className="btn-primary mt-1 w-full">
              Voir des recettes
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {history.map((entry) => (
              <li key={entry.id} className="card">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-muted text-xl">
                    {entry.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      "🍸"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{entry.recipeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {dateFormatter.format(new Date(entry.madeAt))}
                    </p>
                  </div>
                </div>
                {entry.consumedMl.length > 0 && (
                  <ul className="mt-2 border-t border-border pt-2 text-sm text-muted-foreground">
                    {entry.consumedMl.map((c, i) => (
                      <li key={i}>
                        −{Math.round(c.ml)} ml de {c.bottleName}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
