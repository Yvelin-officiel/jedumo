import { cookies } from 'next/headers'
import { WordsList } from './WordsList'
import { AddWordForm } from './AddWordForm'

export default async function GamePage() {
  const cookieStore = await cookies()
  const customWords = JSON.parse(
    cookieStore.get('custom_words')?.value ?? '[]'
  ) as string[]

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Liste des mots</h1>
      <AddWordForm customWords={customWords} />
      <WordsList />
    </div>
  )
}
