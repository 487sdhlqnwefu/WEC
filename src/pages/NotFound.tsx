import { Link } from "react-router";
import { Button } from "@/components/ui/button";

/** Client-side unknown route UI. Direct HTTP unknowns use static 404.html. */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1410] px-4">
      <div className="max-w-lg w-full text-center">
        <img
          src="/assets/logo-white.png"
          alt="World Espresso Championship"
          className="h-16 w-16 object-contain mx-auto mb-6"
        />
        <p className="text-sm text-cinnamon-400 uppercase tracking-[0.2em] mb-3">
          World Espresso Championship
        </p>
        <h1 className="text-5xl font-bold text-sand-100 mb-4">404</h1>
        <p className="text-sand-400 mb-8 leading-relaxed">
          This page does not exist. The shot never made it to the cup.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100"
          >
            <Link to="/">Back to Home</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
          >
            <Link to="/panama-2026">WEC 2026 Panama</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
