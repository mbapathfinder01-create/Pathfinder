export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">MBA Pathfinder</div>
        <div>AI-driven specialization &amp; career guidance for MBA students in Nashik, Pune &amp; Mumbai.</div>
        <div className="mt-2 text-xs">© {new Date().getFullYear()} MBA Pathfinder. Built for academic use.</div>
      </div>
    </footer>
  );
}
