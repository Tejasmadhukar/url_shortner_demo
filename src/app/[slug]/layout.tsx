export default function RedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950 text-white dark:text-white">
      {children}
    </main>
  );
}
