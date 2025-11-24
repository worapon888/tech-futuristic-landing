import SmoothScroll from "./components/layout/SmoothScroll";
import Hero from "./components/hero/Hero";
import Features from "./components/features/Features";
import UseCases from "./components/usecases/UseCases";
import CTA from "./components/cta/CTA";

export default function App() {
  return (
    <>
      <SmoothScroll>
        <main
          style={{
            background: "#050507",
            color: "white",
          }}
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
