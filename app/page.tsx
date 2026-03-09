"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  const [language, setLanguage] = useState("eng");

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      <HeroSection language={language} />
      <footer className="py-6 text-center text-xs text-muted-foreground">
        <p>A new word, every day.</p>
      </footer>
    </div>
  );
}
