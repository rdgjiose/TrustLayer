import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustLayer",
  description: "Portable trading reputation infrastructure."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
