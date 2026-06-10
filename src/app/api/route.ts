export async function GET() {
  return Response.json({ ok: true, message: "Coucou" }, { status: 200 })
}
