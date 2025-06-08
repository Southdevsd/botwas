import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Copy, Code, Variable, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Variable {
  key: string;
  value: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'array';
}

interface VariablesManagerProps {
  variables: Record<string, string>;
  onVariablesChange: (variables: Record<string, string>) => void;
}

const VariablesManager = ({ variables, onVariablesChange }: VariablesManagerProps) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [testMessage, setTestMessage] = useState('Olá {user}! Bem-vindo ao {server}. Hoje é {date} e são {time}.');
  const { toast } = useToast();

  const systemVariables = [
    { key: '{user}', description: 'Nome do usuário que executou o comando' },
    { key: '{user.mention}', description: 'Menciona o usuário (@usuario)' },
    { key: '{user.tag}', description: 'Tag completa do usuário (nome#0000)' },
    { key: '{user.id}', description: 'ID único do usuário' },
    { key: '{server}', description: 'Nome do servidor' },
    { key: '{server.members}', description: 'Número de membros do servidor' },
    { key: '{server.id}', description: 'ID do servidor' },
    { key: '{channel}', description: 'Nome do canal atual' },
    { key: '{channel.mention}', description: 'Menciona o canal (#canal)' },
    { key: '{date}', description: 'Data atual (DD/MM/AAAA)' },
    { key: '{time}', description: 'Hora atual (HH:MM:SS)' },
    { key: '{bot.name}', description: 'Nome do bot' },
    { key: '{prefix}', description: 'Prefixo dos comandos' },
    { key: '{random.1-100}', description: 'Número aleatório entre 1 e 100' },
    { key: '{random.choice:a,b,c}', description: 'Escolhe aleatoriamente entre as opções' }
  ];

  const addVariable = () => {
    if (!newKey || !newValue) {
      toast({
        title: "Erro",
        description: "Preencha o nome e valor da variável.",
        variant: "destructive"
      });
      return;
    }

    const formattedKey = newKey.startsWith('{') ? newKey : `{${newKey}}`;
    
    onVariablesChange({
      ...variables,
      [formattedKey]: newValue
    });

    setNewKey('');
    setNewValue('');
    setNewDescription('');

    toast({
      title: "Variável adicionada!",
      description: `A variável ${formattedKey} foi criada.`,
    });
  };

  const removeVariable = (key: string) => {
    const newVariables = { ...variables };
    delete newVariables[key];
    onVariablesChange(newVariables);

    toast({
      title: "Variável removida!",
      description: `A variável ${key} foi removida.`,
    });
  };

  const copyVariable = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copiado!",
      description: `A variável ${key} foi copiada.`,
    });
  };

  const previewMessage = () => {
    let preview = testMessage;
    
    // Substituir variáveis personalizadas
    Object.entries(variables).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });
    
    // Substituir variáveis do sistema com valores de exemplo
    preview = preview
      .replace(/{user}/g, 'João')
      .replace(/{user\.mention}/g, '@João')
      .replace(/{user\.tag}/g, 'João#1234')
      .replace(/{user\.id}/g, '123456789')
      .replace(/{server}/g, 'Meu Servidor')
      .replace(/{server\.members}/g, '150')
      .replace(/{server\.id}/g, '987654321')
      .replace(/{channel}/g, 'geral')
      .replace(/{channel\.mention}/g, '#geral')
      .replace(/{date}/g, new Date().toLocaleDateString('pt-BR'))
      .replace(/{time}/g, new Date().toLocaleTimeString('pt-BR'))
      .replace(/{bot\.name}/g, 'MeuBot')
      .replace(/{prefix}/g, '!')
      .replace(/{random\.1-100}/g, Math.floor(Math.random() * 100 + 1).toString())
      .replace(/{random\.choice:([^}]+)}/g, (match, choices) => {
        const options = choices.split(',');
        return options[Math.floor(Math.random() * options.length)];
      });
    
    return preview;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Variable className="mr-2 h-5 w-5" />
            Gerenciador de Variáveis
          </CardTitle>
          <CardDescription>
            Crie variáveis personalizadas para usar em comandos e eventos
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="custom">Personalizadas</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="space-y-4">
          {/* Adicionar Nova Variável */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-base">Adicionar Nova Variável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome da Variável</label>
                  <Input
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="minha_variavel ou {minha_variavel}"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Valor</label>
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Valor da variável"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Descrição (opcional)</label>
                <Input
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descreva para que serve esta variável"
                />
              </div>
              <Button onClick={addVariable} className="bg-gradient-discord hover:bg-discord-dark text-white">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Variável
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Variáveis Personalizadas */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Suas Variáveis</CardTitle>
                <Badge variant="secondary">{Object.keys(variables).length} variáveis</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {Object.keys(variables).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Variable className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma variável personalizada criada ainda.</p>
                  <p className="text-sm">Adicione uma acima para começar!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(variables).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {key}
                          </Badge>
                          <span className="text-sm">→</span>
                          <span className="text-sm">{value}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyVariable(key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariable(key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Variáveis do Sistema
              </CardTitle>
              <CardDescription>
                Essas variáveis são automaticamente substituídas pelo bot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemVariables.map((variable, index) => (
                  <div key={index} className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {variable.key}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyVariable(variable.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{variable.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Testar Variáveis
              </CardTitle>
              <CardDescription>
                Digite uma mensagem com variáveis e veja como ficará
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mensagem de Teste</label>
                <Textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Digite uma mensagem usando variáveis..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Preview</label>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm">{previewMessage()}</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p><strong>Dica:</strong> Use variáveis como {'{user}'}, {'{server}'}, {'{date}'} em suas mensagens.</p>
                <p>Variáveis personalizadas e do sistema serão substituídas automaticamente.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VariablesManager;