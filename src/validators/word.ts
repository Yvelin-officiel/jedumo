import { z } from 'zod'

export const wordSchema = z.object({
  word: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .regex(/^[a-zA-ZÀ-ÿ'-]+$/, 'Caractères invalides'),
})

export type WordInput = z.infer<typeof wordSchema>
