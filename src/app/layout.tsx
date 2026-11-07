import type { Metadata, Viewport } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/400-italic.css";
import "./globals.css";
import { ServiceWorker } from "@/components/service-worker";
export const metadata: Metadata = {
  title: "Aprire Tutto — Ouvre tes horizons",
  description:
    "Ton espace pour comprendre, pratiquer et retenir. Un sujet, un parcours, à ton rythme.",
  applicationName: "Aprire Tutto",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aprire Tutto",
  },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f7f1",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
