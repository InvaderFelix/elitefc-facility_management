import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <div className="background" />

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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/players" element={<Players />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>

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