/**
 * Sistema de Cores por Módulo - Arquimedes
 * 
 * Este arquivo define o mapeamento de cores para cada módulo matemático,
 * garantindo consistência visual em toda a plataforma.
 */

export interface ModuleColorScheme {
  /** Cor primária do módulo (para backgrounds, badges) */
  primary: string;
  /** Cor de texto sobre a cor primária */
  primaryForeground: string;
  /** Cor clara para backgrounds sutis */
  light: string;
  /** Cor de borda */
  border: string;
  /** Gradiente decorativo */
  gradient: string;
  /** Emoji representativo */
  emoji: string;
}

/**
 * Mapeamento de cores por slug de módulo
 */
export const moduleColors: Record<string, ModuleColorScheme> = {
  // Módulo 1: Adição e Subtração
  'adicao-e-subtracao': {
    primary: 'oklch(0.65 0.25 142)', // Verde
    primaryForeground: 'oklch(1 0 0)',
    light: 'oklch(0.95 0.05 142)',
    border: 'oklch(0.75 0.15 142)',
    gradient: 'linear-gradient(135deg, oklch(0.65 0.25 142) 0%, oklch(0.55 0.23 142) 100%)',
    emoji: '➕',
  },
  
  // Módulo 2: Multiplicação
  'multiplicacao': {
    primary: 'oklch(0.60 0.20 271)', // Roxo
    primaryForeground: 'oklch(1 0 0)',
    light: 'oklch(0.95 0.05 271)',
    border: 'oklch(0.70 0.15 271)',
    gradient: 'linear-gradient(135deg, oklch(0.60 0.20 271) 0%, oklch(0.50 0.18 271) 100%)',
    emoji: '✖️',
  },
  
  // Módulo 3: Divisão
  'divisao': {
    primary: 'oklch(0.55 0.18 220)', // Azul cyan
    primaryForeground: 'oklch(1 0 0)',
    light: 'oklch(0.95 0.05 220)',
    border: 'oklch(0.65 0.13 220)',
    gradient: 'linear-gradient(135deg, oklch(0.55 0.18 220) 0%, oklch(0.45 0.16 220) 100%)',
    emoji: '➗',
  },
  
  // Módulo 4: Frações
  'fracoes': {
    primary: 'oklch(0.60 0.22 27)', // Laranja
    primaryForeground: 'oklch(1 0 0)',
    light: 'oklch(0.95 0.05 27)',
    border: 'oklch(0.70 0.17 27)',
    gradient: 'linear-gradient(135deg, oklch(0.60 0.22 27) 0%, oklch(0.50 0.20 27) 100%)',
    emoji: '🍕',
  },
  
  // Módulo 5: Proporção e Razão
  'proporcao-e-razao': {
    primary: 'oklch(0.58 0.19 310)', // Rosa/Magenta
    primaryForeground: 'oklch(1 0 0)',
    light: 'oklch(0.95 0.05 310)',
    border: 'oklch(0.68 0.14 310)',
    gradient: 'linear-gradient(135deg, oklch(0.58 0.19 310) 0%, oklch(0.48 0.17 310) 100%)',
    emoji: '⚖️',
  },
  
  // Módulo 6: Porcentagem
  'porcentagem': {
    primary: 'oklch(0.62 0.21 85)', // Amarelo/Dourado
    primaryForeground: 'oklch(0.2 0 0)',
    light: 'oklch(0.95 0.05 85)',
    border: 'oklch(0.72 0.16 85)',
    gradient: 'linear-gradient(135deg, oklch(0.62 0.21 85) 0%, oklch(0.52 0.19 85) 100%)',
    emoji: '💯',
  },
  
  // Módulo 7: Exponenciação
  'exponenciacao': {
    primary: 'oklch(0.57 0.20 15)', // Vermelho/Coral
    primaryForeground: 'oklch(1 0 0)',
    light: 'oklch(0.95 0.05 15)',
    border: 'oklch(0.67 0.15 15)',
    gradient: 'linear-gradient(135deg, oklch(0.57 0.20 15) 0%, oklch(0.47 0.18 15) 100%)',
    emoji: '🚀',
  },
  
  // Módulo 8: Fatoração
  'fatoracao': {
    primary: 'oklch(0.56 0.19 190)', // Turquesa
    primaryForeground: 'oklch(1 0 0)',
    light: 'oklch(0.95 0.05 190)',
    border: 'oklch(0.66 0.14 190)',
    gradient: 'linear-gradient(135deg, oklch(0.56 0.19 190) 0%, oklch(0.46 0.17 190) 100%)',
    emoji: '🔢',
  },
  
  // Fallback para módulos não mapeados
  'default': {
    primary: 'oklch(0.55 0.22 259)', // Azul padrão
    primaryForeground: 'oklch(1 0 0)',
    light: 'oklch(0.95 0.05 259)',
    border: 'oklch(0.65 0.17 259)',
    gradient: 'linear-gradient(135deg, oklch(0.55 0.22 259) 0%, oklch(0.45 0.20 259) 100%)',
    emoji: '📚',
  },
};

/**
 * Obtém o esquema de cores para um módulo específico
 */
export function getModuleColorScheme(moduleSlug: string): ModuleColorScheme {
  return moduleColors[moduleSlug] || moduleColors['default'];
}

/**
 * Gera classes Tailwind CSS para um módulo
 */
export function getModuleClasses(moduleSlug: string) {
  const scheme = getModuleColorScheme(moduleSlug);
  
  return {
    /** Classe para background primário */
    bg: `bg-[${scheme.primary}]`,
    /** Classe para texto sobre background primário */
    text: `text-[${scheme.primaryForeground}]`,
    /** Classe para background claro */
    bgLight: `bg-[${scheme.light}]`,
    /** Classe para borda */
    border: `border-[${scheme.border}]`,
    /** Classe para hover */
    hover: `hover:bg-[${scheme.primary}]`,
  };
}

/**
 * Gera estilos inline para um módulo (útil para gradientes)
 */
export function getModuleStyles(moduleSlug: string) {
  const scheme = getModuleColorScheme(moduleSlug);
  
  return {
    /** Estilo de background com cor primária */
    backgroundColor: scheme.primary,
    /** Estilo de cor de texto */
    color: scheme.primaryForeground,
    /** Estilo de background com gradiente */
    backgroundImage: scheme.gradient,
    /** Estilo de borda */
    borderColor: scheme.border,
  };
}

/**
 * Obtém o emoji representativo de um módulo
 */
export function getModuleEmoji(moduleSlug: string): string {
  const scheme = getModuleColorScheme(moduleSlug);
  return scheme.emoji;
}

/**
 * Gera badge colorido para um módulo
 */
export function getModuleBadgeStyle(moduleSlug: string) {
  const scheme = getModuleColorScheme(moduleSlug);
  
  return {
    backgroundColor: scheme.light,
    color: scheme.primary,
    borderColor: scheme.border,
  };
}
