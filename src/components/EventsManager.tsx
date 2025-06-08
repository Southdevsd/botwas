import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Users, MessageSquare, Shield, Bell } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>;
}

interface EventsManagerProps {
  events: Event[];
  onEventsChange: (events: Event[]) => void;
}

const EventsManager = ({ events, onEventsChange }: EventsManagerProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const defaultEvents: Omit<Event, 'id'>[] = [
    {
      name: 'guildMemberAdd',
      description: 'Mensagem de boas-vindas para novos membros',
      enabled: false,
      config: {
        channel: 'bem-vindos',
        message: 'Bem-vindo(a) {user.mention} ao **{server}**! 🎉',
        embedColor: '#00FF00',
        deleteAfter: 0
      }
    },
    {
      name: 'guildMemberRemove',
      description: 'Mensagem quando alguém sai do servidor',
      enabled: false,
      config: {
        channel: 'saidas',
        message: '{user.tag} saiu do servidor. 😢',
        embedColor: '#FF0000'
      }
    },
    {
      name: 'messageDelete',
      description: 'Log de mensagens deletadas',
      enabled: false,
      config: {
        channel: 'logs',
        includeBot: false,
        embedColor: '#FF0000'
      }
    },
    {
      name: 'messageUpdate',
      description: 'Log de mensagens editadas',
      enabled: false,
      config: {
        channel: 'logs',
        includeBot: false,
        embedColor: '#FFA500'
      }
    },
    {
      name: 'guildBanAdd',
      description: 'Log de banimentos',
      enabled: false,
      config: {
        channel: 'logs',
        embedColor: '#FF0000'
      }
    },
    {
      name: 'voiceStateUpdate',
      description: 'Log de entrada/saída de canais de voz',
      enabled: false,
      config: {
        channel: 'logs-voz',
        logJoin: true,
        logLeave: true,
        embedColor: '#5865F2'
      }
    }
  ];

  const addEvent = (eventTemplate: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventTemplate,
      id: Date.now().toString()
    };
    
    onEventsChange([...events, newEvent]);
  };

  const updateEvent = (eventId: string, updatedEvent: Partial<Event>) => {
    const newEvents = events.map(event => 
      event.id === eventId ? { ...event, ...updatedEvent } : event
    );
    onEventsChange(newEvents);
  };

  const toggleEvent = (eventId: string) => {
    updateEvent(eventId, { enabled: !events.find(e => e.id === eventId)?.enabled });
  };

  const updateEventConfig = (eventId: string, key: string, value: any) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      updateEvent(eventId, {
        config: { ...event.config, [key]: value }
      });
    }
  };

  const getEventIcon = (eventName: string) => {
    switch (eventName) {
      case 'guildMemberAdd':
      case 'guildMemberRemove':
        return Users;
      case 'messageDelete':
      case 'messageUpdate':
        return MessageSquare;
      case 'guildBanAdd':
        return Shield;
      case 'voiceStateUpdate':
        return Bell;
      default:
        return Settings;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Gerenciador de Eventos
          </CardTitle>
          <CardDescription>
            Configure eventos automáticos para seu bot
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Eventos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Eventos Configurados</h3>
            <Badge variant="secondary">{events.filter(e => e.enabled).length} ativos</Badge>
          </div>

          {events.map((event) => {
            const Icon = getEventIcon(event.name);
            return (
              <Card 
                key={event.id} 
                className={`bg-card/50 border-border cursor-pointer transition-colors ${
                  selectedEvent?.id === event.id ? 'ring-2 ring-discord' : ''
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        event.enabled ? 'bg-discord text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={event.enabled}
                      onCheckedChange={() => toggleEvent(event.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Adicionar Novos Eventos */}
          <Card className="bg-card/50 border-border border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Adicionar Eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {defaultEvents
                .filter(defaultEvent => !events.some(e => e.name === defaultEvent.name))
                .map((eventTemplate, index) => {
                  const Icon = getEventIcon(eventTemplate.name);
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => addEvent(eventTemplate)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">{eventTemplate.name}</div>
                        <div className="text-xs text-muted-foreground">{eventTemplate.description}</div>
                      </div>
                    </Button>
                  );
                })}
            </CardContent>
          </Card>
        </div>

        {/* Configuração do Evento Selecionado */}
        <div>
          {selectedEvent ? (
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configurar: {selectedEvent.name}
                </CardTitle>
                <CardDescription>{selectedEvent.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="advanced">Avançado</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    {/* Canal */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Canal</label>
                      <Input
                        value={selectedEvent.config.channel || ''}
                        onChange={(e) => updateEventConfig(selectedEvent.id, 'channel', e.target.value)}
                        placeholder="Nome do canal (ex: logs, bem-vindos)"
                      />
                    </div>

                    {/* Mensagem (se aplicável) */}
                    {['guildMemberAdd', 'guildMemberRemove'].includes(selectedEvent.name) && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Mensagem</label>
                        <Textarea
                          value={selectedEvent.config.message || ''}
                          onChange={(e) => updateEventConfig(selectedEvent.id, 'message', e.target.value)}
                          placeholder="Use variáveis como {user}, {server}, {user.mention}"
                          rows={3}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          Variáveis disponíveis: {'{user}'}, {'{user.mention}'}, {'{server}'}, {'{date}'}, {'{time}'}
                        </div>
                      </div>
                    )}

                    {/* Cor do Embed */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Cor do Embed</label>
                      <Input
                        type="color"
                        value={selectedEvent.config.embedColor || '#5865F2'}
                        onChange={(e) => updateEventConfig(selectedEvent.id, 'embedColor', e.target.value)}
                        className="w-20 h-10"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    {/* Configurações específicas por evento */}
                    {selectedEvent.name === 'messageDelete' && (
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Incluir mensagens de bots</label>
                        <Switch
                          checked={selectedEvent.config.includeBot || false}
                          onCheckedChange={(checked) => updateEventConfig(selectedEvent.id, 'includeBot', checked)}
                        />
                      </div>
                    )}

                    {selectedEvent.name === 'voiceStateUpdate' && (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Log entrada em canal</label>
                          <Switch
                            checked={selectedEvent.config.logJoin || false}
                            onCheckedChange={(checked) => updateEventConfig(selectedEvent.id, 'logJoin', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Log saída de canal</label>
                          <Switch
                            checked={selectedEvent.config.logLeave || false}
                            onCheckedChange={(checked) => updateEventConfig(selectedEvent.id, 'logLeave', checked)}
                          />
                        </div>
                      </>
                    )}

                    {selectedEvent.name === 'guildMemberAdd' && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Deletar mensagem após (segundos)</label>
                        <Input
                          type="number"
                          value={selectedEvent.config.deleteAfter || 0}
                          onChange={(e) => updateEventConfig(selectedEvent.id, 'deleteAfter', parseInt(e.target.value))}
                          placeholder="0 = não deletar"
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 border-border border-dashed">
              <CardContent className="pt-6 text-center">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Selecione um evento</h3>
                <p className="text-sm text-muted-foreground">
                  Clique em um evento à esquerda para configurá-lo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsManager;