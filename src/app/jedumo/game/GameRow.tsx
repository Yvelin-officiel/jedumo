import type { LetterState } from "./Game"

type Props = {
  letters: string[]
  states?: LetterState[]
  isActive: boolean
  isHintRow: boolean
  shake: boolean
}

function cellClass(
  letter: string,
  state: LetterState | undefined,
  isActive: boolean,
  isHintRow: boolean,
  index: number
): string {
  if (state === "correct") return "bg-indigo-600 border-indigo-600 text-white scale-105"
  if (state === "present") return "bg-amber-500 border-amber-500 text-white"
  if (state === "absent") return "bg-zinc-700 border-zinc-700 text-zinc-400"
  if (letter && isActive) return "border-zinc-300 text-white bg-zinc-800"
  if (isHintRow && index === 0 && letter) return "border-indigo-700 text-indigo-400 bg-zinc-900"
  return "border-zinc-700 text-transparent bg-transparent"
}

export function GameRow({ letters, states, isActive, isHintRow, shake }: Props) {
  return (
    <div className={`flex gap-1.5 ${shake ? "animate-shake" : ""}`}>
      {letters.map((letter, i) => (
        <div
          key={i}
          className={`w-12 h-12 flex items-center justify-center border-2 rounded font-bold text-lg uppercase transition-all duration-150 ${cellClass(letter, states?.[i], isActive, isHintRow, i)}`}
        >
          {letter}
        </div>
      ))}
    </div>
  )
}
