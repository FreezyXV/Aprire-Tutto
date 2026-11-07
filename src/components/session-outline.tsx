import { BookOpen, Check, PencilLine, RotateCcw, Sparkles } from "lucide-react";
import type { Minutes } from "@/lib/types";

export function SessionOutline({ minutes }: { minutes: Minutes }) {
  const items = [
    {
      title: "Se souvenir",
      detail: "Une question pour commencer",
      icon: RotateCcw,
    },
    { title: "Comprendre", detail: "Une notion, un exemple", icon: BookOpen },
    {
      title: "Essayer",
      detail:
        minutes >= 10
          ? "Un exercice et une mise en pratique"
          : "Un exercice avec sa correction",
      icon: PencilLine,
    },
    ...(minutes >= 20
      ? [
          {
            title: "Faire le lien",
            detail: "Réutiliser dans un autre contexte",
            icon: Sparkles,
          },
        ]
      : []),
    ...(minutes >= 30
      ? [
          {
            title: "Reformuler",
            detail: "Expliquer avec ses propres mots",
            icon: Check,
          },
        ]
      : []),
  ];
  return (
    <div className="session-outline" aria-label="Le déroulé de ta séance">
      <span className="eyebrow">Au fil de la séance</span>
      <ol>
        {items.map(({ title, detail, icon: Icon }) => (
          <li key={title}>
            <span className="outline-icon">
              <Icon size={16} strokeWidth={1.6} />
            </span>
            <div>
              <strong>{title}</strong>
              <span>{detail}</span>
            </div>
          </li>
        ))}
      </ol>
      <p>À ton rythme, sans chronomètre.</p>
    </div>
  );
}
