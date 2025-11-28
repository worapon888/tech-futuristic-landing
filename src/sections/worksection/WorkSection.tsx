// src/sections/WorkSection.tsx
import { useRef } from "react";
import { useWorkSectionAnimation } from "../../hooks/useWorkSectionAnimation";

export default function WorkSection() {
  // ref ของ section หลัก (รองรับทั้ง HTMLElement และ null)
  const rootRef = useRef<HTMLElement | null>(null);

  // hook ที่จัดการ Lenis + ScrollTrigger + Three.js + grid/letters/cards
  useWorkSectionAnimation(rootRef);

  return (
    <section ref={rootRef} className="work">
      {/* text-container สำหรับตัวอักษร W O R K แบบ 3D motion */}
      <div className="text-container" />
      <div className="hero-vignette1">
        {/* cards เลื่อนแนวนอน */}
        <div className="cards">
          <div className="card">
            <div className="card-img">
              {/* ถ้าใช้ Vite + public/assets ให้ path แบบนี้ */}
              <img src="/assets/img1.jpg" alt="Eclipse Horizon" />
            </div>
            <div className="card-copy">
              <p>Eclipse Horizon</p>
              <p>739284</p>
            </div>
          </div>

          <div className="card">
            <div className="card-img">
              <img src="/assets/img2.jpg" alt="Vision Link" />
            </div>
            <div className="card-copy">
              <p>Vision Link</p>
              <p>385912</p>
            </div>
          </div>

          <div className="card">
            <div className="card-img">
              <img src="/assets/img3.jpg" alt="Iron Bond" />
            </div>
            <div className="card-copy">
              <p>Iron Bond</p>
              <p>621478</p>
            </div>
          </div>

          <div className="card">
            <div className="card-img">
              <img src="/assets/img4.jpg" alt="Golden Case" />
            </div>
            <div className="card-copy">
              <p>Golden Case</p>
              <p>839251</p>
            </div>
          </div>

          <div className="card">
            <div className="card-img">
              <img src="/assets/img5.jpg" alt="Virtual Space" />
            </div>
            <div className="card-copy">
              <p>Virtual Space</p>
              <p>456732</p>
            </div>
          </div>

          <div className="card">
            <div className="card-img">
              <img src="/assets/img6.jpg" alt="Smart Vision" />
            </div>
            <div className="card-copy">
              <p>Smart Vision</p>
              <p>974315</p>
            </div>
          </div>

          <div className="card">
            <div className="card-img">
              <img src="/assets/img7.jpg" alt="Desert Tunnel" />
            </div>
            <div className="card-copy">
              <p>Desert Tunnel</p>
              <p>682943</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
