"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight, X, Check, ArrowRight } from "lucide-react";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <svg viewBox="0 0 40 44" aria-hidden="true">
        <path
          d="M5 39V18a15 15 0 0 1 30 0v21h-8V18a7 7 0 0 0-14 0v21Z"
          fill="currentColor"
        />
        <path d="m21 22 14 9-14 8Z" fill="#e58f86" />
      </svg>
      {!compact && (
        <span>
          aprire
          <span className="brand-second">
            tutto<span className="brand-dot">.</span>
          </span>
        </span>
      )}
    </div>
  );
}
export function Arrow({ className = "" }: { className?: string }) {
  return <ArrowRight size={18} className={className} aria-hidden="true" />;
}
export function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`pill ${className}`}>{children}</span>;
}
export function Ring({ value, size = 44 }: { value: number; size?: number }) {
  const r = 17;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      className="ring"
      aria-label={`${Math.round(value)} % terminé`}
      role="img"
    >
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="currentColor"
        opacity=".15"
        strokeWidth="3"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * r}`}
        strokeDashoffset={`${2 * Math.PI * r * (1 - value / 100)}`}
        transform="rotate(-90 22 22)"
      />
      {value >= 100 ? (
        <path
          d="m15 22 5 5 10-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      ) : (
        <text
          x="22"
          y="26"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="currentColor"
        >
          {Math.round(value)}%
        </text>
      )}
    </svg>
  );
}
export function CourseArt({ small = false }: { small?: boolean }) {
  return (
    <div className={`course-art ${small ? "small" : ""}`} aria-hidden="true">
      <div className="art-grid" />
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-spark spark-one">✳</div>
      <div className="art-spark spark-two">+</div>
      <div className="art-note note-one">
        <span className="note-dot" />
        <span>Le bon problème.</span>
      </div>
      <div className="arch arch-back" />
      <div className="arch arch-front">
        <div className="arch-door" />
        <ArrowUpRight strokeWidth={1.2} />
      </div>
      <div className="art-note note-two">
        <Check size={14} />
        <span>La bonne question.</span>
      </div>
      <div className="art-caption">LE DÉBUT DE TOUT</div>
    </div>
  );
}
export function Modal({
  title,
  children,
  close,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  close: () => void;
  wide?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const d = dialog.current;
    d?.showModal();
    const onClose = (event: Event) => {
      event.preventDefault();
      closeRef.current();
    };
    d?.addEventListener("cancel", onClose);
    return () => {
      d?.removeEventListener("cancel", onClose);
      d?.close();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`modal ${wide ? "wide" : ""}`}
      aria-label={title}
      onClick={(e) => {
        if (e.target === dialog.current) {
          const r = dialog.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            close();
        }
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button className="icon-button" onClick={close} aria-label="Fermer">
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-orbit">
        <span>✳</span>
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
