import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWIC Project Tracker | Government Project Management & Infrastructure ERP",
  description:
    "Enterprise-grade Government Project Tracker for Water, Desalination, Effluent Treatment & Infrastructure Execution.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body className="h-full text-slate-800 bg-slate-50">{children}</body>
    </html>
  );
}
