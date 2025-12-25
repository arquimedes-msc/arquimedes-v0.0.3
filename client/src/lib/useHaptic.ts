/**
 * Hook para feedback tátil (vibração) em dispositivos móveis
 * Usa a Vibration API do navegador
 */
export function useHaptic() {
  /**
   * Verifica se o navegador suporta vibração
   */
  const isSupported = () => {
    return "vibrate" in navigator;
  };

  /**
   * Vibração leve (acerto, click)
   */
  const light = () => {
    if (isSupported()) {
      navigator.vibrate(10);
    }
  };

  /**
   * Vibração média (sucesso)
   */
  const medium = () => {
    if (isSupported()) {
      navigator.vibrate(25);
    }
  };

  /**
   * Vibração forte (erro)
   */
  const heavy = () => {
    if (isSupported()) {
      navigator.vibrate(50);
    }
  };

  /**
   * Vibração de sucesso (padrão curto-curto-longo)
   */
  const success = () => {
    if (isSupported()) {
      navigator.vibrate([10, 50, 10, 50, 30]);
    }
  };

  /**
   * Vibração de erro (padrão longo-curto-longo)
   */
  const error = () => {
    if (isSupported()) {
      navigator.vibrate([50, 100, 50]);
    }
  };

  /**
   * Vibração de conquista (padrão crescente)
   */
  const achievement = () => {
    if (isSupported()) {
      navigator.vibrate([10, 50, 20, 50, 30, 50, 40]);
    }
  };

  /**
   * Vibração de level-up (padrão especial)
   */
  const levelUp = () => {
    if (isSupported()) {
      navigator.vibrate([30, 100, 30, 100, 50, 100, 100]);
    }
  };

  /**
   * Parar todas as vibrações
   */
  const stop = () => {
    if (isSupported()) {
      navigator.vibrate(0);
    }
  };

  return {
    isSupported: isSupported(),
    light,
    medium,
    heavy,
    success,
    error,
    achievement,
    levelUp,
    stop,
  };
}
