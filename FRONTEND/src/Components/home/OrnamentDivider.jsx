export function CornerFiligree({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      fill="none"
      className={`w-6 h-6 text-[#C69B43] pointer-events-none ${className}`}
    >
      <path
        d="M2 38V10C2 5.58172 5.58172 2 10 2H38"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.85"
      />
      <path
        d="M7 32V12C7 9.23858 9.23858 7 12 7H32"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.45"
      />
      <rect x="2" y="2" width="5" height="5" fill="currentColor" fillOpacity="0.9" />
      <circle cx="15" cy="15" r="1.5" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

export function TempleDivider({ className = '' }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-4 my-2 ${className}`}>
      <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-r from-transparent via-[#C69B43]/55 to-[#C69B43]/80" />
      <svg viewBox="0 0 36 20" fill="none" className="w-8 h-5 text-[#C69B43] shrink-0">
        <path
          d="M18 1L23 10L18 19L13 10L18 1Z"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="rgba(198,155,67,0.18)"
        />
        <path d="M1 10H10M26 10H35" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.75" />
        <circle cx="18" cy="10" r="2" fill="currentColor" />
      </svg>
      <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-l from-transparent via-[#C69B43]/55 to-[#C69B43]/80" />
    </div>
  );
}
