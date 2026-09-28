import React from "react";

interface TwicLogoProps {
  className?: string;
  size?: number;
}

export function TwicLogo({ className = "w-8 h-8", size }: TwicLogoProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...(size ? { width: size, height: size } : {})}
      aria-label="TWIC Logo"
    >
      {/* Grey Dots Arc (Top half) */}
      <circle cx="118" cy="28" r="4.5" fill="#94a3b8" />
      <circle cx="106" cy="38" r="5.5" fill="#94a3b8" />
      <circle cx="94" cy="49" r="6.5" fill="#94a3b8" />
      <circle cx="83" cy="62" r="7.5" fill="#94a3b8" />
      <circle cx="75" cy="77" r="8.5" fill="#94a3b8" />
      <circle cx="70" cy="94" r="9.5" fill="#94a3b8" />

      {/* Blue / Cyan Dots Arc (Bottom half) */}
      <circle cx="70" cy="116" r="10" fill="#0284c7" />
      <circle cx="77" cy="136" r="11" fill="#0284c7" />
      <circle cx="95" cy="148" r="12" fill="#0284c7" />
      <circle cx="118" cy="146" r="13" fill="#0284c7" />
      <circle cx="138" cy="130" r="14" fill="#0284c7" />

      {/* Flowing Wave Ribbons */}
      <path
        d="M 18 96 C 45 96, 55 86, 85 86 C 115 86, 125 106, 150 114"
        stroke="#cbd5e1"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 28 88 C 55 88, 65 96, 95 96 C 120 96, 130 84, 142 80"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* "twic" Typography */}
      <text
        x="96"
        y="90"
        fontFamily="Georgia, Cambria, 'Times New Roman', serif"
        fontSize="34"
        fontWeight="600"
        fill="#38bdf8"
        letterSpacing="0.5"
      >
        twic
      </text>
    </svg>
  );
}
