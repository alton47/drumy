"use client";

import { useEffect, useState, useRef } from "react";

const colors = [
  "#ff6b6b",
  "#ffd166",
  "#4dd4ff",
  "#b388ff",
  "#6effa8",
  "#ff9f1c",
  "#ff7edb",
  "#7cf6ff",
];

const soundData: Record<
  string,
  { type: OscillatorType; freq: number; noise: boolean; name: string }
> = {
  Q: { type: "sine", freq: 120, noise: true, name: "kick" },
  W: { type: "triangle", freq: 200, noise: false, name: "snare" },
  E: { type: "square", freq: 300, noise: true, name: "hi-hat" },
  R: { type: "sawtooth", freq: 150, noise: false, name: "tom" },
  T: { type: "sine", freq: 220, noise: true, name: "metal" },
  Z: { type: "triangle", freq: 180, noise: false, name: "clap" },
  U: { type: "square", freq: 250, noise: true, name: "rim" },
  I: { type: "sine", freq: 140, noise: false, name: "shaker" },
  O: { type: "sawtooth", freq: 320, noise: true, name: "cowbell" },
  P: { type: "triangle", freq: 210, noise: false, name: "tamb" },
  A: { type: "square", freq: 190, noise: true, name: "kick2" },
  S: { type: "sine", freq: 170, noise: false, name: "snare2" },
  D: { type: "sawtooth", freq: 260, noise: true, name: "hat2" },
  F: { type: "triangle", freq: 240, noise: false, name: "tom2" },
  G: { type: "sine", freq: 200, noise: true, name: "metal2" },
  H: { type: "square", freq: 180, noise: false, name: "clap2" },
  J: { type: "sawtooth", freq: 230, noise: true, name: "rim2" },
  K: { type: "triangle", freq: 250, noise: false, name: "shaker2" },
  L: { type: "sine", freq: 210, noise: true, name: "cowbell2" },
  Y: { type: "square", freq: 190, noise: false, name: "tamb2" },
  X: { type: "sawtooth", freq: 220, noise: true, name: "kick3" },
  C: { type: "triangle", freq: 200, noise: false, name: "snare3" },
  V: { type: "sine", freq: 240, noise: true, name: "hat3" },
  B: { type: "square", freq: 260, noise: false, name: "tom3" },
  N: { type: "sawtooth", freq: 230, noise: true, name: "metal3" },
  M: { type: "triangle", freq: 210, noise: false, name: "clap3" },
};

export default function Drumy() {
  const [isLight, setIsLight] = useState(false);
  const [layout, setLayout] = useState<string[][]>([]);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setLayout([
          ["Q", "W", "E", "R", "T"],
          ["Z", "U", "I", "O", "P"],
          ["A", "S", "D", "F", "G"],
          ["H", "J", "K", "L", "Y"],
          ["X", "C", "V", "B", "N", "M"],
        ]);
      } else {
        setLayout([
          ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P"],
          ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
          ["Y", "X", "C", "V", "B", "N", "M"],
        ]);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", (e) => trigger(e.key.toUpperCase()));
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", (e) =>
        trigger(e.key.toUpperCase()),
      );
    };
  }, []);

  const trigger = (key: string) => {
    const s = soundData[key];
    if (!s) return;

    const pad = document.querySelector(`[data-key="${key}"]`);
    if (pad) {
      pad.classList.add("active");
      setTimeout(() => pad.classList.remove("active"), 120);
    }

    if (!audioCtx.current)
      audioCtx.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    const ctx = audioCtx.current;
    if (ctx.state === "suspended") ctx.resume();

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    if (s.noise) {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const n = ctx.createBufferSource();
      n.buffer = buf;
      n.connect(g).connect(ctx.destination);
      n.start();
    }

    const o = ctx.createOscillator();
    o.type = s.type;
    o.frequency.value = s.freq;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.18);
  };

  return (
    <main
      className={`app w-full h-full flex flex-col items-center justify-center p-[10px] relative ${isLight ? "light" : ""}`}
    >
      <div
        className="toggle"
        onClick={() => {
          setIsLight(!isLight);
          document.body.classList.toggle("light");
        }}
      />

      <header className="text-center mb-[clamp(10px,4vh,20px)]">
        <h1 className="m-0 text-[clamp(24px,6vw,36px)] font-bold">Drumy 🥁</h1>
      </header>

      <div className="keyboard flex flex-col gap-2 w-full max-w-[900px]">
        {layout.map((row, rIdx) => (
          <div key={rIdx} className="row flex gap-2 justify-center w-full">
            {row.map((key, kIdx) => (
              <div
                key={key}
                data-key={key}
                className="pad"
                style={
                  {
                    "--accent": colors[(rIdx * 2 + kIdx) % colors.length],
                  } as React.CSSProperties
                }
                onMouseDown={() => trigger(key)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  trigger(key);
                }}
              >
                <span className="key text-[clamp(14px,3.5vw,20px)] font-extrabold pointer-events-none">
                  {key}
                </span>
                <span className="type text-[clamp(7px,1.8vw,10px)] opacity-60 mt-[2px] capitalize pointer-events-none">
                  {soundData[key].name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="credit absolute bottom-3 text-[11px] opacity-50">
        made with ❤️{" "}
        <a
          href="https://github.com/alton47"
          target="_blank"
          className="font-semibold no-underline text-inherit"
        >
          Allan
        </a>
      </div>
    </main>
  );
}
