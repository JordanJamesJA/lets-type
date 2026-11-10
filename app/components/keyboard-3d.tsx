"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox, Text } from "@react-three/drei";
import {
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Path,
  Shape,
  Vector3,
} from "three";

type Props = { accent: string };

export type Key = {
  x: number;
  z: number;
  width: number;
  label: string;
  row: number;
  col: number;
};

type Layer = "keycaps" | "switches" | "plate" | "pcb" | "case";

const UNIT = 0.38;
const BOARD_WIDTH = 6.55;
const BOARD_DEPTH = 2.3;

const layerDetails: Record<
  Layer,
  { title: string; description: string; y: number }
> = {
  keycaps: {
    title: "Keycaps",
    description:
      "Sculpted, replaceable keycaps with a comfortable profile and durable legends.",
    y: 1.52,
  },
  switches: {
    title: "Switches",
    description:
      "Hot-swappable mechanical switches deliver the feel and sound of every keystroke.",
    y: 0.77,
  },
  plate: {
    title: "Mounting Plate",
    description:
      "A precision-cut metal plate keeps the switches aligned and the typing feel consistent.",
    y: 0.19,
  },
  pcb: {
    title: "Circuit Board",
    description:
      "The PCB connects every switch and carries your keystrokes to the computer.",
    y: -0.43,
  },
  case: {
    title: "Aluminum Case",
    description:
      "A solid, machined enclosure protects the internals and completes the build.",
    y: -1.1,
  },
};

const layout: readonly (readonly (readonly [string, number])[])[] = [
  [
    ["Esc", 1],
    ["1", 1],
    ["2", 1],
    ["3", 1],
    ["4", 1],
    ["5", 1],
    ["6", 1],
    ["7", 1],
    ["8", 1],
    ["9", 1],
    ["0", 1],
    ["-", 1],
    ["=", 1],
    ["⌫", 2],
  ],
  [
    ["Tab", 1.5],
    ["Q", 1],
    ["W", 1],
    ["E", 1],
    ["R", 1],
    ["T", 1],
    ["Y", 1],
    ["U", 1],
    ["I", 1],
    ["O", 1],
    ["P", 1],
    ["[", 1],
    ["]", 1],
    ["\\", 1.5],
  ],
  [
    ["Caps", 1.75],
    ["A", 1],
    ["S", 1],
    ["D", 1],
    ["F", 1],
    ["G", 1],
    ["H", 1],
    ["J", 1],
    ["K", 1],
    ["L", 1],
    [";", 1],
    ["'", 1],
    ["Enter", 2.25],
  ],
  [
    ["Shift", 2.25],
    ["Z", 1],
    ["X", 1],
    ["C", 1],
    ["V", 1],
    ["B", 1],
    ["N", 1],
    ["M", 1],
    [",", 1],
    [".", 1],
    ["/", 1],
    ["Shift", 2.75],
  ],
  [
    ["Ctrl", 1.25],
    ["Win", 1.25],
    ["Alt", 1.25],
    ["Space", 6.25],
    ["Alt", 1.25],
    ["Fn", 1.25],
    ["Ctrl", 1.25],
    ["←", 1],
    ["↓", 1],
    ["→", 1],
  ],
];

export const keys: Key[] = layout.flatMap((row, rowIndex) => {
  const totalWidth = row.reduce((sum, [, width]) => sum + width, 0);
  let offset = (-totalWidth * UNIT) / 2;

  return row.map(([label, width], col) => {
    const x = offset + (width * UNIT) / 2;
    offset += width * UNIT;

    return {
      x,
      z: (rowIndex - 2) * UNIT,
      width,
      label,
      row: rowIndex,
      col,
    };
  });
});

const screwPositions: [number, number][] = [
  [-3.08, -0.97],
  [0, -0.97],
  [3.08, -0.97],
  [-3.08, 0.97],
  [0, 0.97],
  [3.08, 0.97],
];

