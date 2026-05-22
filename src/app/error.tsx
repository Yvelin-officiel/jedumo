"use client"

import { useEffect } from 'react'

export default function Error({
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="max-w-md w-full rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-5xl font-bold text-zinc-300 dark:text-zinc-700">500</p>
        <h1 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Une erreur est survenue
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {error.message || "Quelque chose s'est mal passé. Réessaie dans un instant."}
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-zinc-400">#{error.digest}</p>
        )}
        <button
          onClick={unstable_retry}
          className="mt-6 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
