import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RegistrationTicker from "./RegistrationTicker";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1410]">
      <Navbar />
      <RegistrationTicker />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#231a14',
            border: '1px solid #3a2a1f',
            color: '#DECCA7',
          },
        }}
      />
    </div>
  );
}
