import { useEffect, useRef } from "react";

export default function CircuitBoardBG() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;

      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // -----------------------------
    // Circuit Layout Generation
    // -----------------------------
    const GRID = 80; // ระยะห่าง node
    const nodes = [];
    for (let y = GRID; y < h; y += GRID) {
      for (let x = GRID; x < w; x += GRID) {
        nodes.push({ x, y });
      }
    }

    // เส้นโครงวงจร (45°, 90°)
    const connections = [];
    for (const n of nodes) {
      if (Math.random() > 0.6) {
        const dx = Math.random() > 0.5 ? GRID : -GRID;
        const dy = Math.random() > 0.5 ? GRID : -GRID;

        const nx = n.x + dx;
        const ny = n.y + dy;

        if (nx > 0 && nx < w && ny > 0 && ny < h) {
          connections.push({
            a: n,
            b: { x: nx, y: ny },
          });
        }
      }
    }

    // -----------------------------
    // Pulse (กระแสไฟ)
    // -----------------------------
    function createPulse() {
      const line = connections[Math.floor(Math.random() * connections.length)];
      return {
        line,
        t: 0,
        speed: 0.008 + Math.random() * 0.008,
      };
    }

    const pulses = new Array(12).fill(0).map(createPulse);

    // -----------------------------
    // Draw Core Circuit Lines
    // -----------------------------
    function drawBaseCircuit() {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(50, 160, 255, 0.15)";

      for (const c of connections) {
        ctx.beginPath();
        ctx.moveTo(c.a.x, c.a.y);
        ctx.lineTo(c.b.x, c.b.y);
        ctx.stroke();
      }

      // Node glow
      for (const n of nodes) {
        ctx.fillStyle = "rgba(100, 200, 255, 0.18)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(150, 220, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // -----------------------------
    // Draw Pulse Flow
    // -----------------------------
    function drawPulse(p) {
      const { a, b } = p.line;

      const x = a.x + (b.x - a.x) * p.t;
      const y = a.y + (b.y - a.y) * p.t;

      // light streak
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(120,210,255,0.32)";
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      // head glow
      ctx.fillStyle = "rgba(180,240,255,0.95)";
      ctx.beginPath();
      ctx.arc(x, y, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // outer bloom
      ctx.fillStyle = "rgba(80,180,255,0.22)";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // -----------------------------
    // Animation Loop
    // -----------------------------
    function draw() {
      ctx.clearRect(0, 0, w, h);

      drawBaseCircuit();

      pulses.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) {
          Object.assign(p, createPulse());
        }
        drawPulse(p);
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-circuitboard" />;
}
