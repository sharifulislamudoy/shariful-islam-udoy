import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const SECTIONS = [
  { id: 'home', label: 'DEVELOPER.OS' },
  { id: 'about', label: 'IDENTITY' },
  { id: 'skills', label: 'TECH STACK' },
  { id: 'projects', label: 'BUILDS' },
  { id: 'experience', label: 'TIMELINE' },
  { id: 'education', label: 'KNOWLEDGE' },
  { id: 'achievement', label: 'MILESTONES' },
  { id: 'contact', label: 'CONNECT' },
];

const blue = '#3b82f6';
const cyan = '#22d3ee';
const dark = '#07111f';

function Float({ children, speed = 1, rotationIntensity = 0.5, floatIntensity = 0.5 }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.elapsedTime * speed;
    ref.current.position.y = Math.sin(time) * 0.16 * floatIntensity;
    ref.current.rotation.x = Math.sin(time * 0.72) * 0.08 * rotationIntensity;
    ref.current.rotation.z = Math.cos(time * 0.58) * 0.07 * rotationIntensity;
  });

  return <group ref={ref}>{children}</group>;
}

function RoundedBox({ args, children, ...props }) {
  return (
    <mesh {...props}>
      <boxGeometry args={args} />
      {children}
    </mesh>
  );
}

function GlowMaterial({ color = blue, opacity = 0.75, wireframe = false }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.65}
      metalness={0.72}
      roughness={0.2}
      transparent
      opacity={opacity}
      wireframe={wireframe}
    />
  );
}

function CodeLaptop() {
  const group = useRef();

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.45) * 0.12;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.18} floatIntensity={0.42}>
      <group ref={group} rotation={[-0.08, -0.28, 0]}>
        <RoundedBox args={[3.5, 2.25, 0.16]} radius={0.12} smoothness={4} position={[0, 0.35, 0]}>
          <meshStandardMaterial color="#101827" metalness={0.88} roughness={0.22} />
        </RoundedBox>
        <RoundedBox args={[3.18, 1.91, 0.035]} radius={0.08} smoothness={4} position={[0, 0.35, 0.1]}>
          <meshStandardMaterial color="#020617" emissive="#07162b" emissiveIntensity={0.45} />
        </RoundedBox>
        {[0.95, 0.48, 0, -0.48].map((y, index) => (
          <group key={y} position={[-0.85, y, 0.145]}>
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[0.18, 0.08, 0.025]} />
              <GlowMaterial color={index % 2 ? cyan : blue} />
            </mesh>
            <mesh position={[0.16, 0, 0]}>
              <boxGeometry args={[index === 2 ? 1.4 : 0.95, 0.08, 0.025]} />
              <GlowMaterial color={index % 2 ? blue : cyan} opacity={0.85} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -1.06, -0.06]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[4.1, 0.12, 1.6]} />
          <meshStandardMaterial color="#111827" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, -0.98, 0.25]}>
          <boxGeometry args={[0.85, 0.025, 0.55]} />
          <GlowMaterial color={blue} opacity={0.35} />
        </mesh>
      </group>
    </Float>
  );
}

