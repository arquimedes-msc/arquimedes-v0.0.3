import { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Formatar horário para Brasília (GMT-3)
  const brasiliaTime = time.toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const brasiliaDate = time.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Separar hora, minuto e segundo
  const [hours, minutes, seconds] = brasiliaTime.split(':');

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-200/20 dark:border-purple-800/20 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
            <ClockIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Horário de Brasília
          </span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold font-mono text-foreground tabular-nums">
              {hours}
            </span>
            <span className="text-3xl font-bold text-purple-500 dark:text-purple-400 animate-pulse">
              :
            </span>
            <span className="text-4xl font-bold font-mono text-foreground tabular-nums">
              {minutes}
            </span>
            <span className="text-3xl font-bold text-purple-500 dark:text-purple-400 animate-pulse">
              :
            </span>
            <span className="text-4xl font-bold font-mono text-muted-foreground/60 tabular-nums">
              {seconds}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground capitalize font-medium">
          {brasiliaDate}
        </div>
      </div>
    </Card>
  );
}
