import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";

export default function Features() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".feat-item", {
        y: 24,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      style={{ minHeight: "100vh", padding: "12vh 8vw", color: "white" }}
    >
      <h2 className="feat-item" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
        Next-Gen Features
      </h2>

      <div style={{ marginTop: 32, display: "grid", gap: 28, maxWidth: 900 }}>
        <div className="feat-item">
          <h3>Cinematic Motion</h3>
          <p style={{ opacity: 0.7 }}>
            GSAP timeline + smooth animation ทั้งเว็บ
          </p>
        </div>

        <div className="feat-item">
          <h3>Dark-Tech Design</h3>
          <p style={{ opacity: 0.7 }}>
            Glow, Scanline, Gradient สาย Futuristic
          </p>
        </div>

        <div className="feat-item">
          <h3>3D-Ready</h3>
          <p style={{ opacity: 0.7 }}>รองรับ R3F, WebGL, Effects ต่าง ๆ</p>
        </div>
      </div>
    </section>
  );
}
