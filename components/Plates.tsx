import type { Plate } from "@/lib/content";

// Line plates for each catalogue entry, drawn like the diagrams in an old technical book.
// Every path carries .plate-line so the Work section can draw it in.
const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function PlateArt({ plate, className = "" }: { plate: Plate; className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} role="img" aria-label={labels[plate]}>
      <g {...common}>{art[plate]}</g>
    </svg>
  );
}

const labels: Record<Plate, string> = {
  agents: "Diagram: a ten-step process where an agent takes over two of the steps",
  rag: "Diagram: a query pulling three relevant chunks from a grid of document chunks",
  multimodal: "Diagram: text, an image and audio feeding into a single summary",
  fraud: "Diagram: a stream of transactions with one outlier circled",
  pipeline: "Diagram: a pipeline from prep to validation feeding versioned models",
};

const P = (d: string, extra = {}) => <path className="plate-line" d={d} {...extra} />;
const T = (x: number, y: number, s: string) => (
  <text x={x} y={y} fill="currentColor" stroke="none" fontSize="9" fontFamily="Courier Prime, monospace">
    {s}
  </text>
);

const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;

const art: Record<Plate, React.ReactNode> = {
  agents: (
    <>
      {[0, 1].map((row) =>
        [0, 1, 2, 3, 4].map((c) => {
          const x = 24 + c * 58;
          const y = 40 + row * 70;
          const removed = (row === 0 && c === 2) || (row === 1 && c === 3);
          return (
            <g key={`${row}${c}`}>
              {P(box(x, y, 30, 30))}
              {removed && P(`M${x + 5} ${y + 5}L${x + 25} ${y + 25}M${x + 25} ${y + 5}L${x + 5} ${y + 25}`)}
              {c < 4 && P(`M${x + 30} ${y + 15}h28`)}
            </g>
          );
        }),
      )}
      {P("M286 70v20H39v20")}
      {P("M140 22c20-14 40-14 60 0", { strokeDasharray: "3 4" })}
      {T(148, 14, "agent")}
    </>
  ),
  rag: (
    <>
      {Array.from({ length: 20 }).map((_, i) => {
        const x = 18 + (i % 4) * 40;
        const y = 22 + Math.floor(i / 4) * 26;
        return <g key={i}>{P(box(x, y, 32, 14))}</g>;
      })}
      {[
        [58, 48],
        [138, 74],
        [98, 126],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={32} height={14} fill="currentColor" stroke="none" opacity={0.85} />
          {P(`M${x + 32} ${y + 7}C${x + 80} ${y + 7} 220 92 248 92`)}
        </g>
      ))}
      {P("M248 92a26 26 0 1 0 52 0a26 26 0 1 0-52 0")}
      {T(262, 95, "query")}
      {T(18, 172, "top-k chunks")}
    </>
  ),
  multimodal: (
    <>
      {P(box(16, 14, 56, 42))}
      {P("M24 26h40M24 34h32M24 42h38")}
      {P(box(16, 70, 56, 42))}
      {P("M20 108l16-20 10 12 8-8 14 16")}
      {P("M53 82a5 5 0 1 0 10 0a5 5 0 1 0-10 0")}
      {P("M16 148l6-10 5 18 6-26 6 30 6-22 5 14 6-8 6 6 6-4")}
      {P("M76 35C150 35 160 90 214 90M76 91h138M76 146C150 146 160 90 214 90")}
      {P(box(214, 50, 86, 80))}
      {P("M226 68h62M226 80h50M226 92h58M226 104h40M226 116h54")}
      {T(214, 146, "one summary")}
    </>
  ),
  fraud: (
    <>
      {P("M10 140h300")}
      {Array.from({ length: 34 }).map((_, i) => {
        const x = 18 + i * 8.6;
        const h = 14 + ((i * 37) % 23);
        const odd = i === 22;
        return <g key={i}>{P(`M${x} 140v${-(odd ? 96 : h)}`)}</g>;
      })}
      {P("M193.2 44a14 14 0 1 0 28 0a14 14 0 1 0-28 0")}
      {P("M222 36l30-18h40")}
      {T(254, 14, "flagged")}
      {T(10, 160, "transactions, scored as they arrive")}
    </>
  ),
  pipeline: (
    <>
      {["prep", "features", "train", "validate"].map((s, i) => {
        const x = 10 + i * 78;
        return (
          <g key={s}>
            {P(box(x, 30, 64, 30))}
            {T(x + 8, 49, s)}
            {i < 3 && P(`M${x + 64} 45h14M${x + 72} 41l6 4-6 4`)}
          </g>
        );
      })}
      {P("M276 60v34")}
      {[0, 1, 2].map((i) => (
        <g key={i}>{P(box(214 + i * 10, 96 + i * 12, 70, 40))}</g>
      ))}
    </>
  ),
};
