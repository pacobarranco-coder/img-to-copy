import React from 'react';
import { FileSearch, Tag, CheckCircle2, Zap, Clock, ShieldAlert } from 'lucide-react';
import { CreativeAnalysis } from '../types';

interface AnalysisCardProps {
  analysis: CreativeAnalysis;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const isPromo = analysis.focusType === 'PROMOCIONAL';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF3E1D] flex items-center justify-center">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Diagnóstico de Creatividad Publicitaria
            </h3>
            <p className="text-xs text-gray-500">
              Lectura de textos y determinación del enfoque estratégico
            </p>
          </div>
        </div>

        {/* Focus Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase border flex items-center gap-1.5 ${
            isPromo
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-purple-50 text-purple-800 border-purple-300'
          }`}
        >
          {isPromo ? <Tag className="w-3.5 h-3.5 text-amber-600" /> : <Zap className="w-3.5 h-3.5 text-purple-600" />}
          <span>{analysis.focusType}</span>
        </div>
      </div>

      {/* Step 1: Textos leídos en el arte */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            Textos leídos en el arte (Slogans, Badges, CTAs, Fechas):
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            {analysis.detectedText.length} elementos detectados
          </span>
        </div>

        {analysis.detectedText.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
            {analysis.detectedText.map((txt, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-800 font-medium shadow-2xs"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{txt}</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500 italic">
            Creatividad puramente visual sin texto tipográfico detectable.
          </div>
        )}
      </div>

      {/* Step 2: Enfoque y razonamiento de Copywriting */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-bold">
            2
          </span>
          Justificación del enfoque estratégico:
        </span>
        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
            isPromo
              ? 'bg-amber-50/60 border-amber-200/70 text-amber-950'
              : 'bg-purple-50/60 border-purple-200/70 text-purple-950'
          }`}
        >
          <p className="font-medium">{analysis.focusReasoning}</p>
        </div>
      </div>

      {/* Extra Badges: Elements detected, Urgency, Brand Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
        {analysis.brandBadgeDetected && (
          <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-[#FF3E1D] font-bold border border-orange-200 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Badge: {analysis.brandBadgeDetected}
          </span>
        )}

        {analysis.urgencyLevel && (
          <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" /> Urgencia: {analysis.urgencyLevel}
          </span>
        )}

        {analysis.creativeElements && analysis.creativeElements.length > 0 && (
          <div className="flex items-center gap-1 text-gray-500 text-[11px] ml-auto">
            <span>Visuales:</span>
            <span className="font-semibold text-gray-700">
              {analysis.creativeElements.slice(0, 3).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
