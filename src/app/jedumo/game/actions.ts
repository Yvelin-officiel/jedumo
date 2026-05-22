'use server'

import { cookies } from 'next/headers'
import { refresh } from 'next/cache'
import { wordSchema } from '@/validators/word'

export type AddWordState = { error: string | null; success: boolean }

export async function addCustomWord(
  _prev: AddWordState,
  formData: FormData
): Promise<AddWordState> {
  const parsed = wordSchema.safeParse({ word: formData.get('word')?.toString().trim() })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false }
  }

  const normalized = parsed.data.word.toLowerCase()
  const cookieStore = await cookies()
  const existing = JSON.parse(cookieStore.get('custom_words')?.value ?? '[]') as string[]

  if (existing.includes(normalized)) return { error: 'Mot déjà présent', success: false }

  cookieStore.set('custom_words', JSON.stringify([...existing, normalized]), { path: '/' })
  refresh()

  return { error: null, success: true }
}
