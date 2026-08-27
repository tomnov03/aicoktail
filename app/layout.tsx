import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppDataProvider } from "@/hooks/useAppData";
import { BottomNav } from "@/components/BottomNav";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Coktail — ton assistant cocktails",
  description:
    "Trouve des recettes de cocktails avec les bouteilles que tu as déjà, et garde ta cave à jour automatiquement.",
  applicationName: "AI Coktail",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI Coktail",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#17110c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
