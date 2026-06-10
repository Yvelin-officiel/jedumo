export default function JeuDuMoHome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-24 text-center dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <span className="mb-4 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:bg-indigo-500/10 dark:text-indigo-300">
        Inspiré de Motus
      </span>
      <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
        Bienvenue sur{" "}
        <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
          Jedumo
        </span>
      </h1>
      <p className="mt-4 max-w-md text-base text-slate-500 dark:text-slate-400">
        Devine le mot caché lettre par lettre, en t&apos;aidant des indices que
        te donnent tes essais précédents.
      </p>
      <a
        href="/jedumo/game"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/30"
      >
        Jouer maintenant
        <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}
