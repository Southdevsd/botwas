import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Server, Zap, ExternalLink, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeployManagerProps {
  botName: string;
  files: Record<string, string>;
}

const DeployManager = ({ botName, files = {} }: DeployManagerProps) => {
  const [activeService, setActiveService] = useState('heroku');
  const [deployConfig, setDeployConfig] = useState({
    heroku: { appName: '', apiKey: '' },
    railway: { projectName: '', token: '' },
    replit: { replName: '', token: '' }
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const deployServices = [
    {
      id: 'heroku',
      name: 'Heroku',
      icon: Cloud,
      description: 'Deploy gratuito com containers',
      difficulty: 'Fácil',
      color: '#6762A6'
    },
    {
      id: 'railway',
      name: 'Railway',
      icon: Zap,
      description: 'Deploy moderno e rápido',
      difficulty: 'Muito Fácil',
      color: '#8B5CF6'
    },
    {
      id: 'replit',
      name: 'Replit',
      icon: Server,
      description: 'IDE online com hosting',
      difficulty: 'Simples',
      color: '#F97316'
    }
  ];

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployStatus('deploying');

    try {
      // Simular processo de deploy
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      setDeployStatus('success');
      toast({
        title: "Deploy realizado com sucesso!",
        description: `Seu bot foi implantado no ${activeService.toUpperCase()}.`,
      });
    } catch (error) {
      setDeployStatus('error');
      toast({
        title: "Erro no deploy",
        description: "Houve um problema durante a implantação.",
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const updateConfig = (service: string, field: string, value: string) => {
    setDeployConfig(prev => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="mr-2 h-5 w-5" />
            Deploy Automático
          </CardTitle>
          <CardDescription>
            Implante seu bot automaticamente em serviços de hosting gratuitos
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Service Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deployServices.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card 
              key={service.id}
              className={`cursor-pointer transition-all border-2 ${
                activeService === service.id 
                  ? 'border-discord bg-discord/10' 
                  : 'border-border bg-card/50 hover:border-discord/50'
              }`}
              onClick={() => setActiveService(service.id)}
            >
              <CardContent className="pt-6 text-center">
                <IconComponent 
                  className="h-8 w-8 mx-auto mb-3" 
                  style={{ color: service.color }}
                />
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                <Badge variant="secondary">{service.difficulty}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Deploy Configuration */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Configuração de Deploy - {deployServices.find(s => s.id === activeService)?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeService} onValueChange={setActiveService}>
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              {deployServices.map((service) => (
                <TabsTrigger 
                  key={service.id}
                  value={service.id}
                  className="data-[state=active]:bg-discord data-[state=active]:text-white"
                >
                  {service.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Heroku Configuration */}
            <TabsContent value="heroku" className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📋 Pré-requisitos:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Conta no Heroku (gratuita)</li>
                  <li>• Heroku CLI instalado</li>
                  <li>• Git configurado</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome da Aplicação</label>
                  <Input 
                    value={deployConfig.heroku.appName}
                    onChange={(e) => updateConfig('heroku', 'appName', e.target.value)}
                    placeholder="meu-discord-bot"
                    className="bg-background border-border"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">API Key do Heroku</label>
                  <Input 
                    type="password"
                    value={deployConfig.heroku.apiKey}
                    onChange={(e) => updateConfig('heroku', 'apiKey', e.target.value)}
                    placeholder="Sua API Key do Heroku"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📝 Comandos para deploy manual:</h4>
                <div className="bg-black/10 dark:bg-black/30 p-3 rounded font-mono text-sm">
                  <div>heroku create {deployConfig.heroku.appName || 'meu-bot'}</div>
                  <div>heroku config:set DISCORD_TOKEN=seu_token</div>
                  <div>git push heroku main</div>
                </div>
              </div>
            </TabsContent>

            {/* Railway Configuration */}
            <TabsContent value="railway" className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📋 Pré-requisitos:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Conta no Railway (gratuita)</li>
                  <li>• GitHub conectado</li>
                  <li>• Repositório público/privado</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome do Projeto</label>
                  <Input 
                    value={deployConfig.railway.projectName}
                    onChange={(e) => updateConfig('railway', 'projectName', e.target.value)}
                    placeholder="discord-bot-project"
                    className="bg-background border-border"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Token do Railway</label>
                  <Input 
                    type="password"
                    value={deployConfig.railway.token}
                    onChange={(e) => updateConfig('railway', 'token', e.target.value)}
                    placeholder="Seu token do Railway"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">⚡ Deploy automático:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Conecte seu GitHub ao Railway</li>
                  <li>Importe este repositório</li>
                  <li>Adicione DISCORD_TOKEN nas variáveis</li>
                  <li>Deploy automático ativado!</li>
                </ol>
              </div>
            </TabsContent>

            {/* Replit Configuration */}
            <TabsContent value="replit" className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📋 Pré-requisitos:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Conta no Replit (gratuita)</li>
                  <li>• Navegador web</li>
                  <li>• Arquivo ZIP do bot</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome do Repl</label>
                  <Input 
                    value={deployConfig.replit.replName}
                    onChange={(e) => updateConfig('replit', 'replName', e.target.value)}
                    placeholder="meu-discord-bot"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">🚀 Passos para deploy:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Baixe o ZIP do bot</li>
                  <li>Crie novo Repl no Replit</li>
                  <li>Faça upload dos arquivos</li>
                  <li>Adicione DISCORD_TOKEN nos Secrets</li>
                  <li>Execute o projeto</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>

          {/* Deploy Button */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Status do Deploy</h4>
                <p className="text-sm text-muted-foreground">
                  {deployStatus === 'idle' && 'Pronto para deploy'}
                  {deployStatus === 'deploying' && 'Implantando...'}
                  {deployStatus === 'success' && 'Deploy realizado com sucesso!'}
                  {deployStatus === 'error' && 'Erro durante o deploy'}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {deployStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {deployStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                
                <Button 
                  onClick={handleDeploy}
                  disabled={isDeploying || Object.keys(files || {}).length === 0}
                  className="bg-gradient-discord hover:bg-discord-dark text-white"
                >
                  {isDeploying ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Implantando...
                    </>
                  ) : (
                    <>
                      <Cloud className="mr-2 h-4 w-4" />
                      Iniciar Deploy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deploy Logs */}
      {deployStatus !== 'idle' && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-sm">Logs de Deploy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/80 text-green-400 p-4 rounded-lg font-mono text-xs space-y-1">
              <div>{'>'} Iniciando processo de deploy...</div>
              <div>{'>'} Validando configurações...</div>
              <div>{'>'} Preparando arquivos...</div>
              <div>{'>'} Enviando para {activeService}...</div>
              {deployStatus === 'deploying' && (
                <div className="animate-pulse">{'>'} Deploy em andamento...</div>
              )}
              {deployStatus === 'success' && (
                <>
                  <div>{'>'} Build realizado com sucesso!</div>
                  <div>{'>'} Bot implantado e rodando!</div>
                  <div className="text-blue-400">{'>'} URL: https://seu-bot.{activeService}.app</div>
                </>
              )}
              {deployStatus === 'error' && (
                <div className="text-red-400">{'>'} Erro: Falha na implantação</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Helpful Resources */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-sm">Recursos Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">📚 Documentação</h4>
              <div className="space-y-1">
                <a href="#" className="flex items-center text-discord hover:underline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Guia Heroku
                </a>
                <a href="#" className="flex items-center text-discord hover:underline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Guia Railway
                </a>
                <a href="#" className="flex items-center text-discord hover:underline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Guia Replit
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">🔧 Ferramentas</h4>
              <div className="space-y-1">
                <a href="#" className="flex items-center text-discord hover:underline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Heroku CLI
                </a>
                <a href="#" className="flex items-center text-discord hover:underline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Git Download
                </a>
                <a href="#" className="flex items-center text-discord hover:underline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Node.js
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">🆘 Suporte</h4>
              <div className="space-y-1">
                <a href="#" className="flex items-center text-discord hover:underline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Discord Suporte
                </a>
                <a href="#" className="flex items-center text-discord hover:underline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  FAQ Deploy
                </a>
                <a href="#" className="flex items-center text-discord hover:underline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Troubleshooting
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeployManager;