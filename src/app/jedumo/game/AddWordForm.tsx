"use client"

import { useActionState, useRef, useEffect } from 'react'
import { addCustomWord, type AddWordState } from './actions'

const initial: AddWordState = { error: null, success: false }

export function AddWordForm({ customWords }: { customWords: string[] }) {
  const [state, action, pending] = useActionState(addCustomWord, initial)
  const ref = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) ref.current?.reset()
  }, [state.success])

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="font-semibold text-gray-800">Ajouter un mot</h2>
      </div>

      <form ref={ref} action={action} className="flex gap-3 p-5">
        <input
          type="text"
          name="word"
          placeholder="Ton mot…"
          required
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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
        <p className="px-5 pb-4 text-sm text-red-500">{state.error}</p>
      )}

      {customWords.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="mb-2 text-xs text-gray-400">{customWords.length} mot(s) ajouté(s)</p>
          <div className="flex flex-wrap gap-2">
            {customWords.map((word) => (
              <span
                key={word}
                className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
