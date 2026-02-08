"use client";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [ctx] = useState(
    new (window.AudioContext || (window as any).webkitAudioContext)(),
  );
  const [isLight, setIsLight] = useState(false);
  const layout = [
    ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Y", "X", "C", "V", "B", "N", "M"],
  ];

  const hit = ({
    type,
    freq,
    decay,
    noise,
  }: {
    type: OscillatorType;
    freq: number;
    decay: number;
    noise: boolean;
  }) => {
    if (ctx.state === "suspended") ctx.resume();
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay);
    if (noise) {
      const buf = ctx.createBuffer(1, ctx.sampleRate * decay, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const n = ctx.createBufferSource();
      n.buffer = buf;
      n.connect(g).connect(ctx.destination);
      n.start();
    }
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + decay);
  };

  const trigger = (key: string) => {
    const pad = document.querySelector<HTMLDivElement>(`[data-key="${key}"]`);
    if (!pad) return;
    pad.classList.add("scale-95 shadow-[0_0_20px_var(--accent)]");
    setTimeout(
      () => pad.classList.remove("scale-95", "shadow-[0_0_20px_var(--accent)]"),
      120,
    );
    hit({ ...soundData[key], decay: 0.18 });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) =>
      trigger((e.key || "").toUpperCase());
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      className={`relative w-full h-screen flex flex-col items-center justify-center transition-colors ${isLight ? "bg-[radial-gradient(circle_at_top,_var(--bg-light-accent),_var(--bg-light))] text-[#0a0d18]" : "text-white bg-[radial-gradient(circle_at_top,_#1b2350,_var(--bg-dark))]"}`}
    >
      {/* Toggle */}
      <button
        onClick={() => setIsLight(!isLight)}
        className="absolute top-4 right-4 w-11 h-11 rounded-full border border-current grid place-items-center"
      >
        <span className="w-4 h-4 rounded-full bg-current opacity-70"></span>
      </button>

      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold">Drumy 🥁</h1>
      </header>

      {/* Keyboard */}
      <div className="flex flex-col gap-2 w-full max-w-4xl">
        {layout.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2 justify-center w-full">
            {row.map((key, kIdx) => {
              const accent = colors[(rIdx * 2 + kIdx) % colors.length];
              return (
                <div
                  key={key}
                  data-key={key}
                  style={{ "--accent": accent } as React.CSSProperties}
                  onMouseDown={() => trigger(key)}
                  onTouchStart={() => trigger(key)}
                  className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer relative transition-transform duration-100 bg-gradient-to-br from-[#1e2550] to-[#0e1228]`}
                >
                  <span className="font-extrabold text-lg pointer-events-none">
                    {key}
                  </span>
                  <span className="text-xs opacity-60 pointer-events-none">
                    {soundData[key].name}
                  </span>
                  <span className="absolute inset-0 rounded-xl bg-[radial-gradient(circle,var(--accent),transparent_70%)] opacity-0 pointer-events-none transition-opacity"></span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Credit */}
      <div className="absolute bottom-3 text-xs opacity-50">
        made with ❤️{" "}
        <a
          href="https://github.com/alton47"
          target="_blank"
          className="font-semibold"
        >
          Allan
        </a>
      </div>
    </div>
  );
}
