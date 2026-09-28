"use client";

import React from "react";
import { TopNavigationBar } from "./TopNavigationBar";
import { ModuleProvider } from "@/context/ModuleContext";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 overflow-x-hidden font-sans antialiased text-slate-800">
      {/* MCA Government Style Top Navigation Bar */}
      <TopNavigationBar />

      {/* Main Full-Width Content Viewport - Space-optimized for enterprise ERP data tables */}
      <main className="flex-1 w-full px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ModuleProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </ModuleProvider>
  );
}
