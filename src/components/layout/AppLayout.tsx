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

      {/* Main Full-Width Content Viewport */}
      <main className="flex-1 w-full p-4 md:p-5 lg:p-6">
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
