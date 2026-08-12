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
import HowItWorks from "./pages/HowItWorks";
import Champions from "./pages/Champions";
import InnovationLab from "./pages/InnovationLab";
import Live from "./pages/Live";
import DallaCorteThanks from "./pages/DallaCorteThanks";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Seo from "./components/Seo";

export default function App() {
  return (
    <>
      <Seo />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/history" element={<History />} />
          <Route path="/champions" element={<Champions />} />
          <Route path="/panama-2026" element={<Panama2026 />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/innovation-lab" element={<InnovationLab />} />
          <Route path="/live" element={<Live />} />
          <Route path="/store" element={<Store />} />
          <Route path="/news" element={<News />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/thanks/dalla-corte" element={<DallaCorteThanks />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
