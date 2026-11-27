import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const TempleProgressBar = React.memo(({ progress }) => (
  <div className="w-full h-1 bg-[#080D0B]/95 overflow-hidden">
    <Motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ type: 'spring', stiffness: 120, damping: 28 }}
      className="h-full bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43] shadow-[0_0_16px_rgba(232,197,116,0.75)]"
    />
  </div>
));
TempleProgressBar.displayName = 'TempleProgressBar';

export function StoneInputField({
  label,
  icon,
  error,
  touched,
  labelRight = null,
  className = '',
  ...props
}) {
  const FieldIcon = icon;
  return (
    <div className={`space-y-1 text-left ${className}`}>
      <div className="flex items-center justify-between gap-2 ml-0.5">
        <label className="lc-font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#E8C574]/95 flex items-center gap-1.5 truncate">
          {FieldIcon && <FieldIcon size={13} className="text-[#C69B43] shrink-0" />}
          <span className="truncate">{label}</span>
        </label>
        {labelRight}
      </div>

      <input
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-lg border transition-all duration-200 outline-none font-medium text-xs sm:text-sm bg-[#080D0B]/88 ${
          touched && error
            ? 'border-red-500/70 bg-red-950/20 text-red-100 focus:border-red-400 focus:ring-1 focus:ring-red-400/50'
            : 'border-[#C69B43]/30 text-[#E8DFC8] placeholder-[#777568] focus:border-[#E8C574] focus:ring-1 focus:ring-[#E8C574]/50 focus:bg-[#0D1611] hover:border-[#C69B43]/55'
        }`}
      />

      {touched && error && (
        <Motion.p
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-0.5 leading-tight"
        >
          {error}
        </Motion.p>
      )}
    </div>
  );
}

export function StoneSelectField({
  label,
  children,
  error,
  touched,
  icon,
  labelRight = null,
  className = '',
  disabled = false,
  ...props
}) {
  const FieldIcon = icon;
  return (
    <div className={`space-y-1 text-left ${className}`}>
      <div className="flex items-center justify-between gap-2 ml-0.5">
        <label className="lc-font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#E8C574]/95 flex items-center gap-1.5 truncate">
          {FieldIcon && <FieldIcon size={13} className="text-[#C69B43] shrink-0" />}
          <span className="truncate">{label}</span>
        </label>
        {labelRight}
      </div>

      <div className="relative group">
        <select
          {...props}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 pr-9 rounded-lg border transition-all duration-200 outline-none font-medium text-xs sm:text-sm appearance-none [&_option]:bg-[#0B140F] [&_option]:text-[#E8DFC8] ${
            disabled
              ? 'cursor-not-allowed opacity-85 border-[#C69B43]/35 bg-[#101D16]/90 text-[#E8C574]'
              : touched && error
              ? 'cursor-pointer border-red-500/70 bg-[#190D0D] text-red-100 focus:border-red-400'
              : 'cursor-pointer border-[#C69B43]/30 bg-[#080D0B]/90 text-[#E8DFC8] focus:border-[#E8C574] focus:ring-1 focus:ring-[#E8C574]/50 group-hover:border-[#C69B43]/55'
          }`}
          style={{ colorScheme: 'dark' }}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#C69B43]/75 group-focus-within:text-[#E8C574] transition-colors">
          <ChevronDown size={16} />
        </div>
      </div>

      {touched && error && (
        <Motion.p
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-0.5 leading-tight"
        >
          {error}
        </Motion.p>
      )}
    </div>
  );
}
