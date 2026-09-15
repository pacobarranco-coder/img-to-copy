import { SampleAd } from '../types';

// Helper to create an SVG data URI
function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Sample 1: Promocional - 50% OFF Hamburguesas
const promoBurgerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3E1D" />
      <stop offset="100%" stop-color="#D92B0C" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="15" flood-opacity="0.35"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="800" fill="url(#bgGrad)" />
  
  <!-- Decorative rays/circle -->
  <circle cx="400" cy="420" r="300" fill="#FF5733" opacity="0.4" />
  
  <!-- Rappi Logo & Header -->
  <g transform="translate(60, 60)">
    <rect x="0" y="0" width="130" height="46" rx="23" fill="#FFFFFF" />
    <text x="65" y="30" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#FF3E1D" text-anchor="middle">Rappi</text>
  </g>
  
  <!-- Badge Prime -->
  <g transform="translate(560, 60)">
    <rect x="0" y="0" width="180" height="46" rx="23" fill="#1E1B4B" />
    <text x="90" y="29" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="16" fill="#FACC15" text-anchor="middle">⭐ ENVÍO GRATIS</text>
  </g>

  <!-- Big Badge 50% OFF -->
  <g transform="translate(400, 210)" filter="url(#shadow)">
    <rect x="-260" y="-55" width="520" height="110" rx="30" fill="#FFDD00" />
    <text x="0" y="20" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="70" fill="#000000" text-anchor="middle" letter-spacing="-1">50% OFF</text>
  </g>

  <!-- Subheading -->
  <text x="400" y="320" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="36" fill="#FFFFFF" text-anchor="middle">EN BURGERS SELECCIONADAS</text>
  <text x="400" y="360" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="20" fill="#FFE5D9" text-anchor="middle">¡Solo por hoy con el código BURGERWEEK!</text>

  <!-- Burger Illustration representation -->
  <g transform="translate(400, 520)" filter="url(#shadow)">
    <!-- Plate -->
    <ellipse cx="0" cy="110" rx="240" ry="40" fill="#000000" opacity="0.3" />
    <!-- Bottom Bun -->
    <path d="M-150,60 C-150,95 150,95 150,60 Z" fill="#E09F5B" />
    <!-- Patty -->
    <rect x="-165" y="35" width="330" height="30" rx="15" fill="#4A2810" />
    <!-- Cheese -->
    <polygon points="-160,35 160,35 140,55 0,40 -120,58" fill="#FFC72C" />
    <!-- Lettuce -->
    <path d="M-170,30 Q-120,10 -80,30 Q-40,10 0,30 Q40,10 80,30 Q120,10 170,30" fill="#588157" stroke="#3A5A40" stroke-width="8" />
    <!-- Tomato -->
    <rect x="-150" y="10" width="300" height="20" rx="10" fill="#D62246" />
    <!-- Top Bun -->
    <path d="M-160,10 C-160,-90 160,-90 160,10 Z" fill="#E09F5B" />
    <!-- Sesame Seeds -->
    <ellipse cx="-60" cy="-35" rx="5" ry="3" fill="#FFF2B2" />
    <ellipse cx="0" cy="-55" rx="5" ry="3" fill="#FFF2B2" />
    <ellipse cx="70" cy="-30" rx="5" ry="3" fill="#FFF2B2" />
    <ellipse cx="-20" cy="-20" rx="5" ry="3" fill="#FFF2B2" />
    <ellipse cx="40" cy="-45" rx="5" ry="3" fill="#FFF2B2" />
  </g>

  <!-- CTA Banner at Bottom -->
  <g transform="translate(400, 715)">
    <rect x="-180" y="-35" width="360" height="70" rx="35" fill="#FFFFFF" filter="url(#shadow)" />
    <text x="0" y="10" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="26" fill="#FF3E1D" text-anchor="middle">PIDE EN UN TOQUE 🛵</text>
  </g>
