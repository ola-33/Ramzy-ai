import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAMZY AI | Penetration Testing Assistant",
  description: "A private AI workspace for authorized website and network penetration testing.",
  applicationName: "RAMZY AI",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#080b09"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
