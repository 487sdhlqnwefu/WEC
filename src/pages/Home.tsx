import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";
import { STATIC_EVENTS } from "@/data/staticContent";
import SoftwareShowcase from "@/components/SoftwareShowcase";
import ChampionsProductModule from "@/components/ChampionsProductModule";
import Seo from "@/components/Seo";
import { SITE_URL, WEC_FACTS } from "@/data/wecFacts";
import {
  Trophy,
  Coffee,
  Users,
  ArrowRight,
  Calendar,
  MapPin,
  Star,
  Globe,
  Eye,
  Handshake,
} from "lucide-react";

export default function Home() {
  const { data: events } = trpc.events.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const list = events && events.length > 0 ? events : STATIC_EVENTS;
  const upcomingEvent = list.find((e) => e.isUpcoming);
  const pastFromList = list.filter((e) => !e.isUpcoming);
  const pastEvents =
    pastFromList.length > 0
      ? pastFromList
      : STATIC_EVENTS.filter((e) => !e.isUpcoming);

  return (
    <div>
      <Seo
        title="World Espresso Championship (WEC)"
        description="The World Espresso Championship is a controlled, blind espresso competition. Same coffee. Same machine. Only the barista differs."
        path="/"
        image={`${SITE_URL}/assets/og/home.jpg`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "World Espresso Championship",
          alternateName: "WEC",
          url: SITE_URL,
          logo: `${SITE_URL}/assets/logo-white.png`,
          email: WEC_FACTS.organisation.founderEmail,
          sameAs: ["https://www.instagram.com/worldespressochampionship"],
        }}
      />
      {/* Hero Section — founder-approved; do not rewrite */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/assets/event-2.jpg"
            alt="WEC Competition"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/60 via-[#1a1410]/70 to-[#1a1410]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1410]/80 via-transparent to-[#1a1410]/80" />
        </div>

        <div className="relative z-10 wec-container text-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cinnamon-950/50 border border-cinnamon-800/50 mb-8">
            <span className="w-2 h-2 rounded-full bg-cinnamon-500 animate-pulse" />
            <span className="text-sm text-cinnamon-300">
              WEC 2026 · Café Unido, Panama · 26 October
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-sand-100 mb-6 tracking-tight leading-[0.95]">
            THE WORLD
            <br />
            <span className="wec-gradient-text">ESPRESSO</span>
            <br />
            CHAMPIONSHIP
          </h1>

          <p className="text-lg sm:text-xl text-sand-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Same coffee. Same machine. Only the barista differs.
            <br className="hidden sm:block" />
            The most objective competition in coffee. Winner takes a career — not
            just a trophy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8 py-6 text-base wec-glow"
            >
              <Link to="/panama-2026#competitor-registration">
                Register for WEC 2026
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10 px-8 py-6 text-base"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Trophy, value: "4", label: "Championships Held" },
              { icon: Globe, value: "32", label: "Countries Represented" },
              { icon: Users, value: "100+", label: "Competitors" },
              { icon: Eye, value: "1", label: "Blind Judging Format" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-cinnamon-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-sand-100">
                  {stat.value}
                </div>
                <div className="text-xs text-sand-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Champion's Product — transparent value (below hero; hero unchanged) */}
      <ChampionsProductModule className="bg-gradient-to-b from-[#1a1410] to-[#1e1610]" />

      {/* Upcoming Event Section */}
      {upcomingEvent && (
        <section className="wec-section bg-[#140f0b]">
          <div className="wec-container">
            <div className="wec-card rounded-2xl p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cinnamon-600/10 rounded-full blur-3xl" />
              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
                    Upcoming Championship
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sand-100 mt-3 mb-4">
                    {upcomingEvent.name}
                  </h2>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sand-400">
                      <Calendar className="w-5 h-5 text-cinnamon-400" />
                      <span>{upcomingEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sand-400">
                      <MapPin className="w-5 h-5 text-cinnamon-400" />
                      <span>{upcomingEvent.location}</span>
                    </div>
                  </div>
                  <p className="text-sand-400 leading-relaxed mb-8">
                    {upcomingEvent.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/panama-2026">
                      <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                        Register Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/panama-2026#sponsors">
                      <Button
                        variant="outline"
                        className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
                      >
                        <Handshake className="mr-2 w-4 h-4" />
                        Become a Sponsor
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="wec-card rounded-xl p-6 text-center wec-card-hover">
                    <Trophy className="w-8 h-8 text-gold mx-auto mb-3" />
                    <div className="text-2xl font-bold text-sand-100">32</div>
                    <div className="text-sm text-sand-500">Competitors</div>
                  </div>
                  <div className="wec-card rounded-xl p-6 text-center wec-card-hover">
                    <Star className="w-8 h-8 text-cinnamon-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-sand-100">
                      €3,000
                    </div>
                    <div className="text-sm text-sand-500">Prize Money</div>
                  </div>
                  <div className="wec-card rounded-xl p-6 text-center wec-card-hover">
                    <Coffee className="w-8 h-8 text-gold mx-auto mb-3" />
                    <div className="text-lg font-bold text-sand-100">
                      Champion's
                    </div>
                    <div className="text-sm text-sand-500">Coffee Product</div>
                  </div>
                  <div className="wec-card rounded-xl p-6 text-center wec-card-hover">
                    <Globe className="w-8 h-8 text-cinnamon-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-sand-100">5</div>
                    <div className="text-sm text-sand-500">Rounds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Audience CTA Cards */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
              Who Is WEC For?
            </h2>
            <p className="text-sand-400 max-w-2xl mx-auto">
              Whether you want to compete, sponsor, judge, volunteer, or simply
              be part of the community — there's a place for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Competitors */}
            <div className="wec-card rounded-2xl p-8 wec-card-hover group">
              <div className="w-14 h-14 rounded-xl bg-cinnamon-950/50 border border-cinnamon-800/50 flex items-center justify-center mb-6 group-hover:bg-cinnamon-900/50 transition-colors">
                <Trophy className="w-7 h-7 text-cinnamon-400" />
              </div>
              <h3 className="text-xl font-bold text-sand-100 mb-3">
                Competitors
              </h3>
              <p className="text-sand-400 text-sm leading-relaxed mb-6">
                National champions competing for the World Espresso Champion title
                under Scoring v3 — with a transparent Champion&apos;s Product ambition
                only if agreements can be made responsibly.
              </p>
              <Link to="/panama-2026#competitor-registration">
                <Button
                  variant="ghost"
                  className="text-cinnamon-400 hover:text-cinnamon-300 hover:bg-cinnamon-950/30 p-0"
                >
                  Register
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Sponsors */}
            <div className="wec-card rounded-2xl p-8 wec-card-hover group">
              <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <Handshake className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-sand-100 mb-3">
                Sponsors
              </h3>
              <p className="text-sand-400 text-sm leading-relaxed mb-6">
                From €5k+ community partners up to a €150k+ presenting package.
                Help us fund Panama — and stand beside a format people can trust.
              </p>
              <Link to="/panama-2026#sponsors">
                <Button
                  variant="ghost"
                  className="text-gold hover:text-[#d4a35e] hover:bg-gold/10 p-0"
                >
                  Explore Sponsorship
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Community */}
            <div className="wec-card rounded-2xl p-8 wec-card-hover group">
              <div className="w-14 h-14 rounded-xl bg-[#3E3F24]/50 border border-[#5a5b36] flex items-center justify-center mb-6 group-hover:bg-[#3E3F24]/70 transition-colors">
                <Users className="w-7 h-7 text-[#8a9b5c]" />
              </div>
              <h3 className="text-xl font-bold text-sand-100 mb-3">
                Community
              </h3>
              <p className="text-sand-400 text-sm leading-relaxed mb-6">
                Judges, volunteers, spectators, and coffee lovers worldwide. Join
                the movement for transparent, objective coffee competitions.
              </p>
              <Link to="/panama-2026">
                <Button
                  variant="ghost"
                  className="text-[#8a9b5c] hover:text-[#a3b872] hover:bg-[#3E3F24]/30 p-0"
                >
                  Get Involved
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events Preview */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-2">
                Past Championships
              </h2>
              <p className="text-sand-400">
                Building momentum since 2022. Each event bigger than the last.
              </p>
            </div>
            <Link to="/history">
              <Button
                variant="outline"
                className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
              >
                View Full History
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="wec-card rounded-xl overflow-hidden wec-card-hover"
              >
                <div className="aspect-video bg-[#2a1f16] relative">
                  <img
                    src={
                      ("photoUrl" in event && event.photoUrl) ||
                      `/assets/event-${[28, 2, 37, 35][Math.max(0, (event.id ?? 1) - 1)] ?? 2}.jpg`
                    }
                    alt={event.name}
                    className="w-full h-full object-cover object-top opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#231a14] to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs text-cinnamon-400 font-medium">
                      {event.location}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-sand-100 mb-1">
                    {event.name}
                  </h3>
                  {event.winner && (
                    <p className="text-sm text-gold mb-2">
                      Winner: {event.winner}
                    </p>
                  )}
                  <p className="text-sm text-sand-500 line-clamp-2">
                    {event.keyHighlights}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software launch promo */}
      <SoftwareShowcase compact className="bg-[#140f0b]" />

      {/* Innovation Lab Teaser — secondary to championship hero */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
                Competition-driven innovation · Innovation Lab
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sand-100 mt-3 mb-5">
                The competition is also{" "}
                <span className="wec-gradient-text">a lab</span>
              </h2>
              <p className="text-sand-400 leading-relaxed mb-4">
                WEC brings elite baristas into a controlled environment and asks
                who can make the better cup. Through the competition software,
                they can also document what they attempted, changed, and learned.
              </p>
              <p className="text-sand-500 text-sm leading-relaxed mb-6">
                Find excellence. Understand it. Build from it. — WEC Innovation
                Lab
              </p>
              <Link to="/innovation">
                <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                  Explore the Innovation Lab
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="aspect-[4/3] overflow-hidden border border-[#3a2a1f]">
              <img
                src="/assets/marketing/04-judging-trust-v3.png"
                alt="WEC Scoring v3 software"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Teaser */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="wec-card rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cinnamon-600/5 rounded-full blur-3xl" />
            <div className="relative">
              <Eye className="w-10 h-10 text-cinnamon-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
                Good coffee was never meant to stay on stage
              </h2>
              <p className="text-sand-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Competition as innovation. Competition as transparency.
                Competition as commercial opportunity. The champion&apos;s recipe
                becomes the industry&apos;s standard. Every barista can learn from it.
                Every cafe can serve it. The winner gets paid. The industry gets
                better.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/vision">
                  <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                    Read Our Vision
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/truth">
                  <Button
                    variant="outline"
                    className="border-sand-400/30 text-sand-200"
                  >
                    Café Unido announcement
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="wec-section bg-gradient-to-b from-[#1a1410] to-[#140f0b]">
        <div className="wec-container text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sand-100 mb-4">
            There Will Never Be Another First
          </h2>
          <p className="text-sand-400 max-w-xl mx-auto mb-8">
            WEC 2026 Panama is the first independently-run World Espresso Championship.
            {WEC_FACTS.event2026.independentEraNote}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/panama-2026#competitor-registration">
              <Button
                size="lg"
                className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8 wec-glow"
              >
                <Trophy className="mr-2 w-5 h-5" />
                Register for WEC 2026
              </Button>
            </Link>
            <Link to="/panama-2026#sponsors">
              <Button
                size="lg"
                variant="outline"
                className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10 px-8"
              >
                <Handshake className="mr-2 w-5 h-5" />
                Partner with WEC
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
