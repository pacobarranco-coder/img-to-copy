import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Share2,
  ExternalLink,
  ChevronRight,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { CreativeOption } from '../types';

interface MetaAdPreviewProps {
  imageSrc: string | null;
  selectedOption: CreativeOption | null;
  options: CreativeOption[];
  onSelectOption: (option: CreativeOption) => void;
  targetCountry?: string;
}

export const MetaAdPreview: React.FC<MetaAdPreviewProps> = ({
  imageSrc,
  selectedOption,
  options,
  onSelectOption,
  targetCountry = 'LATAM',
}) => {
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');

  if (!selectedOption) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center flex flex-col items-center justify-center min-h-[350px] shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF3E1D] flex items-center justify-center mb-3">
          <Smartphone className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-gray-800">
          Previsualización de Meta Ads
        </h4>
        <p className="text-xs text-gray-500 max-w-xs mt-1">
          Analiza una creatividad para ver la simulación en vivo de tu anuncio en Instagram y Facebook.
        </p>
      </div>
    );
  }

  // Country specific display URL
  const domain =
    targetCountry === 'México'
      ? 'rappi.com.mx'
      : targetCountry === 'Colombia'
      ? 'rappi.com.co'
      : targetCountry === 'Argentina'
      ? 'rappi.com.ar'
      : targetCountry === 'Chile'
      ? 'rappi.cl'
      : targetCountry === 'Perú'
      ? 'rappi.pe'
      : 'rappi.com';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
      {/* Header and Platform Selector */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#FF3E1D]" />
            Mockup en Vivo: Meta Ad
          </h3>
          <p className="text-xs text-gray-500">
            Visualiza cómo se verá tu anuncio en el feed de los usuarios
          </p>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setPlatform('instagram')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              platform === 'instagram'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => setPlatform('facebook')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              platform === 'facebook'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Facebook
          </button>
        </div>
      </div>

      {/* Option Selector Pills */}
      {options.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Opción activa:</span>
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
            {options.map((opt) => (
              <button
                key={opt.optionNumber}
                onClick={() => onSelectOption(opt)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedOption.optionNumber === opt.optionNumber
                    ? 'bg-[#FF3E1D] text-white shadow-2xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Opción {opt.optionNumber}: {opt.angle.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phone/Feed Simulation Container */}
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-300 shadow-lg overflow-hidden">
        {/* Ad Header */}
        <div className="p-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            {/* Rappi Profile Avatar */}
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#FF3E1D] to-[#FF6B4A] p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <span className="font-black text-xs text-[#FF3E1D] tracking-tighter">
                  Rappi
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-900">Rappi</span>
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black">
                  ✓
                </span>
              </div>
              <p className="text-[10px] text-gray-500 leading-none">
                Publicidad • {platform === 'instagram' ? 'sponsored' : 'Patrocinado'}
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Facebook Style: Primary Text on TOP */}
        {platform === 'facebook' && (
          <div className="px-3 pt-2 pb-2.5 text-xs text-gray-900 font-normal whitespace-pre-line leading-relaxed">
            {selectedOption.primaryText}
          </div>
        )}

        {/* Creative Image */}
        <div className="relative aspect-square bg-gray-900 flex items-center justify-center overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Creative Ad"
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="text-white text-xs">Sin imagen</div>
          )}
        </div>

        {/* CTA Conversion Bar (Bottom) */}
        <div className="p-3 bg-gray-50 border-t border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold truncate">
              {domain}
            </p>
            <h5 className="text-xs font-black text-gray-900 truncate">
              {selectedOption.headline}
            </h5>
          </div>
          <button className="shrink-0 px-3.5 py-1.5 bg-[#FF3E1D] hover:bg-[#E62E0E] text-white text-xs font-bold rounded-md shadow-2xs transition-colors flex items-center gap-1">
            <span>{selectedOption.ctaButton || 'Pedir ahora'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Engagement Action Bar */}
        <div className="p-3 flex items-center justify-between text-gray-700">
          <div className="flex items-center gap-4">
            {platform === 'instagram' ? (
              <>
                <Heart className="w-5 h-5 hover:text-red-500 cursor-pointer" />
                <MessageCircle className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                <Send className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:text-blue-600">
                  <ThumbsUp className="w-4 h-4" /> Me gusta
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:text-gray-900">
                  <MessageCircle className="w-4 h-4" /> Comentar
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:text-gray-900">
                  <Share2 className="w-4 h-4" /> Compartir
                </div>
              </>
            )}
          </div>
          {platform === 'instagram' && (
            <Bookmark className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
          )}
        </div>

        {/* Instagram Style: Primary text BELOW image with likes */}
        {platform === 'instagram' && (
          <div className="px-3 pb-3 space-y-1">
            <p className="text-xs font-bold text-gray-900">1,842 Me gusta</p>
            <div className="text-xs text-gray-900 leading-relaxed">
              <span className="font-bold mr-1.5">rappi</span>
              <span className="whitespace-pre-line font-normal">{selectedOption.primaryText}</span>
            </div>
            <p className="text-[11px] text-gray-400 cursor-pointer pt-0.5">
              Ver los 48 comentarios
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
