import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Shield, Gamepad2, Wrench, DollarSign, Plus, Sparkles } from 'lucide-react';

interface Command {
  id: string;
  name: string;
  description: string;
  category: string;
  usage: string;
  premium?: boolean;
}

interface CommandSelectorProps {
  selectedCommands: string[];
  onCommandToggle: (commandId: string) => void;
}

const CommandSelector = ({ selectedCommands, onCommandToggle }: CommandSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCommand, setCustomCommand] = useState('');

  const commands: Command[] = [
    // Moderação
    { id: 'ban', name: 'ban', description: 'Banir um usuário do servidor', category: 'moderation', usage: '!ban @user [motivo]' },
    { id: 'kick', name: 'kick', description: 'Expulsar um usuário do servidor', category: 'moderation', usage: '!kick @user [motivo]' },
    { id: 'mute', name: 'mute', description: 'Silenciar um usuário', category: 'moderation', usage: '!mute @user [tempo]' },
    { id: 'warn', name: 'warn', description: 'Advertir um usuário', category: 'moderation', usage: '!warn @user [motivo]' },
    { id: 'clear', name: 'clear', description: 'Limpar mensagens do chat', category: 'moderation', usage: '!clear [quantidade]' },
    
    // Diversão
    { id: '8ball', name: '8ball', description: 'Fazer uma pergunta à bola mágica', category: 'fun', usage: '!8ball [pergunta]' },
    { id: 'meme', name: 'meme', description: 'Enviar um meme aleatório', category: 'fun', usage: '!meme' },
    { id: 'joke', name: 'joke', description: 'Contar uma piada', category: 'fun', usage: '!joke' },
    { id: 'dice', name: 'dice', description: 'Rolar dados', category: 'fun', usage: '!dice [lados]' },
    
    // Utilidades
    { id: 'userinfo', name: 'userinfo', description: 'Informações sobre um usuário', category: 'utility', usage: '!userinfo [@user]' },
    { id: 'serverinfo', name: 'serverinfo', description: 'Informações sobre o servidor', category: 'utility', usage: '!serverinfo' },
    { id: 'avatar', name: 'avatar', description: 'Mostrar avatar de um usuário', category: 'utility', usage: '!avatar [@user]' },
    { id: 'ping', name: 'ping', description: 'Verificar latência do bot', category: 'utility', usage: '!ping' },
    
    // Economia
    { id: 'balance', name: 'balance', description: 'Ver saldo do usuário', category: 'economy', usage: '!balance [@user]', premium: true },
    { id: 'daily', name: 'daily', description: 'Recompensa diária', category: 'economy', usage: '!daily', premium: true },
    { id: 'work', name: 'work', description: 'Trabalhar para ganhar moedas', category: 'economy', usage: '!work', premium: true },
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: Wrench },
    { id: 'moderation', name: 'Moderação', icon: Shield },
    { id: 'fun', name: 'Diversão', icon: Gamepad2 },
    { id: 'utility', name: 'Utilidades', icon: Wrench },
    { id: 'economy', name: 'Economia', icon: DollarSign },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCommands = commands.filter(command => {
    const matchesSearch = command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         command.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || command.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'moderation': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'fun': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'utility': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'economy': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Selecionar Comandos</CardTitle>
          <CardDescription>
            Escolha os comandos que seu bot terá disponível
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comandos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
          
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-5 bg-muted">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="data-[state=active]:bg-discord data-[state=active]:text-white"
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCommands.map((command) => {
          const isSelected = selectedCommands.includes(command.id);
          
          return (
            <Card 
              key={command.id} 
              className={`cursor-pointer transition-all duration-200 border-2 ${
                isSelected 
                  ? 'border-discord bg-discord/10' 
                  : 'border-border bg-card/50 hover:border-discord/50'
              }`}
              onClick={() => onCommandToggle(command.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-mono">
                    {command.name}
                    {command.premium && (
                      <Sparkles className="inline ml-2 h-4 w-4 text-yellow-400" />
                    )}
                  </CardTitle>
                  <Badge className={getCategoryColor(command.category)}>
                    {command.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-sm">
                  {command.description}
                </CardDescription>
                <div className="text-xs font-mono bg-background/50 p-2 rounded border border-border">
                  {command.usage}
                </div>
                {isSelected && (
                  <Badge className="bg-discord-green text-black">
                    ✓ Selecionado
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Command Creator */}
      <Card className="bg-card/50 border-border border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Comando Personalizado
          </CardTitle>
          <CardDescription>
            Descreva o que você quer e nossa IA criará o comando para você
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Ex: Comando para sortear um usuário aleatório do servidor"
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            className="bg-background border-border"
          />
          <Button 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            disabled={!customCommand.trim()}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar com IA
          </Button>
        </CardContent>
      </Card>

      {/* Selected Commands Summary */}
      {selectedCommands.length > 0 && (
        <Card className="bg-discord/10 border-discord">
          <CardHeader>
            <CardTitle className="text-discord">
              Comandos Selecionados ({selectedCommands.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedCommands.map((commandId) => {
                const command = commands.find(c => c.id === commandId);
                return command ? (
                  <Badge 
                    key={commandId} 
                    variant="secondary"
                    className="bg-discord text-white"
                  >
                    {command.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommandSelector;