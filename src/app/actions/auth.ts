"use server"

import { redirect } from "next/navigation"

export type RegisterState = {
  error?: string
  success?: boolean
}

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirm = formData.get("confirm") as string

  if (!name || !email || !password || !confirm) {
    return { error: "Tous les champs sont requis" }
  }

  if (password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas" }
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères" }
  }

  // TODO: Enregistre l'utilisateur dans ta base de données ici
  // ex: await db.user.create({ data: { name, email, password: hash(password) } })

  redirect("/login?registered=true")
}
