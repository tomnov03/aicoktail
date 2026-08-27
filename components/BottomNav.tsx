"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Accueil", icon: HomeIcon },
  { href: "/cave", label: "Ma cave", icon: BottleIcon },
  { href: "/recettes", label: "Recettes", icon: GlassIcon },
  { href: "/historique", label: "Historique", icon: ClockIcon },
  { href: "/parametres", label: "Réglages", icon: GearIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors ${
                  active ? "text-accent-strong" : "text-muted-foreground"
                }`}
              >
                <Icon active={active} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function iconProps(active: boolean) {
  return {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: active ? 2.4 : 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function BottleIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M10 2h4" />
      <path d="M10 2v4.5L7.5 9.8A4 4 0 0 0 6.7 12v7.5A2.5 2.5 0 0 0 9.2 22h5.6a2.5 2.5 0 0 0 2.5-2.5V12a4 4 0 0 0-.8-2.2L14 6.5V2" />
      <path d="M7 15h10" />
    </svg>
  );
}

function GlassIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M5 4h14l-6.2 7.8v6.7h3.2M12.8 18.5H8.8" />
      <path d="M5 4l6.5 8.2" />
    </svg>
  );
}

function ClockIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function GearIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.4 1a7.7 7.7 0 0 0-1.7-1L15 3.5H9l-.3 2.6a7.7 7.7 0 0 0-1.7 1l-2.4-1-2 3.4L4.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.7 7.7 0 0 0 1.7 1l.3 2.6h6l.3-2.6a7.7 7.7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5Z" />
    </svg>
  );
}
