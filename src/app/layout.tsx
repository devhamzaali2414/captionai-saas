import type { Metadata } from "next";
import LayoutShell from "@/components/LayoutShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaptionAI - AI Captions for Healthcare & Dental Practices",
  description: "Generate stunning, personalized social media captions in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
