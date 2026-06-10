import { GameRow } from "./GameRow"
import type { GuessResult, LetterState } from "./Game"

type Props = {
  results: GuessResult[]
  currentGuess: string
  maxAttempts: number
  wordLength: number
  firstLetter: string
  shake: boolean
  gameStatus: "playing" | "won" | "lost"
}

export function GameBoard({
  results,
  currentGuess,
  maxAttempts,
  wordLength,
  firstLetter,
  shake,
  gameStatus,
}: Props) {
  return (
    <div className="flex flex-col gap-1.5 my-4">
      {Array(maxAttempts)
        .fill(null)
        .map((_, rowIndex) => {
          const result = results[rowIndex]
          const isCurrentRow = rowIndex === results.length && gameStatus === "playing"
          const isHintRow = !result && !isCurrentRow

          let letters: string[]
          let states: LetterState[] | undefined

          if (result) {
            letters = result.letters
            states = result.states
          } else if (isCurrentRow) {
            const filled = currentGuess.split("")
            letters = [...filled, ...Array(wordLength - filled.length).fill("")]
          } else {
            letters = [firstLetter, ...Array(wordLength - 1).fill("")]
          }

          return (
            <GameRow
              key={rowIndex}
              letters={letters}
              states={states}
              isActive={isCurrentRow}
              isHintRow={isHintRow}
              shake={isCurrentRow && shake}
            />
          )
        })}
    </div>
  )
}
