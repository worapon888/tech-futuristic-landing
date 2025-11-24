import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";

export default function CTA() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".cta-item", {
        y: 18,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      style={{
        minHeight: "70vh",
        padding: "12vh 8vw",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        color: "white",
      }}
    >
      <div>
        <h2 className="cta-item" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
          Experience the Future Today
        </h2>
        <p className="cta-item" style={{ opacity: 0.7, marginTop: 8 }}>
          พร้อมสร้างเว็บ Cinematic Immersive หรือยัง?
        </p>
        <button
          className="cta-item"
          style={{
            marginTop: 24,
            padding: "14px 26px",
            borderRadius: 999,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
