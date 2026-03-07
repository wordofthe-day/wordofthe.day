// ---------------------------------------------------------------------------
// Mock data layer for Word of the Day
// ---------------------------------------------------------------------------
// This file provides mock data and a fetcher function.
// When you're ready to connect a real backend, swap the implementation of
// `getWordOfTheDay` to fetch from a CDN-hosted JSON file or an API endpoint.
// ---------------------------------------------------------------------------

export interface WordOfTheDay {
  /** ISO 639-1 language code */
  language: string;
  /** The featured word */
  word: string;
  /** IPA pronunciation string */
  pronunciation: string;
  /** Part of speech (noun, verb, adjective, etc.) */
  partOfSpeech: string;
  /** Short definition of the word */
  definition: string;
  /** Example sentence using the word */
  example: string;
  /** URL to an audio file of the pronunciation (optional) */
  audioUrl?: string;
  /** ISO date string for the day this word was featured */
  date: string;
}

// ---------------------------------------------------------------------------
// Mock data – one entry per supported language
// ---------------------------------------------------------------------------

const MOCK_WORDS: Record<string, WordOfTheDay> = {
  en: {
    language: "en",
    word: "Serendipity",
    pronunciation: "/\u02CCser\u0259n\u02C8dip\u0259d\u0113/",
    partOfSpeech: "noun",
    definition:
      "The occurrence of finding something valuable or pleasant by chance.",
    example:
      "Meeting her future cofounder at a coffee shop was pure serendipity.",
    audioUrl: "/audio/serendipity.mp3",
    date: new Date().toISOString().slice(0, 10),
  },
  es: {
    language: "es",
    word: "Madrugada",
    pronunciation: "/ma\u00F0\u027Eu\u02C8\u0263a\u00F0a/",
    partOfSpeech: "sustantivo",
    definition:
      "Periodo de tiempo comprendido entre la medianoche y el amanecer.",
    example: "Salieron de fiesta y no volvieron hasta la madrugada.",
    audioUrl: "/audio/madrugada.mp3",
    date: new Date().toISOString().slice(0, 10),
  },
  fr: {
    language: "fr",
    word: "D\u00E9paysement",
    pronunciation: "/de.pe.iz.m\u0251\u0303/",
    partOfSpeech: "nom",
    definition:
      "Le sentiment de d\u00E9sorientation ressenti dans un pays \u00E9tranger ou un environnement inconnu.",
    example:
      "Son premier voyage en Asie lui a procur\u00E9 un profond d\u00E9paysement.",
    audioUrl: "/audio/depaysement.mp3",
    date: new Date().toISOString().slice(0, 10),
  },
  de: {
    language: "de",
    word: "Fernweh",
    pronunciation: "/\u02C8f\u025B\u0281n\u02CCve\u02D0/",
    partOfSpeech: "Substantiv",
    definition:
      "Die Sehnsucht nach fernen L\u00E4ndern; das Gegenteil von Heimweh.",
    example:
      "\u00DCberall Fotos von Str\u00E4nden zu sehen gab ihr ein starkes Fernweh.",
    audioUrl: "/audio/fernweh.mp3",
    date: new Date().toISOString().slice(0, 10),
  },
  ja: {
    language: "ja",
    word: "\u6728\u6F0F\u308C\u65E5",
    pronunciation: "/ko.mo.\u027Ee.bi/",
    partOfSpeech: "\u540D\u8A5E",
    definition:
      "\u6728\u3005\u306E\u8449\u306E\u9699\u9593\u304B\u3089\u5DEE\u3057\u8FBC\u3080\u6728\u6F0F\u308C\u65E5\u306E\u3053\u3068\u3002",
    example:
      "\u516C\u5712\u3092\u6B69\u3044\u3066\u3044\u308B\u3068\u3001\u7F8E\u3057\u3044\u6728\u6F0F\u308C\u65E5\u304C\u9053\u3092\u7167\u3089\u3057\u3066\u3044\u305F\u3002",
    audioUrl: "/audio/komorebi.mp3",
    date: new Date().toISOString().slice(0, 10),
  },
};

// ---------------------------------------------------------------------------
// Supported languages (used by the LanguageSelector)
// ---------------------------------------------------------------------------

export interface Language {
  code: string;
  label: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Espa\u00F1ol" },
  { code: "fr", label: "Fran\u00E7ais" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "\u65E5\u672C\u8A9E" },
];

// ---------------------------------------------------------------------------
// Data fetcher
// ---------------------------------------------------------------------------
// Replace this implementation with a real fetch call when ready:
//
//   export async function getWordOfTheDay(lang: string): Promise<WordOfTheDay> {
//     const res = await fetch(`https://cdn.wordofthe.day/api/word?lang=${lang}`);
//     if (!res.ok) throw new Error("Failed to fetch word of the day");
//     return res.json();
//   }
// ---------------------------------------------------------------------------

export async function getWordOfTheDay(
  lang: string = "en"
): Promise<WordOfTheDay> {
  // Simulate a small network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const word = MOCK_WORDS[lang] ?? MOCK_WORDS["en"];
  return word;
}
