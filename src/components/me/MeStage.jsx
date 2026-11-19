import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { asset } from "../../data/site.js";
import { buildRig, poseAt, WAVE_LEN } from "./rig.js";
import "./MeStage.css";

const SRC = asset("models/me/me.glb");

function Me({ waveSignal, onWave }) {
  const { scene } = useGLTF(SRC, false, true);
  const rig = useMemo(() => buildRig(scene), [scene]);
  const waveStart = useRef(-1);
  const lastSignal = useRef(waveSignal);
  const look = useRef({ x: 0, y: 0 });
  const music = useRef(0);
  const musicOn = useRef(false);

  useEffect(() => {
    const onBgm = (e) => (musicOn.current = !!e.detail);
    window.addEventListener("bgm", onBgm);
    return () => window.removeEventListener("bgm", onBgm);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (waveSignal !== lastSignal.current) {
      lastSignal.current = waveSignal;
      if (waveStart.current < 0) {
        waveStart.current = t;
        onWave?.();
      }
    }
    let wt = -1;
    if (waveStart.current >= 0) {
      wt = t - waveStart.current;
      if (wt > WAVE_LEN) {
        waveStart.current = -1;
        wt = -1;
      }
    }
    look.current.x = THREE.MathUtils.lerp(look.current.x, state.pointer.x, 0.05);
    look.current.y = THREE.MathUtils.lerp(look.current.y, state.pointer.y, 0.05);
    music.current = THREE.MathUtils.lerp(music.current, musicOn.current ? 1 : 0, 0.03);
    poseAt(rig, t, wt, look.current, music.current);
  });

  return <primitive object={rig.holder} />;
}

function Loading() {
  return (
    <Html center>
      <div className="me-loading pixel">Loading…</div>
    </Html>
  );
}

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <div className="me-fallback pixel">3D model unavailable</div> : this.props.children;
  }
}

export default function MeStage() {
  const [signal, setSignal] = useState(0);
  const [bubble, setBubble] = useState(false);
  const lastHover = useRef(0);

  useEffect(() => {
    const first = setTimeout(() => setSignal((s) => s + 1), 900);
    const loop = setInterval(() => setSignal((s) => s + 1), 12000);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, []);

  useEffect(() => {
    if (!bubble) return;
    const id = setTimeout(() => setBubble(false), 3000);
    return () => clearTimeout(id);
  }, [bubble]);

  const wave = () => setSignal((s) => s + 1);
  const hoverWave = () => {
    const now = performance.now();
    if (now - lastHover.current > 5000) {
      lastHover.current = now;
      wave();
    }
  };

  return (
    <div className="me-stage" onPointerEnter={hoverWave}>
      <div className={`me-bubble ${bubble ? "show" : ""}`} aria-hidden="true">
        Hi! 👋
      </div>
      <Boundary>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 1.7, 6.6], fov: 30 }}
          onCreated={({ camera }) => camera.lookAt(0, 1.62, 0)}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <hemisphereLight args={["#fff4dc", "#16403b", 0.8]} />
          <directionalLight position={[3, 5, 5]} intensity={1.9} color="#fff1dc" />
          <directionalLight position={[-4, 3, -3]} intensity={1.8} color="#3ee6d4" />
          <directionalLight position={[4, 1, -4]} intensity={1} color="#c6f24e" />
          <Suspense fallback={<Loading />}>
            <Me waveSignal={signal} onWave={() => setBubble(true)} />
          </Suspense>
          <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={5} blur={2.6} far={2} color="#000" />
        </Canvas>
      </Boundary>
      <button className="me-wave-btn pixel" onClick={wave}>
        Wave
      </button>
    </div>
  );
}

useGLTF.preload(SRC, false, true);
