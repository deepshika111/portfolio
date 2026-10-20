// Splits text into masked spans for reveal animations; screen readers get the plain text.
export default function Split({
  text,
  by = "word",
  className = "",
  itemClass = "split-item",
}: {
  text: string;
  by?: "word" | "char";
  className?: string;
  itemClass?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block whitespace-nowrap overflow-hidden pb-[0.08em] align-bottom">
          {by === "word" ? (
            <span className={`${itemClass} inline-block`}>{w}</span>
          ) : (
            w.split("").map((c, j) => (
              <span key={j} className={`${itemClass} inline-block`}>
                {c}
              </span>
            ))
          )}
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
