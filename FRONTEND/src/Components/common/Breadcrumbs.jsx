import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Semantic BreadcrumbList navigation bar styled for the Lost Civilization theme.
 */
export default function Breadcrumbs({ items = [], className = '' }) {
  if (!items || items.length < 2) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`inline-flex flex-wrap items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#080D0B]/78 border border-[#C69B43]/30 backdrop-blur-sm text-[11px] font-mono ${className}`}
    >
      <ol className="flex flex-wrap items-center justify-center gap-1.5 list-none m-0 p-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.path || item.name} className="inline-flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight
                  size={12}
                  aria-hidden="true"
                  className="text-[#C69B43]/70 shrink-0"
                />
              )}
              {isLast || !item.path ? (
                <span
                  aria-current="page"
                  className="text-[#E8C574] font-semibold tracking-wide"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="inline-flex items-center gap-1 text-[#E8DFC8]/75 hover:text-[#E8C574] transition-colors"
                >
                  {idx === 0 && <Home size={11} aria-hidden="true" className="text-[#C69B43]" />}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
