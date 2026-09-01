import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import "./App.css";
import { Home } from "./pages/Home";
import { Academy } from "./pages/Academy";
import { Coaches } from "./pages/Coaches";
import { Players } from "./pages/Players";
import { Programs } from "./pages/Programs";
import { Contact } from "./pages/Contact";

const NAV_LINKS = [
  { to: "/academy", label: "Academy" },
  { to: "/coaches", label: "Coaches" },
  { to: "/players", label: "Players" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
];

const PAGE_BACKGROUNDS: Record<string, string> = {
  "/": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=2200&q=85",
  "/academy": "https://images.unsplash.com/photo-1767731325176-1b4c774bd3d3?auto=format&fit=crop&w=2200&q=85",
  "/coaches": "https://images.unsplash.com/photo-1775005968249-ad66e906df17?auto=format&fit=crop&w=2200&q=85",
  "/players": "https://images.unsplash.com/photo-1770937331389-e0c0549aff5d?auto=format&fit=crop&w=2200&q=85",
  "/programs": "https://images.unsplash.com/photo-1780548545759-434981c7c46e?auto=format&fit=crop&w=2200&q=85",
  "/contact": "https://images.unsplash.com/photo-1780255431682-df87de2febfa?auto=format&fit=crop&w=2200&q=85",
};

function Background() {
  const { pathname } = useLocation();
  const image = PAGE_BACKGROUNDS[pathname] ?? PAGE_BACKGROUNDS["/"];

  return (
    <div
      key={pathname}
      className="background"
      style={{ ["--bg-image" as string]: `url("${image}")` } as CSSProperties}
    />
  );
}

function AnimatedRoutes() {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="page-transition">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/players" element={<Players />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Background />

        <header>
          <Link to="/" className="logo">
            <div className="logo-mark">E</div>
            <div className="logo-text">
              ELITE FOOTBALL
              <span>ACADEMY • MELBOURNE</span>
            </div>
          </Link>

          <nav>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <AnimatedRoutes />

        <footer>
          <div>
            <strong>ELITE FOOTBALL ACADEMY</strong>
            &nbsp; • &nbsp;
            Train. Play. Develop.
          </div>

          <div>© 2026 Elite Football Academy</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;