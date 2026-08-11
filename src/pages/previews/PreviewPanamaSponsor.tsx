import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Handshake, Trophy, Coffee } from "lucide-react";

/** Marketing screenshot — Panama event + sponsor CTA hero */
export default function PreviewPanamaSponsor() {
  return (
    <div className="min-h-screen bg-[#1a1410] text-sand-100">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/event-36.jpg"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/70 via-[#1a1410]/85 to-[#1a1410]" />
        </div>

        <div className="wec-container relative py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img
                src="/assets/logo-white.png"
                alt="World Espresso Championship"
                className="h-20 w-20 object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8">
              <span className="text-sm text-gold font-medium">
                First independently-run WEC · Live transparent results
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              WEC 2026{" "}
              <span className="wec-gradient-text">Panama</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sand-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cinnamon-400" />
                26 October 2026
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cinnamon-400" />
                Café Unido, Panama City
              </span>
              <span className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-gold" />
                Roaster sponsor: Café Unido
              </span>
            </div>
            <p className="text-lg sm:text-xl text-sand-400 max-w-2xl mx-auto mb-10">
              The most objective espresso championship in the world. Blind judging.
              Public live bracket. Your brand beside the format that finally trusts the
              cup.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" className="bg-cinnamon-600 hover:bg-cinnamon-500 px-8 wec-glow">
                <Handshake className="mr-2 w-5 h-5" />
                Become a Sponsor
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-sand-400/30 text-sand-200 px-8"
              >
                <Trophy className="mr-2 w-5 h-5" />
                See Live Bracket
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: "32", label: "Competitors" },
                { value: "99", label: "Points per heat" },
                { value: "0%", label: "Visual scoring" },
                { value: "100%", label: "Blind cups" },
              ].map((s) => (
                <div key={s.label} className="wec-card rounded-xl p-5">
                  <div className="text-2xl font-bold text-sand-100">{s.value}</div>
                  <div className="text-xs text-sand-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hidden link for completeness */}
      <Link to="/panama-2026" className="sr-only">
        Real page
      </Link>
    </div>
  );
}
