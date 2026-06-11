import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getPlayableWords } from "@/lib/frenchWords"
import { Game } from "./Game"

export default async function GamePage() {
  const session = await getServerSession(authOptions)
  const wordPool = await getPlayableWords()
  return <Game playerName={session?.user?.name} wordPool={wordPool} />
}