function Screw({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]}>
      <mesh>
        <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
        <meshStandardMaterial
          color="#92949d"
          metalness={0.9}
          roughness={0.26}
        />
      </mesh>

      <mesh position={[0, 0.008, 0]}>
        <boxGeometry args={[0.043, 0.003, 0.008]} />
        <meshStandardMaterial color="#34343b" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Keycap({ keyData, accent }: { keyData: Key; accent: string }) {
  const modifier =
    keyData.width > 1 ||
    ["Esc", "Enter", "Ctrl", "Alt", "Fn", "Win"].includes(keyData.label);

  const color = modifier ? accent : "#e9e5eb";
  const width = keyData.width * UNIT - 0.038;
  const depth = UNIT - 0.038;
  const topWidth = width - 0.045;
  const topDepth = depth - 0.048;

  const legendSize =
    keyData.label.length > 4 ? 0.052 : keyData.label.length > 2 ? 0.064 : 0.079;

  return (
    <group position={[keyData.x, 1.52, keyData.z]}>
      <RoundedBox
        args={[width, 0.17, depth]}
        radius={0.026}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={color}
          roughness={0.42}
          metalness={0.03}
          clearcoat={0.15}
          clearcoatRoughness={0.42}
        />
      </RoundedBox>

      <RoundedBox
        args={[topWidth, 0.085, topDepth]}
        radius={0.035}
        smoothness={3}
        position={[0, 0.105, -0.009]}
        castShadow
      >
        <meshPhysicalMaterial
          color={color}
          roughness={0.34}
          metalness={0.02}
          clearcoat={0.18}
          clearcoatRoughness={0.35}
        />
      </RoundedBox>

      <RoundedBox
        args={[topWidth - 0.045, 0.006, topDepth - 0.045]}
        radius={0.018}
        smoothness={2}
        position={[0, 0.151, -0.009]}
      >
        <meshStandardMaterial color={color} roughness={0.55} />
      </RoundedBox>

      {keyData.label !== "Space" && (
        <Text
          position={[0, 0.158, -0.009]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={legendSize}
          color={modifier ? "#f8f5ff" : "#56505e"}
          anchorX="center"
          anchorY="middle"
          maxWidth={topWidth - 0.045}
        >
          {keyData.label}
        </Text>
      )}
    </group>
  );
}

export function MechanicalSwitch({
  keyData,
  accent,
}: {
  keyData: Key;
  accent: string;
}) {
  return (
    <group position={[keyData.x, 0.77, keyData.z]}>
      <RoundedBox
        args={[0.265, 0.105, 0.265]}
        radius={0.018}
        smoothness={2}
        position={[0, -0.068, 0]}
        castShadow
      >
        <meshStandardMaterial
          color="#4c4b57"
          metalness={0.15}
          roughness={0.57}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.27, 0.12, 0.27]}
        radius={0.022}
        smoothness={2}
        position={[0, 0.044, 0]}
        castShadow
      >
        <meshPhysicalMaterial
          color="#e5e3e9"
          roughness={0.28}
          transparent
          opacity={0.86}
          depthWrite={false}
          metalness={0.02}
        />
      </RoundedBox>

      <mesh position={[0, 0.152, 0]} castShadow>
        <boxGeometry args={[0.145, 0.112, 0.046]} />
        <meshStandardMaterial color={accent} roughness={0.32} />
      </mesh>

      <mesh position={[0, 0.152, 0]} castShadow>
        <boxGeometry args={[0.046, 0.112, 0.145]} />
        <meshStandardMaterial color={accent} roughness={0.32} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.136, -0.008, 0]}>
          <boxGeometry args={[0.018, 0.055, 0.1]} />
          <meshStandardMaterial color="#9a98a4" roughness={0.4} />
        </mesh>
      ))}

      {[-0.055, 0.055].map((x) => (
        <mesh key={x} position={[x, -0.16, 0.025]}>
          <cylinderGeometry args={[0.011, 0.011, 0.12, 8]} />
          <meshStandardMaterial
            color="#c8a35d"
            metalness={0.8}
            roughness={0.27}
          />
        </mesh>
      ))}
    </group>
  );
}

