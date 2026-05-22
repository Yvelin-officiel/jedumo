'use server'

import { cookies } from 'next/headers'
import { refresh } from 'next/cache'

export type AddWordState = { error: string | null; success: boolean }

export async function addCustomWord(
  _prev: AddWordState,
  formData: FormData
): Promise<AddWordState> {
  const word = formData.get('word')?.toString().trim() ?? ''

  if (word.length < 2) return { error: 'Minimum 2 caractères', success: false }
  if (!/^[a-zA-ZÀ-ÿ'-]+$/.test(word)) return { error: 'Caractères invalides', success: false }

  const cookieStore = await cookies()
  const existing = JSON.parse(cookieStore.get('custom_words')?.value ?? '[]') as string[]

  const normalized = word.toLowerCase()
  if (existing.includes(normalized)) return { error: 'Mot déjà présent', success: false }

  cookieStore.set('custom_words', JSON.stringify([...existing, normalized]), { path: '/' })
  refresh()

  return { error: null, success: true }
}
