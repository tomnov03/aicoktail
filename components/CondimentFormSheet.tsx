"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/Sheet";
import { CONDIMENT_CATEGORIES, categoryEmoji } from "@/lib/aliases";
import type { CondimentCategoryId } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; category: CondimentCategoryId }) => void;
}

export function CondimentFormSheet({ open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CondimentCategoryId>("jus_citron_vert");

  useEffect(() => {
    if (open) {
      setName("");
      setCategory("jus_citron_vert");
    }
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), category });
    onClose();
  }

  function pick(c: CondimentCategoryId, label: string) {
    setCategory(c);
    if (!name.trim()) setName(label);
  }

  return (
    <Sheet open={open} onClose={onClose} title="Ajouter un condiment">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div>
          <span className="field-label">Qu&apos;as-tu ajouté ?</span>
          <div className="grid grid-cols-3 gap-2">
            {CONDIMENT_CATEGORIES.filter((c) => c.id !== "autre_condiment").map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pick(c.id as CondimentCategoryId, c.label)}
                className={`chip ${category === c.id ? "chip-selected" : ""}`}
              >
                <span className="text-xl leading-none">{categoryEmoji(c.id)}</span>
                <span className="leading-tight">{c.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => pick("autre_condiment", "")}
              className={`chip ${category === "autre_condiment" ? "chip-selected" : ""}`}
            >
              <span className="text-xl leading-none">🧺</span>
              <span className="leading-tight">Autre</span>
            </button>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="condiment-name">
            Nom (modifiable)
          </label>
          <input
            id="condiment-name"
            className="field-input"
            placeholder="Ex : Sirop de sucre de canne"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary mt-1 w-full py-3.5">
          🧺 Ajouter à ma cave
        </button>
      </form>
    </Sheet>
  );
}
