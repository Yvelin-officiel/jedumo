import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readCustomWords } from '@/lib/customWords'
import { getFrenchWords } from '@/lib/frenchWords'
import { AddWordForm } from './AddWordForm'

const PAGE_SIZE = 100

export default async function WordPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await getServerSession(authOptions)
  const customWords = session?.user?.email
    ? await readCustomWords(session.user.email)
    : []

  const { page } = await searchParams
  const allWords = await getFrenchWords()
  const totalPages = Math.ceil(allWords.length / PAGE_SIZE)
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages)
  const words = allWords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-full">
      <h1 className="text-2xl font-bold text-white">Gestion des mots</h1>
      <AddWordForm customWords={customWords} />

      <div className="rounded-xl border border-zinc-700 bg-zinc-900 shadow-sm">
        <div className="border-b border-zinc-700 px-5 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-100">Mots français</h2>
          <span className="text-xs text-zinc-400">
            {allWords.length.toLocaleString('fr-FR')} mots au total
          </span>
        </div>

        <div className="p-5 grid grid-cols-3 gap-1 sm:grid-cols-5 lg:grid-cols-8">
          {words.map((word) => (
            <Link
              key={word}
              href={`/jedumo/word/${encodeURIComponent(word)}`}
              className="truncate text-sm text-zinc-300 py-0.5 hover:text-indigo-400 hover:underline"
            >
              {word}
            </Link>
          ))}
        </div>

        <div className="border-t border-zinc-700 px-5 py-3 flex items-center justify-between text-xs text-zinc-500">
          <Link
            href={`/jedumo/word?page=${currentPage - 1}`}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? 'pointer-events-none opacity-30' : 'hover:text-zinc-300'}
          >
            ← Précédent
          </Link>
          <span>Page {currentPage} / {totalPages}</span>
          <Link
            href={`/jedumo/word?page=${currentPage + 1}`}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-30' : 'hover:text-zinc-300'}
          >
            Suivant →
          </Link>
        </div>
      </div>
    </div>
  )
}
