import { Coffee, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function Store() {
  return (
    <div>
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <Coffee className="w-10 h-10 text-gold mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-100 mb-4">
              Champion&apos;s Coffee{" "}
              <span className="text-gold">Store</span>
            </h1>
            <p className="text-lg text-sand-400 max-w-2xl">
              Buy past and present champions&apos; coffee products. Every purchase
              supports the champion and the future of transparent coffee
              competition.
            </p>
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="max-w-xl mx-auto text-center border border-[#3a2a1f] bg-[#231a14]/60 px-8 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <Clock className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">
                Coming soon
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 mb-4">
              The Champion&apos;s Coffee Product store opens with WEC 2026
            </h2>
            <p className="text-sand-400 leading-relaxed mb-8">
              After Panama, the winning protocol becomes a product you can buy —
              with royalties flowing back to the champion. We&apos;re building the
              store now so it&apos;s ready when the first independent champion is
              crowned.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/panama-2026">
                <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                  Follow WEC 2026
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/innovation">
                <Button
                  variant="outline"
                  className="border-sand-400/30 text-sand-200"
                >
                  Innovation Lab
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
