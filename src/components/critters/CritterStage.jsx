import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { smoothModel } from "../three/smooth.js";
import { addExtras, extrasKey } from "./extras.js";
import "./CritterStage.css";

const TARGET_HEIGHT = 1.5;

function useNormalized(src) {
  const { scene } = useGLTF(src, false, true);
  return useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      if (o.isMesh) o.geometry = o.geometry.clone();
    });
    smoothModel(clone, { roughness: 0.6 });
    addExtras(extrasKey(src), clone);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = TARGET_HEIGHT / Math.max(size.y, size.x * 0.8, 0.0001);
    clone.position.set(-center.x * s, -box.min.y * s, -center.z * s);
    clone.scale.setScalar(s);
    return clone;
  }, [scene]);
}

function Critter({ src, seed }) {
  const object = useNormalized(src);
  const group = useRef();

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime + seed;
    const b = Math.sin(t * 2.2) * 0.025;
    const c = t % 9;
    const look = (c > 5 && c < 7 ? Math.sin(((c - 5) / 2) * Math.PI) : 0) * 0.5;
    g.scale.set(1 - b * 0.5, 1 + b, 1 - b * 0.5);
    g.position.y = Math.max(0, Math.sin(t * 2.2)) * 0.02;
    g.rotation.y = Math.sin(t * 0.5) * 0.18 + look;
    g.rotation.z = Math.sin(t * 1.1) * 0.025;
  });

  return (
    <group ref={group}>
      <primitive object={object} />
    </group>
  );
}

function Loading() {
  return (
    <Html center>
      <div className="critter-loading">Loading…</div>
    </Html>
  );
}

class CanvasBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <div className="critter-fallback">Model unavailable</div>;
    return this.props.children;
  }
}

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "120px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

export default function CritterStage({ critters, tint = "#b9e86a", initial = 0 }) {
  const [index, setIndex] = useState(Math.max(0, initial));
  const holder = useRef(null);
  const inView = useInView(holder);
  const critter = critters[index];

  return (
    <div className="critter-stage" style={{ "--stage-tint": tint }}>
      <div className="critter-canvas" ref={holder}>
        <CanvasBoundary key={critter.src}>
          <Canvas frameloop={inView ? "always" : "never"} dpr={[1, 2]} camera={{ position: [0, 1.25, 3.7], fov: 34 }} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={0.7} />
            <hemisphereLight args={["#fff6e8", "#7a9a7a", 0.9]} />
            <directionalLight position={[3, 5, 4]} intensity={1.3} />
            <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#ffe2ec" />
            <Suspense fallback={<Loading />}>
              <Critter src={critter.src} seed={index * 1.7} />
            </Suspense>
            <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={4} blur={2.6} far={2} />
            <OrbitControls target={[0, 0.7, 0]} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.05} />
          </Canvas>
        </CanvasBoundary>
      </div>
      {critters.length > 1 && (
        <div className="critter-picker" role="tablist" aria-label="Choose a character">
          {critters.map((c, i) => (
            <button key={c.name} role="tab" aria-selected={i === index} className={`picker-btn ${i === index ? "active" : ""}`} onClick={() => setIndex(i)}>
              {c.name}
            </button>
          ))}
        </div>
      )}
      <p className="critter-hint">Drag to rotate</p>
    </div>
  );
}
