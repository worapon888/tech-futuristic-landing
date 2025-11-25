import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

type PreloaderOverlayProps = {
  onDone?: () => void;
};

export default function PreloaderOverlay({ onDone }: PreloaderOverlayProps) {
  const root = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(CustomEase, SplitText);
    CustomEase.create("hop", ".8, 0, .3, 1");

    const ctx = gsap.context(() => {
      // ---------- Split helper ----------
      const splitTextElements = (
        selector: string,
        type: string = "words,chars",
        addFirstChar: boolean = false
      ) => {
        const elements = gsap.utils.toArray<HTMLElement>(selector);
        elements.forEach((el) => {
          const split = new SplitText(el, {
            type,
            wordsClass: "word",
            charsClass: "char",
          });

          if (type.includes("chars")) {
            split.chars.forEach((char, i) => {
              const t = char.textContent;
              // ใช้ wrapper char-inner เพื่อกันเส้นปริ
              char.innerHTML = `<span class="char-inner">${t}</span>`;
              if (addFirstChar && i === 0) {
                char.classList.add("first-char");
              }
            });
          }
        });
      };

      // ---------- Split ----------
      splitTextElements(".intro-title h1", "words,chars", true);
      // เลข 10: เอาเฉพาะ chars พอ ไม่ต้อง words
      splitTextElements(".outro-title h1", "chars");
      splitTextElements(".tag p", "words");
      splitTextElements(".card h1", "words,chars", true);

      const isMobile = window.innerWidth <= 1000;

      // ---------- Fix visual seam ของเลข 10 ----------
      // ทำให้แต่ละ char เป็นกล่องครอบ (overflow hidden) + inner เป็น block
      gsap.set(".outro-title .char", {
        display: "inline-block",
        overflow: "hidden",
        lineHeight: 1,
        height: "1em",
      });
      gsap.set(".outro-title .char-inner", {
        display: "block",
        willChange: "transform",
      });

      // ---------- ค่าเริ่มต้น ----------
      gsap.set(
        [
          ".split-overlay .intro-title .first-char span",
          ".split-overlay .outro-title .char span",
        ],
        { y: "0%" }
      );

      gsap.set(".split-overlay .intro-title .first-char", {
        x: isMobile ? "7.5rem" : "18rem",
        y: isMobile ? "-1rem" : "-2.75rem",

        scale: 0.75,
      });

      gsap.set(".split-overlay .outro-title .char", {
        x: isMobile ? "-3rem" : "-8rem",
        fontSize: isMobile ? "6rem" : "14rem",
      });

      const tl = gsap.timeline({ defaults: { ease: "hop" } });
      const tags = gsap.utils.toArray<HTMLElement>(".tag");

      // ---------- tags ขึ้น ----------
      tags.forEach((tag, index) => {
        tl.to(
          tag.querySelectorAll("p .word"),
          { y: "0%", duration: 0.75 },
          0.5 + index * 0.1
        );
      });

      // ---------- Nullspace ขึ้น / ลง เหลือ N ----------
      tl.to(
        ".preloader .intro-title .char span",
        { y: "0%", duration: 0.75, stagger: 0.05 },
        0.5
      )
        .to(
          ".preloader .intro-title .char:not(.first-char) span",
          { y: "100%", duration: 0.75, stagger: 0.05 },
          2
        )
        // ---------- เลข 10 โผล่ (ใช้ .char-inner / span เดิม) ----------
        .to(
          ".preloader .outro-title .char span",
          { y: "0%", duration: 0.75, stagger: 0.075 },
          2.5
        )
        // ขยับ N ไปเป็น superscript
        .to(
          ".preloader .intro-title .first-char",
          { x: isMobile ? "20rem" : "30rem", duration: 1 },
          3.5
        )
        // ขยับเลข 10 เข้า position
        .to(
          ".preloader .outro-title .char",
          { x: isMobile ? "-3rem" : "-8rem", duration: 1 },
          3.5
        )
        // รีเซ็ต N กลับค่าที่ต้องการ
        .to(
          ".preloader .intro-title .first-char",
          {
            x: isMobile ? "9rem" : "15rem",
            y: isMobile ? "-1rem" : "-2.75rem",

            scale: 0.75,
            duration: 0.75,
          },
          4.5
        )
        // sync เลข 10 ฝั่ง split-overlay แล้วหั่นจอ
        .to(
          ".preloader .outro-title .char",
          {
            x: isMobile ? "-3rem" : "-8rem",
            fontSize: isMobile ? "6rem" : "14rem",
            duration: 0.75,
            onComplete: () => {
              // หั่นจอเป็นบน/ล่าง
              gsap.set(".preloader", {
                clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
              });
              gsap.set(".split-overlay", {
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
              });
            },
          },
          4.5
        )
        // เตรียมเปิดฉาก site-container
        .to(
          ".site-container",
          {
            clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
            duration: 1,
          },
          5
        );

      // ---------- tags ลง ----------
      tags.forEach((tag, index) => {
        tl.to(
          tag.querySelectorAll("p .word"),
          { y: "100%", duration: 0.75 },
          5.5 + index * 0.1
        );
      });

      // ---------- slide preloader ออก / เปิด site จริง ----------
      tl.to(
        [".preloader", ".split-overlay"],
        { y: (i) => (i === 0 ? "-50%" : "50%"), duration: 1 },
        6
      )
        .to(
          ".site-container",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
          },
          6
        )
        .to(
          ".site-container .card",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.75,
          },
          6.25
        )
        .to(
          ".site-container .card h1 .char span",
          { y: "0%", duration: 0.75, stagger: 0.05 },
          6.5
        )
        .add(() => onDone?.(), ">");
    }, root);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div ref={root}>
      <div className="preloader">
        <div className="intro-title">
          <h1>FUTURISTIC TECH</h1>
        </div>
        <div className="outro-title">
          <h1>DEV</h1>
        </div>
      </div>

      <div className="split-overlay">
        <div className="intro-title">
          <h1>FUTURISTIC TECH</h1>
        </div>
        <div className="outro-title">
          <h1>DEV</h1>
        </div>
      </div>

      <div className="tags-overlay">
        <div className="tag tag-1">
          <p>Negative Space</p>
        </div>
        <div className="tag tag-2">
          <p>Form &amp; Void</p>
        </div>
        <div className="tag tag-3">
          <p>Worapon.dev&copy; 2025</p>
        </div>
      </div>
    </div>
  );
}
