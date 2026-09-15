import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, Sparkles, X, Globe, Check, AlertCircle } from 'lucide-react';
import { SAMPLE_CREATIVES } from '../data/samples';
import { SampleAd } from '../types';

interface CreativeUploaderProps {
  selectedImage: string | null;
  onImageSelected: (base64: string, sampleInfo?: SampleAd) => void;
  onClearImage: () => void;
  targetCountry: string;
  onCountryChange: (country: string) => void;
  extraContext: string;
  onContextChange: (ctx: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  loadingMessage?: string;
}

const COUNTRIES = [
  { code: 'LATAM', label: 'LATAM (Regional)', flag: '🌎' },
  { code: 'México', label: 'México (MX)', flag: '🇲🇽' },
  { code: 'Colombia', label: 'Colombia (CO)', flag: '🇨🇴' },
  { code: 'Argentina', label: 'Argentina (AR)', flag: '🇦🇷' },
  { code: 'Chile', label: 'Chile (CL)', flag: '🇨🇱' },
  { code: 'Perú', label: 'Perú (PE)', flag: '🇵🇪' },
];

export const CreativeUploader: React.FC<CreativeUploaderProps> = ({
  selectedImage,
  onImageSelected,
  onClearImage,
  targetCountry,
  onCountryChange,
  extraContext,
  onContextChange,
  onAnalyze,
  isLoading,
  loadingMessage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file reading
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor sube un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setActiveSampleId(null);
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  // Global paste handler for quick paste anywhere
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const selectSample = (sample: SampleAd) => {
    setActiveSampleId(sample.id);
    if (sample.preloadedContext && !extraContext) {
      onContextChange(sample.preloadedContext);
    }
    onImageSelected(sample.imageUrl, sample);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF3E1D] flex items-center justify-center text-xs font-black">
              1
            </span>
            Creatividad Publicitaria
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Sube el banner o selecciona un ejemplo de campaña Rappi
          </p>
        </div>
        {selectedImage && (
          <button
            onClick={onClearImage}
            disabled={isLoading}
            className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Cambiar imagen
          </button>
        )}
      </div>

      {/* Upload Zone */}
      {!selectedImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
            isDragging
              ? 'border-[#FF3E1D] bg-orange-50/70 scale-[0.99]'
              : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50/20 bg-gray-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept="image/*"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF3E1D] flex items-center justify-center mb-3 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-800">
            Arrastra tu arte aquí o haz clic para explorar
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG o WebP • Puedes pegar directo con <kbd className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px] font-mono">Ctrl + V</kbd>
          </p>
          <span className="inline-block mt-3 text-xs font-semibold text-[#FF3E1D] hover:underline">
            Seleccionar archivo desde el equipo
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 group max-h-80 flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Creatividad a analizar"
              className="max-h-80 w-auto object-contain mx-auto"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-bold shadow-md hover:bg-gray-100"
              >
                Reemplazar
              </button>
              <button
                onClick={onClearImage}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}

      {/* Preset Samples Selector */}
      <div className="space-y-2 pt-1 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
          <span>O prueba con creatividades de ejemplo:</span>
          <span className="text-[11px] font-normal text-gray-500">Haz clic en una</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_CREATIVES.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => selectSample(sample)}
                disabled={isLoading}
                className={`text-left p-2 rounded-xl border transition-all flex flex-col gap-1.5 group ${
                  isSelected
                    ? 'border-[#FF3E1D] ring-2 ring-orange-200 bg-orange-50/50'
                    : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                    {sample.category}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#FF3E1D]">
                    {sample.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaign Details & Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
        {/* Country Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-gray-500" />
            Mercado / País
          </label>
          <select
            value={targetCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            disabled={isLoading}
            className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF3E1D]/20 focus:border-[#FF3E1D]"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Extra Notes / Context */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Contexto adicional (opcional)
          </label>
          <input
            type="text"
            value={extraContext}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="Ej: Cupón BURGERWEEK, delivery gratis Turbo..."
            disabled={isLoading}
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3E1D]/20 focus:border-[#FF3E1D]"
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onAnalyze}
        disabled={!selectedImage || isLoading}
        className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
          !selectedImage || isLoading
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            : 'bg-linear-to-r from-[#FF3E1D] to-[#FF6B4A] hover:from-[#E62E0E] hover:to-[#FF542E] text-white shadow-orange-500/25 active:scale-[0.99]'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{loadingMessage || 'Analizando textos y redactando copys en tono Rappi...'}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Analizar Arte y Redactar 5 Copys</span>
          </>
        )}
      </button>
    </div>
  );
};
