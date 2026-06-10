import { cookies } from 'next/headers'
import { WordsList } from './WordsList'
import { AddWordForm } from './AddWordForm'

export default async function WordPage() {
  const cookieStore = await cookies()
  const customWords = JSON.parse(
    cookieStore.get('custom_words')?.value ?? '[]'
  ) as string[]

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-full">
      <h1 className="text-2xl font-bold text-white">Gestion des mots</h1>
      <AddWordForm customWords={customWords} />
      <WordsList />
    </div>
  )
}
