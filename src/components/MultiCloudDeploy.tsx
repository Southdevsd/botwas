import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Cloud, Server, Zap, Globe, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Platform {
  id: string;
  name: string;
  icon: any;
  description: string;
  status: 'available' | 'deploying' | 'deployed' | 'error';
  url?: string;
  deployTime?: number;
}

const MultiCloudDeploy = ({ botName }: { botName: string }) => {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'replit',
      name: 'Replit',
      icon: Server,
      description: 'Deploy rápido e gratuito para desenvolvimento',
      status: 'available'
    },
    {
      id: 'railway',
      name: 'Railway',
      icon: Zap,
      description: 'Infraestrutura moderna para produção',
      status: 'available'
    },
    {
      id: 'vercel',
      name: 'Vercel',
      icon: Globe,
      description: 'Edge computing global',
      status: 'available'
    },
    {
      id: 'fly',
      name: 'Fly.io',
      icon: Cloud,
      description: 'Deploy próximo aos usuários',
      status: 'available'
    }
  ]);

  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  const deployToPlatform = async (platformId: string) => {
    setIsDeploying(true);
    
    // Atualizar status para deploying
    setPlatforms(platforms.map(p => 
      p.id === platformId ? { ...p, status: 'deploying' } : p
    ));

    try {
      // Simular deploy
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Simular sucesso
      const deployTime = Math.floor(Math.random() * 120) + 30;
      const url = `https://${botName.toLowerCase()}-${platformId}.app`;
      
      setPlatforms(platforms.map(p => 
        p.id === platformId 
          ? { ...p, status: 'deployed', url, deployTime }
          : p
      ));

      toast({
        title: "Deploy concluído!",
        description: `Bot implantado no ${platforms.find(p => p.id === platformId)?.name} em ${deployTime}s`
      });
    } catch (error) {
      setPlatforms(platforms.map(p => 
        p.id === platformId ? { ...p, status: 'error' } : p
      ));
      
      toast({
        title: "Erro no deploy",
        description: "Falha ao implantar o bot. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = (status: Platform['status']) => {
    switch (status) {
      case 'available': return Cloud;
      case 'deploying': return Clock;
      case 'deployed': return CheckCircle;
      case 'error': return AlertTriangle;
      default: return Cloud;
    }
  };

  const getStatusColor = (status: Platform['status']) => {
    switch (status) {
      case 'available': return 'bg-blue-500';
      case 'deploying': return 'bg-yellow-500';
      case 'deployed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Platform['status']) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'deploying': return 'Implantando';
      case 'deployed': return 'Implantado';
      case 'error': return 'Erro';
      default: return 'Desconhecido';
    }
  };

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cloud className="mr-2 h-5 w-5" />
          Deploy Automático Multicloud
        </CardTitle>
        <CardDescription>
          Implante seu bot automaticamente em múltiplas plataformas com um clique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((platform) => {
            const StatusIcon = getStatusIcon(platform.status);
            
            return (
              <Card key={platform.id} className="bg-background border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <platform.icon className="h-5 w-5" />
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(platform.status)}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {getStatusText(platform.status)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {platform.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {platform.status === 'deploying' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span className="text-sm">Configurando ambiente...</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  )}
                  
                  {platform.status === 'deployed' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>URL do Bot:</span>
                        <a 
                          href={platform.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate max-w-[150px]"
                        >
                          {platform.url}
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Tempo de Deploy:</span>
                        <span className="text-muted-foreground">{platform.deployTime}s</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => deployToPlatform(platform.id)}
                    disabled={isDeploying || platform.status === 'deploying'}
                    className={`w-full ${
                      platform.status === 'deployed' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gradient-discord hover:bg-discord-dark'
                    } text-white`}
                  >
                    {platform.status === 'deployed' ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Reimplantar
                      </>
                    ) : platform.status === 'deploying' ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-pulse" />
                        Implantando...
                      </>
                    ) : (
                      <>
                        <Cloud className="mr-2 h-4 w-4" />
                        Implantar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Cloud className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Deploy Automatizado</p>
              <p className="text-xs text-muted-foreground">
                O sistema configura automaticamente todas as variáveis de ambiente, 
                instala dependências e mantém atualizações automáticas.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiCloudDeploy;