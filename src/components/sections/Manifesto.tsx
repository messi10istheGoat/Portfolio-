import { profile } from "@/data/profile";

const manifesto = [
  { index: "I", word: "RAW", tail: "STRUCTURE", note: "Grids, borders, hard edges. The skeleton is never hidden." },
  { index: "II", word: "REFINED", tail: "EXECUTION", note: "Every surface earns its place. Detail is not decoration." },
  { index: "III", word: "ENGINEERED", tail: "TO CREATE", note: "Typed contracts, measured performance, shipped products." },
];

export function Manifesto() {
  return (
    <section aria-label="Design manifesto" className="relative overflow-hidden border-y border-white/10 bg-[#0a0b0f]">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-20" aria-hidden />
      <div className="shell relative">
        <div className="flex flex-col gap-2 border-b border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="mono text-[14px] text-accent">MANIFESTO / v1.0</span>
          <span className="mono text-[14px] text-fog">
            {profile.role.toUpperCase()} — {profile.location.toUpperCase()}
          </span>
        </div>
        <div className="grid divide-white/10 sm:grid-cols-3 sm:divide-x">
          {manifesto.map((item, index) => (
            <div
              key={item.index}
              className={`group relative py-7 sm:px-6 ${index === 0 ? "sm:pl-0" : ""} ${
                index < manifesto.length - 1 ? "border-b border-white/10 sm:border-b-0" : ""
              }`}
            >
              <span className="font-mono text-[14px] text-fog">/{item.index}</span>
              <p className="display mt-2 text-[clamp(1.6rem,3.6vw,2.7rem)] leading-[0.95] transition-colors duration-500 group-hover:text-accent">
                {item.word}
                <br />
                <span className="text-outline">{item.tail}</span>
              </p>
              <p className="body-copy mt-3 max-w-[30ch] text-[15px]">{item.note}</p>
              <span className="mt-4 block h-px w-full bg-white/10">
                <span className="block h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
