import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Game } from "./Game"

export default async function GamePage() {
  const session = await getServerSession(authOptions)
  return <Game playerName={session?.user?.name} />
}
