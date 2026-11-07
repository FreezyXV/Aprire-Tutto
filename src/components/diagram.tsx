import { Fragment } from "react";
import { ArrowDown, ArrowRight, CornerUpLeft } from "lucide-react";
import type { Diagram as D } from "@/lib/types";
import { diagramToText } from "@/lib/diagram-text";

/**
 * Data-driven diagrams in HTML/CSS: they reflow to the iPhone width
 * (vertical on mobile), keep selectable text, and ship a text equivalent.
 */
export function Diagram({ diagram }: { diagram: D }) {
  return (
    <figure className={`diagram diagram-${diagram.kind}`}>
      <figcaption className="diagram-title">{diagram.title}</figcaption>
      <div className="diagram-body" aria-hidden="true">
        <Body d={diagram} />
      </div>
      <p className="diagram-caption">{diagram.caption}</p>
      <details className="diagram-text">
        <summary>Lire le schéma en texte</summary>
        <ul>
          {diagramToText(diagram).map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </details>
    </figure>
  );
}

function Body({ d }: { d: D }) {
  switch (d.kind) {
    case "flow":
      return (
        <>
          <ol className="flow-steps">
            {d.steps.map((s, i) => (
              <Fragment key={`${s.label}-${i}`}>
                {i > 0 && (
                  <li className="flow-arrow" role="presentation">
                    <ArrowRight className="wide-only" size={18} />
                    <ArrowDown className="narrow-only" size={18} />
                  </li>
                )}
                <li className={`flow-step tone-${s.tone ?? "neutral"}`}>
                  <strong>{s.label}</strong>
                  {s.note && <span>{s.note}</span>}
                </li>
              </Fragment>
            ))}
          </ol>
          {d.loop && (
            <p className="flow-loop">
              <CornerUpLeft size={16} /> {d.loop.label} (de «{" "}
              {d.steps[d.loop.from]?.label} » vers « {d.steps[d.loop.to]?.label}{" "}
              »)
            </p>
          )}
        </>
      );
    case "quadrant":
      return (
        <div className="quadrant">
          <span className="quadrant-y">{d.yAxis} ↑</span>
          <div className="quadrant-grid">
            {d.cells.map((c) => (
              <div
                key={c.title}
                className={`quadrant-cell tone-${c.tone ?? "neutral"}`}
              >
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
          <span className="quadrant-x">{d.xAxis} →</span>
        </div>
      );
    case "table":
      return (
        <table className="diagram-table">
          <thead>
            <tr>
              {d.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.rows.map((r) => (
              <tr key={r.join("|")}>
                {r.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} data-label={d.columns[i]}>
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "lanes":
      return (
        <div
          className="lanes"
          style={{ ["--lanes" as string]: d.lanes.length }}
        >
          <div className="lanes-head">
            {d.lanes.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <ol className="lanes-steps">
            {d.steps.map((s, i) => {
              const handoff = i > 0 && d.steps[i - 1].lane !== s.lane;
              return (
                <li
                  key={`${s.label}-${i}`}
                  className={`lane-step ${handoff ? "handoff" : ""} ${s.issue ? "issue" : ""}`}
                  style={{ ["--lane" as string]: s.lane }}
                >
                  <em className="narrow-only">{d.lanes[s.lane]}</em>
                  {handoff && (
                    <small className="handoff-label">
                      {s.issue ? "Relais à risque" : "Passage de relais"}
                    </small>
                  )}
                  <strong>{s.label}</strong>
                </li>
              );
            })}
          </ol>
        </div>
      );
    case "bridge":
      return (
        <div className="bridge">
          <Box b={d.left} />
          <div className="bridge-arrows">
            <span>→ {d.forward[0]}</span>
            <span>← {d.backward[0]}</span>
          </div>
          <Box b={d.center} center />
          <div className="bridge-arrows">
            <span>→ {d.forward[1]}</span>
            <span>← {d.backward[1]}</span>
          </div>
          <Box b={d.right} />
        </div>
      );
  }
}

function Box({
  b,
  center = false,
}: {
  b: { title: string; lines: string[] };
  center?: boolean;
}) {
  return (
    <div className={`bridge-box ${center ? "center" : ""}`}>
      <strong>{b.title}</strong>
      {b.lines.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </div>
  );
}
