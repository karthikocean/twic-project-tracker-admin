import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWIC Project ERP | Government Project Management & Infrastructure ERP",
  description:
    "Enterprise-grade Government Project Tracker for Water, Desalination, Effluent Treatment & Infrastructure Execution.",
  icons: {
    icon: "/twic-logo.png",
    shortcut: "/twic-logo.png",
    apple: "/twic-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased" suppressHydrationWarning>
      <body className="h-full text-slate-800 bg-slate-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
