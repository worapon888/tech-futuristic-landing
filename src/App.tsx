import { useState } from "react";
import SmoothScroll from "./components/layout/SmoothScroll";
import Hero from "./components/hero/Hero";
import Features from "./components/features/Features";
import UseCases from "./components/usecases/UseCases";
import CTA from "./components/cta/CTA";
import PreloaderOverlay from "./components/preloader/PreloaderOverlay";

export default function App() {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && <PreloaderOverlay onDone={() => setDone(true)} />}

      <SmoothScroll>
        <main
          className="site-container"
          style={{ background: "#050507", color: "white" }}
        >
          <Hero />
          <Features />
          <UseCases />
          <CTA />
        </main>
      </SmoothScroll>
    </>
  );
}
