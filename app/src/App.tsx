import { BrowserRouter, Routes, Route, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, type CSSProperties } from "react";
import "./App.css";
import { Home } from "./pages/Home";
import { Academy } from "./pages/Academy";
import { Facility } from "./pages/Facility";
import { Register } from "./pages/Register";
import { Coaches } from "./pages/Coaches";
import { Elite360 } from "./pages/Elite360";
import { Booking } from "./pages/Booking";
import { Contact } from "./pages/Contact";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { getSupabase } from "./lib/supabase";

const NAV_LINKS = [
  { to: "/facility", label: "Facility" },
  { to: "/academy", label: "Academy" },
  { to: "/elite360", label: "Elite360" },
  { to: "/coaches", label: "Coaches" },
  { to: "/booking", label: "Booking" },
  { to: "/contact", label: "Contact" },
];

const PAGE_BACKGROUNDS: Record<string, string> = {
  "/": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=2200&q=85",
  "/facility": "https://images.unsplash.com/photo-1767731325176-1b4c774bd3d3?auto=format&fit=crop&w=2200&q=85",
  "/booking": "https://images.unsplash.com/photo-1767731325176-1b4c774bd3d3?auto=format&fit=crop&w=2200&q=85",
  "/academy": "https://images.unsplash.com/photo-1770937331389-e0c0549aff5d?auto=format&fit=crop&w=2200&q=85",
  "/register": "https://images.unsplash.com/photo-1767731325176-1b4c774bd3d3?auto=format&fit=crop&w=2200&q=85",
  "/coaches": "https://images.unsplash.com/photo-1775005968249-ad66e906df17?auto=format&fit=crop&w=2200&q=85",
  "/elite360": "https://images.pexels.com/photos/20386785/pexels-photo-20386785.jpeg?auto=compress&cs=tinysrgb&w=2200",
  "/contact": "https://images.unsplash.com/photo-1780255431682-df87de2febfa?auto=format&fit=crop&w=2200&q=85",
  "/forgot-password": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=2200&q=85",
  "/reset-password": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=2200&q=85",
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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
        <Route path="/facility" element={<Facility />} />
        <Route
          path="/booking"
          element={
            <Booking />
          }
        />
        <Route path="/academy" element={<Academy />} />
        <Route path="/register" element={<Register />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/elite360" element={<Elite360 />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppHeader />
    </BrowserRouter>
  );
}

function AppHeader() {
  const [session, setSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (cancelled) return;
      setSession(Boolean(sess));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="page">
      <Background />

      <header>
        <Link to="/" className="logo">
          <img src="/assets/img/logo-white.png" alt="Elite Football Academy" className="logo-img" />
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
          {session && (
            <button type="button" onClick={handleSignOut} className="btn btn--ghost btn--sm">
              Log out
            </button>
          )}
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
  );
}

export default App;