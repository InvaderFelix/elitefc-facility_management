import { BrowserRouter, Routes, Route, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, type CSSProperties } from "react";
import { Home } from "./pages/Home";
import { Academy } from "./pages/Academy";
import { Facility } from "./pages/Facility";
import { Register } from "./pages/Register";
import { Coaches } from "./pages/Coaches";
import { Elite360 } from "./pages/Elite360";
import { BookPitch } from "./pages/BookPitch";
import { BookCoach } from "./pages/BookCoach";
import { BookParty } from "./pages/BookParty";
import { Contact } from "./pages/Contact";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { PortalLayout } from "./pages/portal/PortalLayout";
import { PortalPlaceholder } from "./pages/portal/PortalPlaceholder";
import { PORTAL_NAV } from "./pages/portal/portalNav";
import { getSupabase } from "./lib/supabase";
import { Button } from "./components/Button";
import { AuthProvider } from "./lib/AuthProvider";
import { useAuth } from "./lib/useAuth";
import { PAGE_BACKGROUNDS } from "./data/pageBackgrounds";

const NAV_LINKS = [
  { to: "/facility", label: "Facility" },
  { to: "/academy", label: "Academy" },
  { to: "/elite360", label: <span className="elite360-green">Elite360</span> },
  { to: "/coaches", label: "Coaches" },
  { to: "/bookpitch", label: "Bookings" },
  { to: "/contact", label: "Contact" },
];

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const segment = pathname.split("/").filter(Boolean).pop();
    const name = segment
      ? segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Home";
    document.title = `Elite Football - ${name}`;
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

  /*
   * Public pages remount on every nav so the page-in animation replays.
   * The portal is different: PortalLayout (and its sidebar) must stay mounted
   * while only <Outlet /> swaps, so give all /portal routes one stable key and
   * skip the transition there.
   */
  const isPortal = pathname === "/portal" || pathname.startsWith("/portal/");

  return (
    <div
      key={isPortal ? "portal" : pathname}
      className={isPortal ? undefined : "page-transition"}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/facility" element={<Facility />} />
        <Route path="/booking" element={<BookPitch />} />
        <Route path="/bookpitch" element={<BookPitch />} />
        <Route path="/bookcoach" element={<BookCoach />} />
        <Route path="/bookparty" element={<BookParty />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/register" element={<Register />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/elite360" element={<Elite360 />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/*
          Routes are derived from PORTAL_NAV — the single source of truth for
          both these routes and PortalLayout's sidebar. This tree is
          intentionally left ungated while auth is being wired.
        */}
        <Route path="/portal" element={<PortalLayout />}>
          {PORTAL_NAV.flatMap((section) =>
            section.items.map((item) =>
              item.path === "" ? (
                <Route
                  key="index"
                  index
                  element={
                    item.element ?? (
                      <PortalPlaceholder eyebrow={item.eyebrow ?? section.role} title={item.title ?? item.label} />
                    )
                  }
                />
              ) : (
                <Route
                  key={item.path}
                  path={item.path}
                  element={
                    item.element ?? (
                      <PortalPlaceholder eyebrow={item.eyebrow ?? section.role} title={item.title ?? item.label} />
                    )
                  }
                />
              ),
            ),
          )}
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <PageTitle />
        <AppHeader />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppHeader() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

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
        <Link to="/" className={`logo${isHome ? " logo--hidden" : ""}`}>
          <img src="/assets/img/logo-white.png" alt="Elite Football Academy" className="logo-img" />
        </Link>

        <nav>
          {NAV_LINKS.map((link) => {
            if (link.to === "/elite360") {
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => (isActive ? "elite360-green active" : "")}
                >
                  Elite360
                </NavLink>
              );
            }
            if (link.to === "/bookpitch") {
              return (
                <div key={link.to} className="nav__item nav__item--dropdown">
                  <NavLink
                    to="/bookpitch"
                    className={({ isActive }) =>
                      `nav__link nav__link--bookings nav__link--bookings-underline${isActive ? " active" : ""}`
                    }
                  >
                    Bookings
                  </NavLink>
                  <div className="nav__dropdown">
                    <Link to="/bookpitch" className="nav__dropdown-link">Book a Pitch</Link>
                    <Link to="/bookcoach" className="nav__dropdown-link">Book a Coach</Link>
                    <Link to="/bookparty" className="nav__dropdown-link">Book a Party</Link>
                  </div>
                </div>
              );
            }
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {link.label}
              </NavLink>
            );
          })}
          {session && (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Log out
            </Button>
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