import type { LetterState } from "./Game"

const ROWS = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["ENTER", "W", "X", "C", "V", "B", "N", "⌫"],
]

type Props = {
  letterMap: Record<string, LetterState>
  onKey: (key: string) => void
}

function keyClass(key: string, state: LetterState | undefined): string {
  const base = "h-12 rounded font-semibold text-sm transition-colors select-none active:scale-95"
  const special = "px-3 min-w-14 bg-zinc-600 hover:bg-zinc-500 text-white"
  const isSpecial = key === "ENTER" || key === "⌫"

  if (isSpecial) return `${base} ${special}`
  if (state === "correct") return `${base} w-9 bg-indigo-600 text-white`
  if (state === "present") return `${base} w-9 bg-amber-500 text-white`
  if (state === "absent") return `${base} w-9 bg-zinc-700 text-zinc-500`
  return `${base} w-9 bg-zinc-600 hover:bg-zinc-500 text-white`
}

export function GameKeyboard({ letterMap, onKey }: Props) {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-lg mt-4">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKey(key === "⌫" ? "BACKSPACE" : key)}
              className={keyClass(key, letterMap[key.toLowerCase()])}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
