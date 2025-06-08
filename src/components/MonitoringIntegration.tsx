import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, Bell, Settings, Activity, Code, Database, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MonitoringService {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
  config: Record<string, any>;
}

interface MonitoringIntegrationProps {
  botName: string;
}

const MonitoringIntegration = ({ botName }: MonitoringIntegrationProps) => {
  const [services, setServices] = useState<MonitoringService[]>([
    {
      id: 'sentry',
      name: 'Sentry',
      description: 'Monitoramento de erros e performance em tempo real',
      icon: Shield,
      enabled: false,
      config: {
        environment: 'production',
        sampleRate: 1.0,
        tracesSampleRate: 0.1
      }
    },
    {
      id: 'datadog',
      name: 'Datadog',
      description: 'Monitoramento completo de infraestrutura e aplicação',
      icon: Activity,
      enabled: false,
      config: {
        service: botName.toLowerCase(),
        env: 'production',
        version: '1.0.0'
      }
    },
    {
      id: 'newrelic',
      name: 'New Relic',
      description: 'Observabilidade completa com APM e logs',
      icon: Globe,
      enabled: false,
      config: {
        appName: botName,
        licenseKey: '',
        distributedTracing: true
      }
    },
    {
      id: 'discord-webhook',
      name: 'Discord Webhook',
      description: 'Notificações diretas no Discord',
      icon: Bell,
      enabled: false,
      config: {
        channel: 'logs',
        mentionRoles: false,
        embedColor: '#FF0000'
      }
    }
  ]);

  const [alertRules, setAlertRules] = useState([
    {
      id: '1',
      name: 'Bot Offline',
      condition: 'uptime < 95%',
      severity: 'critical',
      enabled: true,
      notifications: ['discord-webhook', 'sentry']
    },
    {
      id: '2',
      name: 'Alto número de erros',
      condition: 'error_rate > 5%',
      severity: 'warning',
      enabled: true,
      notifications: ['sentry']
    },
    {
      id: '3',
      name: 'Tempo de resposta alto',
      condition: 'response_time > 1000ms',
      severity: 'warning',
      enabled: false,
      notifications: ['datadog']
    }
  ]);

  const [logs, setLogs] = useState([
    {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Comando !ban falhou para usuário 123456789',
      service: 'sentry',
      details: 'PermissionError: Bot não possui permissão'
    },
    {
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: 'warning',
      message: 'Alto tempo de resposta detectado',
      service: 'datadog',
      details: 'Response time: 1.2s (threshold: 1.0s)'
    },
    {
      timestamp: new Date(Date.now() - 600000).toISOString(),
      level: 'info',
      message: 'Bot conectado com sucesso',
      service: 'discord-webhook',
      details: 'Conectado em 3 servidores'
    }
  ]);

  const { toast } = useToast();

  const toggleService = (serviceId: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, enabled: !service.enabled }
          : service
      )
    );
    
    const service = services.find(s => s.id === serviceId);
    toast({
      title: service?.enabled ? "Serviço desabilitado" : "Serviço habilitado",
      description: `${service?.name} foi ${service?.enabled ? 'desconectado' : 'conectado'} com sucesso.`,
    });
  };

  const updateServiceConfig = (serviceId: string, key: string, value: any) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, config: { ...service.config, [key]: value } }
          : service
      )
    );
  };

  const updateServiceCredentials = (serviceId: string, field: 'apiKey' | 'webhookUrl', value: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, [field]: value }
          : service
      )
    );
  };

  const generateIntegrationCode = (service: MonitoringService) => {
    switch (service.id) {
      case 'sentry':
        return `// Integração Sentry
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: '${service.config.environment}',
  sampleRate: ${service.config.sampleRate},
  tracesSampleRate: ${service.config.tracesSampleRate}
});

// Capturar erros
process.on('uncaughtException', (error) => {
  Sentry.captureException(error);
});

// Capturar erros em comandos
client.on('error', (error) => {
  Sentry.captureException(error);
});`;

      case 'datadog':
        return `// Integração Datadog
const tracer = require('dd-trace').init({
  service: '${service.config.service}',
  env: '${service.config.env}',
  version: '${service.config.version}'
});

// Métricas customizadas
const StatsD = require('node-statsd');
const stats = new StatsD();

// Contar comandos executados
client.on('messageCreate', (message) => {
  if (message.content.startsWith(prefix)) {
    stats.increment('bot.commands.executed');
  }
});`;

      case 'discord-webhook':
        return `// Webhook Discord para logs
const { WebhookClient } = require('discord.js');
const webhook = new WebhookClient({ url: '${service.webhookUrl || 'SUA_WEBHOOK_URL'}' });

// Enviar notificação de erro
const sendErrorNotification = async (error, context) => {
  const embed = {
    title: '🚨 Erro Detectado',
    description: error.message,
    color: ${service.config.embedColor},
    fields: [
      { name: 'Contexto', value: context, inline: true },
      { name: 'Timestamp', value: new Date().toISOString(), inline: true }
    ]
  };
  
  await webhook.send({ embeds: [embed] });
};`;

      default:
        return '// Código de integração será gerado aqui';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Integração de Monitoramento
          </CardTitle>
          <CardDescription>
            Configure serviços de monitoramento e alertas para seu bot
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="code">Código</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="bg-card/50 border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-8 w-8" />
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={service.enabled}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {service.enabled && (
                      <>
                        {/* Credenciais */}
                        {service.id !== 'discord-webhook' && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">API Key</label>
                            <Input
                              type="password"
                              placeholder="Sua API Key"
                              value={service.apiKey || ''}
                              onChange={(e) => updateServiceCredentials(service.id, 'apiKey', e.target.value)}
                            />
                          </div>
                        )}
                        
                        {service.id === 'discord-webhook' && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">Webhook URL</label>
                            <Input
                              placeholder="https://discord.com/api/webhooks/..."
                              value={service.webhookUrl || ''}
                              onChange={(e) => updateServiceCredentials(service.id, 'webhookUrl', e.target.value)}
                            />
                          </div>
                        )}

                        {/* Configurações específicas */}
                        <div className="space-y-3">
                          {Object.entries(service.config).map(([key, value]) => (
                            <div key={key}>
                              <label className="text-sm font-medium mb-1 block capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </label>
                              {typeof value === 'boolean' ? (
                                <Switch
                                  checked={value}
                                  onCheckedChange={(checked) => updateServiceConfig(service.id, key, checked)}
                                />
                              ) : typeof value === 'number' ? (
                                <Input
                                  type="number"
                                  step={key.includes('Rate') ? '0.1' : '1'}
                                  value={value}
                                  onChange={(e) => updateServiceConfig(service.id, key, parseFloat(e.target.value))}
                                />
                              ) : (
                                <Input
                                  value={value}
                                  onChange={(e) => updateServiceConfig(service.id, key, e.target.value)}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Regras de Alerta</CardTitle>
              <CardDescription>Configure quando e como receber notificações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge className={getSeverityColor(rule.severity)}>
                          {rule.severity}
                        </Badge>
                      </div>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(enabled) => {
                          setAlertRules(prev => 
                            prev.map(r => r.id === rule.id ? { ...r, enabled } : r)
                          );
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Condição:</span>
                        <code className="block mt-1 bg-background p-2 rounded text-xs">
                          {rule.condition}
                        </code>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Notificações:</span>
                        <div className="mt-1 space-x-1">
                          {rule.notifications.map(service => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Logs de Monitoramento</CardTitle>
              <CardDescription>Eventos recentes dos serviços de monitoramento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{log.service}</Badge>
                        <span className={`font-medium ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-medium mb-1">{log.message}</p>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <div className="space-y-6">
            {services.filter(service => service.enabled).map((service) => (
              <Card key={service.id} className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 h-5 w-5" />
                    Código de Integração - {service.name}
                  </CardTitle>
                  <CardDescription>
                    Copie este código para integrar {service.name} ao seu bot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      <code>{generateIntegrationCode(service)}</code>
                    </pre>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generateIntegrationCode(service));
                        toast({
                          title: "Código copiado!",
                          description: `Código de integração do ${service.name} copiado.`,
                        });
                      }}
                    >
                      Copiar Código
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringIntegration;