"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { WordOfTheDay } from "@/lib/data";
import {
  Shuffle,
  BookOpen,
  Zap,
  Brain,
  ChevronDown,
  RotateCcw,
  Trophy,
  Check,
  X,
} from "lucide-react";

/* ─── constants ─── */

const FUN_COLORS = ["#F472B6", "#6EE7B7", "#FDBA74", "#C4B5FD", "#FDE047", "#67E8F9"];

const GAME_HEADERS: { icon: typeof Shuffle; title: string; color: string; colorDark: string }[] = [
  { icon: Shuffle, title: "Scramble Challenge", color: "#F472B6", colorDark: "#EC4899" },
  { icon: BookOpen, title: "Definition Duel", color: "#C4B5FD", colorDark: "#A78BFA" },
  { icon: Zap, title: "Speed Type", color: "#FDE047", colorDark: "#FACC15" },
  { icon: Brain, title: "Letter Memory", color: "#67E8F9", colorDark: "#22D3EE" },
];

const FAKE_DEFINITIONS = [
  "A state of profound tranquility achieved through sustained contemplation",
  "The practice of arranging objects in a symmetrical pattern for decorative purposes",
  "An ancient technique for preserving food using natural mineral salts",
  "The sudden onset of clarity following a period of confusion",
  "A decorative motif found in Renaissance architecture",
  "The quality of being excessively meticulous about small details",
  "A rhythmic pattern used in traditional folk music compositions",
  "The tendency to seek comfort in familiar surroundings",
  "A botanical term for the first bloom of a perennial plant",
  "The process of gradually adapting to a new cultural environment",
  "An obsolete unit of measurement once used by cartographers",
  "The characteristic sound produced by certain wind instruments",
  "A philosophical concept relating to the nature of time",
  "The practice of using color to influence mood and behavior",
  "A geological formation created by ancient volcanic activity",
  "The art of crafting intricate designs from woven materials",
  "A medical term for the involuntary repetition of gestures",
  "The study of linguistic patterns across different cultures",
  "A culinary technique involving slow reduction of aromatic liquids",
  "The phenomenon of perceiving patterns in random stimuli",
];

/* ─── seeded random ─── */

function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i);
  }
  return function () {
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = h ^ (h >>> 16);
    return (h >>> 0) / 0xffffffff;
  };
}

function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── localStorage helpers ─── */

