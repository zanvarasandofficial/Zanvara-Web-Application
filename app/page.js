export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-semibold tracking-tight text-zinc-900">
            Zanvara
          </span>
          <nav className="hidden items-center gap-6 text-sm text-zinc-600 sm:flex">
            <a href="#" className="transition-colors hover:text-zinc-900">
              Home
            </a>
            <a href="#" className="transition-colors hover:text-zinc-900">
              About
            </a>
            <a href="#" className="transition-colors hover:text-zinc-900">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center">
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-emerald-600">
              Welcome
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Zanvara Web Application
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Your Next.js project is ready. Built with JavaScript and Tailwind
              CSS, this is the starting point for your application.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Get Started
              </button>
              <button
                type="button"
                className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} Zanvara</span>
          <span>Next.js + Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
