const FRENCH_WORDS_URL =
  'https://raw.githubusercontent.com/words/an-array-of-french-words/master/index.json'

export const FRENCH_WORDS_TAG = 'french-words'

export async function getFrenchWords(): Promise<string[]> {
  const res = await fetch(FRENCH_WORDS_URL, {
    next: { revalidate: 60 * 60 * 24, tags: [FRENCH_WORDS_TAG] },
  })

  if (!res.ok) {
    throw new Error(`Impossible de charger le dictionnaire (${res.status})`)
  }

  return res.json() as Promise<string[]>
}