export function MountingPlate() {
  const geometry = useMemo(() => {
    const shape = new Shape();
    const w = BOARD_WIDTH / 2;
    const d = BOARD_DEPTH / 2;

    shape.moveTo(-w, -d);
    shape.lineTo(w, -d);
    shape.lineTo(w, d);
    shape.lineTo(-w, d);
    shape.closePath();

    keys.forEach((key) => {
      const hole = new Path();
      const half = 0.139;
      const x = key.x;
      const y = -key.z;

      hole.moveTo(x - half, y - half);
      hole.lineTo(x - half, y + half);
      hole.lineTo(x + half, y + half);
      hole.lineTo(x + half, y - half);
      hole.closePath();

      shape.holes.push(hole);
    });

    return new ExtrudeGeometry(shape, {
      depth: 0.065,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.008,
      bevelThickness: 0.006,
      curveSegments: 2,
    });
  }, []);

  return (
    <group position={[0, 0.19, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={geometry}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#a9a8b3"
          metalness={0.83}
          roughness={0.29}
          clearcoat={0.4}
          side={DoubleSide}
        />
      </mesh>

      {screwPositions.map(([x, z], index) => (
        <Screw key={index} x={x} y={0.014} z={z} />
      ))}
    </group>
  );
}

export function PCB() {
  return (
    <group position={[0, -0.43, 0]}>
      <RoundedBox
        args={[BOARD_WIDTH - 0.09, 0.075, BOARD_DEPTH - 0.09]}
        radius={0.038}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#17332e"
          metalness={0.26}
          roughness={0.5}
          clearcoat={0.25}
        />
      </RoundedBox>

      {keys.map((key, index) => (
        <group key={index}>
          <mesh position={[key.x, 0.04, key.z]}>
            <boxGeometry args={[0.19, 0.004, 0.19]} />
            <meshStandardMaterial
              color="#947f55"
              metalness={0.75}
              roughness={0.33}
            />
          </mesh>

          <mesh position={[key.x, 0.043, key.z]}>
            <boxGeometry args={[0.135, 0.005, 0.135]} />
            <meshStandardMaterial color="#1b3530" roughness={0.54} />
          </mesh>

          {[-0.063, 0.063].map((x) => (
            <mesh
              key={x}
              position={[key.x + x, 0.047, key.z + 0.035]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.013, 0.025, 12]} />
              <meshStandardMaterial
                color="#d8b56a"
                metalness={0.9}
                roughness={0.26}
                side={DoubleSide}
              />
            </mesh>
          ))}

          <mesh position={[key.x + 0.11, 0.042, key.z + 0.115]}>
            <boxGeometry args={[0.14, 0.003, 0.006]} />
            <meshStandardMaterial
              color="#b79a56"
              metalness={0.75}
              roughness={0.36}
            />
          </mesh>

          <mesh position={[key.x + 0.14, 0.042, key.z + 0.085]}>
            <boxGeometry args={[0.006, 0.003, 0.06]} />
            <meshStandardMaterial
              color="#b79a56"
              metalness={0.75}
              roughness={0.36}
            />
          </mesh>

          {index % 3 === 0 && (
            <mesh position={[key.x - 0.12, 0.055, key.z + 0.115]}>
              <boxGeometry args={[0.075, 0.024, 0.038]} />
              <meshStandardMaterial color="#171c1d" roughness={0.7} />
            </mesh>
          )}
        </group>
      ))}

      <mesh position={[2.65, 0.067, -0.84]} castShadow>
        <boxGeometry args={[0.31, 0.06, 0.25]} />
        <meshStandardMaterial color="#16191c" roughness={0.65} />
      </mesh>

      <mesh position={[0, 0.045, -1.12]}>
        <boxGeometry args={[0.34, 0.12, 0.14]} />
        <meshStandardMaterial
          color="#a9abb0"
          metalness={0.88}
          roughness={0.24}
        />
      </mesh>

      {screwPositions.map(([x, z], index) => (
        <Screw key={index} x={x} y={0.045} z={z} />
      ))}
    </group>
  );
}

export function KeyboardCase({ accent }: Props) {
  return (
    <group position={[0, -1.1, 0]}>
      <RoundedBox
        args={[BOARD_WIDTH + 0.29, 0.3, BOARD_DEPTH + 0.29]}
        radius={0.11}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={accent}
          metalness={0.74}
          roughness={0.27}
          clearcoat={0.45}
          clearcoatRoughness={0.25}
        />
      </RoundedBox>

      <RoundedBox
        args={[BOARD_WIDTH - 0.1, 0.028, BOARD_DEPTH - 0.1]}
        radius={0.045}
        smoothness={3}
        position={[0, 0.158, 0]}
      >
        <meshStandardMaterial
          color="#17151d"
          metalness={0.3}
          roughness={0.52}
        />
      </RoundedBox>

      {[-1, 1].map((side) => (
        <group key={side}>
          <RoundedBox
            args={[BOARD_WIDTH + 0.06, 0.055, 0.075]}
            radius={0.018}
            smoothness={2}
            position={[0, 0.168, side * (BOARD_DEPTH / 2 + 0.065)]}
          >
            <meshStandardMaterial
              color={accent}
              metalness={0.84}
              roughness={0.23}
            />
          </RoundedBox>

          <RoundedBox
            args={[0.075, 0.055, BOARD_DEPTH + 0.07]}
            radius={0.018}
            smoothness={2}
            position={[side * (BOARD_WIDTH / 2 + 0.065), 0.168, 0]}
          >
            <meshStandardMaterial
              color={accent}
              metalness={0.84}
              roughness={0.23}
            />
          </RoundedBox>
        </group>
      ))}

      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <RoundedBox
            key={`${x}-${z}`}
            args={[0.55, 0.065, 0.23]}
            radius={0.035}
            smoothness={2}
            position={[x * 2.64, -0.182, z * 0.77]}
          >
            <meshStandardMaterial color="#18181c" roughness={0.9} />
          </RoundedBox>
        )),
      )}

      <mesh position={[0, -0.015, -1.296]}>
        <boxGeometry args={[0.31, 0.083, 0.007]} />
        <meshStandardMaterial color="#111015" roughness={0.68} />
      </mesh>

      <mesh position={[0, -0.015, -1.301]}>
        <boxGeometry args={[0.18, 0.039, 0.008]} />
        <meshStandardMaterial
          color="#77767d"
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      {screwPositions.map(([x, z], index) => (
        <Screw key={index} x={x} y={0.179} z={z} />
      ))}
    </group>
  );
}

