import { useState } from "react";
import SmoothScroll from "./components/layout/SmoothScroll";
import Hero from "./sections/hero/Hero";
import WorkSection from "./sections/worksection/WorkSection";
import UseCases from "./sections/usecases/UseCases";
import CTA from "./sections/cta/CTA";
import PreloaderOverlay from "./components/preloader/PreloaderOverlay";

import "./styles/work.css";
import "./styles/usecases.css";

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
          {/* Hero อยู่บนสุดตามเดิม */}
          <Hero />

          {/* งานโชว์โปรเจกต์ / การ์ด work */}
          <WorkSection />

          {/* UseCases แบบพารัลแลกซ์ (ตัวใหม่ที่เราเขียน GSAP ไว้) */}
          <UseCases />

          {/* CTA ปิดท้ายก่อน footer */}
          <CTA />
        </main>
      </SmoothScroll>
    </>
  );
}
