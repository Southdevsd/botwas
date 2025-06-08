import { useState, useEffect } from 'react';
import { statsService, AppStats } from '@/services/statsService';

const DynamicStats = () => {
  const [stats, setStats] = useState<AppStats>(statsService.getStats());

  useEffect(() => {
    const handleStatsUpdate = (event: CustomEvent) => {
      setStats(event.detail);
    };

    window.addEventListener('statsUpdated', handleStatsUpdate as EventListener);
    
    // Iniciar simulação de atividade
    statsService.simulateActivity();

    return () => {
      window.removeEventListener('statsUpdated', handleStatsUpdate as EventListener);
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k+';
    }
    return num.toString() + '+';
  };

  return (
    <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
      <div className="text-center">
        <div className="text-3xl font-bold text-cyber-cyan transition-all duration-500">
          {formatNumber(stats.botsCreated)}
        </div>
        <div className="text-cyber-green">Bots Criados</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-cyber-cyan transition-all duration-500">
          {formatNumber(stats.commandsGenerated)}
        </div>
        <div className="text-cyber-green">Comandos</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-cyber-cyan transition-all duration-500">
          {formatNumber(stats.activeUsers)}
        </div>
        <div className="text-cyber-green">Usuários</div>
      </div>
    </div>
  );
};

export default DynamicStats;