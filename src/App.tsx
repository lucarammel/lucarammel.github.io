import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { CommandPalette } from "./components/CommandPalette";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import CV from "./pages/CV";
import Music from "./pages/Music";

// Leaflet and the 106-spot dataset only load when the page is actually visited.
const Coffee = lazy(() => import("./pages/Coffee"));

const titles: Record<string, string> = {
  "/": "Lucas Pereira — Data Scientist & Software Engineer",
  "/projects": "Projects — Lucas Pereira",
  "/cv": "CV — Lucas Pereira",
  "/coffee": "Coffee — Lucas Pereira",
  "/music": "Music — Lucas Pereira",
};

function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = titles[pathname] ?? titles["/"];
  }, [pathname]);

  return null;
}

// Remounting on pathname change replays the CSS fade-in defined in index.css.
function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <RouteEffects />
      <Header onOpenSearch={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto max-w-4xl px-5 py-16 text-sm text-ink-muted dark:text-night-muted">Loading…</div>}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/cv" element={<CV />} />
              <Route path="/coffee" element={<Coffee />} />
              <Route path="/music" element={<Music />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
