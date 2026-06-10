"use client"

import { useState, useEffect, useCallback } from "react"
import { GameBoard } from "./GameBoard"
import { GameKeyboard } from "./GameKeyboard"
import Link from "next/link"

export const WORD_LENGTH = 6
export const MAX_ATTEMPTS = 6

export type LetterState = "correct" | "present" | "absent"

export type GuessResult = {
  letters: string[]
  states: LetterState[]
}

function checkGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill("absent")
  const targetArr = target.split("")
  const guessArr = guess.split("")

  guessArr.forEach((ch, i) => {
    if (ch === targetArr[i]) {
      result[i] = "correct"
      targetArr[i] = "\0"
    }
  })

  guessArr.forEach((ch, i) => {
    if (result[i] === "correct") return
    const j = targetArr.indexOf(ch)
    if (j !== -1) {
      result[i] = "present"
      targetArr[j] = "\0"
    }
  })

  return result
}

async function fetchRandomWord(): Promise<string> {
  const res = await fetch(
    "https://raw.githubusercontent.com/words/an-array-of-french-words/master/index.json"
  )
  const words: string[] = await res.json()
  const pool = words.filter((w) => /^[a-z]{6}$/.test(w))
  return pool[Math.floor(Math.random() * pool.length)]
}

type GameStatus = "loading" | "playing" | "won" | "lost"

export function Game({ playerName }: { playerName?: string | null }) {
  const [status, setStatus] = useState<GameStatus>("loading")
  const [target, setTarget] = useState("")
  const [results, setResults] = useState<GuessResult[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [letterMap, setLetterMap] = useState<Record<string, LetterState>>({})
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState("")

  const showToast = (msg: string, ms = 2500) => {
    setToast(msg)
    setTimeout(() => setToast(""), ms)
  }

  const startGame = useCallback(async () => {
    setStatus("loading")
    setResults([])
    setLetterMap({})
    setToast("")
    const word = await fetchRandomWord()
    setTarget(word)
    setCurrentGuess(word[0])
    setStatus("playing")
  }, [])

  useEffect(() => {
    startGame()
  }, [startGame])

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true)
      showToast(`Le mot doit faire ${WORD_LENGTH} lettres`)
      setTimeout(() => setShake(false), 500)
      return
    }

    const states = checkGuess(currentGuess, target)
    const newResult: GuessResult = { letters: currentGuess.split(""), states }
    const newResults = [...results, newResult]

    const newMap = { ...letterMap }
    currentGuess.split("").forEach((ch, i) => {
      const prev = newMap[ch]
      const next = states[i]
      if (prev === "correct") return
      if (prev === "present" && next !== "correct") return
      newMap[ch] = next
    })

    setResults(newResults)
    setLetterMap(newMap)

    if (currentGuess === target) {
      setStatus("won")
      const msgs = ["Parfait !", "Excellent !", "Bravo !", "Bien joué !", "Ouf !", "Miracle !"]
      showToast(msgs[Math.min(newResults.length - 1, msgs.length - 1)], 4000)
      setCurrentGuess("")
    } else if (newResults.length >= MAX_ATTEMPTS) {
      setStatus("lost")
      showToast(`Le mot était : ${target.toUpperCase()}`, 4000)
      setCurrentGuess("")
    } else {
      setCurrentGuess(target[0])
    }
  }, [currentGuess, target, results, letterMap])

  const handleKey = useCallback(
    (key: string) => {
      if (status !== "playing") return
      if (key === "ENTER") {
        submitGuess()
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
      } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key.toLowerCase())
      }
    },
    [status, currentGuess, submitGuess]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      if (e.key === "Enter") handleKey("ENTER")
      else if (e.key === "Backspace") handleKey("BACKSPACE")
      else handleKey(e.key)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleKey])

  return (
    <div className="flex flex-col items-center flex-1 bg-zinc-950 text-white py-4 px-4">
      <header className="w-full max-w-lg flex items-center justify-between pb-4 mb-2 border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-indigo-400">Je</span>dumo
        </h1>
        <div className="flex items-center gap-4">
          {playerName && (
            <span className="text-sm text-zinc-400">Bonjour {playerName} 👋</span>
          )}
          <Link href="/jedumo/word" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Mots →
          </Link>
        </div>
      </header>

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl pointer-events-none">
          {toast}
        </div>
      )}

      {status === "loading" ? (
        <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">
          Chargement du mot…
        </div>
      ) : (
        <>
          <GameBoard
            results={results}
            currentGuess={currentGuess}
            maxAttempts={MAX_ATTEMPTS}
            wordLength={WORD_LENGTH}
            firstLetter={target[0] ?? ""}
            shake={shake}
            gameStatus={status as "playing" | "won" | "lost"}
          />

          {(status === "won" || status === "lost") && (
            <button
              onClick={startGame}
              className="mt-2 mb-4 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-sm font-semibold"
            >
              Rejouer
            </button>
          )}

          <GameKeyboard letterMap={letterMap} onKey={handleKey} />
        </>
      )}
    </div>
  )
}