function KeyboardModel({
  accent,
  hovered,
  onHover,
  lineRef,
  dotRef,
}: Props & {
  hovered: Layer | null;
  onHover: (layer: Layer | null) => void;
  lineRef: React.RefObject<SVGPathElement | null>;
  dotRef: React.RefObject<SVGCircleElement | null>;
}) {
  const modelRef = useRef<Group>(null);
  const projected = useMemo(() => new Vector3(), []);

  useFrame(({ camera, size }) => {
    if (!hovered || !modelRef.current || !lineRef.current || !dotRef.current)
      return;

    const y = layerDetails[hovered].y;

    modelRef.current.updateWorldMatrix(true, false);
    projected.set(1.55, y, 0);
    modelRef.current.localToWorld(projected);
    projected.project(camera);

    const x = (projected.x * 0.5 + 0.5) * size.width;
    const screenY = (-projected.y * 0.5 + 0.5) * size.height;
    const endX = size.width - 130;
    const endY = size.height * 0.28 + 56;

    lineRef.current.setAttribute(
      "d",
      `M ${x} ${screenY} L ${Math.min(
        endX - 20,
        x + 55,
      )} ${screenY} L ${endX} ${endY}`,
    );

    dotRef.current.setAttribute("cx", String(x));
    dotRef.current.setAttribute("cy", String(screenY));
  });

  const handleOver = (layer: Layer) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover(layer);
  };

  const handleOut = () => onHover(null);

  return (
    <Float speed={1.3} floatIntensity={0.15} rotationIntensity={0.02}>
      <group ref={modelRef} rotation={[0.12, -0.45, 0]}>
        <group
          onPointerOver={handleOver("keycaps")}
          onPointerOut={handleOut}
          position={[0, hovered === "keycaps" ? 0.1 : 0, 0]}
        >
          {keys.map((key, index) => (
            <Keycap key={index} keyData={key} accent={accent} />
          ))}
        </group>

        <group
          onPointerOver={handleOver("switches")}
          onPointerOut={handleOut}
          position={[0, hovered === "switches" ? 0.09 : 0, 0]}
        >
          {keys.map((key, index) => (
            <MechanicalSwitch key={index} keyData={key} accent={accent} />
          ))}
        </group>

        <group
          onPointerOver={handleOver("plate")}
          onPointerOut={handleOut}
          position={[0, hovered === "plate" ? 0.075 : 0, 0]}
        >
          <MountingPlate />
        </group>

        <group
          onPointerOver={handleOver("pcb")}
          onPointerOut={handleOut}
          position={[0, hovered === "pcb" ? 0.07 : 0, 0]}
        >
          <PCB />
        </group>

        <group
          onPointerOver={handleOver("case")}
          onPointerOut={handleOut}
          position={[0, hovered === "case" ? -0.06 : 0, 0]}
        >
          <KeyboardCase accent={accent} />
        </group>
      </group>
    </Float>
  );
}

