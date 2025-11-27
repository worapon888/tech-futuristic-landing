import { useEffect, useRef } from "react";
import { gsap, SplitText } from "../../utils/gsap";

export default function CTA() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!root.current) return;

    const el = root.current;

    const ctx = gsap.context(() => {
      const title = el.querySelector(".cta-title");
      const items = el.querySelectorAll(".cta-item");

      if (!title) return;

      /* ---------------------------------
         SPLIT TEXT MOTION FOR <h2>
      ----------------------------------*/
      const split = new SplitText(title, {
        type: "chars",
        mask: "chars",
      });

      gsap.set(split.chars, { y: "120%", opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // title ขึ้นทีละตัว
      tl.to(split.chars, {
        y: "0%",
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.03,
      });

      // cta-item ขึ้นเร็ว + ซ้อนกับท้าย ๆ ของ title
      tl.from(
        items,
        {
          y: 16,
          opacity: 0,
          duration: 0.36, // เร็วสุดแบบยังเนียน
          ease: "power3.out",
          stagger: 0.03,
        },
        "-=0.6" // เริ่มเร็วกว่าของเดิม (ซ้อนท้าย title เลย)
      );
    }, el);

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
        <h2
          className="cta-title"
          style={{
            fontSize: "clamp(28px, 4vw, 96px)",
            display: "inline-block", // ให้ mask ของ SplitText ทำงานสวย ๆ
          }}
        >
          Build the Experience of Tomorrow
        </h2>

        <p className="cta-item" style={{ opacity: 0.7, marginTop: 8 }}>
          Ready to craft immersive, cinematic web experiences?
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
