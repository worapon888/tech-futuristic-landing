import SmoothScroll from "./components/layout/SmoothScroll";
import Hero from "./components/hero/Hero";
import Features from "./components/features/Features";
import UseCases from "./components/usecases/UseCases";
import CTA from "./components/cta/CTA";
import BG from "./components/background/BG";

export default function App() {
  return (
    <SmoothScroll>
      <BG />
      <main style={{ background: "#050507", color: "white" }}>
        <Hero />
        <Features />
        <UseCases />
        <CTA />
      </main>
    </SmoothScroll>
  );
}
