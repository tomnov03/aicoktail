import type { Metadata, Viewport } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppDataProvider } from "@/hooks/useAppData";
import { BottomNav } from "@/components/BottomNav";
import { ToastProvider } from "@/components/Toast";

const fredoka = Fredoka({
  variable: "--font-display-raw",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body-raw",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Coktail — ton assistant cocktails",
  description:
    "Trouve des recettes de cocktails avec les bouteilles que tu as déjà, et garde ta cave à jour automatiquement.",
  applicationName: "AI Coktail",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Coktail",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fredoka.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppDataProvider>
          <ToastProvider>
            <div className="safe-top flex-1 flex flex-col pb-24">{children}</div>
            <BottomNav />
          </ToastProvider>
        </AppDataProvider>
      </body>
    </html>
  );
}
