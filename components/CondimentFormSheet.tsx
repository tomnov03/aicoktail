"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/Sheet";
import { CONDIMENT_CATEGORIES } from "@/lib/aliases";
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

  return (
    <Sheet open={open} onClose={onClose} title="Ajouter un condiment">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="condiment-name">
            Nom
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
        <div>
          <label className="field-label" htmlFor="condiment-category">
            Catégorie
          </label>
          <select
            id="condiment-category"
            className="field-input"
            value={category}
            onChange={(e) => setCategory(e.target.value as CondimentCategoryId)}
          >
            {CONDIMENT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary mt-2 w-full">
          Ajouter
        </button>
      </form>
    </Sheet>
  );
}
