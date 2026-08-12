import { Routes, Route, Navigate } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import History from "./pages/History";
import Panama2026 from "./pages/Panama2026";
import Vision from "./pages/Vision";
import Store from "./pages/Store";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Decisions from "./pages/Decisions";
import LiveTournament from "./pages/LiveTournament";
import Judging from "./pages/Judging";
import Innovation from "./pages/Innovation";
import Truth from "./pages/Truth";
import Champions from "./pages/Champions";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import RulesAndIntegrity from "./pages/RulesAndIntegrity";
import DallaCorteThanks from "./pages/DallaCorteThanks";
import PreviewLiveBoard from "./pages/previews/PreviewLiveBoard";
import PreviewAdminControl from "./pages/previews/PreviewAdminControl";
import PreviewJudgingTrust from "./pages/previews/PreviewJudgingTrust";
import PreviewPanamaSponsor from "./pages/previews/PreviewPanamaSponsor";
import PreviewChampionMoment from "./pages/previews/PreviewChampionMoment";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import StoreUnavailable from "./pages/StoreUnavailable";
import NotFound from "./pages/NotFound";
import { WEC_FACTS } from "./data/wecFacts";

function StoreGate() {
  if (!WEC_FACTS.features.storeEnabled) {
    return <StoreUnavailable />;
  }
  return <Store />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about.html" element={<Navigate to="/about" replace />} />
        <Route path="/history" element={<History />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="/champions/:year" element={<Champions />} />
        <Route path="/champions/:year/" element={<Champions />} />
        <Route path="/panama-2026" element={<Panama2026 />} />
        <Route path="/panama2026" element={<Navigate to="/panama-2026" replace />} />
        <Route path="/panama2026.html" element={<Navigate to="/panama-2026" replace />} />
        <Route path="/participate" element={<Navigate to="/panama-2026#competitor-registration" replace />} />
        <Route path="/judging" element={<Judging />} />
        <Route path="/rules-and-integrity" element={<RulesAndIntegrity />} />
        <Route path="/innovation" element={<Innovation />} />
        <Route path="/innovation-lab" element={<Innovation />} />
        <Route path="/think-tank" element={<Navigate to="/innovation" replace />} />
        <Route path="/live" element={<LiveTournament />} />
        <Route path="/live/:slug" element={<LiveTournament />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/vision.html" element={<Navigate to="/vision" replace />} />
        <Route
          path="/truth"
          element={<Navigate to="/news/cafe-unido-confirmed-wec-2026" replace />}
        />
        <Route
          path="/truth.html"
          element={<Navigate to="/news/cafe-unido-confirmed-wec-2026" replace />}
        />
        <Route path="/store" element={<StoreGate />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/partners/dalla-corte-2022-2025"
          element={<DallaCorteThanks />}
        />
        <Route path="/decisions" element={<Decisions />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/preview/live" element={<PreviewLiveBoard />} />
      <Route path="/preview/admin" element={<PreviewAdminControl />} />
      <Route path="/preview/judging" element={<PreviewJudgingTrust />} />
      <Route path="/preview/panama" element={<PreviewPanamaSponsor />} />
      <Route path="/preview/champion" element={<PreviewChampionMoment />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
