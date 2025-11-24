import "./BG.css";
import CircuitBG from "./CircuitBoardBG";

export default function BG() {
  return (
    <div className="bg-wrapper">
      <div className="bg-glow"></div>

      {/* NEW: circuit wires + flow current */}
      <CircuitBG />

      <div className="bg-noise"></div>
      <div className="bg-scanline"></div>
    </div>
  );
}
