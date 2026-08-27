"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StockBar } from "@/components/StockBar";
import { BottleFormSheet } from "@/components/BottleFormSheet";
import { CondimentFormSheet } from "@/components/CondimentFormSheet";
import { useAppData } from "@/hooks/useAppData";
import { categoryLabel } from "@/lib/aliases";
import type { Bottle } from "@/lib/types";

type Tab = "bouteilles" | "condiments";

export default function CavePage() {
  const {
    bottles,
    condiments,
    hydrated,
    addBottle,
    updateBottle,
    removeBottle,
    addCondiment,
    removeCondiment,
  } = useAppData();
  const [tab, setTab] = useState<Tab>("bouteilles");
  const [bottleSheetOpen, setBottleSheetOpen] = useState(false);
  const [condimentSheetOpen, setCondimentSheetOpen] = useState(false);
  const [editingBottle, setEditingBottle] = useState<Bottle | null>(null);

  if (!hydrated) return null;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Ma cave" subtitle="Ce que tu as vraiment chez toi" />

      <div className="mx-5 mb-4 flex gap-2 rounded-2xl bg-surface-muted p-1">
        <TabButton active={tab === "bouteilles"} onClick={() => setTab("bouteilles")}>
          Bouteilles ({bottles.length})
        </TabButton>
        <TabButton active={tab === "condiments"} onClick={() => setTab("condiments")}>
          Condiments ({condiments.length})
        </TabButton>
      </div>

      <div className="flex-1 px-5 pb-6">
        {tab === "bouteilles" ? (
          <>
            <button
              onClick={() => {
                setEditingBottle(null);
                setBottleSheetOpen(true);
              }}
              className="btn-primary mb-4 w-full"
            >
              + Ajouter une bouteille
            </button>
            {bottles.length === 0 ? (
              <EmptyHint text="Aucune bouteille pour l'instant." />
            ) : (
              <ul className="flex flex-col gap-3">
                {bottles.map((b) => (
                  <li key={b.id}>
                    <button
                      className="card w-full text-left"
                      onClick={() => {
                        setEditingBottle(b);
                        setBottleSheetOpen(true);
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{b.name}</p>
                          <p className="text-xs text-muted-foreground">{categoryLabel(b.category)}</p>
                        </div>
                        {b.remainingMl <= 0 && (
                          <span className="shrink-0 rounded-full bg-danger/15 px-2 py-0.5 text-xs font-medium text-danger">
                            Vide
                          </span>
                        )}
                      </div>
                      <StockBar remainingMl={b.remainingMl} volumeMl={b.volumeMl} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <button onClick={() => setCondimentSheetOpen(true)} className="btn-primary mb-4 w-full">
              + Ajouter un condiment
            </button>
            {condiments.length === 0 ? (
              <EmptyHint text="Aucun condiment enregistré." />
            ) : (
              <ul className="flex flex-col gap-2">
                {condiments.map((c) => (
                  <li key={c.id} className="card flex items-center justify-between">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{categoryLabel(c.category)}</p>
                    </div>
                    <button
                      onClick={() => removeCondiment(c.id)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-surface-muted"
                      aria-label={`Supprimer ${c.name}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <BottleFormSheet
        open={bottleSheetOpen}
        onClose={() => setBottleSheetOpen(false)}
        initial={editingBottle}
        onSave={(data) => {
          if (editingBottle) updateBottle(editingBottle.id, data);
          else addBottle(data);
        }}
        onDelete={editingBottle ? () => removeBottle(editingBottle.id) : undefined}
      />
      <CondimentFormSheet
        open={condimentSheetOpen}
        onClose={() => setCondimentSheetOpen(false)}
        onSave={addCondiment}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
        active ? "bg-surface text-accent-strong shadow-sm" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="card flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
      <span className="text-3xl">🗄️</span>
      {text}
    </div>
  );
}
