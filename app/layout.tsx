import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAMZY AI | Security Assistant",
  description: "A private AI workspace for authorized website and network security learning.",
  applicationName: "RAMZY AI",
  manifest: "/manifest.webmanifest",
  themeColor: "#080b09"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
