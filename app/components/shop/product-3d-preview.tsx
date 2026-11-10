"use client";

import { useLayoutEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls } from "@react-three/drei";
import type { OrthographicCamera as ThreeOrthographicCamera } from "three";

import {
  keys,
  Keycap,
  MechanicalSwitch,
  MountingPlate,
  PCB,
  KeyboardCase,
} from "../keyboard-3d";

import type { Product } from "@/lib/products";

type Props = {
  product: Product;
};

const colorByProduct: Record<string, string> = {
  "lt65-custom-kit": "#B89B72",
  "lt75-premium-kit": "#66788C",
  "lavender-linear": "#AE91CA",
  "evergreen-tactile": "#527C65",
  "haze-keycaps": "#A99BC3",
  "moss-keycaps": "#6B8468",
  "aluminum-plate": "#B2B5BF",
  "forest-case": "#25473A",
};

const previewDimensions: Record<
  Product["category"],
  { width: number; height: number }
> = {
  Keyboards: { width: 8.5, height: 5.2 },
  Keycaps: { width: 3.5, height: 2.6 },
  Switches: { width: 0.95, height: 1.1 },
  Plates: { width: 8.5, height: 5.2 },
  Cases: { width: 8.5, height: 5.2 },
  Accessories: { width: 8.5, height: 5.2 },
};

function CameraController({ category }: { category: Product["category"] }) {
  const { size, invalidate } = useThree();
  const cameraRef = useRef<ThreeOrthographicCamera>(null);

  useLayoutEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const dimensions = previewDimensions[category];

    const horizontalZoom = (size.width * 0.82) / dimensions.width;
    const verticalZoom = (size.height * 0.82) / dimensions.height;

    camera.zoom = Math.max(1, Math.min(horizontalZoom, verticalZoom));

    camera.updateProjectionMatrix();
    invalidate();
  }, [category, size.width, size.height, invalidate]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={[0, 5, 9]}
      near={0.1}
      far={100}
    />
  );
}

function ProductModel({ product }: Props) {
  const accent = colorByProduct[product.id] ?? "#B89B72";

  if (product.category === "Switches") {
    const switchKey = {
      ...keys[5],
      x: 0,
      z: 0,
    };

    return (
      <group rotation={[0.08, -0.45, 0]} position={[0, -0.77, 0]}>
        <MechanicalSwitch keyData={switchKey} accent={accent} />
      </group>
    );
  }

  if (product.category === "Keycaps") {
    const cluster = keys.filter((key) => key.width === 1).slice(0, 9);

    return (
      <group rotation={[0.12, -0.4, 0]}>
        <group position={[0, -1.52, 0]}>
          {cluster.map((key, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;

            return (
              <Keycap
                key={index}
                keyData={{
                  ...key,
                  x: (col - 1) * 0.42,
                  z: (row - 1) * 0.42,
                }}
                accent={accent}
              />
            );
          })}
        </group>
      </group>
    );
  }

  if (product.category === "Plates") {
    return (
      <group rotation={[0.14, -0.4, 0]}>
        <group position={[0, -0.19, 0]}>
          <MountingPlate />
        </group>
      </group>
    );
  }

  if (product.category === "Cases") {
    return (
      <group rotation={[0.14, -0.4, 0]}>
        <group position={[0, 1.1, 0]}>
          <KeyboardCase accent={accent} />
        </group>
      </group>
    );
  }

  if (product.category === "Keyboards") {
    return (
      <group rotation={[0.12, -0.35, 0]}>
        <group position={[0, -1.3, 0]}>
          {keys.map((key, index) => (
            <Keycap key={index} keyData={key} accent={accent} />
          ))}
        </group>

        <group position={[0, -0.82, 0]}>
          {keys.map((key, index) => (
            <MechanicalSwitch key={index} keyData={key} accent={accent} />
          ))}
        </group>

        <group position={[0, -0.39, 0]}>
          <MountingPlate />
        </group>

        <group position={[0, 0.13, 0]}>
          <PCB />
        </group>

        <group position={[0, 0.65, 0]}>
          <KeyboardCase accent={accent} />
        </group>
      </group>
    );
  }

  return null;
}

export default function Product3DPreview({ product }: Props) {
  return (
    <div
      className="relative h-full min-h-0 w-full overflow-hidden"
      aria-label={`Interactive 3D preview of ${product.name}`}
    >
      <Canvas
        orthographic
        frameloop="demand"
        camera={{
          position: [0, 5, 9],
          zoom: 60,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent",
          borderRadius: 0,
        }}
      >
        <CameraController category={product.category} />

        <ambientLight intensity={1.8} />

        <hemisphereLight args={["#FFFFFF", "#B8A995", 1.2]} />

        <directionalLight position={[5, 8, 5]} intensity={3} />

        <directionalLight position={[-4, 3, -4]} intensity={1.5} />

        <ProductModel product={product} />

        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enablePan={false}
          enableZoom={false}
          enableDamping={false}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
