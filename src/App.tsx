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
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { WlatShell } from "./wlat/WlatShell";
import WlatLanding from "./pages/wlat/Landing";
import WlatLogin from "./pages/wlat/Login";
import WlatAuthCallback from "./pages/wlat/AuthCallback";
import WlatDashboard from "./pages/wlat/Dashboard";
import WlatCreate from "./pages/wlat/Create";
import WlatOrganise from "./pages/wlat/Organise";
import WlatPublicEvent from "./pages/wlat/PublicEvent";
import WlatBoard from "./pages/wlat/Board";
import WlatJudge from "./pages/wlat/Judge";
import WlatCompete from "./pages/wlat/Compete";
import WlatSteward from "./pages/wlat/Steward";
import WlatAdmin from "./pages/wlat/Admin";
import WlatDirectory from "./pages/wlat/Directory";
import WlatArchive from "./pages/wlat/Archive";
import WlatInvite from "./pages/wlat/Invite";
import WlatBracket from "./pages/wlat/BracketPage";
import WlatShots from "./pages/wlat/Shots";
import WlatFeedback from "./pages/wlat/Feedback";
import WlatProfile from "./pages/wlat/Profile";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<History />} />
        <Route path="/panama-2026" element={<Panama2026 />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/store" element={<Store />} />
        <Route path="/news" element={<News />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/decisions" element={<Decisions />} />
      </Route>
      <Route path="/throwdown" element={<WlatShell />}>
        <Route index element={<WlatLanding />} />
        <Route path="events" element={<WlatDirectory />} />
        <Route path="login" element={<WlatLogin />} />
        <Route path="auth/callback" element={<WlatAuthCallback />} />
        <Route path="me" element={<WlatDashboard />} />
        <Route path="me/profile" element={<WlatProfile />} />
        <Route path="create" element={<WlatCreate />} />
        <Route path="organise/:eventId" element={<WlatOrganise />} />
        <Route path="e/:slug" element={<WlatPublicEvent />} />
        <Route path="e/:slug/bracket" element={<WlatBracket />} />
        <Route path="judge/:eventId" element={<WlatJudge />} />
        <Route path="compete/:eventId" element={<WlatCompete />} />
        <Route path="steward/:eventId" element={<WlatSteward />} />
        <Route path="shots/:eventId" element={<WlatShots />} />
        <Route path="admin" element={<WlatAdmin />} />
        <Route path="members/:memberId" element={<WlatArchive />} />
        <Route path="invite/:token" element={<WlatInvite />} />
        <Route path="feedback/:eventId" element={<WlatFeedback />} />
      </Route>
      <Route path="/throwdown/e/:slug/board" element={<WlatShell fullBleed />}>
        <Route index element={<WlatBoard />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
