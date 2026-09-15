import React, { useState } from 'react';
import { Header } from './components/Header';
import { CreativeUploader } from './components/CreativeUploader';
import { AnalysisCard } from './components/AnalysisCard';
import { CopyOptionCard } from './components/CopyOptionCard';
import { MetaAdPreview } from './components/MetaAdPreview';
import { BrandGuidelinesModal } from './components/BrandGuidelinesModal';
import { GenerateCopyResponse, CreativeOption, SampleAd } from './types';
import { normalizeImageForApi } from './utils/imageUtils';
import { Copy, Check, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [targetCountry, setTargetCountry] = useState<string>('LATAM');
  const [extraContext, setExtraContext] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateCopyResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<CreativeOption | null>(null);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Analizando textos y redactando copys en tono Rappi...');

  // Handle image selection
  const handleImageSelected = (base64: string, sample?: SampleAd) => {
    setSelectedImage(base64);
    setError(null);
    if (sample && sample.preloadedContext) {
      setExtraContext(sample.preloadedContext);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setResult(null);
    setSelectedOption(null);
    setError(null);
    setExtraContext('');
  };

  // Analyze creative and generate copies with automatic retries (3 attempts, 2s wait)
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    setLoadingMessage('Analizando textos y redactando copys en tono Rappi...');

    const maxClientAttempts = 3;
    let clientAttempt = 0;
    let lastErrMessage = '';

    try {
      // 1. Normalize image to standard high-quality base64 strictly formatted for Gemini
      const { base64, mimeType } = await normalizeImageForApi(selectedImage);

      while (clientAttempt < maxClientAttempts) {
        clientAttempt++;
        try {
          if (clientAttempt > 1) {
            setLoadingMessage(
              `Servidor con alta demanda. Reintentando en segundo plano (${clientAttempt}/${maxClientAttempts})...`
            );
          }

          const response = await fetch('/api/generate-copy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageBase64: base64,
              mimeType,
              targetCountry,
              extraContext,
            }),
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const rawMsg = errData.error || `Error ${response.status}`;

            // If it's a 503 or server busy, retry smoothly in background with 2 seconds wait
            if (
              response.status === 503 ||
              response.status === 429 ||
              rawMsg.includes('503') ||
              rawMsg.includes('high demand') ||
              rawMsg.includes('UNAVAILABLE') ||
              rawMsg.includes('ocupado')
            ) {
              lastErrMessage = 'Los servidores de IA tienen alta demanda temporal. Puedes reintentar en un momento.';
              if (clientAttempt < maxClientAttempts) {
                setLoadingMessage(
                  `Servidor ocupado. Reintentando en segundo plano en 2s (${clientAttempt}/${maxClientAttempts})...`
                );
                await new Promise((r) => setTimeout(r, 2000));
                continue;
              }
            }
            throw new Error(rawMsg);
          }

          const data: GenerateCopyResponse = await response.json();
          setResult(data);
          if (data.options && data.options.length > 0) {
            setSelectedOption(data.options[0]);
          }
          setError(null);
          return; // Success!
        } catch (subErr: any) {
          const msg = subErr?.message || '';
          lastErrMessage = msg;
          if (clientAttempt < maxClientAttempts) {
            setLoadingMessage(
              `Reintentando en segundo plano en 2s (${clientAttempt}/${maxClientAttempts})...`
            );
            await new Promise((r) => setTimeout(r, 2000));
          } else {
            throw subErr;
          }
        }
      }
    } catch (err: any) {
      console.warn('Error analyzing creative after retries:', err);
      // Friendly, non-red notice only after all 3 background attempts fail
      setError(
        lastErrMessage && !lastErrMessage.includes('503')
          ? lastErrMessage
          : 'El servidor de IA está momentáneamente ocupado por alta demanda. Haz clic en "Reintentar ahora".'
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage('Analizando textos y redactando copys en tono Rappi...');
    }
  };

  // Copy all 5 options formatted together
  const handleCopyAll = () => {
    if (!result || !result.options) return;
    const allText = result.options
      .map(
        (opt) =>
          `Opción ${opt.optionNumber}: ${opt.angle}\n• Texto principal: ${opt.primaryText}\n• Título: ${opt.headline}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-gray-900 flex flex-col font-sans">
      <Header onOpenGuidelines={() => setIsGuidelinesOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Hero Banner */}
        <div className="bg-linear-to-r from-orange-50 via-white to-amber-50/50 rounded-2xl border border-orange-100 p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100/80 text-[#FF3E1D] text-xs font-bold border border-orange-200">
                <Sparkles className="w-3.5 h-3.5" />
                Senior Copywriter Meta Ads • Rappi Brand System
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Generador y Optimizador de Copys para Creatividades Rappi
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
                Analiza slogans, badges de Turbo o descuentos en cualquier arte y redacta automáticamente 5 opciones de copys con tono casual, de 2 a 3 emojis clave y titulares de 3 a 4 palabras exactas.
              </p>
            </div>

            {result && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyAll}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-orange-50 text-gray-800 border border-gray-200 shadow-xs transition-colors"
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">5 Copys Copiados</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-600" />
                      <span>Copiar las 5 Opciones</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FF3E1D] hover:bg-[#E62E0E] text-white shadow-xs transition-colors"
                  title="Re-analizar y generar nuevas variaciones"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Regenerar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF3E1D] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-gray-900">Aviso del servicio de IA</p>
                <p className="text-gray-700">{error}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF3E1D] hover:bg-[#E62E0E] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Reintentar ahora</span>
              </button>
              <button
                onClick={() => setError(null)}
                className="px-2 py-1 text-gray-400 hover:text-gray-700 text-xs font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Main Work Area: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Creative Uploader & Ad Diagnosis (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <CreativeUploader
              selectedImage={selectedImage}
              onImageSelected={handleImageSelected}
              onClearImage={handleClearImage}
              targetCountry={targetCountry}
              onCountryChange={setTargetCountry}
              extraContext={extraContext}
              onContextChange={setExtraContext}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />

            {/* Analysis Card */}
            {result && result.analysis && (
              <AnalysisCard analysis={result.analysis} />
            )}
          </div>

          {/* Right Column: 3 Copy Options & Meta Ads Live Preview (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <>
                {/* 5 Copy Options Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF3E1D] flex items-center justify-center text-xs font-black">
                          2
                        </span>
                        5 Opciones de Copys en Tono Rappi
                      </h2>
                      <p className="text-xs text-gray-500">
                        Ángulos diferenciados con titulares de 3-4 palabras y sin hashtags
                      </p>
                    </div>

                    <button
                      onClick={handleCopyAll}
                      className="text-xs font-bold text-[#FF3E1D] hover:underline flex items-center gap-1"
                    >
                      {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAll ? '¡Copiado!' : 'Copiar todo'}</span>
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {result.options.map((option) => (
                      <CopyOptionCard
                        key={option.optionNumber}
                        option={option}
                        isSelectedForPreview={
                          selectedOption?.optionNumber === option.optionNumber
                        }
                        onSelectForPreview={() => setSelectedOption(option)}
                      />
                    ))}
                  </div>
                </div>

                {/* Section 3: Live Meta Ads Feed Mockup */}
                <div className="pt-2">
                  <MetaAdPreview
                    imageSrc={selectedImage}
                    selectedOption={selectedOption}
                    options={result.options}
                    onSelectOption={setSelectedOption}
                    targetCountry={targetCountry}
                  />
                </div>
              </>
            ) : (
              /* Empty State / Welcome Guide */
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-5 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#FF3E1D] flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-base font-black text-gray-900">
                    Sube una creatividad o elige un ejemplo
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Nuestro motor analizará el arte con inteligencia artificial multivariante para detectar texto, promociones, badges como <strong>Turbo</strong> o <strong>Prime</strong>, y redactará 3 opciones de alto rendimiento para Meta Ads.
                  </p>
                </div>

                {/* Checklist of enforced rules */}
                <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-2.5">
                  <p className="text-xs font-bold text-gray-800">
                    Estándares aplicados automáticamente:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E1D]" />
                      <span>Headline: 3 a 4 palabras</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E1D]" />
                      <span>2 a 3 emojis clave</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E1D]" />
                      <span>Texto: máx 3 líneas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E1D]" />
                      <span>Sin ningún hashtag (#)</span>
                    </div>
                  </div>
                </div>

                {/* Sample teaser callout */}
                <div className="pt-2">
                  <span className="text-xs font-medium text-gray-400">
                    Puedes hacer clic en cualquiera de las 4 creatividades de ejemplo en la columna izquierda para probarlo al instante.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400">
          Rappi Meta Ads Copywriter • Generación con Gemini Multimodal • Diseñado para Performance & Social Ads
        </div>
      </footer>

      {/* Guidelines Modal */}
      <BrandGuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />
    </div>
  );
}
