import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";
import BioVeinScene from "../../components/background/BioVeinScene";
import logo from "../../assets/logo.png";
import { bioVeinMouse } from "../../utils/bioVeinMouse";

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);

  // timeline ของเมนู (block reveal)
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const isOpen = useRef(false);

  // --- ใส่ useEffect สำหรับ mouse ตรงนี้ ---
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();

      // แปลงเป็น 0..1 ภายใน hero section
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      bioVeinMouse.x = x;
      bioVeinMouse.y = 1 - y; // UV แกน Y กลับด้าน
    };

    const handleLeave = () => {
      // เมาส์ออกนอก hero → ค่อย ๆ กลับไปกลางจอ
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
      /* ===== HERO INTRO ===== */
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      introTl
        .from(".hero-kicker", { y: -15, opacity: 0, duration: 0.7 }, 6.7)
        .from(
          ".hero-title",
          { y: 24, opacity: 0, filter: "blur(8px)", duration: 1 },
          6.6
        )
        .from(".hero-sub", { y: 12, opacity: 0, duration: 1 }, 6.8)
        .from(
          ".hero-cta",
          { y: 8, opacity: 0, stagger: 0.08, duration: 0.6 },
          6.6
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

      {/* ===== BLOCK OVERLAY ===== */}
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

      {/* ===== VIGNETTE / FOCUS OVERLAY ===== */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* ===== Content Layer ===== */}
      <div
        className="hero-content"
        style={{
          maxWidth: 1100,
          position: "relative",
          zIndex: 2,
          textAlign: "right",
          marginLeft: "auto", // ชิดขวา
          paddingRight: "4vw",
          marginTop: "10vh", // ดันลงมาจากขอบบน
        }}
      >
        <p className="hero-kicker">FUTURISTIC TECH</p>

        <h1 className="hero-title" data-text="Launch the Next-Gen Experience">
          {/* ใช้ non-breaking hyphen กันคำแตกบรรทัด */}
          {"Launch the Next\u2011Gen Experience"}
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