function getStored(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStored(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

/* ─── GameCard wrapper ─── */

function GameCard({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const header = GAME_HEADERS[index];
  const Icon = header.icon;

  return (
    <Card className="w-full border-3 border-black/10 shadow-[4px_6px_0_rgba(0,0,0,0.12)] dark:border-white/10 dark:shadow-[4px_6px_0_rgba(255,255,255,0.06)] ring-0 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer text-left transition-colors hover:opacity-90"
        style={{ backgroundColor: header.color }}
      >
        <span className="dark:hidden flex items-center gap-3 flex-1">
          <Icon className="size-5" style={{ color: "#1a1a1a" }} />
          <span
            className="text-lg font-bold"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              color: "#1a1a1a",
            }}
          >
            {header.title}
          </span>
        </span>
        <span className="hidden dark:flex items-center gap-3 flex-1">
          <Icon className="size-5" style={{ color: "#1a1a1a" }} />
          <span
            className="text-lg font-bold"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              color: "#1a1a1a",
            }}
          >
            {header.title}
          </span>
        </span>
        <ChevronDown
          className="size-5 transition-transform duration-300"
          style={{
            color: "#1a1a1a",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <CardContent className="p-5 sm:p-6 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════
   GAME 1: Scramble Challenge
   ═══════════════════════════════════════ */

function ScrambleGame({ word }: { word: WordOfTheDay }) {
  const letters = word.word.toUpperCase().split("");
  const rng = useCallback(() => seededRandom(word.date + "-scramble-" + Date.now()), [word.date]);

  const [scrambled, setScrambled] = useState<{ char: string; id: number }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [won, setWon] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);

  const initScramble = useCallback(() => {
    const r = seededRandom(word.date + "-scramble-" + Math.random());
    const items = letters.map((c, i) => ({ char: c, id: i }));
    setScrambled(shuffleArray(items, r));
    setSelected([]);
    setWon(false);
    setWrongShake(false);
  }, [word.date, letters]);

  useEffect(() => {
    initScramble();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.date]);

  const handleTileClick = (id: number) => {
    if (won || selected.includes(id)) return;
    const next = [...selected, id];
    setSelected(next);

    const currentStr = next.map((sid) => scrambled.find((s) => s.id === sid)!.char).join("");
    const target = word.word.toUpperCase();

    if (currentStr.length === target.length) {
      if (currentStr === target) {
        setWon(true);
      } else {
        setWrongShake(true);
        setTimeout(() => {
          setSelected([]);
          setWrongShake(false);
        }, 600);
      }
    } else {
      // Check partial match
      if (target[next.length - 1] !== currentStr[currentStr.length - 1]) {
        setWrongShake(true);
        setTimeout(() => {
          setSelected([]);
          setWrongShake(false);
        }, 600);
      }
    }
  };

  const selectedChars = selected.map((sid) => scrambled.find((s) => s.id === sid)!.char);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Answer area */}
      <div className="flex flex-wrap gap-2 justify-center min-h-[3.5rem]">
        {letters.map((_, i) => (
          <div
            key={i}
            className={`letter-tile ${wrongShake ? "animate-shake" : ""} ${won && selectedChars[i] ? "animate-bounce-celebrate" : ""}`}
            style={{
              backgroundColor: selectedChars[i]
                ? won
                  ? "#6EE7B7"
                  : FUN_COLORS[i % FUN_COLORS.length]
                : "rgba(0,0,0,0.06)",
              color: selectedChars[i] ? "#1a1a1a" : "transparent",
              width: "2.5rem",
              height: "3rem",
              fontSize: "1.25rem",
              "--tile-rotate": "0deg",
              transform: "rotate(0deg)",
            } as React.CSSProperties}
          >
            {selectedChars[i] || "·"}
          </div>
        ))}
      </div>

      {/* Confetti */}
      {won && (
        <div className="game-confetti-container">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="game-confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: FUN_COLORS[i % FUN_COLORS.length],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random() * 1}s`,
              }}
            />
          ))}
          <p
            className="text-center text-lg font-bold mt-2"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            🎉 You got it!
          </p>
        </div>
      )}

      {/* Scrambled tiles */}
      {!won && (
        <div className="flex flex-wrap gap-2 justify-center">
          {scrambled.map((item) => {
            const isSelected = selected.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleTileClick(item.id)}
                disabled={isSelected}
                className="letter-tile transition-all cursor-pointer"
                style={{
                  backgroundColor: isSelected
                    ? "rgba(0,0,0,0.05)"
                    : FUN_COLORS[item.id % FUN_COLORS.length],
                  color: isSelected ? "transparent" : "#1a1a1a",
                  opacity: isSelected ? 0.3 : 1,
                  "--tile-rotate": "0deg",
                  transform: isSelected ? "scale(0.9)" : "rotate(0deg)",
                } as React.CSSProperties}
              >
                {item.char}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={initScramble}>
          <Shuffle className="size-3.5 mr-1" />
          {won ? "Play Again" : "Shuffle"}
        </Button>
        {selected.length > 0 && !won && (
          <Button variant="outline" size="sm" onClick={() => setSelected([])}>
            <RotateCcw className="size-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GAME 2: Definition Duel
   ═══════════════════════════════════════ */

function DefinitionDuel({ word }: { word: WordOfTheDay }) {
  const rng = useMemo(() => seededRandom(word.date + "-defduel"), [word.date]);

  const options = useMemo(() => {
    const r = rng;
    const fakes = shuffleArray(FAKE_DEFINITIONS, r).slice(0, 3);
    const all = [word.definition, ...fakes].map((def, i) => ({
      text: def,
      correct: i === 0,
      id: i,
    }));
    return shuffleArray(all, r);
  }, [word.definition, rng]);

  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const stored = getStored("wotd-def-streak");
    const storedDate = getStored("wotd-def-streak-date");
    if (stored && storedDate) {
      setStreak(parseInt(stored, 10) || 0);
    }
  }, []);

  const handlePick = (id: number) => {
    if (picked !== null) return;
    setPicked(id);
    const opt = options.find((o) => o.id === id)!;
    if (opt.correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setStored("wotd-def-streak", String(newStreak));
      setStored("wotd-def-streak-date", word.date);
    } else {
      setStreak(0);
      setStored("wotd-def-streak", "0");
      setStored("wotd-def-streak-date", word.date);
    }
  };

  const getOptionStyle = (opt: { correct: boolean; id: number }) => {
    if (picked === null) return {};
    if (opt.id === picked && opt.correct) return { borderColor: "#6EE7B7", backgroundColor: "rgba(110,231,183,0.15)" };
    if (opt.id === picked && !opt.correct) return { borderColor: "#F472B6", backgroundColor: "rgba(244,114,182,0.15)" };
    if (opt.correct && picked !== null) return { borderColor: "#6EE7B7", backgroundColor: "rgba(110,231,183,0.08)" };
    return { opacity: 0.5 };
  };

  const getOptionClass = (opt: { correct: boolean; id: number }) => {
    if (picked === null) return "hover:border-foreground/30";
    if (opt.id === picked && opt.correct) return "animate-bounce-sm";
    if (opt.id === picked && !opt.correct) return "animate-shake";
    return "";
  };

  return (
    <div className="flex flex-col gap-3">
      {streak > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Trophy className="size-4" style={{ color: "#FDE047" }} />
          <span>Streak: {streak}</span>
        </div>
      )}

      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => handlePick(opt.id)}
          className={`w-full text-left p-4 rounded-xl border-2 border-border transition-all cursor-pointer ${getOptionClass(opt)}`}
          style={getOptionStyle(opt)}
          disabled={picked !== null}
        >
          <div className="flex items-start gap-2">
            {picked !== null && opt.correct && (
              <Check className="size-4 mt-0.5 shrink-0" style={{ color: "#6EE7B7" }} />
            )}
            {picked !== null && opt.id === picked && !opt.correct && (
              <X className="size-4 mt-0.5 shrink-0" style={{ color: "#F472B6" }} />
            )}
            <span className="text-sm leading-relaxed">{opt.text}</span>
          </div>
        </button>
      ))}

      {picked !== null && (
        <p
          className="text-center text-sm font-medium mt-1"
          style={{
            color: options.find((o) => o.id === picked)!.correct ? "#6EE7B7" : "#F472B6",
          }}
        >
          {options.find((o) => o.id === picked)!.correct
            ? "🎉 Correct!"
            : `❌ The right answer was highlighted above.`}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   GAME 3: Speed Type
   ═══════════════════════════════════════ */

function SpeedType({ word }: { word: WordOfTheDay }) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const target = word.word.toLowerCase();

  useEffect(() => {
    const stored = getStored(`wotd-speed-best-${word.date}`);
    if (stored) setBestTime(parseInt(stored, 10));
  }, [word.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (endTime) return;

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    setInput(val);

    if (val.toLowerCase() === target) {
      const elapsed = Date.now() - (startTime || Date.now());
      setEndTime(elapsed);
      if (!bestTime || elapsed < bestTime) {
        setBestTime(elapsed);
        setStored(`wotd-speed-best-${word.date}`, String(elapsed));
      }
    }
  };

  const reset = () => {
    setInput("");
    setStartTime(null);
    setEndTime(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Character display */}
      <div className="flex flex-wrap gap-1 justify-center">
        {target.split("").map((char, i) => {
          const typed = input[i]?.toLowerCase();
          let bg = "rgba(0,0,0,0.06)";
          let color = "transparent";
          if (typed !== undefined) {
            if (typed === char) {
              bg = "rgba(110,231,183,0.3)";
              color = "#059669";
            } else {
              bg = "rgba(244,114,182,0.3)";
              color = "#DB2777";
            }
          }
          return (
            <span
              key={i}
              className="inline-flex items-center justify-center rounded-lg font-bold text-lg uppercase"
              style={{
                width: "2.2rem",
                height: "2.8rem",
                backgroundColor: bg,
                color,
                fontFamily: "var(--font-fraunces), Georgia, serif",
                transition: "all 0.15s ease",
              }}
            >
              {typed || char}
            </span>
          );
        })}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        disabled={endTime !== null}
        placeholder="Start typing..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full max-w-xs text-center text-lg px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-foreground/30 transition-colors"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      />

      {/* Results */}
      {endTime !== null && (
        <div className="text-center animate-in fade-in-0 zoom-in-95 duration-300">
          <p
            className="text-2xl font-bold"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              color: "#6EE7B7",
            }}
          >
            ⚡ {endTime}ms
          </p>
          {bestTime !== null && (
            <p className="text-sm text-muted-foreground mt-1">
              <Trophy className="size-3.5 inline mr-1" style={{ color: "#FDE047" }} />
              Best today: {bestTime}ms
            </p>
          )}
        </div>
      )}

      {endTime !== null && (
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="size-3.5 mr-1" />
          Try Again
        </Button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   GAME 4: Letter Memory
   ═══════════════════════════════════════ */

type Difficulty = "easy" | "medium" | "hard";
const DIFFICULTY_TIMES: Record<Difficulty, number> = { easy: 3000, medium: 2000, hard: 1000 };
const DIFFICULTY_LABELS: Record<Difficulty, string> = { easy: "Easy (3s)", medium: "Medium (2s)", hard: "Hard (1s)" };
const DIFF_COLORS: Record<Difficulty, string> = { easy: "#6EE7B7", medium: "#FDE047", hard: "#F472B6" };

function LetterMemory({ word }: { word: WordOfTheDay }) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [phase, setPhase] = useState<"idle" | "showing" | "hidden" | "result">("idle");
  const [input, setInput] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const target = word.word.toLowerCase();

  const start = () => {
    setPhase("showing");
    setInput("");
    setScore(null);
    setTimeout(() => {
      setPhase("hidden");
      setTimeout(() => inputRef.current?.focus(), 100);
    }, DIFFICULTY_TIMES[difficulty]);
  };

  const submit = () => {
    const typed = input.toLowerCase();
    let correct = 0;
    for (let i = 0; i < target.length; i++) {
      if (typed[i] === target[i]) correct++;
    }
    setScore(correct);
    setPhase("result");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && phase === "hidden") {
      submit();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Difficulty selector */}
      <div className="flex gap-2">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => {
              setDifficulty(d);
              if (phase !== "showing") setPhase("idle");
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border-2 transition-all cursor-pointer"
            style={{
              borderColor: difficulty === d ? DIFF_COLORS[d] : "transparent",
              backgroundColor: difficulty === d ? `${DIFF_COLORS[d]}20` : "transparent",
              color: difficulty === d ? DIFF_COLORS[d] : undefined,
            }}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Word display area */}
      <div className="min-h-[4rem] flex items-center justify-center">
        {phase === "idle" && (
          <Button variant="outline" onClick={start}>
            <Brain className="size-4 mr-1.5" />
            Start Challenge
          </Button>
        )}
        {phase === "showing" && (
          <div className="flex flex-wrap gap-2 justify-center animate-in fade-in-0 zoom-in-95 duration-200">
            {target.split("").map((char, i) => (
              <div
                key={i}
                className="letter-tile"
                style={{
                  backgroundColor: FUN_COLORS[i % FUN_COLORS.length],
                  color: "#1a1a1a",
                  "--tile-rotate": "0deg",
                  transform: "rotate(0deg)",
                  animationDelay: `${i * 0.05}s`,
                } as React.CSSProperties}
              >
                {char.toUpperCase()}
              </div>
            ))}
          </div>
        )}
        {phase === "hidden" && (
          <div className="flex flex-col items-center gap-3 w-full animate-in fade-in-0 duration-300">
            <p className="text-sm text-muted-foreground">Type the word from memory!</p>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Type here..."
              className="w-full max-w-xs text-center text-lg px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-foreground/30 transition-colors"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            />
            <Button variant="outline" size="sm" onClick={submit}>
              <Check className="size-3.5 mr-1" />
              Submit
            </Button>
          </div>
        )}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Show comparison */}
            <div className="flex flex-wrap gap-1 justify-center">
              {target.split("").map((char, i) => {
                const typed = input.toLowerCase()[i];
                const isCorrect = typed === char;
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center justify-center rounded-lg font-bold text-lg uppercase ${isCorrect ? "animate-bounce-sm" : "animate-shake"}`}
                    style={{
                      width: "2.2rem",
                      height: "2.8rem",
                      backgroundColor: isCorrect ? "rgba(110,231,183,0.3)" : "rgba(244,114,182,0.3)",
                      color: isCorrect ? "#059669" : "#DB2777",
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
            <p
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {score === target.length
                ? "🎉 Perfect!"
                : `${score}/${target.length} correct`}
            </p>
            <Button variant="outline" size="sm" onClick={start}>
              <RotateCcw className="size-3.5 mr-1" />
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN: GamesSection
   ═══════════════════════════════════════ */

interface GamesSectionProps {
  word: WordOfTheDay;
}

export function GamesSection({ word }: GamesSectionProps) {
  return (
    <div className="w-full max-w-xl mt-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
      <h2
        className="text-center text-2xl font-bold mb-6"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        🎮 Play with today&apos;s word
      </h2>

      <div className="flex flex-col gap-4">
        <GameCard index={0}>
          <ScrambleGame word={word} />
        </GameCard>
        <GameCard index={1}>
          <DefinitionDuel word={word} />
        </GameCard>
        <GameCard index={2}>
          <SpeedType word={word} />
        </GameCard>
        <GameCard index={3}>
          <LetterMemory word={word} />
        </GameCard>
      </div>
    </div>
  );
}
