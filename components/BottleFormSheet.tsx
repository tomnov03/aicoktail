"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/Sheet";
import { ALCOHOL_CATEGORIES, categoryEmoji } from "@/lib/aliases";
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

const VOLUME_PRESETS = [350, 500, 700, 750, 1000];

export function BottleFormSheet({ open, onClose, initial, onSave, onDelete }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AlcoholCategoryId>("rhum_blanc");
  const [volumeMl, setVolumeMl] = useState(700);
  const [customVolume, setCustomVolume] = useState(false);
  const [remainingMl, setRemainingMl] = useState(700);
  const [fullBottle, setFullBottle] = useState(true);

  useEffect(() => {
    if (open) {
      const vol = initial?.volumeMl ?? 700;
      setName(initial?.name ?? "");
      setCategory(initial?.category ?? "rhum_blanc");
      setVolumeMl(vol);
      setCustomVolume(!VOLUME_PRESETS.includes(vol));
      setRemainingMl(initial?.remainingMl ?? vol);
      setFullBottle(initial ? initial.remainingMl >= initial.volumeMl : true);
    }
  }, [open, initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || volumeMl <= 0) return;
    onSave({
      name: name.trim(),
      category,
      volumeMl,
      remainingMl: Math.min(fullBottle ? volumeMl : remainingMl, volumeMl),
    });
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={initial ? "Modifier la bouteille" : "Ajouter une bouteille"}>
      <form onSubmit={submit} className="flex flex-col gap-5">
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
            autoFocus
          />
        </div>

        <div>
          <span className="field-label">Type d&apos;alcool</span>
          <div className="grid grid-cols-3 gap-2">
            {ALCOHOL_CATEGORIES.filter((c) => c.id !== "autre_alcool").map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id as AlcoholCategoryId)}
                className={`chip ${category === c.id ? "chip-selected" : ""}`}
              >
                <span className="text-xl leading-none">{categoryEmoji(c.id)}</span>
                <span className="leading-tight">{c.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCategory("autre_alcool")}
              className={`chip ${category === "autre_alcool" ? "chip-selected" : ""}`}
            >
              <span className="text-xl leading-none">🍾</span>
              <span className="leading-tight">Autre</span>
            </button>
          </div>
        </div>

        <div>
          <span className="field-label">Contenance</span>
          <div className="flex flex-wrap gap-2">
            {VOLUME_PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setVolumeMl(v);
                  setCustomVolume(false);
                }}
                className={`chip flex-row! px-3.5 py-2 ${
                  !customVolume && volumeMl === v ? "chip-selected" : ""
                }`}
              >
                {v >= 1000 ? `${v / 1000} L` : `${v} ml`}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCustomVolume(true)}
              className={`chip flex-row! px-3.5 py-2 ${customVolume ? "chip-selected" : ""}`}
            >
              Autre
            </button>
          </div>
          {customVolume && (
            <input
              type="number"
              min={1}
              className="field-input mt-2"
              placeholder="Contenance en ml"
              value={volumeMl}
              onChange={(e) => setVolumeMl(Number(e.target.value) || 0)}
              autoFocus
            />
          )}
        </div>

        <div>
          <span className="field-label">Niveau actuel</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFullBottle(true)}
              className={`chip flex-row! flex-1 px-3.5 py-2 ${fullBottle ? "chip-selected" : ""}`}
            >
              🆕 Pleine
            </button>
            <button
              type="button"
              onClick={() => setFullBottle(false)}
              className={`chip flex-row! flex-1 px-3.5 py-2 ${!fullBottle ? "chip-selected" : ""}`}
            >
              🍶 Entamée
            </button>
          </div>
          {!fullBottle && (
            <div className="mt-3">
              <input
                type="range"
                min={0}
                max={volumeMl}
                step={10}
                value={Math.min(remainingMl, volumeMl)}
                onChange={(e) => setRemainingMl(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <p className="mt-1 text-center text-base text-muted-foreground">
                {Math.round(Math.min(remainingMl, volumeMl))} ml restants sur {volumeMl} ml
              </p>
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary mt-1 w-full py-3.5">
          {initial ? "Enregistrer" : "🍾 Ajouter à ma cave"}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full py-2 text-base font-medium text-danger"
          >
            Supprimer cette bouteille
          </button>
        )}
      </form>
    </Sheet>
  );
}
