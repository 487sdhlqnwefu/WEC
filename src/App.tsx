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

import ThrowdownLayout from "./throwdown/ThrowdownLayout";
import ThrowdownLanding from "./throwdown/pages/Landing";
import ThrowdownCompare from "./throwdown/pages/Compare";
import ThrowdownSignIn from "./throwdown/pages/SignIn";
import ThrowdownProfile from "./throwdown/pages/Profile";
import ThrowdownDashboard from "./throwdown/pages/Dashboard";
import ThrowdownWizard from "./throwdown/pages/Wizard";
import OrganiserDesk from "./throwdown/pages/Organiser";
import StewardScreen from "./throwdown/pages/Steward";
import JudgeBallot from "./throwdown/pages/Judge";
import RecipeForm from "./throwdown/pages/Recipe";
import PublicEventPage from "./throwdown/pages/PublicEvent";
import ThrowdownPay from "./throwdown/pages/Pay";
import InviteAccept from "./throwdown/pages/Invite";
import ThrowdownAdmin from "./throwdown/pages/Admin";
import AuditLogPage from "./throwdown/pages/Audit";

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
      <Route path="/throwdown" element={<ThrowdownLayout />}>
        <Route index element={<ThrowdownLanding />} />
        <Route path="compare" element={<ThrowdownCompare />} />
        <Route path="sign-in" element={<ThrowdownSignIn />} />
        <Route path="profile" element={<ThrowdownProfile />} />
        <Route path="dashboard" element={<ThrowdownDashboard />} />
        <Route path="events/new" element={<ThrowdownWizard />} />
        <Route path="events/:eventId" element={<OrganiserDesk />} />
        <Route path="events/:eventId/pay" element={<ThrowdownPay />} />
        <Route path="events/:eventId/audit" element={<AuditLogPage />} />
        <Route path="invite/:token" element={<InviteAccept />} />
        <Route path="steward/:eventId" element={<StewardScreen />} />
        <Route path="judge/:heatId" element={<JudgeBallot />} />
        <Route path="recipe/:heatId" element={<RecipeForm />} />
        <Route path="e/:slug" element={<PublicEventPage />} />
        <Route path="admin" element={<ThrowdownAdmin />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
