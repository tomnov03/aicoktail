"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/Sheet";
import { ALCOHOL_CATEGORIES } from "@/lib/aliases";
import type { AlcoholCategoryId, Bottle } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Bottle | null;
  onSave: (data: {
    name: string;
    category: AlcoholCategoryId;
    volumeMl: number;
    remainingMl: number;
  }) => void;
  onDelete?: () => void;
}

export function BottleFormSheet({ open, onClose, initial, onSave, onDelete }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AlcoholCategoryId>("rhum_blanc");
  const [volumeMl, setVolumeMl] = useState(700);
  const [remainingMl, setRemainingMl] = useState(700);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setCategory(initial?.category ?? "rhum_blanc");
      setVolumeMl(initial?.volumeMl ?? 700);
      setRemainingMl(initial?.remainingMl ?? initial?.volumeMl ?? 700);
    }
  }, [open, initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || volumeMl <= 0) return;
    onSave({
      name: name.trim(),
      category,
      volumeMl,
      remainingMl: Math.min(remainingMl, volumeMl),
    });
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={initial ? "Modifier la bouteille" : "Ajouter une bouteille"}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="bottle-name">
            Nom de la bouteille
          </label>
          <input
            id="bottle-name"
            className="field-input"
            placeholder="Ex : Havana Club 3 ans"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="bottle-category">
            Type d&apos;alcool
          </label>
          <select
            id="bottle-category"
            className="field-input"
            value={category}
            onChange={(e) => setCategory(e.target.value as AlcoholCategoryId)}
          >
            {ALCOHOL_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="bottle-volume">
              Contenance (ml)
            </label>
            <input
              id="bottle-volume"
              type="number"
              min={1}
              className="field-input"
              value={volumeMl}
              onChange={(e) => setVolumeMl(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="bottle-remaining">
              Restant (ml)
            </label>
            <input
              id="bottle-remaining"
              type="number"
              min={0}
              className="field-input"
              value={remainingMl}
              onChange={(e) => setRemainingMl(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-2 w-full">
          Enregistrer
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full py-2 text-sm font-medium text-danger"
          >
            Supprimer cette bouteille
          </button>
        )}
      </form>
    </Sheet>
  );
}
