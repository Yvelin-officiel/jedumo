"use client"

import { useState, useEffect } from 'react'

type State =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; words: string[] }

export function useFrenchWords() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    fetch('https://raw.githubusercontent.com/words/an-array-of-french-words/master/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Impossible de charger les mots (${res.status})`)
        return res.json() as Promise<string[]>
      })
      .then((words) => {
        if (!cancelled) setState({ status: 'success', words })
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ status: 'error', error })
      })

    return () => { cancelled = true }
  }, [])

  return state
}
