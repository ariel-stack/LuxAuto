import React from "react";

export function Spinner({ size = 40 }: { size?: number }) {
  const s = Math.max(16, size);
  return (
    <div role="status" aria-live="polite" aria-label="Cargando" className="flex items-center justify-center">
      <svg
        width={s}
        height={s}
        viewBox="0 0 50 50"
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <circle cx="25" cy="25" r="20" stroke="#E5E7EB" strokeWidth="6" opacity="0.15" />
        <path
          d="M45 25c0-11.046-8.954-20-20-20"
          stroke="#C9A84C"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default Spinner;
