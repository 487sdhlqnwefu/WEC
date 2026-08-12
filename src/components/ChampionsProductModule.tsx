import { WEC_FACTS } from "@/data/wecFacts";
import { Link } from "react-router";

const statusLabels: Record<string, string> = {
  ambition: "Ambition",
  in_development: "In development",
  contracted: "Contracted",
  launched: "Launched",
  reported: "Reported",
};

export default function ChampionsProductModule({ className = "" }: { className?: string }) {
  const cp = WEC_FACTS.championsProduct;

  return (
    <section className={`wec-section ${className}`}>
      <div className="wec-container max-w-3xl">
        <p className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider mb-3">
          Champion&apos;s Product · {statusLabels[cp.status]}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-6">{cp.heading}</h2>
        {cp.publicCopy.split("\n\n").map((para) => (
          <p key={para.slice(0, 40)} className="text-sand-400 leading-relaxed mb-4">
            {para}
          </p>
        ))}
        <h3 className="text-lg font-semibold text-sand-100 mt-8 mb-3">What WEC will publish</h3>
        <ul className="space-y-2 text-sm text-sand-400 mb-6">
          {cp.publishList.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-cinnamon-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-sand-500 border-t border-[#3a2a1f] pt-4">
          {cp.governingPrinciple}{" "}
          <Link to="/rules-and-integrity" className="text-cinnamon-400 hover:text-cinnamon-300">
            Read Rules &amp; Integrity
          </Link>
        </p>
      </div>
    </section>
  );
}
