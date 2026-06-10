"use client"

import { useActionState, useRef, useEffect } from 'react'
import { addCustomWord, removeCustomWord, type AddWordState } from './actions'

const initial: AddWordState = { error: null, success: false }

export function AddWordForm({ customWords }: { customWords: string[] }) {
  const [state, action, pending] = useActionState(addCustomWord, initial)
  const ref = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) ref.current?.reset()
  }, [state.success])

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 shadow-sm">
      <div className="border-b border-zinc-700 px-5 py-4">
        <h2 className="font-semibold text-zinc-100">Mes mots</h2>
      </div>

      <form ref={ref} action={action} className="flex gap-3 p-5">
        <input
          type="text"
          name="word"
          placeholder="Ton mot…"
          required
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? 'Ajout…' : 'Ajouter'}
        </button>
      </form>

      {state.error && (
        <p className="px-5 pb-4 text-sm text-red-400">{state.error}</p>
      )}

      {customWords.length > 0 && (
        <div className="border-t border-zinc-700 px-5 py-4">
          <p className="mb-2 text-xs text-zinc-500">{customWords.length} mot(s) ajouté(s)</p>
          <div className="flex flex-wrap gap-2">
            {customWords.map((word) => (
              <form key={word} action={removeCustomWord.bind(null, word)}>
                <span className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300">
                  {word}
                  <button
                    type="submit"
                    aria-label={`Supprimer ${word}`}
                    className="text-indigo-300/70 hover:text-indigo-100"
                  >
                    ×
                  </button>
                </span>
              </form>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
