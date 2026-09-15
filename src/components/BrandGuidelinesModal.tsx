import React from 'react';
import { X, Check, ShieldAlert, Sparkles, BookOpen, Zap } from 'lucide-react';

interface BrandGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandGuidelinesModal: React.FC<BrandGuidelinesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF3E1D] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Guía Oficial: Copywriting Meta Ads para Rappi
              </h3>
              <p className="text-xs text-gray-500">
                Reglas obligatorias de tono, longitud y estructura de conversión
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          {/* Analysis Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF3E1D] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Pasos para Analizar la Creatividad
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900 text-xs mb-1">
                  1. Lectura Total del Arte
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Extraer todo el texto: slogan, marca, llamados a la acción, conceptos, fechas límite, precios o badges como <strong>Turbo</strong>, <strong>Express</strong> o <strong>Prime</strong>.
                </p>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900 text-xs mb-1">
                  2. Determinación del Enfoque
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Promocional:</strong> Descuento, ahorro, precio o fecha límite.<br />
                  <strong>Conceptual / Branding / Temporada:</strong> Antojo, ocasión (lluvia, fiesta, noche), emoción o entrega en minutos (Turbo).
                </p>
              </div>
            </div>
          </div>

          {/* Tone & Aesthetic */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
              Estética y Tono de Rappi
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Tono:</strong> Casual, fresco, dinámico, enfocado en el antojo y la conveniencia insuperable (<em>"en minutos"</em>, <em>"en un toque"</em>, <em>"resuelve ya"</em>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Emojis:</strong> Estrictamente de 2 a 3 emojis clave (ej. 💜, 🍫, ⚡, 🛵, 🧡, 🍬, 🍔).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Título (Headline):</strong> ULTRA CORTO. Debe tener estrictamente entre <strong>3 y 4 palabras máximo</strong>. Sin excepciones.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Texto Principal (Primary Text):</strong> Máximo 3 líneas. No uses hashtags (#).
                </span>
              </li>
            </ul>
          </div>

          {/* Output Structure */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
              Estructura de las 5 Opciones
            </h4>
            <div className="p-4 bg-gray-900 text-gray-100 rounded-xl font-mono text-xs leading-relaxed border border-gray-800">
              <p className="text-orange-400">Opción [Número]: [Ángulo o Enfoque]</p>
              <p className="text-emerald-300">• Texto principal: [2 a 3 líneas con concepto + llamado a pedir por Rappi]</p>
              <p className="text-cyan-300">• Título: [Headline de 3 a 4 palabras]</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FF3E1D] text-white rounded-xl text-xs font-bold hover:bg-[#E62E0E] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
