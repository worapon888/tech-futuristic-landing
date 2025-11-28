// src/hooks/useWorkSectionAnimation.ts
import { useEffect } from "react";
import { gsap } from "../utils/gsap"; // ใช้ตัวที่นายทำ wrapper ไว้
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export function useWorkSectionAnimation(
  rootRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const workSection = rootRef.current;
    if (!workSection) return;

    const cardsContainer = workSection.querySelector(
      ".cards"
    ) as HTMLElement | null;
    const textContainer = workSection.querySelector(
      ".text-container"
    ) as HTMLElement | null;

    if (!cardsContainer || !textContainer) return;

    /* =========================
       Lenis + ScrollTrigger sync
    ========================== */
    const lenis = new Lenis();
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /* =========================
       Canvas พื้นหลัง grid-dot
    ========================== */
    const gridCanvas = document.createElement("canvas");
    gridCanvas.id = "grid-canvas";
    workSection.appendChild(gridCanvas);
    const gridCtx = gridCanvas.getContext("2d");

    const resizeGridCanvas = () => {
      if (!gridCtx) return;
      const dpr = window.devicePixelRatio || 1;

      // reset transform กัน scale สะสม
      gridCtx.setTransform(1, 0, 0, 1, 0, 0);

      gridCanvas.width = window.innerWidth * dpr;
      gridCanvas.height = window.innerHeight * dpr;
      gridCanvas.style.width = `${window.innerWidth}px`;
      gridCanvas.style.height = `${window.innerHeight}px`;
      gridCtx.scale(dpr, dpr);
    };

    const drawGrid = (scrollProgress = 0) => {
      if (!gridCtx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      gridCtx.fillStyle = "black";
      gridCtx.fillRect(0, 0, w, h);

      gridCtx.fillStyle = "#0c84f4ff";
      const dotSize = 1;
      const spacing = 30;

      const rows = Math.ceil(h / spacing);
      const cols = Math.ceil(w / spacing) + 15;
      const offset = (scrollProgress * spacing * 10) % spacing;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          gridCtx.beginPath();
          gridCtx.arc(
            x * spacing - offset,
            y * spacing,
            dotSize,
            0,
            Math.PI * 2
          );
          gridCtx.fill();
        }
      }
    };

    resizeGridCanvas();
    drawGrid(0);

    /* =========================
       Three.js สำหรับ path ตัวอักษร
    ========================== */
    const lettersScene = new THREE.Scene();
    const lettersCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    lettersCamera.position.z = 20;
    lettersCamera.aspect = window.innerWidth / window.innerHeight;
    lettersCamera.updateProjectionMatrix();

    const lettersRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    lettersRenderer.setClearColor(0x000000, 0);
    lettersRenderer.setPixelRatio(window.devicePixelRatio);
    lettersRenderer.domElement.id = "letters-canvas";
    workSection.appendChild(lettersRenderer.domElement);

    const createTextAnimationPath = (yPos: number, amplitude: number) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        points.push(
          new THREE.Vector3(
            -25 + 50 * t,
            yPos + Math.sin(t * Math.PI) * -amplitude,
            (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(100)
      );
      const material = new THREE.LineBasicMaterial({ color: 0x000000 });
      const line = new THREE.Line(geometry, material) as THREE.Line & {
        curve?: THREE.CatmullRomCurve3;
        letterElements?: HTMLDivElement[];
      };
      line.curve = curve;
      return line;
    };

    const path = [
      createTextAnimationPath(10, 2),
      createTextAnimationPath(3.5, 1),
      createTextAnimationPath(-3.5, -1),
      createTextAnimationPath(-10, -2),
    ];
    path.forEach((line) => lettersScene.add(line));

    const letterPositions = new Map<
      HTMLDivElement,
      {
        current: { x: number; y: number };
        target: { x: number; y: number };
      }
    >();

    const letters = ["W", "O", "R", "K"];

    path.forEach((line, i) => {
      const typedLine = line as THREE.Line & {
        curve?: THREE.CatmullRomCurve3;
        letterElements?: HTMLDivElement[];
      };

      typedLine.letterElements = Array.from({ length: 15 }, () => {
        const el = document.createElement("div");
        el.className = "letter";
        el.textContent = letters[i];
        textContainer.appendChild(el);
        letterPositions.set(el, {
          current: { x: 0, y: 0 },
          target: { x: 0, y: 0 },
        });
        return el;
      });
    });

    const lerp = (start: number, end: number, t: number) =>
      start + (end - start) * t;

    const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];
    let scrollProgress = 0;
    let moveDistance = window.innerWidth * 5;
    let currentXPosition = 0;

    const updateTargetPositions = (progress = 0) => {
      path.forEach((line, lineIndex) => {
        const typedLine = line as THREE.Line & {
          curve?: THREE.CatmullRomCurve3;
          letterElements?: HTMLDivElement[];
        };
        if (!typedLine.curve || !typedLine.letterElements) return;

        typedLine.letterElements.forEach((element, i) => {
          const point = typedLine.curve!.getPoint(
            (i / 14 + progress * lineSpeedMultipliers[lineIndex]) % 1
          );
          const vector = point.clone().project(lettersCamera);
          const positions = letterPositions.get(element);
          if (!positions) return;

          positions.target = {
            x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
            y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
          };
        });
      });
    };

    const updateLetterPositions = () => {
      letterPositions.forEach((positions, element) => {
        const distX = positions.target.x - positions.current.x;
        if (Math.abs(distX) > window.innerWidth * 0.7) {
          positions.current.x = positions.target.x;
          positions.current.y = positions.target.y;
        } else {
          positions.current.x = lerp(
            positions.current.x,
            positions.target.x,
            0.07
          );
          positions.current.y = lerp(
            positions.current.y,
            positions.target.y,
            0.07
          );
        }

        element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
      });
    };

    const updateCardsPosition = () => {
      const targetX = -moveDistance * scrollProgress;
      currentXPosition = lerp(currentXPosition, targetX, 0.07);
      gsap.set(cardsContainer, {
        x: currentXPosition,
      });
    };

    let animationFrameId: number;
    const animate = () => {
      updateLetterPositions();
      updateCardsPosition();
      lettersRenderer.render(lettersScene, lettersCamera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // ScrollTrigger pin section
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: workSection,
      start: "top top",
      end: "+=700%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress = self.progress;
        updateTargetPositions(scrollProgress);
        drawGrid(scrollProgress);
      },
    });

    requestAnimationFrame(() => {
      updateTargetPositions(0);
    });

    animate();

    const handleResize = () => {
      resizeGridCanvas();
      drawGrid(scrollProgress);

      lettersCamera.aspect = window.innerWidth / window.innerHeight;
      lettersCamera.updateProjectionMatrix();
      lettersRenderer.setSize(window.innerWidth, window.innerHeight);

      moveDistance = window.innerWidth * 5;
      updateTargetPositions(scrollProgress);
    };

    window.addEventListener("resize", handleResize);

    /* =========================
       Cleanup
    ========================== */
    return () => {
      window.removeEventListener("resize", handleResize);

      scrollTriggerInstance.kill();

      cancelAnimationFrame(animationFrameId);
      gsap.ticker.remove(raf);
      lenis.destroy();

      // ลบ canvas ออกจาก DOM
      if (gridCanvas.parentNode === workSection) {
        workSection.removeChild(gridCanvas);
      }
      if (lettersRenderer.domElement.parentNode === workSection) {
        workSection.removeChild(lettersRenderer.domElement);
      }

      // ลบตัวอักษรที่เพิ่มเข้าไปใน text-container
      textContainer.innerHTML = "";
    };
  }, [rootRef]);
}