function IdentityCore() {
  return (
    <Float speed={1.4} rotationIntensity={0.55} floatIntensity={0.35}>
      <group>
        <mesh>
          <icosahedronGeometry args={[1.35, 2]} />
          <GlowMaterial color={cyan} opacity={0.32} wireframe />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.72, 1]} />
          <GlowMaterial color={blue} opacity={0.78} />
        </mesh>
        {[0, Math.PI / 2].map((rotation, index) => (
          <mesh key={rotation} rotation={[rotation, 0.35, 0]}>
            <torusGeometry args={[1.85 + index * 0.2, 0.018, 10, 96]} />
            <GlowMaterial color={index ? blue : cyan} opacity={0.7} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function SkillsOrbit() {
  const group = useRef();
  const nodes = useMemo(() => Array.from({ length: 9 }, (_, index) => {
    const angle = (index / 9) * Math.PI * 2;
    return [Math.cos(angle) * 2, Math.sin(angle) * 1.35, Math.sin(angle * 2) * 0.55];
  }), []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.12;
  });

  return (
    <group ref={group}>
      <mesh rotation={[0.4, 0.2, 0]}>
        <octahedronGeometry args={[0.9, 0]} />
        <GlowMaterial color={blue} opacity={0.85} />
      </mesh>
      <mesh rotation={[1.1, 0.25, 0.3]}>
        <torusGeometry args={[2, 0.025, 8, 96]} />
        <GlowMaterial color={cyan} opacity={0.5} />
      </mesh>
      {nodes.map((position, index) => (
        <Float key={index} speed={1 + index * 0.08} floatIntensity={0.4}>
          <mesh position={position}>
            {index % 3 === 0 ? <boxGeometry args={[0.42, 0.42, 0.42]} /> : <sphereGeometry args={[0.22, 18, 18]} />}
            <GlowMaterial color={index % 2 ? cyan : blue} opacity={0.82} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ProjectStack() {
  return (
    <Float speed={1.2} rotationIntensity={0.24} floatIntensity={0.35}>
      <group rotation={[0.08, -0.42, -0.04]}>
        {[0, 1, 2].map((index) => (
          <group key={index} position={[index * 0.38 - 0.35, index * 0.26 - 0.25, -index * 0.5]}>
            <RoundedBox args={[3.1, 1.75, 0.12]} radius={0.1} smoothness={4}>
              <meshStandardMaterial color={index === 0 ? '#111827' : '#0b1220'} metalness={0.75} roughness={0.25} />
            </RoundedBox>
            <mesh position={[0, 0.47, 0.08]}>
              <boxGeometry args={[2.65, 0.28, 0.03]} />
              <GlowMaterial color={index % 2 ? cyan : blue} opacity={0.65} />
            </mesh>
            <mesh position={[-0.62, -0.18, 0.08]}>
              <boxGeometry args={[1.05, 0.78, 0.03]} />
              <GlowMaterial color={cyan} opacity={0.24} />
            </mesh>
            <mesh position={[0.72, -0.18, 0.08]}>
              <boxGeometry args={[1.25, 0.78, 0.03]} />
              <GlowMaterial color={blue} opacity={0.22} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

function Timeline() {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.16;
  });

  return (
    <group ref={group} rotation={[0.15, 0, -0.18]}>
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 4.1, 12]} />
        <GlowMaterial color={cyan} opacity={0.55} />
      </mesh>
      {[-1.6, -0.8, 0, 0.8, 1.6].map((y, index) => (
        <Float key={y} speed={1.3 + index * 0.1} floatIntensity={0.25}>
          <group position={[index % 2 ? 0.65 : -0.65, y, 0]}>
            <mesh position={[index % 2 ? -0.32 : 0.32, 0, 0]}>
              <boxGeometry args={[0.65, 0.025, 0.025]} />
              <GlowMaterial color={blue} opacity={0.6} />
            </mesh>
            <RoundedBox args={[0.65, 0.5, 0.3]} radius={0.08} smoothness={3}>
              <GlowMaterial color={index % 2 ? cyan : blue} opacity={0.72} />
            </RoundedBox>
          </group>
        </Float>
      ))}
    </group>
  );
}

function KnowledgeBook() {
  return (
    <Float speed={1.3} rotationIntensity={0.28} floatIntensity={0.45}>
      <group rotation={[-0.55, 0, 0.05]}>
        <RoundedBox args={[1.9, 2.55, 0.16]} radius={0.08} smoothness={4} position={[-0.94, 0, 0]} rotation={[0, 0.2, -0.03]}>
          <meshStandardMaterial color="#101827" metalness={0.62} roughness={0.28} />
        </RoundedBox>
        <RoundedBox args={[1.9, 2.55, 0.16]} radius={0.08} smoothness={4} position={[0.94, 0, 0]} rotation={[0, -0.2, 0.03]}>
          <meshStandardMaterial color="#101827" metalness={0.62} roughness={0.28} />
        </RoundedBox>
        {[-0.55, 0, 0.55].map((y, index) => (
          <group key={y} position={[0, y, 0.16]}>
            <mesh position={[-0.95, 0, 0]} rotation={[0, 0.2, 0]}>
              <boxGeometry args={[1.25 - index * 0.12, 0.035, 0.025]} />
              <GlowMaterial color={index % 2 ? cyan : blue} opacity={0.7} />
            </mesh>
            <mesh position={[0.95, 0, 0]} rotation={[0, -0.2, 0]}>
              <boxGeometry args={[1.25 - index * 0.08, 0.035, 0.025]} />
              <GlowMaterial color={index % 2 ? blue : cyan} opacity={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

function Trophy() {
  return (
    <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.42}>
      <group rotation={[0.05, -0.2, 0]}>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.75, 0.38, 1.35, 32, 1, true]} />
          <GlowMaterial color={cyan} opacity={0.65} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.22, 0.75, 24]} />
          <GlowMaterial color={blue} opacity={0.78} />
        </mesh>
        <RoundedBox args={[1.4, 0.22, 0.72]} radius={0.1} smoothness={4} position={[0, -0.78, 0]}>
          <meshStandardMaterial color={dark} metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.83, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.52, 0.07, 14, 48, Math.PI]} />
            <GlowMaterial color={blue} opacity={0.72} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function ContactGlobe() {
  return (
    <Float speed={1.25} rotationIntensity={0.5} floatIntensity={0.38}>
      <group rotation={[0.25, 0, -0.14]}>
        <mesh>
          <sphereGeometry args={[1.45, 24, 18]} />
          <GlowMaterial color={cyan} opacity={0.28} wireframe />
        </mesh>
        {[0, 0.7, -0.7].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[Math.sqrt(1 - (y / 1.55) ** 2), Math.sqrt(1 - (y / 1.55) ** 2), 1]}>
            <torusGeometry args={[1.45, 0.018, 8, 72]} />
            <GlowMaterial color={blue} opacity={0.42} />
          </mesh>
        ))}
        <mesh rotation={[1.05, 0.1, 0.6]}>
          <torusGeometry args={[2.05, 0.026, 10, 100]} />
          <GlowMaterial color={cyan} opacity={0.65} />
        </mesh>
        <mesh position={[1.75, 0.5, 0.62]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <GlowMaterial color={blue} opacity={0.95} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const points = useRef();
  const positions = useMemo(() => {
    const values = new Float32Array(210 * 3);
    for (let i = 0; i < 210; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 15;
      values[i * 3 + 1] = (Math.random() - 0.5) * 10;
      values[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return values;
  }, []);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.018;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={cyan} size={0.018} transparent opacity={0.52} sizeAttenuation />
    </points>
  );
}

const MODELS = [CodeLaptop, IdentityCore, SkillsOrbit, ProjectStack, Timeline, KnowledgeBook, Trophy, ContactGlobe];

function WorldRig({ activeIndex, scrollProgress, reducedMotion }) {
  const root = useRef();
  const modelRefs = useRef([]);
  const { size, camera } = useThree();

  useFrame((state, delta) => {
    const desktop = size.width >= 1024;
    const targetX = desktop ? 2.65 : 0;
    const targetY = desktop ? -0.08 : 0.25;
    const pointerX = reducedMotion ? 0 : state.pointer.x;
    const pointerY = reducedMotion ? 0 : state.pointer.y;

    if (root.current) {
      root.current.position.x = THREE.MathUtils.damp(root.current.position.x, targetX, 3, delta);
      root.current.position.y = THREE.MathUtils.damp(root.current.position.y, targetY, 3, delta);
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointerX * 0.24 + scrollProgress * 0.22, 4, delta);
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -pointerY * 0.14, 4, delta);
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointerX * 0.34, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointerY * 0.22, 3, delta);
    camera.lookAt(0, 0, 0);

    modelRefs.current.forEach((model, index) => {
      if (!model) return;
      const targetScale = index === activeIndex ? (desktop ? 1 : 0.72) : 0.001;
      const value = THREE.MathUtils.damp(model.scale.x, targetScale, 5.5, delta);
      model.scale.setScalar(value);
      model.rotation.z = THREE.MathUtils.damp(model.rotation.z, index === activeIndex ? scrollProgress * 0.34 : 0, 3, delta);
    });
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[4, 4, 5]} color={cyan} intensity={16} distance={15} />
      <pointLight position={[-4, -2, 3]} color={blue} intensity={12} distance={14} />
      <ParticleField />
      <group ref={root}>
        {MODELS.map((Model, index) => (
          <group key={SECTIONS[index].id} ref={(node) => { modelRefs.current[index] = node; }} scale={index === 0 ? 1 : 0.001}>
            <Model />
          </group>
        ))}
      </group>
    </>
  );
}

export default function DeveloperWorld() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);

    const updateScene = () => {
      const marker = window.innerHeight * 0.48;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      SECTIONS.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const distance = rect.top <= marker && rect.bottom >= marker
          ? 0
          : Math.min(Math.abs(rect.top - marker), Math.abs(rect.bottom - marker));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      const height = document.documentElement.scrollHeight - window.innerHeight;
      setActiveIndex(closestIndex);
      setScrollProgress(height > 0 ? window.scrollY / height : 0);
    };

    updateScene();
    window.addEventListener('scroll', updateScene, { passive: true });
    window.addEventListener('resize', updateScene);
    return () => {
      media.removeEventListener('change', updateMotion);
      window.removeEventListener('scroll', updateScene);
      window.removeEventListener('resize', updateScene);
    };
  }, []);

  return (
    <>
      <div className="developer-world" aria-hidden="true">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 8], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <WorldRig activeIndex={activeIndex} scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </div>

      <div className="scene-status" aria-hidden="true">
        <span className="scene-status__index">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="scene-status__line" />
        <span>{SECTIONS[activeIndex].label}</span>
      </div>

      <div className="scroll-rail" aria-hidden="true">
        <span style={{ height: `${Math.max(4, scrollProgress * 100)}%` }} />
      </div>
    </>
  );
}