</svg>`;

// Sample 2: Turbo - Cervezas y Botanas en 10 min
const turboDrinksSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="turboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14002C" />
      <stop offset="50%" stop-color="#2D0B5A" />
      <stop offset="100%" stop-color="#550A8A" />
    </linearGradient>
    <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00FFA3" />
      <stop offset="100%" stop-color="#00E5FF" />
    </linearGradient>
  </defs>

  <rect width="800" height="800" fill="url(#turboGrad)" />

  <!-- Lightning decorative lines -->
  <path d="M50,150 L200,80 L350,180" stroke="#7928CA" stroke-width="3" opacity="0.3" fill="none" />
  <path d="M600,600 L720,500 L780,680" stroke="#00FFA3" stroke-width="2" opacity="0.3" fill="none" />

  <!-- Turbo Badge Header -->
  <g transform="translate(400, 110)">
    <rect x="-190" y="-45" width="380" height="90" rx="45" fill="#FF441F" />
    <text x="-40" y="15" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="42" fill="#FFFFFF" text-anchor="middle">Rappi</text>
    <rect x="25" y="-30" width="135" height="60" rx="30" fill="#00FFA3" />
    <text x="92" y="12" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">⚡TURBO</text>
  </g>

  <!-- Main Headline -->
  <text x="400" y="235" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="46" fill="#FFFFFF" text-anchor="middle">¿SE ACABARON LAS FRÍAS?</text>
  <text x="400" y="285" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="28" fill="#00FFA3" text-anchor="middle">LLEGAN EN MENOS DE 10 MINUTOS</text>

  <!-- Illustration of cold beers and snacks -->
  <g transform="translate(400, 480)">
    <!-- Ice glow -->
    <ellipse cx="0" cy="110" rx="260" ry="40" fill="#00E5FF" opacity="0.25" />
    
    <!-- Beer bottles -->
    <g transform="translate(-80, 0)">
      <path d="M-25,-120 L25,-120 L25,-40 L45,0 L45,100 L-45,100 L-45,0 L-25,-40 Z" fill="#2E5A27" />
      <rect x="-20" y="-135" width="40" height="15" rx="5" fill="#DAA520" />
      <rect x="-35" y="10" width="70" height="50" rx="6" fill="#FFFFFF" opacity="0.9" />
      <text x="0" y="42" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#2E5A27" text-anchor="middle">CERVEZA</text>
    </g>
    
    <g transform="translate(50, 20)">
      <path d="M-25,-120 L25,-120 L25,-40 L45,0 L45,100 L-45,100 L-45,0 L-25,-40 Z" fill="#78350F" />
      <rect x="-20" y="-135" width="40" height="15" rx="5" fill="#DAA520" />
      <rect x="-35" y="10" width="70" height="50" rx="6" fill="#FFFFFF" opacity="0.9" />
      <text x="0" y="42" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#B45309" text-anchor="middle">HELADA</text>
    </g>

    <!-- Snacks bag -->
    <g transform="translate(160, 40) rotate(10)">
      <polygon points="-40,-70 40,-70 50,60 -50,60" fill="#EF4444" />
      <polygon points="-45,-75 45,-75 40,-68 -40,-68" fill="#F59E0B" />
      <text x="0" y="10" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle">CHIPS</text>
    </g>
  </g>

  <!-- Footer Tag -->
  <g transform="translate(400, 715)">
    <rect x="-220" y="-35" width="440" height="70" rx="35" fill="url(#neonGlow)" />
    <text x="0" y="10" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#000000" text-anchor="middle">RESUELVE LA FIESTA EN UN TOQUE ⚡</text>
  </g>
</svg>`;

// Sample 3: Conceptual / Antojo Dulce - Chocolates & Snacks tarde lluviosa
const sweetCravingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="purpleChoc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4C1D95" />
      <stop offset="100%" stop-color="#2E1065" />
    </linearGradient>
  </defs>

  <rect width="800" height="800" fill="url(#purpleChoc)" />

  <!-- Rappi Logo -->
  <g transform="translate(70, 70)">
    <rect x="0" y="0" width="130" height="44" rx="22" fill="#FF441F" />
    <text x="65" y="29" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">Rappi</text>
  </g>

  <!-- Tagline -->
  <text x="400" y="190" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="38" fill="#FBCFE8" text-anchor="middle">TARDE DE PELIS Y LLUVIA</text>
  <text x="400" y="255" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" text-anchor="middle">EL ANTOJO DULCE QUE MERECES</text>

  <!-- Chocolate bars and treats illustration -->
  <g transform="translate(400, 470)">
    <!-- Chocolate Bar 1 -->
    <g transform="translate(-100, -30) rotate(-15)">
      <rect x="-80" y="-120" width="160" height="240" rx="12" fill="#581C87" stroke="#7E22CE" stroke-width="4" />
      <!-- Gold wrapper peeking -->
      <polygon points="-80,-120 80,-120 40,-50 -80,-50" fill="#EAB308" />
      <!-- Chocolate chunks -->
      <rect x="-60" y="-30" width="50" height="60" rx="6" fill="#3B1207" />
      <rect x="10" y="-30" width="50" height="60" rx="6" fill="#3B1207" />
      <rect x="-60" y="40" width="50" height="60" rx="6" fill="#3B1207" />
      <rect x="10" y="40" width="50" height="60" rx="6" fill="#3B1207" />
      <text x="0" y="-70" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle">MILK CHOC</text>
    </g>

    <!-- Candies and Donuts -->
    <g transform="translate(110, 40) rotate(12)">
      <!-- Donut -->
      <ellipse cx="0" cy="0" rx="80" ry="70" fill="#D97706" />
      <ellipse cx="0" cy="0" rx="65" ry="55" fill="#EC4899" />
      <ellipse cx="0" cy="0" rx="25" ry="20" fill="#2E1065" />
      <!-- Sprinkles -->
      <line x1="-35" y1="-30" x2="-25" y2="-20" stroke="#FBBF24" stroke-width="4" stroke-linecap="round"/>
      <line x1="20" y1="-35" x2="35" y2="-30" stroke="#60A5FA" stroke-width="4" stroke-linecap="round"/>
      <line x1="30" y1="20" x2="40" y2="35" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      <line x1="-40" y1="15" x2="-30" y2="25" stroke="#34D399" stroke-width="4" stroke-linecap="round"/>
    </g>
  </g>

  <!-- CTA Box -->
  <g transform="translate(400, 710)">
    <rect x="-190" y="-35" width="380" height="70" rx="35" fill="#FF441F" />
    <text x="0" y="10" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">ENDÚLZATE EN MINUTOS 🍫</text>
  </g>
