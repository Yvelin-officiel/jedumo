"use client"

import { useEffect } from 'react'

export default function GameError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-sm w-full rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-4xl">💥</p>
        <h2 className="mt-3 text-lg font-semibold text-zinc-900">Erreur dans le jeu</h2>
        <p className="mt-2 text-sm text-zinc-500">
          {error.message || "Une erreur inattendue s'est produite."}
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-zinc-400">#{error.digest}</p>
        )}
        <button
          onClick={unstable_retry}
          className="mt-5 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
