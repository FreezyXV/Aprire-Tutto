import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/500.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
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
  themeColor: "#f5f6f8",
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
