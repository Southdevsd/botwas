export interface AppStats {
  botsCreated: number;
  commandsGenerated: number;
  activeUsers: number;
}

class StatsService {
  private stats: AppStats;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    // Estatísticas iniciais mais realistas
    this.stats = {
      botsCreated: 1387,
      commandsGenerated: 9561,
      activeUsers: 434
    };
    
    // Carregar stats do localStorage se existir
    const savedStats = localStorage.getItem('appStats');
    if (savedStats) {
      this.stats = JSON.parse(savedStats);
    }
    
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Escutar eventos de criação de bot
    window.addEventListener('botCreated', () => {
      this.stats.botsCreated += 1;
      this.updateStats();
      console.log('Bot criado! Total:', this.stats.botsCreated);
    });

    // Escutar eventos de comandos gerados
    window.addEventListener('commandsGenerated', (event: any) => {
      const count = event.detail?.count || 1;
      this.stats.commandsGenerated += count;
      this.updateStats();
      console.log(`Comandos gerados: ${count} Total: ${this.stats.commandsGenerated}`);
    });

    // Escutar eventos de novos usuários
    window.addEventListener('userCreated', () => {
      this.stats.activeUsers += 1;
      this.updateStats();
      console.log('Novo usuário ativo! Total:', this.stats.activeUsers);
    });
  }

  private updateStats() {
    // Salvar no localStorage
    localStorage.setItem('appStats', JSON.stringify(this.stats));
    
    // Disparar evento para atualizar UI
    window.dispatchEvent(new CustomEvent('statsUpdated', { 
      detail: this.stats 
    }));
  }

  getStats(): AppStats {
    return { ...this.stats };
  }

  // Simular atividade para tornar as stats mais dinâmicas
  simulateActivity() {
    if (this.intervalId) return; // Já está rodando

    this.intervalId = setInterval(() => {
      const random = Math.random();
      
      if (random < 0.3) {
        // 30% chance: gerar comandos (1-5)
        const commandCount = Math.floor(Math.random() * 5) + 1;
        window.dispatchEvent(new CustomEvent('commandsGenerated', { 
          detail: { count: commandCount } 
        }));
      } else if (random < 0.5) {
        // 20% chance: novo bot criado
        window.dispatchEvent(new CustomEvent('botCreated'));
        // Quando um bot é criado, também gera alguns comandos
        const commandCount = Math.floor(Math.random() * 5) + 3;
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('commandsGenerated', { 
            detail: { count: commandCount } 
          }));
        }, 500);
      } else if (random < 0.6) {
        // 10% chance: novo usuário ativo
        window.dispatchEvent(new CustomEvent('userCreated'));
      }
    }, 10000 + Math.random() * 10000); // Entre 10-20 segundos
  }

  stopSimulation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const statsService = new StatsService();