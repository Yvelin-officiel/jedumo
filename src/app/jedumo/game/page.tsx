import { Suspense } from 'react'

async function WordsList() {
  const res = await fetch(
    'https://raw.githubusercontent.com/words/an-array-of-french-words/master/index.json'
  )
  if (!res.ok) throw new Error(`Impossible de charger les mots (${res.status})`)
  const words: string[] = await res.json()

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Mots français</h2>
        <span className="text-xs text-gray-400">{words.length.toLocaleString('fr-FR')} mots au total</span>
      </div>
      <div className="p-5 grid grid-cols-3 gap-1 sm:grid-cols-5 lg:grid-cols-8 max-h-64 overflow-y-auto">
        {words.slice(0, 500).map((word) => (
          <span key={word} className="truncate text-sm text-gray-700 py-0.5">
            {word}
          </span>
        ))}
      </div>
      <p className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
        Affichage des 500 premiers mots
      </p>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      <Suspense fallback={
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-sm text-gray-400">
          Chargement des mots…
        </div>
      }>
        <WordsList />
      </Suspense>
    </div>
  )
}
