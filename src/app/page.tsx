"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
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

    const layout = [
      ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Y", "X", "C", "V", "B", "N", "M"],
    ];

    const keyboardContainer = document.createElement("div");
    keyboardContainer.className =
      "keyboard flex flex-col gap-2 w-full max-w-3xl";
    document.body.appendChild(keyboardContainer);

    const renderPads = () => {
      keyboardContainer.innerHTML = "";
      layout.forEach((row, rIdx) => {
        const rowEl = document.createElement("div");
        rowEl.className = "row flex gap-2 justify-center w-full";
        row.forEach((key, kIdx) => {
          const pad = document.createElement("div");
          pad.className =
            "pad flex-1 aspect-square rounded-lg bg-gradient-to-br from-[#1e2550] to-[#0e1228] flex flex-col items-center justify-center cursor-pointer relative transition-transform duration-100";
          pad.dataset.key = key;
          pad.style.setProperty(
            "--accent",
            colors[(rIdx * 2 + kIdx) % colors.length],
          );
          pad.innerHTML = `<span class="key font-bold text-lg">${key}</span><span class="type text-xs opacity-60">${soundData[key].name}</span>`;
          const play = (e: Event) => {
            e.preventDefault();
            trigger(key);
          };
          pad.addEventListener("mousedown", play);
          pad.addEventListener("touchstart", play);
          rowEl.appendChild(pad);
        });
        keyboardContainer.appendChild(rowEl);
      });
    };

    const trigger = (k: string) => {
      const pad = document.querySelector(`.pad[data-key="${k}"]`);
      if (!pad) return;
      pad.classList.add("active");
      setTimeout(() => pad.classList.remove("active"), 120);
      const s = soundData[k];
      hit({ type: s.type, freq: s.freq, decay: 0.18, noise: s.noise });
    };

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

    window.addEventListener("keydown", (e) =>
      trigger((e.key || "").toUpperCase()),
    );
    window.addEventListener("resize", renderPads);
    renderPads();

    const toggle = document.createElement("div");
    toggle.id = "modeToggle";
    toggle.className =
      "toggle absolute top-4 right-4 w-11 h-11 rounded-full border border-white grid place-items-center cursor-pointer";
    document.body.appendChild(toggle);
    toggle.addEventListener("click", () =>
      document.body.classList.toggle("light"),
    );

    const credit = document.createElement("div");
    credit.className = "credit absolute bottom-3 text-xs opacity-50";
    credit.innerHTML =
      'made with ❤️ <a href="https://github.com/alton47" target="_blank">Allan</a>';
    document.body.appendChild(credit);
  }, []);

  return null;
}
