import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { BioVeinMaterial } from "./BioVeinMaterial";
import { useRef } from "react";
import * as THREE from "three";

function BioVeinPlane() {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  // บังคับ scale ให้เต็มกล้องทุกเฟรม (กัน viewport/ortho เพี้ยน)
  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.elapsedTime;

    // scale ให้เต็มจอเหมือนเดิม
    meshRef.current.scale.set(viewport.width, viewport.height, 1);

    // เพิ่ม drift ช้า ๆ เหมือนกล้องลอย
    meshRef.current.position.x = Math.sin(t * 0.08) * 0.15;
    meshRef.current.position.y = Math.cos(t * 0.06) * 0.12;
  });

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      {/* plane 1x1 แล้วค่อย scale */}
      <planeGeometry args={[1, 1]} />
      <BioVeinMaterial transparent={false} depthWrite={false} />
    </mesh>
  );
}

export default function BioVeinScene() {
  return (
    <Canvas
      orthographic
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0); // โปร่งใสทับ hero ได้
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={1} />
      <BioVeinPlane />
    </Canvas>
  );
}
