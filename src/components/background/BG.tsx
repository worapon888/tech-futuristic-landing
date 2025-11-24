import "./BG.css";

export default function BG() {
  return (
    <div className="bg-wrapper">
      {/* NEW: circuit wires + flow current */}

      <div className="bg-noise"></div>
      <div className="bg-scanline"></div>
    </div>
  );
}
