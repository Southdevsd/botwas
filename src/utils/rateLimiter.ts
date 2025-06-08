interface RateLimit {
  attempts: number;
  resetTime: number;
}

interface SecurityLog {
  userId: string;
  action: string;
  success: boolean;
  metadata: any;
  timestamp: number;
}

export const useRateLimit = () => {
  const RATE_LIMITS = {
    aiGeneration: { maxAttempts: 10, windowMs: 60000 }, // 10 attempts per minute
  };

  const checkLimit = (action: keyof typeof RATE_LIMITS): boolean => {
    const key = `rateLimit_${action}`;
    const stored = localStorage.getItem(key);
    const now = Date.now();
    const limit = RATE_LIMITS[action];

    let rateLimit: RateLimit;
    if (stored) {
      rateLimit = JSON.parse(stored);
      if (now > rateLimit.resetTime) {
        rateLimit = { attempts: 0, resetTime: now + limit.windowMs };
      }
    } else {
      rateLimit = { attempts: 0, resetTime: now + limit.windowMs };
    }

    if (rateLimit.attempts >= limit.maxAttempts) {
      return false;
    }

    rateLimit.attempts++;
    localStorage.setItem(key, JSON.stringify(rateLimit));
    return true;
  };

  const getRemainingAttempts = (action: keyof typeof RATE_LIMITS): number => {
    const key = `rateLimit_${action}`;
    const stored = localStorage.getItem(key);
    const now = Date.now();
    const limit = RATE_LIMITS[action];

    if (!stored) return limit.maxAttempts;

    const rateLimit: RateLimit = JSON.parse(stored);
    if (now > rateLimit.resetTime) {
      return limit.maxAttempts;
    }

    return Math.max(0, limit.maxAttempts - rateLimit.attempts);
  };

  return { checkLimit, getRemainingAttempts };
};

export const validateCode = (code: string) => {
  const errors: string[] = [];
  
  // Verificações de segurança básicas
  if (code.includes('eval(')) {
    errors.push('Uso de eval() não permitido');
  }
  
  if (code.includes('require(\'fs\')') || code.includes('require("fs")')) {
    errors.push('Acesso ao sistema de arquivos não permitido');
  }
  
  if (code.includes('process.env') && !code.includes('process.env.TOKEN')) {
    errors.push('Acesso a variáveis de ambiente sensíveis');
  }
  
  // Verificações de sintaxe básicas
  try {
    // Verificar se tem estrutura básica de comando Discord.js
    if (!code.includes('SlashCommandBuilder')) {
      errors.push('Comando deve usar SlashCommandBuilder');
    }
    
    if (!code.includes('module.exports')) {
      errors.push('Comando deve exportar módulo');
    }
    
    if (!code.includes('async execute(interaction)')) {
      errors.push('Comando deve ter função execute');
    }
  } catch (error) {
    errors.push('Erro de sintaxe no código gerado');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const securityLogger = {
  logAttempt: (userId: string, action: string, success: boolean, metadata: any) => {
    const log: SecurityLog = {
      userId,
      action,
      success,
      metadata,
      timestamp: Date.now()
    };
    
    // Armazenar logs localmente (em produção, enviar para servidor)
    const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    logs.push(log);
    
    // Manter apenas os últimos 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('securityLogs', JSON.stringify(logs));
    console.log('Security Log:', log);
  }
};
