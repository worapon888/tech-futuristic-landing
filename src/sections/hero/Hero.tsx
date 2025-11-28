import { useEffect, useRef } from "react";
import { gsap, SplitText } from "../../utils/gsap";
import BioVeinScene from "../../components/background/BioVeinScene";
import logo from "../../assets/logo.png";
import { bioVeinMouse } from "../../utils/bioVeinMouse";

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);

  // timeline ของเมนู (block reveal)
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const isOpen = useRef(false);

  // --- mouse position → shader ---
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();

      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      bioVeinMouse.x = x;
      bioVeinMouse.y = 1 - y; // UV แกน Y กลับด้าน
    };

    const handleLeave = () => {
      bioVeinMouse.x = 0.5;
      bioVeinMouse.y = 0.5;
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const titleEl = root.current?.querySelector(
        ".hero-title"
      ) as HTMLElement | null;

      // เตรียม SplitText สำหรับ hero-title แบบเดียวกับ CTA
      let split: SplitText | null = null;

      if (titleEl) {
        split = new SplitText(titleEl, {
          type: "chars",
          mask: "chars",
        });

        // เริ่มจากอยู่ล่าง + โปร่งใส
        gsap.set(split.chars, { y: "120%", opacity: 0 });
      }

      /* ===== HERO INTRO ===== */
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1) kicker เข้ามาก่อนนิดหน่อย
      introTl.from(".hero-kicker", { y: -15, opacity: 0, duration: 0.7 }, 6.5);

      // 2) hero-title แบบ SplitText chars เหมือน CTA
      introTl.to(
        split ? split.chars : ".hero-title",
        {
          y: "0%",
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.03,
        },
        6.6
      );

      // 3) sub text โผล่ตามหลัง title
      introTl.from(
        ".hero-sub",
        {
          y: 12,
          opacity: 0,
          duration: 1,
        },
        "-=0.4"
      );

      // 4) CTA buttons เข้ามาซ้อนท้าย ๆ
      introTl.from(
        ".hero-cta",
        {
          y: 8,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
        },
        "-=0.5"
      );

      /* ===== BLOCK REVEAL MENU ===== */
      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(".overlay-menu", { opacity: 0, pointerEvents: "none" });
        },
      });

      tl.set(".overlay-menu", { opacity: 1, pointerEvents: "auto" }, 0);
      tl.set(".menu-item", { opacity: 0, y: 20 }, 0);

      tl.to(".block", {
        duration: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        stagger: 0.075,
        ease: "power3.inOut",
      });

      tl.to(
        ".menu-item,.menu-title",
        {
          duration: 0.3,
          opacity: 1,
          stagger: 0.05,
        },
        "-=0.5"
      );

      menuTl.current = tl;
    }, root);

    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    if (!menuTl.current) return;

    if (isOpen.current) {
      menuTl.current.reverse();
    } else {
      menuTl.current.play(0);
    }

    isOpen.current = !isOpen.current;
  };

  return (
    <section ref={root} className="hero-section">
      {/* ===== NAV BAR ===== */}
      <nav className="hero-nav">
        <div className="hero-logo">
          <img src={logo} alt="logo" />
        </div>

        <button
          className="hero-burger"
          onClick={(e) => {
            e.currentTarget.classList.toggle("active");
            toggleMenu();
          }}
          aria-label="toggle menu"
        />
      </nav>

      {/* ===== BLOCK OVERLAY ===== */}
      <div className="overlay" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="block" key={i} />
        ))}
      </div>

      {/* ===== Shader Scene Layer ===== */}
      <div className="hero-bg">
        <BioVeinScene />
      </div>

      {/* ===== VIGNETTE / FOCUS OVERLAY ===== */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* ===== Content Layer ===== */}
      <div className="hero-content">
        <p className="hero-kicker">FUTURISTIC TECH</p>

        <h1 className="hero-title" data-text="Launch the Next-Gen Experience">
          {"Launch the Next\u2011Gen Ex\u2011perience"}
        </h1>

        <p className="hero-sub">
          Cinematic motion. Precise interaction. Dark-tech premium tone.
        </p>

        <div className="hero-cta-group">
          <button className="hero-cta">Get Started</button>
          <button className="hero-cta">Watch Demo</button>
        </div>
      </div>

      {/* ===== Overlay Menu ===== */}
      <div className="overlay-menu">
        <div className="menu-title">
          <p>[menu]</p>
        </div>

        <div className="menu-item">
          <div className="menu-item-year">
            <p>2023</p>
          </div>
          <div className="menu-item-name">
            <p>Digital Art Collecting</p>
          </div>
          <div className="menu-item-link">
            <a href="#">[explore]</a>
          </div>
        </div>

        <div className="menu-item">
          <div className="menu-item-year">
            <p>2022</p>
          </div>
          <div className="menu-item-name">
            <p>Art NFT Collecting</p>
          </div>
          <div className="menu-item-link">
            <a href="#">[explore]</a>
          </div>
        </div>

        <div className="menu-item">
          <div className="menu-item-year">
            <p>2021</p>
          </div>
          <div className="menu-item-name">
            <p>Collectors Edition</p>
          </div>
          <div className="menu-item-link">
            <a href="#">[explore]</a>
          </div>
        </div>

        <div className="menu-item">
          <div className="menu-item-year">
            <p>Learn More</p>
          </div>
          <div className="menu-item-name">
            <p>About</p>
          </div>
          <div className="menu-item-link">
            <a href="#">[explore]</a>
          </div>
        </div>
      </div>
    </section>
  );
}
