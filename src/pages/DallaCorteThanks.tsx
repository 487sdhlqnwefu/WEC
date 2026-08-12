import Seo from "@/components/Seo";
import { WEC_FACTS } from "@/data/wecFacts";
import { STATIC_EVENTS } from "@/data/staticContent";
import { Link } from "react-router";

const TIMELINE = STATIC_EVENTS.filter((e) => !e.isUpcoming).sort((a, b) => a.year - b.year);

export default function DallaCorteThanks() {
  return (
    <div>
      <Seo
        title="Thank You, Dalla Corte | WEC 2022–2025"
        description="World Espresso Championship thanks founding equipment partner Dalla Corte for four years of support across WEC 2022, 2023, 2024 and 2025."
        path={WEC_FACTS.partners.foundingEquipment.pagePath}
        image="https://worldespressochampionship.com/assets/og/dalla-corte.jpg"
      />
      <section className="wec-section">
        <div className="wec-container max-w-3xl">
          <p className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider mb-3">
            Founding equipment partner
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-sand-100 mb-8">
            Four years that helped build WEC.
          </h1>

          <div className="space-y-5 text-sand-400 leading-relaxed mb-12">
            <p>
              From 2022 through 2025, Dalla Corte supported the first four World Espresso
              Championships as WEC&apos;s founding equipment partner.
            </p>
            <p>
              Those four years brought competitors, judges, hosts and coffee communities together
              around a new kind of espresso competition. Dalla Corte&apos;s support helped WEC move
              from an idea into an international championship—and gave four champions their winning
              stage.
            </p>
            <p>
              As WEC begins its independent era, we want this part of the record to remain clear:
              Dalla Corte was there at the beginning. We are grateful for the machines, the
              practical support, the shared work and the belief that helped make the first four
              championships possible.
            </p>
            <p className="text-sand-200 font-medium">
              Thank you to the Dalla Corte team for four good years.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-sand-100 mb-6">2022–2025</h2>
          <ol className="space-y-6 mb-12">
            {TIMELINE.map((event) => (
              <li
                key={event.year}
                className="border-l-2 border-cinnamon-700 pl-5"
              >
                <p className="text-cinnamon-400 text-sm font-medium">{event.year}</p>
                <p className="text-sand-100 font-semibold">{event.name}</p>
                <p className="text-sand-500 text-sm">
                  {event.location}
                  {event.winner ? ` · Champion: ${event.winner}` : ""}
                </p>
                {event.winner && (
                  <Link
                    to="/champions"
                    className="text-sm text-cinnamon-400 hover:text-cinnamon-300"
                  >
                    View champions archive
                  </Link>
                )}
              </li>
            ))}
          </ol>

          <p className="text-sm text-sand-500 border-t border-[#3a2a1f] pt-6">
            Founding equipment partner · World Espresso Championship · 2022–2025
          </p>
          <p className="mt-4">
            <Link to="/history" className="text-cinnamon-400 hover:text-cinnamon-300 text-sm">
              ← Back to History
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
