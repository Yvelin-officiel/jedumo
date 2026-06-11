"use client"

import { useState, useEffect, useCallback } from "react"
import { GameBoard } from "./GameBoard"
import { GameKeyboard } from "./GameKeyboard"
import Link from "next/link"
import { signOut } from "next-auth/react"

export const MAX_ATTEMPTS = 6

export type LetterState = "correct" | "present" | "absent"

export type GuessResult = {
  letters: string[]
  states: LetterState[]
}

function checkGuess(
  guess: string,
  target: string,
  wordLength: number
): LetterState[] {
  const result: LetterState[] = Array(wordLength).fill("absent")
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

async function fetchWordPool(): Promise<string[]> {
  const res = await fetch(
    "https://raw.githubusercontent.com/words/an-array-of-french-words/master/index.json"
  )
  const words: string[] = await res.json()
  return words.filter((w) => /^[a-z]{2,10}$/.test(w))
}

function pickWord(pool: string[]): { word: string; length: number } {
  const min = pool.reduce((m, w) => Math.min(m, w.length), Infinity)
  const max = pool.reduce((m, w) => Math.max(m, w.length), 0)
  const length = Math.floor(Math.random() * (max - min + 1)) + min
  const candidates = pool.filter((w) => w.length === length)
  const word = candidates[Math.floor(Math.random() * candidates.length)]
  return { word, length }
}

type GameStatus = "loading" | "playing" | "won" | "lost"

export function Game({ playerName }: { playerName?: string | null }) {
  const [status, setStatus] = useState<GameStatus>("loading")
  const [target, setTarget] = useState("")
  const [wordLength, setWordLength] = useState(5)
  const [results, setResults] = useState<GuessResult[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [letterMap, setLetterMap] = useState<Record<string, LetterState>>({})
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState("")
  const [pool, setPool] = useState<string[]>([])
  const [wordSet, setWordSet] = useState<Set<string>>(new Set())

  const showToast = (msg: string, ms = 2500) => {
    setToast(msg)
    setTimeout(() => setToast(""), ms)
  }

  const startRound = useCallback((wordPool: string[]) => {
    const { word, length } = pickWord(wordPool)
    setWordLength(length)
    setWordSet(new Set(wordPool.filter((w) => w.length === length)))
    setTarget(word)
    setCurrentGuess(word[0])
    setResults([])
    setLetterMap({})
    setToast("")
    setStatus("playing")
  }, [])

  const startGame = useCallback(async () => {
    setStatus("loading")
    const wordPool = await fetchWordPool()
    setPool(wordPool)
    startRound(wordPool)
  }, [startRound])

  useEffect(() => {
    let cancelled = false

    fetchWordPool().then((wordPool) => {
      if (cancelled) return
      setPool(wordPool)
      startRound(wordPool)
    })

    return () => {
      cancelled = true
    }
  }, [startRound])

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== wordLength) {
      setShake(true)
      showToast(`Le mot doit faire ${wordLength} lettres`)
      setTimeout(() => setShake(false), 500)
      return
    }

    if (!wordSet.has(currentGuess)) {
      setShake(true)
      showToast("Ce mot n'existe pas dans le dictionnaire")
      setTimeout(() => setShake(false), 500)
      return
    }

    const states = checkGuess(currentGuess, target, wordLength)
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
      const msgs = [
        "Parfait !",
        "Excellent !",
        "Bravo !",
        "Bien joué !",
        "Ouf !",
        "Miracle !",
      ]
      showToast(msgs[Math.min(newResults.length - 1, msgs.length - 1)], 4000)
      setCurrentGuess("")
    } else if (newResults.length >= MAX_ATTEMPTS) {
      setStatus("lost")
      showToast(`Le mot était : ${target.toUpperCase()}`, 4000)
      setCurrentGuess("")
    } else {
      setCurrentGuess(target[0])
    }
  }, [currentGuess, target, wordLength, results, letterMap, wordSet])

  const handleKey = useCallback(
    (key: string) => {
      if (status !== "playing") return
      if (key === "ENTER") {
        submitGuess()
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
      } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + key.toLowerCase())
      }
    },
    [status, currentGuess, wordLength, submitGuess]
  )

  const replay = useCallback(() => {
    if (pool.length === 0) {
      startGame()
      return
    }
    startRound(pool)
  }, [pool, startGame, startRound])

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
            <span className="text-sm text-zinc-400">
              Bonjour {playerName} 👋
            </span>
          )}
          <Link
            href="/jedumo/word"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Mots →
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Déconnexion
          </button>
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
            wordLength={wordLength}
            firstLetter={target[0] ?? ""}
            shake={shake}
            gameStatus={status as "playing" | "won" | "lost"}
          />

          {(status === "won" || status === "lost") && (
            <button
              onClick={replay}
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
