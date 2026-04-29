export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-3 px-6">
      <div className="h-3 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-2 w-56 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-2 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
    </main>
  );
}
