import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { getPortalData } from "@/lib/notion";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Winter 2026 · IPE Academic Portal",
    template: "%s · Winter 2026",
  },
  description:
    "What's due next for the Winter 2026 IPE section: quizzes, assignments, class notes, resources and progress, live from the class Notion board.",
};

export const viewport: Viewport = {
  themeColor: "#0d1b3d",
  width: "device-width",
  initialScale: 1,
};

export const revalidate = 300;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getPortalData();

  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased">
        <AppShell records={data.records} fetchedAt={data.fetchedAt}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
