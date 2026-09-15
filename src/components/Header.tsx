import React from 'react';
import { Sparkles, Zap, ShieldCheck, FileText } from 'lucide-react';

interface HeaderProps {
  onOpenGuidelines?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuidelines }) => {
  return (
    <header className="border-b border-orange-100 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#FF3E1D] to-[#FF6B4A] flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-gray-900 tracking-tight text-lg">Rappi</span>
              <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-orange-100 text-[#FF3E1D] border border-orange-200">
                Meta Ads Copywriter
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium hidden sm:block">
              Analizador de creatividades & redactor senior con reglas estrictas de marca
            </p>
          </div>
        </div>

        {/* Brand Rules Quick Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="flex items-center gap-1 text-[#FF3E1D]">
              <Zap className="w-3.5 h-3.5" /> Headline 3-4 palabras
            </span>
            <span className="text-gray-300">•</span>
            <span>2-3 Emojis</span>
            <span className="text-gray-300">•</span>
            <span>Máx 3 líneas</span>
            <span className="text-gray-300">•</span>
            <span className="text-emerald-600 flex items-center gap-0.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 0 hashtags
            </span>
          </div>

          {onOpenGuidelines && (
            <button
              onClick={onOpenGuidelines}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-orange-50 hover:text-[#FF3E1D] border border-gray-200 transition-colors shadow-xs"
              title="Ver directrices y reglas oficiales de Rappi"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reglas de Marca</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
