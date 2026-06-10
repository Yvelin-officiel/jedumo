'use server'

import { refresh } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { wordSchema } from '@/validators/word'
import { readCustomWords, writeCustomWords } from '@/lib/customWords'

export type AddWordState = { error: string | null; success: boolean }

async function addWord(email: string, word: string): Promise<AddWordState> {
  const parsed = wordSchema.safeParse({ word })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false }
  }

  const normalized = parsed.data.word.toLowerCase()
  const existing = await readCustomWords(email)

  if (existing.includes(normalized)) return { error: 'Mot déjà présent', success: false }

  await writeCustomWords(email, [...existing, normalized])
  return { error: null, success: true }
}

export async function addCustomWord(
  _prev: AddWordState,
  formData: FormData
): Promise<AddWordState> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { error: 'Non authentifié', success: false }
  }

  const result = await addWord(session.user.email, formData.get('word')?.toString().trim() ?? '')
  if (result.success) refresh()

  return result
}

export async function addCustomWordByValue(word: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return

  await addWord(session.user.email, word)
  refresh()
}

export async function removeCustomWord(word: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return

  const existing = await readCustomWords(session.user.email)
  await writeCustomWords(session.user.email, existing.filter((w) => w !== word))
  refresh()
}
