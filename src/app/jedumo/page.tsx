import Image from "next/image"

export default function JeuDuMoHome() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center  py-16 bg-white dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Welcome to Jedumo!
        </h1>
        <nav>
          <a
            href="/jedumo/lejeu"
            className="text-sm font-medium text-blue-500 hover:underline"
          >
            Le jeu
          </a>
        </nav>
      </main>
    </div>
  )
}