export default function Keyboard3D({ accent }: Props) {
  const [hovered, setHovered] = useState<Layer | null>(null);

  const lineRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  const detail = hovered ? layerDetails[hovered] : null;

  return (
    <div
      className="relative h-[560px] w-full"
      aria-label="Interactive exploded mechanical keyboard model. Drag to rotate and scroll to zoom."
      onPointerLeave={() => setHovered(null)}
    >
      <Canvas
        camera={{ position: [0, 2.8, 7.5], fov: 40 }}
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1.15} />

        <hemisphereLight args={["#ffffff", "#40354f", 1.1]} />

        <directionalLight
          position={[4, 8, 5]}
          intensity={3.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <directionalLight
          position={[-5, 3, -4]}
          intensity={1.8}
          color="#c4b8e7"
        />

        <pointLight position={[-3, 4, 2]} intensity={9} color={accent} />

        <KeyboardModel
          accent={accent}
          hovered={hovered}
          onHover={setHovered}
          lineRef={lineRef}
          dotRef={dotRef}
        />

        <OrbitControls
          makeDefault
          enableRotate
          enableZoom
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          autoRotate
          autoRotateSpeed={0.35}
          minDistance={5}
          maxDistance={13}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          onStart={() => setHovered(null)}
        />
      </Canvas>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <path
          ref={lineRef}
          d=""
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            opacity: hovered ? 0.95 : 0,
            filter: `drop-shadow(0 0 5px ${accent})`,
            transition: "opacity 180ms ease",
          }}
        />

        <circle
          ref={dotRef}
          r="4"
          fill={accent}
          style={{
            opacity: hovered ? 1 : 0,
            filter: `drop-shadow(0 0 7px ${accent})`,
            transition: "opacity 180ms ease",
          }}
        />
      </svg>

      <div
        className="pointer-events-none absolute right-0 top-[28%] z-10 w-[min(240px,40%)] rounded-xl border px-4 py-3 shadow-xl backdrop-blur-xl transition-all duration-200"
        style={{
          borderColor: accent,
          backgroundColor: "rgba(16, 13, 24, 0.88)",
          boxShadow: `0 0 22px ${accent}35`,
          opacity: detail ? 1 : 0,
          transform: detail ? "translateY(0)" : "translateY(8px)",
        }}
        aria-hidden={!detail}
      >
        <div className="mb-1 text-sm font-semibold text-white">
          {detail?.title}
        </div>

        <p className="text-xs leading-relaxed text-white/75">
          {detail?.description}
        </p>
      </div>
    </div>
  );
}
