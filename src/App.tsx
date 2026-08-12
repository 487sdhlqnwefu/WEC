import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import History from "./pages/History";
import Panama2026 from "./pages/Panama2026";
import Vision from "./pages/Vision";
import Store from "./pages/Store";
import News from "./pages/News";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Decisions from "./pages/Decisions";
import LiveTournament from "./pages/LiveTournament";
import Judging from "./pages/Judging";
import Innovation from "./pages/Innovation";
import PreviewLiveBoard from "./pages/previews/PreviewLiveBoard";
import PreviewAdminControl from "./pages/previews/PreviewAdminControl";
import PreviewJudgingTrust from "./pages/previews/PreviewJudgingTrust";
import PreviewPanamaSponsor from "./pages/previews/PreviewPanamaSponsor";
import PreviewChampionMoment from "./pages/previews/PreviewChampionMoment";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<History />} />
        <Route path="/panama-2026" element={<Panama2026 />} />
        <Route path="/judging" element={<Judging />} />
        <Route path="/innovation" element={<Innovation />} />
        <Route path="/live" element={<LiveTournament />} />
        <Route path="/live/:slug" element={<LiveTournament />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/store" element={<Store />} />
        <Route path="/news" element={<News />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/decisions" element={<Decisions />} />
      </Route>
      {/* Marketing screenshot previews — no database required */}
      <Route path="/preview/live" element={<PreviewLiveBoard />} />
      <Route path="/preview/admin" element={<PreviewAdminControl />} />
      <Route path="/preview/judging" element={<PreviewJudgingTrust />} />
      <Route path="/preview/panama" element={<PreviewPanamaSponsor />} />
      <Route path="/preview/champion" element={<PreviewChampionMoment />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
