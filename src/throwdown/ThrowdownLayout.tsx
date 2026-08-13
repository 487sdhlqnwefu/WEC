import { Link, Outlet, useLocation } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { trpc } from "@/providers/trpc";
import { OfflineBanner } from "./OfflineBanner";

export default function ThrowdownLayout() {
  const location = useLocation();
  const { data: me } = trpc.throwdown.me.useQuery();
  const logout = trpc.throwdown.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/throwdown";
    },
  });
  const minimal = location.pathname.includes("/judge/") || location.pathname.includes("/recipe/");

  return (
    <div className="min-h-screen bg-[#140f0c] text-sand-200">
      <OfflineBanner />
      <header className="border-b border-[#3a2a1f]/80 bg-[#1a1410]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/throwdown" className="flex items-center gap-3">
            <img src="/assets/logo-white.png" alt="World Espresso Championship" className="h-10 w-10 object-contain" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-sand-100">Espresso Throwdown</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-cinnamon-400">World Espresso Championship</p>
            </div>
          </Link>
          {!minimal && (
            <nav className="flex items-center gap-3 text-sm">
              <Link to="/throwdown/compare" className="hidden text-sand-400 hover:text-sand-100 sm:inline">
                Free &amp; Premium
              </Link>
              {me ? (
                <>
                  <Link to="/throwdown/dashboard" className="text-sand-200 hover:text-sand-50">
                    My events
                  </Link>
                  <button
                    type="button"
                    onClick={() => logout.mutate()}
                    className="text-sand-500 hover:text-sand-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/throwdown/sign-in" className="text-sand-200 hover:text-sand-50">
                  Sign in
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      {!minimal && (
        <footer className="mt-16 border-t border-[#3a2a1f] py-8 text-center text-xs text-sand-500">
          Same coffee. Blind cups. Independent judges. The cup decides.
          <span className="mx-2">·</span>
          <Link to="/" className="hover:text-sand-300">
            WEC home
          </Link>
        </footer>
      )}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: "#231a14", border: "1px solid #3a2a1f", color: "#DECCA7" },
        }}
      />
    </div>
  );
}
