This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Jedumo : pages "mots" et stratégie de cache

Le module `/jedumo/word` illustre les patterns liste/détail avec données chargées côté serveur (React Server Components) :

- **Liste** (`src/app/jedumo/word/page.tsx`) : récupère le dictionnaire français (~330 000 mots) via `getFrenchWords()` et affiche une page paginée (100 mots/page, navigation par `?page=`). Chaque mot est un lien vers sa page de détail.
- **Détail** (`src/app/jedumo/word/[word]/page.tsx`) : récupère le même dictionnaire ainsi que la liste des mots personnalisés de l'utilisateur, puis affiche les caractéristiques du mot (longueur, présence dans le dictionnaire, éligibilité Motus à 6 lettres, présence dans "mes mots").

### Stratégie de cache / revalidation

| Donnée | Type de cache | Durée / déclencheur | Tag | Justification |
| --- | --- | --- | --- | --- |
| Dictionnaire français (`src/lib/frenchWords.ts`, `getFrenchWords()`) | Data Cache de `fetch` (`next: { revalidate, tags }`) | `revalidate: 86400` (24h) | `french-words` | Fichier statique externe volumineux qui évolue très rarement : une revalidation quotidienne évite de re-télécharger ~330 000 mots à chaque requête tout en gardant les données raisonnablement à jour. Le tag permet une invalidation manuelle ciblée via `revalidateTag('french-words')` si besoin. |
| Mots personnalisés (`src/lib/customWords.ts`, stockés en cookie par utilisateur) | Aucun cache (rendu dynamique, lecture via `cookies()`) | Toujours frais (par requête) | — | Donnée propre à l'utilisateur, modifiée fréquemment via Server Actions ; elle doit refléter immédiatement l'état courant, donc pas de mise en cache. |

### Revalidation après mutation

Les Server Actions `addCustomWord`, `addCustomWordByValue` et `removeCustomWord` (`src/app/jedumo/word/actions.ts`) :

1. Valident l'entrée côté serveur avec **Zod** (`src/validators/word.ts`).
2. Retournent un état d'erreur exploitable par l'UI (`AddWordState`) pour afficher un message d'erreur à l'utilisateur (mot invalide, déjà présent, non authentifié...).
3. Persistent le changement (cookie `custom_words_<email>`).
4. Appellent `refresh()` (`next/cache`) pour rafraîchir les données dynamiques de la page courante (liste et détail) après la mutation, sans recharger toute la page.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
