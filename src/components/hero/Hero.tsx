import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-kicker", { y: 12, opacity: 0, duration: 0.7 }, 0.2)
        .from(
          ".hero-title",
          { y: 24, opacity: 0, filter: "blur(8px)", duration: 1 },
          0.35
        )
        .from(".hero-sub", { y: 12, opacity: 0, duration: 0.8 }, 0.75)
        .from(
          ".hero-cta",
          { y: 8, opacity: 0, stagger: 0.08, duration: 0.6 },
          0.95
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "12vh 8vw",
        background: "#050507",
      }}
    >
      <div style={{ maxWidth: 900 }}>
        <p
          className="hero-kicker"
          style={{ opacity: 0.6, letterSpacing: "0.2em" }}
        >
          FUTURISTIC TECH
        </p>

        <h1
          className="hero-title"
          style={{ fontSize: "clamp(36px, 6vw, 80px)", margin: "10px 0" }}
        >
          Launch the Next-Gen Experience
        </h1>

        <p className="hero-sub" style={{ opacity: 0.8, maxWidth: 600 }}>
          Cinematic motion. Precise interaction. Dark-tech premium tone.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            className="hero-cta"
            style={{ padding: "12px 18px", borderRadius: 999 }}
          >
            Get Started
          </button>
          <button
            className="hero-cta"
            style={{ padding: "12px 18px", borderRadius: 999 }}
          >
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
}
