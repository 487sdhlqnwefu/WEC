import { Route, Routes } from "react-router";
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
import WbtLayout from "./wbt/WbtLayout";
import WbtHome from "./wbt/pages/Home";
import WbtHow from "./wbt/pages/HowItWorks";
import WbtSitters from "./wbt/pages/Sitters";
import WbtFestival from "./wbt/pages/Festival";
import WbtResults from "./wbt/pages/Results";
import WbtCompetitors from "./wbt/pages/Competitors";
import WbtLuck from "./wbt/pages/Luck";
import WbtWec from "./wbt/pages/Wec";
import WbtContact from "./wbt/pages/Contact";
import { isWbtRootHost } from "./wbt/host";

export default function App() {
  const wbtAtRoot = isWbtRootHost();

  return (
    <Routes>
      {!wbtAtRoot && (
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
      )}
      <Route element={<WbtLayout />}>
        {wbtAtRoot ? <Route path="/" element={<WbtHome />} /> : null}
        {wbtAtRoot ? <Route path="/how-it-works" element={<WbtHow />} /> : null}
        {wbtAtRoot ? <Route path="/sitters" element={<WbtSitters />} /> : null}
        {wbtAtRoot ? <Route path="/festival" element={<WbtFestival />} /> : null}
        {wbtAtRoot ? <Route path="/results" element={<WbtResults />} /> : null}
        {wbtAtRoot ? <Route path="/competitors" element={<WbtCompetitors />} /> : null}
        {wbtAtRoot ? <Route path="/luck" element={<WbtLuck />} /> : null}
        {wbtAtRoot ? <Route path="/wec" element={<WbtWec />} /> : null}
        {wbtAtRoot ? <Route path="/contact" element={<WbtContact />} /> : null}
        <Route path="/wbt" element={<WbtHome />} />
        <Route path="/wbt/how-it-works" element={<WbtHow />} />
        <Route path="/wbt/sitters" element={<WbtSitters />} />
        <Route path="/wbt/festival" element={<WbtFestival />} />
        <Route path="/wbt/results" element={<WbtResults />} />
        <Route path="/wbt/competitors" element={<WbtCompetitors />} />
        <Route path="/wbt/luck" element={<WbtLuck />} />
        <Route path="/wbt/wec" element={<WbtWec />} />
        <Route path="/wbt/contact" element={<WbtContact />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
