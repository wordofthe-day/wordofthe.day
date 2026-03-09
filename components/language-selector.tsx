"use client";

import { Languages, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/data";

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const current: Language | undefined = SUPPORTED_LANGUAGES.find(
    (l) => l.code === value
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            aria-label="Select language"
          />
        }
      >
        <Languages className="size-4" />
        <span className="hidden sm:inline">
          {current?.label ?? "English"}
        </span>
        <span className="sm:hidden uppercase">{value}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => onChange(lang.code)}
            className={value === lang.code ? "font-semibold" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <a
            href="https://github.com/wordofthe-day/wordofthe.day/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center px-1.5 py-1 text-muted-foreground"
          >
            <Plus className="size-3.5 mr-1.5" />
            Request a language
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
