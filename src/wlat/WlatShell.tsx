import { Link, NavLink, Outlet, useLocation } from "react-router";
import { WLAT_ASSETS, WLAT_NAME } from "./assets";
import { trpc } from "@/providers/trpc";

export function WlatShell({ fullBleed = false }: { fullBleed?: boolean }) {
  const location = useLocation();
  const isBoard = location.pathname.includes("/board");
  const me = trpc.wlat.me.useQuery(undefined, { retry: false });

  if (isBoard || fullBleed) {
    return (
      <div className="min-h-screen bg-[#120c09] text-sand-100">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#140e0a] text-sand-100 flex flex-col">
      <header className="border-b border-[#3a2a1f]/80 bg-[#120c09]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/throwdown" className="flex items-center gap-3 min-w-0">
            <img src={WLAT_ASSETS.logoWhite} alt="WEC" className="h-10 w-10 object-contain" />
            <div className="min-w-0">
              <div className="text-sm font-bold tracking-wide truncate">{WLAT_NAME}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cinnamon-400">WEC sibling product</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[
              ["/throwdown", "Home"],
              ["/throwdown/events", "Events"],
              ["/throwdown/me", "Dashboard"],
            ].map(([href, label]) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/throwdown"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md ${isActive ? "text-cinnamon-300 bg-cinnamon-950/40" : "text-sand-400 hover:text-sand-100"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {me.data ? (
              <Link to="/throwdown/me" className="text-sm text-sand-300 truncate max-w-[10rem]">
                {me.data.member.displayName}
              </Link>
            ) : (
              <Link to="/throwdown/login" className="text-sm text-sand-300">
                Sign in
              </Link>
            )}
            <Link
              to="/throwdown/create"
              className="text-sm bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-3 py-2 rounded-md"
            >
              Create event
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
