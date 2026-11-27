import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const TempleProgressBar = React.memo(({ progress }) => (
  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#080D0B]/90 overflow-hidden z-20">
    <Motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ type: 'spring', stiffness: 100, damping: 28 }}
      className="h-full bg-gradient-to-r from-[#B86B35] via-[#E8C574] to-[#C69B43] shadow-[0_0_18px_rgba(232,197,116,0.75)]"
    />
  </div>
));
TempleProgressBar.displayName = 'TempleProgressBar';

export function StoneInputField({ label, icon, error, touched, ...props }) {
  const FieldIcon = icon;
  return (
    <div className="space-y-2 text-left">
      <label className="lc-font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8C574]/90 ml-1 flex items-center gap-2">
        {FieldIcon && <FieldIcon size={14} className="text-[#C69B43] shrink-0" />}
        <span>{label}</span>
      </label>
      <div className="relative group">
        <input
          {...props}
          className={`w-full px-4 sm:px-5 py-3.5 rounded-lg border transition-all duration-300 outline-none font-medium text-sm bg-[#080D0B]/85 ${
            touched && error
              ? 'border-red-500/65 bg-red-950/20 text-red-100 focus:border-red-400 focus:ring-1 focus:ring-red-400/50'
              : 'border-[#C69B43]/30 text-[#E8DFC8] placeholder-[#777568] focus:border-[#E8C574] focus:ring-1 focus:ring-[#E8C574]/50 focus:bg-[#0D1611] group-hover:border-[#C69B43]/55'
          }`}
        />
      </div>
      {touched && error && (
        <Motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1"
        >
          {error}
        </Motion.p>
      )}
    </div>
  );
}

export function StoneSelectField({ label, children, error, touched, icon, ...props }) {
  const FieldIcon = icon;
  return (
    <div className="space-y-2 text-left">
      <label className="lc-font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8C574]/90 ml-1 flex items-center gap-2">
        {FieldIcon && <FieldIcon size={14} className="text-[#C69B43] shrink-0" />}
        <span>{label}</span>
      </label>
      <div className="relative group">
        <select
          {...props}
          className={`w-full px-4 sm:px-5 py-3.5 pr-10 rounded-lg border transition-all duration-300 outline-none font-medium text-sm appearance-none cursor-pointer [&_option]:bg-[#0B140F] [&_option]:text-[#E8DFC8] ${
            touched && error
              ? 'border-red-500/65 bg-[#190D0D] text-red-100 focus:border-red-400'
              : 'border-[#C69B43]/30 bg-[#080D0B]/90 text-[#E8DFC8] focus:border-[#E8C574] focus:ring-1 focus:ring-[#E8C574]/50 group-hover:border-[#C69B43]/55'
          }`}
          style={{ colorScheme: 'dark' }}
        >
          {children}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#C69B43]/70 group-focus-within:text-[#E8C574] transition-colors">
          <ChevronDown size={17} />
        </div>
      </div>
      {touched && error && (
        <Motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1"
        >
          {error}
        </Motion.p>
      )}
    </div>
  );
}
