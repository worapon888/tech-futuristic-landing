import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";

export default function UseCases() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".use-item", {
        y: 20,
        opacity: 0,
        duration: 1,
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
      style={{
        minHeight: "100vh",
        padding: "12vh 8vw",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        color: "white",
      }}
    >
      <div className="use-item" style={{ maxWidth: 700 }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
          Perfect for Future-Forward Teams
        </h2>
        <p style={{ opacity: 0.7, marginTop: 14 }}>
          เหมาะสำหรับ AI Startup, Tech Product, Creative Agency
          ที่ต้องการเว็บล้ำ ๆ
        </p>
      </div>
    </section>
  );
}
