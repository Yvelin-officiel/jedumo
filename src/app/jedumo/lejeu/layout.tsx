export default function LeJeuLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full ">
      <body className="">{children}</body>
    </html>
  )
}
