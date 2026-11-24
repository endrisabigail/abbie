import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import "./KodaMoods.css";

const ANIMALS = ["bear", "frog", "bunny", "koala", "fox", "panda"];
const MOODS = [
  ["happy", "Happy"],
  ["energetic", "Energetic"],
  ["quiet", "Quiet"],
  ["angry", "Angry"],
  ["crying", "Crying"],
  ["hungry", "Hungry"],
  ["feeding", "Feeding"],
  ["sleepy", "Sleepy"],
  ["sleeping", "Sleeping"],
  ["woke", "Waking up"],
  ["playtime", "Playtime"],
  ["diaper", "Diaper change"],
];

const FILE = {
  happy: "Happy",
  energetic: "Energetic",
  quiet: "Quiet",
  angry: "Angry",
  crying: "Crying",
  hungry: "Hungry",
  feeding: "Feeding",
  sleepy: "Sleepy",
  sleeping: "Sleeping",
  woke: "Woke",
  playtime: "Playtime",
  diaper: "Diaper",
};

const modules = import.meta.glob("./animations/*/*.jsx");
const cache = {};
function getComp(animal, mood) {
  const key = `${animal}/${mood}`;
  if (!cache[key]) {
    const name = `${FILE[mood]}${animal[0].toUpperCase()}${animal.slice(1)}`;
    const loader = modules[`./animations/${animal}/${name}.jsx`];
    cache[key] = loader ? lazy(loader) : null;
  }
  return cache[key];
}

const DAY = { exposure: 1.15, ambient: 0.9, ambientColor: "#fff4e2", sun: 2.0, sunColor: "#fff0cf", rim: 0.6, rimColor: "#b6e3d6", hemiSky: "#ffffff", hemiGround: "#6f9a6e", hemi: 0.95 };
const LIGHTS = {
  frog: { exposure: 1.15, ambient: 0.8, ambientColor: "#fff6e6", sun: 2.1, sunColor: "#fff3d6", rim: 0.45, rimColor: "#a8e0ea", hemiSky: "#f0ffe6", hemiGround: "#4a6b47", hemi: 0.95 },
  bunny: { exposure: 1.15, ambient: 0.72, ambientColor: "#fff4e2", sun: 2.0, sunColor: "#ffeec2", rim: 0.35, rimColor: "#ffcfa0", hemiSky: "#fff0c4", hemiGround: "#8a7a42", hemi: 0.9 },
  fox: { exposure: 1.12, ambient: 0.78, ambientColor: "#fff0dc", sun: 2.0, sunColor: "#ffe2b8", rim: 0.45, rimColor: "#ffc48a", hemiSky: "#fff2d8", hemiGround: "#7a5a36", hemi: 0.9 },
  koala: { exposure: 1.12, ambient: 0.8, ambientColor: "#f6f4ec", sun: 2.0, sunColor: "#fff1d6", rim: 0.45, rimColor: "#c8e2d0", hemiSky: "#eef6ea", hemiGround: "#5e6e52", hemi: 0.92 },
};

function makeMatte(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    if (!o.userData.kodaShadow && !o.isSprite) {
      o.castShadow = true;
      o.receiveShadow = true;
      o.userData.kodaShadow = true;
    }
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => {
      if (!m || m.userData.kodaMatte) return;
      if ("roughness" in m) m.roughness = 1;
      if ("metalness" in m) m.metalness = 0;
      if ("clearcoat" in m) m.clearcoat = 0;
      if ("specularIntensity" in m) m.specularIntensity = 0;
      m.userData.kodaMatte = true;
      m.needsUpdate = true;
    });
  });
}

function MatteScene() {
  const { scene } = useThree();
  const tick = useRef(0);
  useFrame(() => {
    tick.current += 1;
    if (tick.current % 30 === 1) makeMatte(scene);
  });
  return null;
}

function ExposureSync({ exposure }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMappingExposure = exposure;
  }, [gl, exposure]);
  return null;
}

function Loading() {
  return (
    <Html center>
      <div className="km-loading">Loading…</div>
    </Html>
  );
}

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <div className="km-fallback">Animation unavailable</div> : this.props.children;
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

export default function KodaMoods({ tint = "#b9e86a", initialAnimal = "bear" }) {
  const [animal, setAnimal] = useState(ANIMALS.includes(initialAnimal) ? initialAnimal : "bear");
  const [mood, setMood] = useState("happy");
  const holder = useRef(null);
  const inView = useInView(holder);
  const Comp = getComp(animal, mood);
  const L = LIGHTS[animal] || DAY;

  return (
    <div className="km" style={{ "--km-tint": tint }}>
      <div className="km-canvas" ref={holder}>
        <Boundary key={`${animal}-${mood}`}>
          <Canvas
            frameloop={inView ? "always" : "never"}
            shadows="soft"
            gl={{ alpha: true, antialias: true, toneMappingExposure: L.exposure }}
            dpr={[1, 2]}
            camera={{ position: [0, 1.05, 4.4], fov: 34 }}
            onCreated={({ camera }) => camera.lookAt(0, 0.85, 0)}
          >
            <ExposureSync exposure={L.exposure} />
            <ambientLight intensity={L.ambient} color={L.ambientColor} />
            <directionalLight
              position={[5, 8, 3]}
              intensity={L.sun}
              color={L.sunColor}
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0004}
              shadow-camera-left={-3}
              shadow-camera-right={3}
              shadow-camera-top={3}
              shadow-camera-bottom={-3}
            />
            <directionalLight position={[-5, 3, -4]} intensity={L.rim} color={L.rimColor} />
            <hemisphereLight args={[L.hemiSky, L.hemiGround, L.hemi]} />
            <MatteScene />
            <Suspense fallback={<Loading />}>{Comp && <Comp referenceHeight={1.8} variant={mood === "diaper" ? "wet" : "good"} />}</Suspense>
          </Canvas>
        </Boundary>
        <span className="km-label">{MOODS.find(([m]) => m === mood)?.[1]}</span>
      </div>

      <div className="km-row" role="tablist" aria-label="Character">
        {ANIMALS.map((a) => (
          <button key={a} role="tab" aria-selected={a === animal} className={`km-btn ${a === animal ? "on" : ""}`} onClick={() => setAnimal(a)}>
            {a[0].toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>
      <div className="km-row moods" aria-label="Mood">
        {MOODS.map(([m, label]) => (
          <button key={m} className={`km-chip ${m === mood ? "on" : ""}`} aria-pressed={m === mood} onClick={() => setMood(m)}>
            {label}
          </button>
        ))}
      </div>
      <p className="km-hint">Each mood plays when that activity or mood is logged in the app.</p>
    </div>
  );
}
