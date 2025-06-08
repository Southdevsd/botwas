import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, Eye, Star, Shield, Users, Gamepad2, Zap } from 'lucide-react';

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: Zap },
    { id: 'moderation', name: 'Moderação', icon: Shield },
    { id: 'utility', name: 'Utilidade', icon: Users },
    { id: 'fun', name: 'Diversão', icon: Gamepad2 },
  ];

  const templates = [
    {
      id: 1,
      name: 'Bot de Moderação Completo',
      description: 'Sistema completo de moderação com ban, kick, mute, warn e logs automáticos',
      category: 'moderation',
      commands: 15,
      downloads: 1250,
      rating: 4.8,
      isPremium: false,
      preview: '/ban @usuario spam - Bane usuário por spam\n/warn @usuario linguagem - Adverte usuário\n/logs - Mostra logs de moderação',
      features: ['Auto-moderação', 'Sistema de warns', 'Logs detalhados', 'Backup de mensagens']
    },
    {
      id: 2,
      name: 'Bot de Economia',
      description: 'Sistema completo de economia com daily, work, shop e ranking',
      category: 'utility',
      commands: 12,
      downloads: 890,
      rating: 4.6,
      isPremium: true,
      preview: '/daily - Recompensa diária\n/work - Trabalhar para ganhar moedas\n/balance - Ver saldo\n/shop - Loja virtual',
      features: ['Sistema de moedas', 'Loja personalizada', 'Ranking global', 'Mini-games']
    },
    {
      id: 3,
      name: 'Bot de Entretenimento',
      description: 'Comandos divertidos com memes, jogos e interações sociais',
      category: 'fun',
      commands: 20,
      downloads: 2100,
      rating: 4.9,
      isPremium: false,
      preview: '/meme - Meme aleatório\n/8ball pergunta - Bola 8 mágica\n/ship @user1 @user2 - Compatibilidade',
      features: ['Memes atualizados', 'Jogos interativos', 'Sistema de XP', 'Comandos sociais']
    },
    {
      id: 4,
      name: 'Bot Multi-Função Premium',
      description: 'Bot completo com moderação, economia, diversão e sistema de tickets',
      category: 'utility',
      commands: 50,
      downloads: 3200,
      rating: 4.7,
      isPremium: true,
      preview: 'Inclui todos os recursos dos outros templates + sistema de tickets + auto-roles + boas-vindas personalizadas',
      features: ['Moderação avançada', 'Sistema de tickets', 'Auto-roles', 'Economia completa', 'Logs detalhados', 'Backup automático']
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: any) => {
    console.log('Usando template:', template.name);
    // Aqui implementaria a lógica para usar o template
  };

  const handlePreview = (template: any) => {
    console.log('Preview do template:', template.name);
    // Aqui implementaria a lógica para preview
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Templates de Bots</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Templates prontos para acelerar a criação do seu bot Discord
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            
            <div className="flex gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? 'bg-discord text-white' : 'border-border hover:bg-muted'}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-card/50 border-border hover-scale group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {template.name}
                        {template.isPremium && (
                          <Badge className="bg-gradient-discord text-white">
                            Premium
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      {template.commands} comandos
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {template.downloads.toLocaleString()} downloads
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {template.rating}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Preview */}
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">Preview dos comandos:</div>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {template.preview}
                    </pre>
                  </div>
                  
                  {/* Features */}
                  <div>
                    <div className="text-sm font-medium mb-2">Funcionalidades:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={() => handlePreview(template)}
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    
                    <Button 
                      onClick={() => handleUseTemplate(template)}
                      className={`flex-1 ${
                        template.isPremium 
                          ? 'bg-gradient-discord hover:bg-discord-dark text-white' 
                          : 'bg-discord hover:bg-discord-dark text-white'
                      }`}
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {template.isPremium ? 'Premium' : 'Usar Template'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Nenhum template encontrado para sua busca
              </div>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-discord text-white border-0 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Não encontrou o que procura?</CardTitle>
                <CardDescription className="text-white/80">
                  Use nossa IA para criar comandos personalizados ou solicite um template específico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    size="lg"
                    className="bg-white text-discord hover:bg-gray-100"
                  >
                    Criar Bot Personalizado
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Solicitar Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;