</svg>`;

// Sample 4: Temporada / Fin de Semana - Pizza & Amigos
const weekendPizzaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bgWarm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F2937" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
  </defs>

  <rect width="800" height="800" fill="url(#bgWarm)" />

  <g transform="translate(70, 70)">
    <rect x="0" y="0" width="130" height="44" rx="22" fill="#FF441F" />
    <text x="65" y="29" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">Rappi</text>
  </g>

  <g transform="translate(560, 70)">
    <rect x="0" y="0" width="180" height="44" rx="22" fill="#FF441F" />
    <text x="90" y="28" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="16" fill="#FFFFFF" text-anchor="middle">🍕 VIERNES DE PIZZA</text>
  </g>

  <text x="400" y="200" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" fill="#F59E0B" text-anchor="middle">2X1 EN PIZZAS FAMILIARES</text>
  <text x="400" y="250" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="24" fill="#E5E7EB" text-anchor="middle">El plan perfecto para compartir hoy</text>

  <!-- Big Pizza graphic -->
  <g transform="translate(400, 470)">
    <ellipse cx="0" cy="0" rx="210" ry="180" fill="#D97706" />
    <ellipse cx="0" cy="0" rx="190" ry="160" fill="#F59E0B" />
    <!-- Slices dividers -->
    <line x1="-180" y1="0" x2="180" y2="0" stroke="#B45309" stroke-width="3" stroke-dasharray="8,6" />
    <line x1="0" y1="-150" x2="0" y2="150" stroke="#B45309" stroke-width="3" stroke-dasharray="8,6" />
    <!-- Pepperonis -->
    <ellipse cx="-70" cy="-60" rx="24" ry="20" fill="#DC2626" />
    <ellipse cx="60" cy="-70" rx="26" ry="22" fill="#DC2626" />
    <ellipse cx="-80" cy="50" rx="28" ry="24" fill="#DC2626" />
    <ellipse cx="80" cy="60" rx="25" ry="22" fill="#DC2626" />
    <ellipse cx="0" cy="0" rx="30" ry="25" fill="#DC2626" />
    <!-- Cheese melt drops -->
    <circle cx="-20" cy="-40" r="8" fill="#FEF08A" />
    <circle cx="40" cy="20" r="7" fill="#FEF08A" />
  </g>

  <g transform="translate(400, 715)">
    <rect x="-180" y="-35" width="360" height="70" rx="35" fill="#FF441F" />
    <text x="0" y="10" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">PIDE YA CON 2X1 🍕</text>
  </g>
</svg>`;

export const SAMPLE_CREATIVES: SampleAd[] = [
  {
    id: 'promo-burgers',
    title: '50% OFF Hamburguesas',
    category: 'Promocional',
    imageUrl: createSvgDataUri(promoBurgerSvg),
    description: 'Promo agresiva de Burger Week con 50% de descuento y badge Prime de envío gratis.',
    preloadedContext: 'Campaña promocional de Burger Week con 50% OFF en marcas seleccionadas y envío gratis.',
  },
  {
    id: 'turbo-drinks',
    title: 'Rappi Turbo: Cervezas & Botanas',
    category: 'Turbo',
    imageUrl: createSvgDataUri(turboDrinksSvg),
    description: 'Enfoque de conveniencia y rapidez inmediata: cervezas frías y snacks en menos de 10 minutos.',
    preloadedContext: 'Campaña Rappi Turbo para viernes y fines de semana. Entrega ultra rápida en menos de 10 min.',
  },
  {
    id: 'sweet-craving',
    title: 'Antojo Dulce: Chocolates Milka',
    category: 'Antojo / Producto',
    imageUrl: createSvgDataUri(sweetCravingSvg),
    description: 'Enfoque de antojo y ocasión de consumo: tarde de lluvia, descanso y chocolates favoritos.',
    preloadedContext: 'Creatividad de producto enfocada en el antojo dulce de la tarde y comodidad sin salir.',
  },
  {
    id: 'weekend-pizza',
    title: '2x1 Pizzas de Fin de Semana',
    category: 'Temporada',
    imageUrl: createSvgDataUri(weekendPizzaSvg),
    description: 'Enfoque social y promocional: reunión de amigos o familia para viernes de pizza 2x1.',
    preloadedContext: 'Promoción de viernes de pizza al 2x1 para compartir con amigos.',
  },
];
