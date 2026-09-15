export type FocusType = 'PROMOCIONAL' | 'CONCEPTUAL / BRANDING / TEMPORADA';

export interface CreativeOption {
  optionNumber: number;
  angle: string;
  primaryText: string;
  headline: string;
  headlineWordCount: number;
  ctaButton: string;
  formattedCopy: string;
  whyItWorks?: string;
}

export interface CreativeAnalysis {
  detectedText: string[];
  focusType: FocusType;
  focusReasoning: string;
  creativeElements: string[];
  brandBadgeDetected?: string | null;
  targetAudience?: string;
  urgencyLevel?: 'Alta' | 'Media' | 'Baja';
}

export interface GenerateCopyResponse {
  analysis: CreativeAnalysis;
  options: CreativeOption[];
  modelUsed: string;
  timestamp: string;
}

export interface SampleAd {
  id: string;
  title: string;
  category: 'Promocional' | 'Turbo' | 'Antojo / Producto' | 'Temporada';
  imageUrl: string;
  description: string;
  preloadedContext?: string;
}
