import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThrowdownLanding() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 py-16 sm:py-24">
        <div className="absolute inset-0">
          <img src="/assets/event-2.jpg" alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#140f0c]/70 via-[#140f0c]/80 to-[#140f0c]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-cinnamon-800/60 bg-cinnamon-950/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-cinnamon-300">
            A WEC community calibration tool
          </p>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-sand-100 sm:text-6xl">
            Find the recipe your coffee prefers.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-sand-400">
            Two espressos. Blind codes. Independent judges. Espresso Throwdown helps cafés and
            roasters compare baristas and recipes without knowing who made which cup.
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-gold">The cup decides.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-cinnamon-600 px-8 text-sand-100 hover:bg-cinnamon-500">
              <Link to="/throwdown/events/new">
                Create a Throwdown
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-sand-400/30 text-sand-200">
              <Link to="/throwdown/compare">Free vs Premium</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-20 sm:grid-cols-3">
        {[
          {
            title: "Same coffee",
            body: "Two baristas prepare the same coffee on shared equipment. The comparison is the recipe and the craft, not the origin bag.",
          },
          {
            title: "Blind cups",
            body: "Each heat receives two new random codes. Only the Cup Steward sees who is behind which cup until the heat is finished.",
          },
          {
            title: "Independent judges",
            body: "Judges vote alone. Ballots lock when submitted. The software totals the result. Recipes stay private until the whole event ends.",
          },
        ].map((item) => (
          <article key={item.title} className="wec-card p-6">
            <h2 className="text-lg font-semibold text-sand-100">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-sand-400">{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
