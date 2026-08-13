import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function ThrowdownCompare() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sand-100">Free Throwdown or Premium Tournament</h1>
      <p className="mt-4 max-w-3xl text-sand-400">
        A four-person Throwdown can be completed efficiently in a café. Eight or more competitors is
        a proper tournament and needs a larger bracket and operational support. That is why the
        products are separate — not to upsell, but to match the work.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="wec-card p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-cinnamon-400">Free</p>
          <h2 className="mt-2 text-2xl font-semibold text-sand-100">Espresso Throwdown</h2>
          <p className="mt-2 text-3xl text-gold">USD 0</p>
          <ul className="mt-6 space-y-2 text-sm text-sand-300">
            <li>Exactly 2, 3, or 4 competitors</li>
            <li>Single-elimination</li>
            <li>A 3-person event receives one recorded random bye</li>
            <li>Official WEC Scoring v3 or Simple Blind A/B</li>
          </ul>
        </article>
        <article className="wec-card p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Premium</p>
          <h2 className="mt-2 text-2xl font-semibold text-sand-100">Espresso Tournament</h2>
          <p className="mt-2 text-3xl text-gold">USD 300 once</p>
          <ul className="mt-6 space-y-2 text-sm text-sand-300">
            <li>8–64 competitors in version one</li>
            <li>Byes generated for non-power-of-two fields</li>
            <li>One-time licence for that tournament, not a subscription</li>
            <li>Draft setup is free; live invitations, publish, bracket lock, and start wait for verified payment</li>
          </ul>
        </article>
      </div>
      <p className="mt-8 text-sm text-sand-500">
        5, 6, or 7 competitors are not offered. The free Throwdown stops at four on purpose. The
        Premium Tournament begins at eight.
      </p>
      <Button asChild className="mt-8 bg-cinnamon-600 text-sand-100 hover:bg-cinnamon-500">
        <Link to="/throwdown/events/new">Start setup</Link>
      </Button>
    </div>
  );
}
