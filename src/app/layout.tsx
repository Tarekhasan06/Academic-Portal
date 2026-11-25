import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { getPortalData } from "@/lib/notion";

export const metadata: Metadata = {
  title: {
    default: "Winter 2026 Academic Portal",
    template: "%s | Winter 2026 Academic Portal",
  },
  description:
    "Modern academic portal powered by Notion for Winter 2026 coursework, assessments, class notes, resources, and progress tracking.",
};

export const revalidate = 300;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getPortalData();

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppShell records={data.records}>{children}</AppShell>
      </body>
    </html>
  );
}
