import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Zap, Plus, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutoResponse {
  id: string;
  trigger: string;
  type: 'welcome' | 'goodbye' | 'error' | 'custom';
  tone: 'formal' | 'casual' | 'funny' | 'sarcastic';
  message: string;
  enabled: boolean;
}

const AIAutoResponses = () => {
  const [responses, setResponses] = useState<AutoResponse[]>([
    {
      id: '1',
      trigger: 'member_join',
      type: 'welcome',
      tone: 'casual',
      message: 'Bem-vindo(a) {user}! 🎉 Que bom ter você aqui no {server}!',
      enabled: true
    },
    {
      id: '2',
      trigger: 'command_error',
      type: 'error',
      tone: 'funny',
      message: 'Ops! 😅 Parece que algo deu errado. Tente novamente ou peça ajuda!',
      enabled: true
    }
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [newResponse, setNewResponse] = useState({
    trigger: '',
    type: 'custom' as const,
    tone: 'casual' as const,
    context: ''
  });
  const { toast } = useToast();

  const generateResponse = async () => {
    if (!newResponse.trigger || !newResponse.context) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o gatilho e o contexto para gerar a resposta",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simular geração de resposta com IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const toneMessages = {
        formal: `Prezado(a) {user}, agradecemos sua participação em {server}. ${newResponse.context}`,
        casual: `Olá {user}! ${newResponse.context} Seja bem-vindo(a) ao {server}! 😊`,
        funny: `Eita {user}! 😂 ${newResponse.context} Bem-vindo(a) à bagunça do {server}!`,
        sarcastic: `Ah, olha só... {user} decidiu aparecer. 🙄 ${newResponse.context}`
      };
      
      const generatedMessage = toneMessages[newResponse.tone];
      
      const response: AutoResponse = {
        id: Date.now().toString(),
        trigger: newResponse.trigger,
        type: newResponse.type,
        tone: newResponse.tone,
        message: generatedMessage,
        enabled: true
      };
      
      setResponses(prev => [...prev, response]);
      setNewResponse({ trigger: '', type: 'custom', tone: 'casual', context: '' });
      
      toast({
        title: "Resposta gerada!",
        description: "Nova auto-resposta criada com IA"
      });
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Falha ao gerar resposta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleResponse = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteResponse = (id: string) => {
    setResponses(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Resposta removida",
      description: "Auto-resposta deletada com sucesso"
    });
  };

  const getTriggerLabel = (trigger: string) => {
    const triggers: Record<string, string> = {
      'member_join': 'Membro entrou',
      'member_leave': 'Membro saiu',
      'command_error': 'Erro de comando',
      'mention': 'Bot mencionado',
      'dm_received': 'DM recebida'
    };
    return triggers[trigger] || trigger;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'welcome': 'bg-green-500',
      'goodbye': 'bg-red-500',
      'error': 'bg-yellow-500',
      'custom': 'bg-blue-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          Auto-Respostas Inteligentes
        </CardTitle>
        <CardDescription>
          Crie mensagens automáticas personalizadas com IA para diferentes situações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generator */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
          <h3 className="font-medium mb-4 flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            Gerador de Resposta com IA
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Gatilho</label>
              <Select value={newResponse.trigger} onValueChange={(value) => setNewResponse(prev => ({ ...prev, trigger: value }))}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione um gatilho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member_join">Membro entrou</SelectItem>
                  <SelectItem value="member_leave">Membro saiu</SelectItem>
                  <SelectItem value="command_error">Erro de comando</SelectItem>
                  <SelectItem value="mention">Bot mencionado</SelectItem>
                  <SelectItem value="dm_received">DM recebida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tom da Mensagem</label>
              <Select value={newResponse.tone} onValueChange={(value: any) => setNewResponse(prev => ({ ...prev, tone: value }))}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="funny">Divertido</SelectItem>
                  <SelectItem value="sarcastic">Sarcástico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Contexto da Mensagem</label>
            <Textarea 
              value={newResponse.context}
              onChange={(e) => setNewResponse(prev => ({ ...prev, context: e.target.value }))}
              placeholder="Descreva o contexto ou propósito da mensagem..."
              className="bg-background border-border"
              rows={2}
            />
          </div>
          
          <Button 
            onClick={generateResponse}
            disabled={isGenerating}
            className="w-full bg-gradient-discord hover:bg-discord-dark text-white"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Gerando...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Gerar Resposta com IA
              </>
            )}
          </Button>
        </div>

        {/* Existing Responses */}
        <div className="space-y-3">
          <h3 className="font-medium">Auto-Respostas Configuradas ({responses.length})</h3>
          
          {responses.map((response) => (
            <Card key={response.id} className="bg-background border-border">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(response.type)}>
                      {response.type}
                    </Badge>
                    <Badge variant="outline">
                      {getTriggerLabel(response.trigger)}
                    </Badge>
                    <Badge variant="secondary">
                      {response.tone}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleResponse(response.id)}
                      className={response.enabled ? 'bg-green-500/10 border-green-500' : ''}
                    >
                      {response.enabled ? 'Ativa' : 'Inativa'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteResponse(response.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm">{response.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Variables Help */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="font-medium mb-2">🏷️ Variáveis Disponíveis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div><code className="bg-black/20 px-1 rounded">{'user'}</code> - Nome do usuário</div>
            <div><code className="bg-black/20 px-1 rounded">{'server'}</code> - Nome do servidor</div>
            <div><code className="bg-black/20 px-1 rounded">{'channel'}</code> - Nome do canal</div>
            <div><code className="bg-black/20 px-1 rounded">{'count'}</code> - Contagem de membros</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAutoResponses;