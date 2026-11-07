import type { Diagram } from "@/lib/types";

/** Plain-text equivalent of a diagram, for screen readers and "Lire en texte". */
export function diagramToText(d: Diagram): string[] {
  switch (d.kind) {
    case "flow": {
      const lines = d.steps.map(
        (s, i) => `${i + 1}. ${s.label}${s.note ? ` — ${s.note}` : ""}`,
      );
      if (d.loop)
        lines.push(
          `Retour de l’étape ${d.loop.from + 1} vers l’étape ${d.loop.to + 1} : ${d.loop.label}.`,
        );
      return lines;
    }
    case "quadrant": {
      const where = [
        "En haut à gauche",
        "En haut à droite",
        "En bas à gauche",
        "En bas à droite",
      ];
      return [
        `Axe horizontal : ${d.xAxis}. Axe vertical : ${d.yAxis}.`,
        ...d.cells.map((c, i) => `${where[i]} — ${c.title} : ${c.text}`),
      ];
    }
    case "table":
      return d.rows.map((r) =>
        r
          .map((cell, i) => (i === 0 ? cell : `${d.columns[i]} : ${cell}`))
          .join(" — "),
      );
    case "lanes": {
      const lines: string[] = [];
      d.steps.forEach((s, i) => {
        const prev = d.steps[i - 1];
        if (prev && prev.lane !== s.lane)
          lines.push(
            `Passage de relais : ${d.lanes[prev.lane]} → ${d.lanes[s.lane]}${s.issue ? " (point de rupture)" : ""}.`,
          );
        lines.push(`${i + 1}. ${d.lanes[s.lane]} : ${s.label}`);
      });
      return lines;
    }
    case "bridge":
      return [
        `${d.left.title} (${d.left.lines.join(", ")}) transmet « ${d.forward[0]} » à ${d.center.title}.`,
        `${d.center.title} (${d.center.lines.join(", ")}) transmet « ${d.forward[1]} » à ${d.right.title} (${d.right.lines.join(", ")}).`,
        `En retour : « ${d.backward[1]} » de ${d.right.title} vers ${d.center.title}, puis « ${d.backward[0]} » vers ${d.left.title}.`,
      ];
  }
}
