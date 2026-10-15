import { NavLink, Outlet } from "react-router-dom";
import "../../App.css";
import { useAuth } from "../../lib/useAuth";
import { PORTAL_NAV, type PortalNavItem } from "./portalNav";

/* Overview/Dashboard first, Settings last, everything else A–Z. */
function navOrder(a: PortalNavItem, b: PortalNavItem) {
  const rank = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("overview") || l.includes("dashboard")) return 0;
    if (l.includes("settings")) return 2;
    return 1;
  };

  return rank(a.label) - rank(b.label) || a.label.localeCompare(b.label);
}

/*
 * Persistent chrome for every /portal route. Pages render into <Outlet />, so
 * adding a dashboard page means adding one entry to portalNav.tsx — the routes
 * (App.tsx) and the sidebar below both read from it.
 *
 * TODO: once auth is wired, hide sections whose `roles` the viewer lacks
 * instead of showing all of them.
 */
export function PortalLayout() {
  const { person } = useAuth();
  const name = person?.preferred_name ?? person?.first_name ?? "Member";

  return (
    <main className="content">
      <section className="hero">
        <div className="eyebrow">Member Portal</div>
        <h1>
          {name}
          <span>Portal</span>
        </h1>
      </section>

      <div className="portal">
        <aside className="portal__nav">
          {PORTAL_NAV.map((section) => (
            <div className="portal__group" key={section.role}>
              <span className="portal__group-title">{section.role}</span>

              {[...section.items].sort(navOrder).map((item) => {
                const to = item.path ? `/portal/${item.path}` : "/portal";

                return (
                  <NavLink key={to} to={to} end>
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </aside>

        <div className="portal__body">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
