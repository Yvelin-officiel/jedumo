import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readCustomWords } from '@/lib/customWords'
import { getFrenchWords } from '@/lib/frenchWords'
import { addCustomWordByValue, removeCustomWord } from '../actions'

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ word: string }>
}) {
  const { word } = await params
  const normalized = decodeURIComponent(word).toLowerCase()

  if (!/^[a-zà-ÿ'-]+$/i.test(normalized)) notFound()

  const session = await getServerSession(authOptions)
  const [dictionary, customWords] = await Promise.all([
    getFrenchWords(),
    session?.user?.email ? readCustomWords(session.user.email) : Promise.resolve([]),
  ])

  const inDictionary = dictionary.includes(normalized)
  const isCustom = customWords.includes(normalized)
  const isMotusEligible = /^[a-z]{6}$/.test(normalized)

  return (
    <div className="p-8 space-y-6 bg-zinc-950 min-h-full text-white">
      <Link href="/jedumo/word" className="text-sm text-zinc-400 hover:text-zinc-200">
        ← Retour à la liste
      </Link>

      <h1 className="text-3xl font-bold">{normalized}</h1>

      <dl className="grid grid-cols-2 gap-4 max-w-md">
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
          <dt className="text-xs text-zinc-400">Longueur</dt>
          <dd className="text-lg font-semibold">{normalized.length} lettres</dd>
        </div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
          <dt className="text-xs text-zinc-400">Dans le dictionnaire</dt>
          <dd className="text-lg font-semibold">{inDictionary ? 'Oui' : 'Non'}</dd>
        </div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
          <dt className="text-xs text-zinc-400">Éligible Motus (6 lettres)</dt>
          <dd className="text-lg font-semibold">{isMotusEligible ? 'Oui' : 'Non'}</dd>
        </div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
          <dt className="text-xs text-zinc-400">Dans mes mots</dt>
          <dd className="text-lg font-semibold">{isCustom ? 'Oui' : 'Non'}</dd>
        </div>
      </dl>

      {session?.user?.email && (
        isCustom ? (
          <form action={removeCustomWord.bind(null, normalized)}>
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Retirer de mes mots
            </button>
          </form>
        ) : (
          <form action={addCustomWordByValue.bind(null, normalized)}>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Ajouter à mes mots
            </button>
          </form>
        )
      )}
    </div>
  )
}
