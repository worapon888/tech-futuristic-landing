import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";
import BioVeinScene from "../background/BioVeinScene";
import logo from "../../assets/logo.png";

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);

  // timeline ของเมนู (block reveal)
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const isOpen = useRef(false);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      /* ===== HERO INTRO ===== */
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      introTl
        .from(".hero-kicker", { y: 12, opacity: 0, duration: 0.7 }, 0.2)
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

      /* ===== BLOCK REVEAL MENU ===== */
      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(".overlay-menu", { opacity: 0, pointerEvents: "none" });
        },
      });

      // เปิด overlay menu container
      tl.set(".overlay-menu", { opacity: 1, pointerEvents: "auto" }, 0);

      // รีเซ็ต menu item
      tl.set(".menu-item", { opacity: 0, y: 20 }, 0);

      // block wipe
      tl.to(".block", {
        duration: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        stagger: 0.075,
        ease: "power3.inOut",
      });

      // menu item โผล่ขึ้น
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
    <section
      ref={root}
      className="hero-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "12vh 8vw",
        background: "#050507",
        overflow: "hidden",
      }}
    >
      {/* ===== NAV BAR ===== */}
      <nav className="hero-nav">
        <div className="hero-logo">
          <img src={logo} alt="logo" />
        </div>

        {/* ปุ่ม burger ใช้ GSAP toggle */}
        <button
          className="hero-burger"
          onClick={(e) => {
            e.currentTarget.classList.toggle("active");
            toggleMenu();
          }}
          aria-label="toggle menu"
        />
      </nav>

      {/* ===== BLOCK OVERLAY (เพิ่มเข้ามาใหม่) ===== */}
      <div className="overlay" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="block" key={i} />
        ))}
      </div>

      {/* ===== Shader Scene Layer ===== */}
      <div
        className="hero-bg"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <BioVeinScene />
      </div>

      {/* ===== Content Layer (ของเดิมคุณทั้งหมด) ===== */}
      <div
        style={{
          maxWidth: 900,
          position: "relative",
          zIndex: 2,
        }}
      >
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

      {/* ===== Overlay Menu (ของเดิม แต่ animate ด้วย GSAP) ===== */}

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
