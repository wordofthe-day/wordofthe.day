// ---------------------------------------------------------------------------
// Data layer for Word of the Day
// ---------------------------------------------------------------------------
// Fetches from /prod.json (served from the public folder).
// The backend (GitHub Action) updates this file daily at 00:00 UTC.
// ---------------------------------------------------------------------------

export interface WordOfTheDay {
  language: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  audioUrl?: string;
  date: string;
}

// ---------------------------------------------------------------------------
// Supported languages (used by the LanguageSelector)
// ---------------------------------------------------------------------------

export interface Language {
  code: string;
  label: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "eng", label: "English" },
];

// ---------------------------------------------------------------------------
// Mapping from language codes to prod.json keys
// ---------------------------------------------------------------------------

const LANG_KEYS: Record<string, string> = {
  eng: "eng",
};

// ---------------------------------------------------------------------------
// Raw shape of prod.json entries
// ---------------------------------------------------------------------------

interface ProdWordEntry {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  dateUsed: number; // epoch seconds
  audioUrl?: string;
}

// ---------------------------------------------------------------------------
// Data fetcher
// ---------------------------------------------------------------------------

export async function getWordOfTheDay(
  lang: string = "eng"
): Promise<WordOfTheDay> {
  const res = await fetch("/prod.json");
  if (!res.ok) throw new Error("Failed to fetch word of the day");

  const data: Record<string, ProdWordEntry> = await res.json();

  const key = LANG_KEYS[lang] ?? "eng";
  const entry = data[key] ?? data["eng"];

  // Convert epoch seconds to YYYY-MM-DD
  const date = new Date(entry.dateUsed * 1000)
    .toISOString()
    .slice(0, 10);

  return {
    language: lang,
    word: entry.word,
    pronunciation: entry.pronunciation,
    partOfSpeech: entry.partOfSpeech,
    definition: entry.definition,
    examples: entry.examples,
    audioUrl: entry.audioUrl,
    date,
  };
}
