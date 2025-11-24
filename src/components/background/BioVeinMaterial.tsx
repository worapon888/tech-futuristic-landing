import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, type ComponentProps } from "react";

// GLSL shaders
import vertexShader from "./shaders/bioVein.vert?raw";
import fragmentShader from "./shaders/bioVein.frag?raw";

/* ============================================================
 * 1) Create shader material
 * ============================================================ */
const BioVeinMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#040B12"), // deep black-blue
    uColor2: new THREE.Color("#0E3558"), // dark navy electric
    uColor3: new THREE.Color("#47B5F2"), // softer cyan highlight
  },
  vertexShader,
  fragmentShader
);

// register <bioVeinMaterial />
extend({ BioVeinMaterial: BioVeinMaterialImpl });

/* ============================================================
 * 2) Uniform typing (strict)
 * ============================================================ */
type BioVeinUniforms = {
  uTime: number;
  uColor1: THREE.Color;
  uColor2: THREE.Color;
  uColor3: THREE.Color;
};

/* ============================================================
 * 3) R3F v9 TypeScript module augmentation
 *    ✅ ใช้ ThreeElement (type ใหม่)
 * ============================================================ */
declare module "@react-three/fiber" {
  interface ThreeElements {
    bioVeinMaterial: ThreeElement<typeof BioVeinMaterialImpl>;
  }
}

/* ============================================================
 * 4) React wrapper component
 * ============================================================ */
export const BioVeinMaterial = (props: ComponentProps<"bioVeinMaterial">) => {
  const ref = useRef<(THREE.ShaderMaterial & BioVeinUniforms) | null>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.uTime = clock.getElapsedTime();
  });

  return <bioVeinMaterial ref={ref} {...props} />;
};
