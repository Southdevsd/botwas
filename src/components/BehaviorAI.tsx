import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Brain, Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BehaviorAI = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [behaviorData, setBehaviorData] = useState({
    commandsBlocked: 3,
    spamPrevented: 7,
    autoAdjustments: 12,
    healthScore: 95
  });

  const { toast } = useToast();

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    toast({
      title: isMonitoring ? "Monitoramento Desativado" : "Monitoramento Ativado",
      description: isMonitoring 
        ? "A IA parou de monitorar o comportamento do bot" 
        : "A IA está agora monitorando o comportamento do bot em tempo real"
    });
  };

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          IA de Auto-Correção Comportamental
        </CardTitle>
        <CardDescription>
          Sistema inteligente que monitora e corrige automaticamente o comportamento do bot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status e Controle */}
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-medium">
              {isMonitoring ? 'Monitoramento Ativo' : 'Monitoramento Inativo'}
            </span>
          </div>
          <Switch checked={isMonitoring} onCheckedChange={toggleMonitoring} />
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-red-500">{behaviorData.commandsBlocked}</div>
            <div className="text-xs text-muted-foreground">Comandos Bloqueados</div>
          </div>
          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-orange-500">{behaviorData.spamPrevented}</div>
            <div className="text-xs text-muted-foreground">Spam Prevenido</div>
          </div>
          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-blue-500">{behaviorData.autoAdjustments}</div>
            <div className="text-xs text-muted-foreground">Ajustes Automáticos</div>
          </div>
          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-green-500">{behaviorData.healthScore}%</div>
            <div className="text-xs text-muted-foreground">Score de Saúde</div>
          </div>
        </div>

        {/* Detecções Recentes */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Detecções Recentes
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Comando !spam causando flood</span>
              </div>
              <Badge variant="destructive">Bloqueado</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Taxa de mensagens muito alta</span>
              </div>
              <Badge className="bg-orange-500 text-white">Ajustado</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Comportamento otimizado</span>
              </div>
              <Badge className="bg-green-500 text-white">Sucesso</Badge>
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="space-y-4">
          <h3 className="font-medium">Configurações de Proteção</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Prevenção de Spam</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-bloqueio de Comandos Perigosos</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ajuste Automático de Rate Limit</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Notificações de Alertas</span>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Score de Saúde */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Score de Saúde do Bot</span>
            <span className="text-sm text-muted-foreground">{behaviorData.healthScore}%</span>
          </div>
          <Progress value={behaviorData.healthScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Score baseado em: tempo de atividade, taxa de erros, eficiência de comandos e segurança
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BehaviorAI;