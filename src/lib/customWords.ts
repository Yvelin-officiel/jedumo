import { cookies } from 'next/headers'

export function cookieKeyFor(email: string) {
  return `custom_words_${encodeURIComponent(email)}`
}

export async function readCustomWords(email: string): Promise<string[]> {
  const cookieStore = await cookies()
  return JSON.parse(cookieStore.get(cookieKeyFor(email))?.value ?? '[]') as string[]
}

export async function writeCustomWords(email: string, words: string[]) {
  const cookieStore = await cookies()
  cookieStore.set(cookieKeyFor(email), JSON.stringify(words), { path: '/' })
}
