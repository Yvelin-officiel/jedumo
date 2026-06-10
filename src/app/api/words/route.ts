import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { wordSchema } from '@/validators/word'
import { readCustomWords, writeCustomWords } from '@/lib/customWords'

async function requireUserEmail() {
  const session = await getServerSession(authOptions)
  return session?.user?.email ?? null
}

export async function GET() {
  const email = await requireUserEmail()
  if (!email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const words = await readCustomWords(email)
  return NextResponse.json({ words }, { status: 200 })
}

export async function POST(req: NextRequest) {
  const email = await requireUserEmail()
  if (!email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête JSON invalide' }, { status: 400 })
  }

  const parsed = wordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const normalized = parsed.data.word.toLowerCase()
  const words = await readCustomWords(email)

  if (words.includes(normalized)) {
    return NextResponse.json({ error: 'Mot déjà présent' }, { status: 409 })
  }

  const updated = [...words, normalized]
  await writeCustomWords(email, updated)

  return NextResponse.json({ words: updated }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const email = await requireUserEmail()
  if (!email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête JSON invalide' }, { status: 400 })
  }

  const parsed = wordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const normalized = parsed.data.word.toLowerCase()
  const words = await readCustomWords(email)

  if (!words.includes(normalized)) {
    return NextResponse.json({ error: 'Mot introuvable' }, { status: 404 })
  }

  const updated = words.filter((w) => w !== normalized)
  await writeCustomWords(email, updated)

  return NextResponse.json({ words: updated }, { status: 200 })
}
