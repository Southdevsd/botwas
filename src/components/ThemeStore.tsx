import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Download, Star, Eye, Brush, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ThemeStore = () => {
  const [activeCategory, setActiveCategory] = useState('panel');
  const [appliedTheme, setAppliedTheme] = useState<string | null>(null);
  const { toast } = useToast();

  const panelThemes = [
    {
      id: 'dark-cyber',
      name: 'Cyberpunk Neon',
      description: 'Tema escuro com acentos neon',
      colors: ['#0a0a0a', '#7c3aed', '#06ffa5', '#ff006e'],
      price: 'Grátis',
      rating: 4.8,
      downloads: 2540
    },
    {
      id: 'light-minimal',
      name: 'Minimalista Claro',
      description: 'Design limpo e moderno',
      colors: ['#ffffff', '#f3f4f6', '#6366f1', '#10b981'],
      price: 'Grátis',
      rating: 4.9,
      downloads: 3120
    },
    {
      id: 'discord-original',
      name: 'Discord Original',
      description: 'Cores oficiais do Discord',
      colors: ['#36393f', '#2f3136', '#5865f2', '#57f287'],
      price: 'Grátis',
      rating: 4.7,
      downloads: 1890
    },
    {
      id: 'synthwave',
      name: 'Synthwave',
      description: 'Estética retro-futurista',
      colors: ['#1a1a2e', '#16213e', '#ff0080', '#00ffff'],
      price: 'Premium',
      rating: 4.9,
      downloads: 890
    }
  ];

  const botThemes = [
    {
      id: 'elegant-blue',
      name: 'Azul Elegante',
      description: 'Embeds em tons de azul profissional',
      preview: {
        title: 'Comando Executado',
        description: 'Exemplo de embed com tema azul elegante',
        color: '#3b82f6'
      },
      price: 'Grátis',
      rating: 4.6,
      downloads: 1650
    },
    {
      id: 'warm-sunset',
      name: 'Pôr do Sol',
      description: 'Gradientes quentes e acolhedores',
      preview: {
        title: 'Bem-vindo!',
        description: 'Tema com cores quentes do pôr do sol',
        color: '#f97316'
      },
      price: 'Grátis',
      rating: 4.8,
      downloads: 2100
    },
    {
      id: 'forest-green',
      name: 'Floresta Verde',
      description: 'Tons naturais de verde',
      preview: {
        title: 'Moderação',
        description: 'Tema natural com verde floresta',
        color: '#22c55e'
      },
      price: 'Premium',
      rating: 4.7,
      downloads: 750
    }
  ];

  const applyTheme = (themeId: string, category: string) => {
    setAppliedTheme(themeId);
    toast({
      title: "Tema aplicado!",
      description: `Tema ${category === 'panel' ? 'do painel' : 'do bot'} aplicado com sucesso.`
    });
  };

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="mr-2 h-5 w-5" />
          Loja de Temas e Skins
        </CardTitle>
        <CardDescription>
          Personalize a aparência do seu painel e bot com temas únicos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="panel">
              <Brush className="mr-1 h-3 w-3" />
              Temas do Painel
            </TabsTrigger>
            <TabsTrigger value="bot">
              <Sparkles className="mr-1 h-3 w-3" />
              Temas do Bot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="panel" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {panelThemes.map((theme) => (
                <Card key={theme.id} className="bg-background border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{theme.name}</CardTitle>
                      <Badge variant={theme.price === 'Grátis' ? 'secondary' : 'default'}>
                        {theme.price}
                      </Badge>
                    </div>
                    <CardDescription>{theme.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Color Palette Preview */}
                    <div className="flex space-x-2">
                      {theme.colors.map((color, index) => (
                        <div 
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{theme.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{theme.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-discord hover:bg-discord-dark text-white"
                        onClick={() => applyTheme(theme.id, 'panel')}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Aplicar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bot" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {botThemes.map((theme) => (
                <Card key={theme.id} className="bg-background border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{theme.name}</CardTitle>
                      <Badge variant={theme.price === 'Grátis' ? 'secondary' : 'default'}>
                        {theme.price}
                      </Badge>
                    </div>
                    <CardDescription>{theme.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Embed Preview */}
                    <div 
                      className="p-3 rounded border-l-4 bg-black/20"
                      style={{ borderLeftColor: theme.preview.color }}
                    >
                      <div className="font-semibold text-sm" style={{ color: theme.preview.color }}>
                        {theme.preview.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {theme.preview.description}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{theme.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{theme.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-discord hover:bg-discord-dark text-white"
                        onClick={() => applyTheme(theme.id, 'bot')}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Aplicar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
          <h4 className="font-medium mb-2">🎨 Crie seus próprios temas</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Compartilhe suas criações com a comunidade e ganhe pontos de experiência
          </p>
          <Button variant="outline" size="sm">
            <Palette className="mr-2 h-3 w-3" />
            Editor de Temas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeStore;