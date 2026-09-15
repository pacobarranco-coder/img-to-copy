import React, { useState } from 'react';
import { Copy, Check, Eye, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { CreativeOption } from '../types';

interface CopyOptionCardProps {
  option: CreativeOption;
  isSelectedForPreview: boolean;
  onSelectForPreview: () => void;
}

// Utility to count emojis in a string
function countEmojis(str: string): number {
  const emojiRegex = /[\p{Extended_Pictographic}]/gu;
  const matches = str.match(emojiRegex);
  return matches ? matches.length : 0;
}

// Utility to count lines in a string
function countLines(str: string): number {
  return str.split(/\r\n|\r|\n/).filter((l) => l.trim().length > 0).length;
}

// Utility to count words strictly
function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export const CopyOptionCard: React.FC<CopyOptionCardProps> = ({
  option,
  isSelectedForPreview,
  onSelectForPreview,
}) => {
  const [copiedType, setCopiedType] = useState<'all' | 'primary' | 'headline' | null>(null);

  const headlineWordCount = countWords(option.headline);
  const isHeadlineValid = headlineWordCount >= 3 && headlineWordCount <= 4;
  const lineCount = countLines(option.primaryText);
  const emojiCount = countEmojis(option.primaryText);
  const hasHashtags = option.primaryText.includes('#') || option.headline.includes('#');

  const copyToClipboard = (text: string, type: 'all' | 'primary' | 'headline') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const formattedOutput = `Opción ${option.optionNumber}: ${option.angle}
• Texto principal: ${option.primaryText}
• Título: ${option.headline}`;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 p-5 bg-white shadow-xs ${
        isSelectedForPreview
          ? 'border-[#FF3E1D] ring-2 ring-orange-200 shadow-md'
          : 'border-gray-200 hover:border-orange-200'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF3E1D] flex items-center justify-center font-black text-sm">
            {option.optionNumber}
          </span>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-snug">
              Opción {option.optionNumber}: {option.angle}
            </h4>
            {option.whyItWorks && (
              <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                {option.whyItWorks}
              </p>
            )}
          </div>
        </div>

        {/* Preview in Mockup Toggle */}
        <button
          onClick={onSelectForPreview}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            isSelectedForPreview
              ? 'bg-[#FF3E1D] text-white shadow-xs'
              : 'bg-gray-100 hover:bg-orange-50 hover:text-[#FF3E1D] text-gray-700'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isSelectedForPreview ? 'Viendo en Anuncio' : 'Previsualizar'}</span>
        </button>
      </div>

      {/* Main Copy Elements */}
      <div className="space-y-3 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
        {/* Primary Text */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              • Texto Principal (Primary Text)
            </span>
            <button
              onClick={() => copyToClipboard(option.primaryText, 'primary')}
              className="text-[11px] font-semibold text-gray-500 hover:text-[#FF3E1D] flex items-center gap-1"
            >
              {copiedType === 'primary' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar texto</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-800 font-medium whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-lg border border-gray-200">
            {option.primaryText}
          </p>
        </div>

        {/* Headline */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              • Título (Headline - Ultra corto)
            </span>
            <button
              onClick={() => copyToClipboard(option.headline, 'headline')}
              className="text-[11px] font-semibold text-gray-500 hover:text-[#FF3E1D] flex items-center gap-1"
            >
              {copiedType === 'headline' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar título</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-900 font-black tracking-tight">
              {option.headline}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              CTA: {option.ctaButton || 'Pedir ahora'}
            </span>
          </div>
        </div>
      </div>

      {/* Strict Rappi Compliance Rule Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        {/* Headline Words Badge */}
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
            isHeadlineValid
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
          title="Regla: Estrictamente entre 3 y 4 palabras máximo"
        >
          {isHeadlineValid ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <AlertTriangle className="w-3 h-3" />
          )}
          <span>{headlineWordCount} palabras {isHeadlineValid ? '✓' : '(debe ser 3 o 4)'}</span>
        </span>

        {/* Line Count Badge */}
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
            lineCount <= 3
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
          title="Regla: Máximo 3 líneas"
        >
          <CheckCircle className="w-3 h-3" />
          <span>{lineCount} {lineCount === 1 ? 'línea' : 'líneas'} (máx 3)</span>
        </span>

        {/* Emoji Count Badge */}
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
            emojiCount >= 2 && emojiCount <= 3
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
          title="Regla: 2 a 3 emojis clave"
        >
          <span>{emojiCount} emojis (2-3 clave)</span>
        </span>

        {/* No Hashtags Badge */}
        {!hasHashtags && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
            <span>✓ 0 hashtags</span>
          </span>
        )}

        {/* Copy All Button */}
        <button
          onClick={() => copyToClipboard(formattedOutput, 'all')}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white bg-gray-900 hover:bg-black transition-colors shadow-2xs"
        >
          {copiedType === 'all' ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copiar Opción {option.optionNumber}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
