export function StockBar({ remainingMl, volumeMl }: { remainingMl: number; volumeMl: number }) {
  const pct = volumeMl > 0 ? Math.max(0, Math.min(100, (remainingMl / volumeMl) * 100)) : 0;
  const color = pct <= 15 ? "bg-danger" : pct <= 40 ? "bg-accent" : "bg-success";

  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {Math.round(remainingMl)} ml restants sur {Math.round(volumeMl)} ml
      </p>
    </div>
  );
}
