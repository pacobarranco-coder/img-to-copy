import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Allow JSON body up to 25MB for base64 images
app.use(express.json({ limit: "25mb" }));

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// API endpoint to analyze creative and generate Rappi Meta Ads copy
app.post("/api/generate-copy", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", extraContext, targetCountry = "LATAM" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Se requiere la imagen de la creatividad publicitaria en base64." });
    }

    // 1. Sanitize and format base64 string accurately for Gemini Multimodal API
    let cleanBase64 = String(imageBase64);
    let finalMimeType = mimeType || "image/jpeg";

    // Extract mime type and raw payload if data URI is present
    const dataUriPrefixMatch = cleanBase64.match(/^data:([^;,]+)(?:;[^;,]+)*;base64,(.+)$/s);
    if (dataUriPrefixMatch) {
      finalMimeType = dataUriPrefixMatch[1] || finalMimeType;
      cleanBase64 = dataUriPrefixMatch[2];
    } else {
      // Strip any other data URI prefix
      cleanBase64 = cleanBase64.replace(/^data:[^,]+,/, "");
    }

    // Strip any whitespaces, newlines, carriage returns or tabs
    cleanBase64 = cleanBase64.replace(/[\r\n\s]/g, "");

    // Validate MIME type against Gemini API allowed image types
    if (!["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(finalMimeType)) {
      finalMimeType = "image/jpeg";
    }

    if (!cleanBase64 || cleanBase64.length < 16) {
      return res.status(400).json({ error: "La imagen provista no tiene un formato base64 válido." });
    }

    const ai = getGeminiClient();

    const systemPrompt = `Eres un Copywriter Senior de Meta Ads para Rappi (la superapp de delivery de América Latina).
Tu trabajo es analizar cualquier creatividad publicitaria (promocional, de branding, de producto, o de temporada) y redactar copys en el tono característico y estricto de la marca.

Pasos para analizar la imagen:
1. Lee TODO el texto del arte (slogan, marca, llamado a la acción, conceptos, fechas, precios, descuentos o badges como Turbo, Express, Prime).
2. Determina el enfoque del arte:
   - Si es PROMOCIONAL: Enfócate en el descuento, ahorro, precio, combo, 2x1 o fecha límite.
   - Si es CONCEPTUAL / BRANDING / TEMPORADA: Enfócate en el antojo, la ocasión de consumo (lluvia, fiesta, partido, antojo dulce, noche de películas), la emoción, el concepto de la imagen o la rapidez de entrega (Turbo).

Estética y Tono Rappi (REGLAS MANDATORIAS):
- Tono: Casual, fresco, dinámico, enfocado en el antojo y la conveniencia ("en minutos", "en un toque", "resuelve ya", "pídelo ya", "sin moverte de casa").
- Emojis: Exactamente de 2 a 3 emojis clave (ej. 💜, 🍫, ⚡, 🛵, 🧡, 🍬, 🍔, 🍕, 🥑, 🥤). Ni 1, ni más de 3.
- Título (Headline): ULTRA CORTO. Debe tener ESTRICTAMENTE entre 3 y 4 palabras máximo. Sin excepciones. Cuenta las palabras individualmente. Ejemplos válidos de 3 o 4 palabras: "Pídelo en 10 minutos", "Tu antojo en minutos", "Pide hoy con descuento", "Hamburguesas con 50% OFF", "Llega volando a ti", "Pide y ahorra hoy". PROHIBIDO 1, 2, 5 o más palabras.
- Texto Principal (Primary Text): Máximo 3 líneas. Debe combinar concepto o antojo + llamado claro a pedir por Rappi.
- REGLA CRÍTICA: NO USES HASHTAGS (#). Prohibidos totalmente.

Genera siempre exactamente 5 opciones con esta estructura:
Opción [Número]: [Ángulo o Enfoque]
• Texto principal: [2 a 3 líneas con concepto + llamado a pedir por Rappi]
• Título: [Headline de 3 a 4 palabras]`;

    const userPrompt = `Analiza esta creatividad publicitaria adjunta para Meta Ads de Rappi.
${targetCountry ? `Mercado objetivo: ${targetCountry}.` : ""}
${extraContext ? `Contexto o información adicional del anunciante: "${extraContext}".` : ""}

Realiza el análisis completo de los textos del arte y el enfoque visual, y genera las 5 opciones de copy siguiendo rigurosamente las instrucciones de tono, emojis (2-3), límite de líneas (máx 3), ausencia total de hashtags, y títulos de estrictamente 3 a 4 palabras.`;

    let response;
    let attempts = 0;
    const maxAttempts = 3; // Exactly 3 automatic attempts
    let lastError: any = null;
    let successfulModel = "gemini-3.8-flash";

    // Alternate candidate models if primary is busy or experiencing high demand
    const candidateModels = [
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.1-flash-lite",
    ];

    while (attempts < maxAttempts) {
      const currentModel = candidateModels[attempts] || "gemini-3.8-flash";
      try {
        attempts++;
        console.log(`[AI] Intentando generar copys con ${currentModel} (intento ${attempts}/${maxAttempts})...`);
        response = await ai.models.generateContent({
          model: currentModel,
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: finalMimeType,
                },
              },
              {
                text: userPrompt,
              },
            ],
          },
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                analysis: {
                  type: Type.OBJECT,
                  properties: {
                    detectedText: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Lista de todos los textos leídos en la imagen (slogans, marcas, llamadas a la acción, porcentajes, fechas, badges)",
                    },
                    focusType: {
                      type: Type.STRING,
                      enum: ["PROMOCIONAL", "CONCEPTUAL / BRANDING / TEMPORADA"],
                      description: "Enfoque determinado para la creatividad",
                    },
                    focusReasoning: {
                      type: Type.STRING,
                      description: "Explicación breve del por qué se determinó este enfoque",
                    },
                    creativeElements: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Elementos visuales detectados (ej: comida, packaging, logo Turbo, colores de fondo)",
                    },
                    brandBadgeDetected: {
                      type: Type.STRING,
                      description: "Badge de Rappi detectado si existe (ej. Turbo, Express, Prime, RappiBank, o null)",
                    },
                    urgencyLevel: {
                      type: Type.STRING,
                      enum: ["Alta", "Media", "Baja"],
                      description: "Nivel de urgencia detectado en la creatividad",
                    },
                  },
                  required: ["detectedText", "focusType", "focusReasoning", "creativeElements"],
                },
                options: {
                  type: Type.ARRAY,
                  description: "Exactamente 5 opciones distintas de copy para Meta Ads (Opción 1 a 5)",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      optionNumber: {
                        type: Type.INTEGER,
                        description: "Número de la opción (1 al 5)",
                      },
                      angle: {
                        type: Type.STRING,
                        description: "Ángulo o enfoque específico del copy (ej. Antojo Inmediato, Ahorro Agresivo, Conveniencia Turbo)",
                      },
                      primaryText: {
                        type: Type.STRING,
                        description: "Texto principal de máximo 3 líneas con concepto + llamado a pedir por Rappi, 2 a 3 emojis, sin hashtags",
                      },
                      headline: {
                        type: Type.STRING,
                        description: "Título (headline) ultra corto estrictamente de entre 3 y 4 palabras máximo",
                      },
                      headlineWordCount: {
                        type: Type.INTEGER,
                        description: "Cantidad exacta de palabras en el headline (debe ser 3 o 4)",
                      },
                      ctaButton: {
                        type: Type.STRING,
                        description: "Llamado a la acción recomendado para el botón de Meta Ads (ej. Pedir ahora, Comprar, Ver menú)",
                      },
                      formattedCopy: {
                        type: Type.STRING,
                        description: "El copy formateado con la estructura exacta: Opción X: [Ángulo]\\n• Texto principal: [texto]\\n• Título: [headline]",
                      },
                      whyItWorks: {
                        type: Type.STRING,
                        description: "Breve justificación de copywriting para esta opción",
                      },
                    },
                    required: ["optionNumber", "angle", "primaryText", "headline", "headlineWordCount", "ctaButton", "formattedCopy"],
                  },
                },
              },
              required: ["analysis", "options"],
            },
          },
        });
        successfulModel = currentModel;
        break; // Success
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        console.warn(`[AI] Intento ${attempts} con ${currentModel} falló:`, msg.slice(0, 150));

        if (attempts < maxAttempts) {
          console.log(`[AI] Servidor ocupado o reintento necesario. Esperando 2 segundos antes del siguiente intento...`);
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }

    if (!response) {
      // Parse error if 503
      let userFriendlyError = "No se pudo conectar con el servicio de IA.";
      const errMsg = lastError?.message || "";
      if (errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("UNAVAILABLE")) {
        userFriendlyError = "Los servidores de IA están experimentando una alta demanda temporal (Error 503). La solicitud se reintentó automáticamente varias veces. Por favor presiona 'Reintentar' en unos segundos.";
      } else if (errMsg) {
        userFriendlyError = errMsg;
      }
      return res.status(503).json({
        error: userFriendlyError,
        isHighDemand: true,
      });
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error("El modelo no generó ninguna respuesta.");
    }

    const parsedData = JSON.parse(responseText);

    // Double check & normalize headline words counts & formatted copy
    if (parsedData.options && Array.isArray(parsedData.options)) {
      parsedData.options = parsedData.options.map((opt: any, index: number) => {
        const headline = (opt.headline || "").trim();
        const words = headline.split(/\s+/).filter(Boolean);
        const wordCount = words.length;

        // Ensure formatted copy exists exactly as required
        const formatted = opt.formattedCopy || `Opción ${opt.optionNumber || index + 1}: ${opt.angle || "Enfoque Rappi"}\n• Texto principal: ${opt.primaryText}\n• Título: ${opt.headline}`;

        return {
          ...opt,
          optionNumber: opt.optionNumber || index + 1,
          headlineWordCount: wordCount,
          formattedCopy: formatted,
        };
      });
    }

    res.json({
      analysis: parsedData.analysis,
      options: parsedData.options,
      modelUsed: successfulModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in /api/generate-copy:", error);
    let message = error?.message || "Error al procesar la creatividad publicitaria.";
    if (message.includes("503") || message.includes("high demand")) {
      message = "Los servidores de Google AI están con alta demanda temporal (Error 503). Por favor reintenta en unos instantes.";
    }
    res.status(500).json({
      error: message,
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
