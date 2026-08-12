import { Outlet, Link } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RegistrationTicker from "./RegistrationTicker";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1410]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-cinnamon-600 focus:text-sand-100 focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to content
      </a>
      <Navbar />
      <RegistrationTicker />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#231a14",
            border: "1px solid #3a2a1f",
            color: "#DECCA7",
          },
        }}
      />
    </div>
  );
}
