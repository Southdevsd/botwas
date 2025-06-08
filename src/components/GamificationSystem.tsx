import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Award, Zap, Target, Crown, Medal, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
  date?: string;
}

const GamificationSystem = () => {
  const [userLevel, setUserLevel] = useState(5);
  const [currentXP, setCurrentXP] = useState(2350);
  const [xpToNextLevel, setXpToNextLevel] = useState(3000);
  const [totalBots, setTotalBots] = useState(12);
  const [totalCommands, setTotalCommands] = useState(89);
  const { toast } = useToast();

  const badges = [
    {
      id: 'first-bot',
      name: 'Primeiro Bot',
      description: 'Criou seu primeiro bot',
      icon: Trophy,
      color: 'bg-yellow-500',
      unlocked: true
    },
    {
      id: 'command-master',
      name: 'Mestre dos Comandos',
      description: 'Criou 50+ comandos',
      icon: Zap,
      color: 'bg-blue-500',
      unlocked: true,
      progress: 89,
      maxProgress: 50
    },
    {
      id: 'bot-creator',
      name: 'Criador de Bots',
      description: 'Criou 10+ bots',
      icon: Crown,
      color: 'bg-purple-500',
      unlocked: true,
      progress: 12,
      maxProgress: 10
    },
    {
      id: 'community-helper',
      name: 'Ajudante da Comunidade',
      description: 'Compartilhou 5 templates',
      icon: Award,
      color: 'bg-green-500',
      unlocked: false,
      progress: 2,
      maxProgress: 5
    },
    {
      id: 'perfectionist',
      name: 'Perfeccionista',
      description: 'Obteve 100% de qualidade em um bot',
      icon: Target,
      color: 'bg-red-500',
      unlocked: false,
      progress: 87,
      maxProgress: 100
    },
    {
      id: 'speed-demon',
      name: 'Demônio da Velocidade',
      description: 'Criou um bot em menos de 5 minutos',
      icon: Medal,
      color: 'bg-orange-500',
      unlocked: false
    }
  ];

  const achievements = [
    {
      id: 'level-5',
      title: 'Nível 5 Alcançado!',
      description: 'Parabéns por chegar ao nível 5',
      xp: 500,
      unlocked: true,
      date: '2024-01-15'
    },
    {
      id: 'deploy-master',
      title: 'Mestre do Deploy',
      description: 'Fez deploy de 5 bots com sucesso',
      xp: 300,
      unlocked: true,
      date: '2024-01-10'
    },
    {
      id: 'ai-enthusiast',
      title: 'Entusiasta da IA',
      description: 'Usou IA para gerar 20 comandos',
      xp: 200,
      unlocked: false
    }
  ];

  const rewards = [
    {
      level: 10,
      reward: 'Template Premium Gratuito',
      unlocked: false
    },
    {
      level: 15,
      reward: 'Tema Exclusivo "Cyberpunk"',
      unlocked: false
    },
    {
      level: 20,
      reward: 'Deploy Gratuito por 1 mês',
      unlocked: false
    }
  ];

  const earnXP = (amount: number, reason: string) => {
    setCurrentXP(prev => {
      const newXP = prev + amount;
      if (newXP >= xpToNextLevel) {
        setUserLevel(level => level + 1);
        setXpToNextLevel(xp => xp + 1000);
        toast({
          title: "🎉 Level Up!",
          description: `Você alcançou o nível ${userLevel + 1}!`
        });
      }
      
      toast({
        title: `+${amount} XP`,
        description: reason
      });
      
      return newXP;
    });
  };

  const levelProgress = (currentXP / xpToNextLevel) * 100;

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          Sistema de Gamificação
        </CardTitle>
        <CardDescription>
          Ganhe XP, desbloqueie badges e complete conquistas criando bots
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {userLevel}
              </div>
              <div>
                <h3 className="font-semibold">Nível {userLevel}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => earnXP(100, 'Teste de XP')}
              className="bg-gradient-discord hover:bg-discord-dark text-white"
            >
              <Gift className="mr-1 h-3 w-3" />
              Ganhar XP
            </Button>
          </div>
          <Progress value={levelProgress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {xpToNextLevel - currentXP} XP para o próximo nível
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-purple-500">{totalBots}</div>
            <div className="text-sm text-muted-foreground">Bots Criados</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-blue-500">{totalCommands}</div>
            <div className="text-sm text-muted-foreground">Comandos Totais</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-green-500">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-sm text-muted-foreground">Conquistas</div>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-medium mb-3">🏆 Badges Conquistadas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {badges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border ${
                    badge.unlocked 
                      ? 'bg-background border-green-500/50' 
                      : 'bg-muted/50 border-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-8 h-8 ${badge.color} rounded-full flex items-center justify-center text-white`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                    </div>
                  </div>
                  
                  {badge.progress !== undefined && badge.maxProgress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{badge.progress}</span>
                        <span>{badge.maxProgress}</span>
                      </div>
                      <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-1" />
                    </div>
                  )}
                  
                  {badge.unlocked && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Desbloqueada
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h3 className="font-medium mb-3">🎯 Conquistas Recentes</h3>
          <div className="space-y-2">
            {achievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-background border-border'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-green-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-500">+{achievement.xp} XP</div>
                  {achievement.date && (
                    <div className="text-xs text-muted-foreground">{achievement.date}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Rewards */}
        <div>
          <h3 className="font-medium mb-3">🎁 Recompensas de Nível</h3>
          <div className="space-y-2">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  userLevel >= reward.level 
                    ? 'bg-yellow-500/10 border-yellow-500/20' 
                    : 'bg-background border-border'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    userLevel >= reward.level 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Gift className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{reward.reward}</div>
                    <div className="text-xs text-muted-foreground">Nível {reward.level}</div>
                  </div>
                </div>
                {userLevel >= reward.level ? (
                  <Badge className="bg-yellow-500 text-white">Desbloqueado</Badge>
                ) : (
                  <Badge variant="outline">Bloqueado</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenges */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="font-medium mb-3 flex items-center">
            <Target className="mr-2 h-4 w-4 text-blue-500" />
            Desafios Diários
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>✅ Criar 1 comando novo</span>
              <span className="text-green-500 font-medium">+50 XP</span>
            </div>
            <div className="flex items-center justify-between">
              <span>🔄 Fazer deploy de um bot</span>
              <span className="text-blue-500 font-medium">+100 XP</span>
            </div>
            <div className="flex items-center justify-between opacity-60">
              <span>📝 Compartilhar um template</span>
              <span className="text-purple-500 font-medium">+150 XP</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSystem;