"use client"

import { useFrenchWords } from "@/hooks/useFrenchWords"

export function WordsList() {
  const state = useFrenchWords()

  if (state.status === "loading") {
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 text-sm text-zinc-400">
        Chargement des mots…
      </div>
    )
  }

  if (state.status === "error") {
    throw state.error
  }

  const { words } = state

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 shadow-sm">
      <div className="border-b border-zinc-700 px-5 py-4 flex items-center justify-between">
        <h2 className="font-semibold text-zinc-100">Mots français</h2>
        <span className="text-xs text-zinc-400">
          {words.length.toLocaleString("fr-FR")} mots au total
        </span>
      </div>
      <div className="p-5 grid grid-cols-3 gap-1 sm:grid-cols-5 lg:grid-cols-8 max-h-64 overflow-y-auto">
        {words.slice(0, 500).map((word) => (
          <span key={word} className="truncate text-sm text-zinc-300 py-0.5">
            {word}
          </span>
        ))}
      </div>
      <p className="border-t border-zinc-700 px-5 py-3 text-xs text-zinc-500">
        Affichage des 500 premiers mots
      </p>
    </div>
  )
}
