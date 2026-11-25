import React from 'react';

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

/**
 * Shared GPU-accelerated architectural tech background canvas for About and Events pages.
 */
const TechBackground = ({ variant = 'about' }) => {
  const isEvents = variant === 'events';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#040711]">
      {/* Architectural Blueprint Primary Grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(56, 189, 248, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 25%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 25%, black 40%, transparent 100%)',
        }}
      />

      {/* Fine Micro Sub-Grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148, 163, 184, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.04) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 100%)',
        }}
      />

      {/* Precision SVG Circuit Traces & Telemetry Nodes */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.16]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id={`traceGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isEvents ? '#22d3ee' : '#38bdf8'} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d="M 0 160 H 220 L 280 220 H 540 L 580 180 H 860"
          fill="none"
          stroke={`url(#traceGrad-${variant})`}
          strokeWidth="1.2"
        />
        <path
          d="M 1440 240 H 1160 L 1100 300 H 840 L 790 250 H 610"
          fill="none"
          stroke={`url(#traceGrad-${variant})`}
          strokeWidth="1.2"
        />
        <path
          d="M 80 720 H 320 L 380 660 H 640"
          fill="none"
          stroke={`url(#traceGrad-${variant})`}
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <path
          d="M 1360 760 H 1040 L 980 690 H 720"
          fill="none"
          stroke={`url(#traceGrad-${variant})`}
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <circle cx="280" cy="220" r="3.5" fill="#22d3ee" />
        <circle cx="580" cy="180" r="3" fill="#818cf8" />
        <circle cx="1100" cy="300" r="3.5" fill="#22d3ee" />
        <circle cx="380" cy="660" r="3" fill="#2dd4bf" />
        <circle cx="980" cy="690" r="3" fill="#38bdf8" />
      </svg>

      {/* GPU-Accelerated Ambient Aurora Orbs */}
      <div
        className={`animate-aurora absolute -top-32 left-[12%] w-[36rem] h-[36rem] rounded-full blur-[140px] ${
          isEvents ? 'bg-cyan-500/14' : 'bg-sky-500/14'
        }`}
      />
      <div
        className={`animate-aurora-reverse absolute top-[38%] -right-28 w-[34rem] h-[34rem] rounded-full blur-[150px] ${
          isEvents ? 'bg-indigo-500/14' : 'bg-teal-500/12'
        }`}
      />
      <div className="animate-aurora absolute -bottom-36 left-[30%] w-[32rem] h-[28rem] rounded-full bg-blue-600/10 blur-[150px]" />

      {/* Smooth Laser Telemetry Scan Sweep */}
      <div className="animate-scan-sweep absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.45)]" />

      {/* Tactile Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.028]"
        style={{ backgroundImage: NOISE_SVG }}
      />
    </div>
  );
};

export default TechBackground;
