// src/sections/UseCases.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../utils/gsap";
import logo from "../../assets/logo.png";

export default function UseCases() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      /* ============================
         CONFIG พารัลแลกซ์การ์ด
      ============================ */
      const leftXValues = [-800, -900, -400];
      const rightXValues = [800, 900, 400];
      const leftRotationValues = [-30, -20, -35];
      const rightRotationValues = [30, 20, 35];
      const yValues = [100, -150, -400];

      // === แอนิเมชันแถวการ์ด (ซ้าย-ขวา) ===
      gsap.utils.toArray<HTMLElement>(".use-row").forEach((row, index) => {
        const cardLeft = row.querySelector<HTMLElement>(".use-card-left");
        const cardRight = row.querySelector<HTMLElement>(".use-card-right");
        if (!cardLeft || !cardRight) return;

        ScrollTrigger.create({
          trigger: root.current,
          start: "top center",
          end: "150% bottom",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;

            cardLeft.style.transform = `
              translateX(${progress * leftXValues[index]}px)
              translateY(${progress * yValues[index]}px)
              rotate(${progress * leftRotationValues[index]}deg)
            `;

            cardRight.style.transform = `
              translateX(${progress * rightXValues[index]}px)
              translateY(${progress * yValues[index]}px)
              rotate(${progress * rightRotationValues[index]}deg)
            `;
          },
        });
      });

      // === แอนิเมชันหัวข้อ / text / ปุ่ม ===
      const scrollTriggerSettings = {
        trigger: root.current,
        start: "top 40%",
        toggleActions: "play reverse play reverse" as const,
      };

      gsap.from(".use-logo", {
        scale: 0,
        duration: 0.5,
        ease: "power1.out",
        scrollTrigger: scrollTriggerSettings,
      });

      gsap.from(".use-line p", {
        y: 30,
        duration: 0.5,
        ease: "power1.out",
        stagger: 0.1,
        scrollTrigger: scrollTriggerSettings,
      });

      gsap.from(".use-cta-btn", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
        delay: 0.2,
        scrollTrigger: scrollTriggerSettings,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const renderRows = () => {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        <div className="use-row" key={i}>
          <div className="use-card use-card-left">
            <img src={`/img-${2 * i - 1}.jpg`} alt="" />
          </div>
          <div className="use-card use-card-right">
            <img src={`/img-${2 * i}.jpg`} alt="" />
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <section ref={root} className="usecases">
      <div className="use-main-content">
        <div className="use-logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="use-copy">
          <div className="use-line">
            <p>Built for brands that move beyond ordinary web experiences.</p>
          </div>

          <div className="use-line">
            <p>AI Startups • Tech Products • Creative Digital Agencies</p>
          </div>

          <div className="use-line">
            <p>
              Crafted for immersive, cinematic, and high-precision interactions.
            </p>
          </div>
        </div>

        <div className="use-btn">
          <button className="use-cta-btn">Explore Use Cases</button>
        </div>
      </div>

      {renderRows()}
    </section>
  );
}
